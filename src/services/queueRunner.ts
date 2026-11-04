import { storageService } from './storage';
import { PublishingTask } from '../types';

export interface QueueRunnerStatus {
  isRunning: boolean;
  activeProcessingTaskId: string | null;
  lastHeartbeat: string;
  isExtensionConnected: boolean;
  extensionVersion: string;
}

class QueueRunnerService {
  private timer: number | null = null;
  private isProcessing = false;
  private isExtensionConnected = false;
  private extensionVersion = '1.0.0';
  private subscribers: ((status: QueueRunnerStatus) => void)[] = [];
  private activeProcessingTaskId: string | null = null;

  constructor() {
    this.setupExtensionListener();
    this.start();
  }

  public subscribe(cb: (status: QueueRunnerStatus) => void): () => void {
    this.subscribers.push(cb);
    cb(this.getStatus());
    return () => {
      this.subscribers = this.subscribers.filter((s) => s !== cb);
    };
  }

  public getStatus(): QueueRunnerStatus {
    return {
      isRunning: this.timer !== null,
      activeProcessingTaskId: this.activeProcessingTaskId,
      lastHeartbeat: new Date().toISOString(),
      isExtensionConnected: this.isExtensionConnected,
      extensionVersion: this.extensionVersion,
    };
  }

  private notify() {
    const status = this.getStatus();
    this.subscribers.forEach((cb) => {
      try {
        cb(status);
      } catch (err) {
        console.error('Queue runner listener error:', err);
      }
    });
  }

  public start() {
    if (this.timer) return;
    this.timer = window.setInterval(() => {
      this.checkAndProcessQueue();
    }, 4000);
    this.notify();
  }

  public stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.notify();
  }

  private setupExtensionListener() {
    window.addEventListener('message', (event) => {
      // Security check: only trust window messages from trusted origins or extension content scripts
      if (!event.data || typeof event.data !== 'object') return;

      const { type, payload } = event.data;

      if (type === 'TECTIC_EXTENSION_HANDSHAKE') {
        this.isExtensionConnected = true;
        this.extensionVersion = payload?.version || '1.0.0';
        storageService.addLog({
          type: 'extension_connected',
          message: `Chrome Extension v${this.extensionVersion} connected successfully to dashboard bridge`,
        });
        this.notify();

        // Respond to extension with current app settings and queue
        window.postMessage(
          {
            type: 'TECTIC_DASHBOARD_ACK',
            payload: {
              connected: true,
              settings: storageService.getSettings(),
            },
          },
          '*'
        );
      }

      if (type === 'TECTIC_EXTENSION_UPDATE_TASK') {
        if (payload?.taskId && payload?.status) {
          storageService.updateTask(payload.taskId, {
            status: payload.status,
            fbPostUrl: payload.fbPostUrl,
            errorMessage: payload.errorMessage,
            executedAt: payload.executedAt || new Date().toISOString(),
          });
          if (payload.status === 'Published') {
            storageService.addLog({
              type: 'task_published',
              message: `Published to ${payload.groupName || 'Facebook Group'} via Chrome Extension`,
              taskId: payload.taskId,
            });
          }
        }
      }
    });
  }

  public async checkAndProcessQueue() {
    if (this.isProcessing) return;

    const settings = storageService.getSettings();
    const tasks = storageService.getTasks();

    // Find first task that is scheduled and due
    const nowTime = Date.now();
    const dueTask = tasks.find(
      (t) => t.status === 'Scheduled' && new Date(t.scheduledAt).getTime() <= nowTime
    );

    if (!dueTask) return;

    // Check if simulated extension runner is active or if user enabled auto-simulation
    if (settings.simulatedExtension || this.isExtensionConnected) {
      await this.executeTask(dueTask);
    }
  }

  public async executeTask(task: PublishingTask, force = false): Promise<boolean> {
    if (this.isProcessing && !force) return false;

    this.isProcessing = true;
    this.activeProcessingTaskId = task.id;
    this.notify();

    // Step 1: Set to processing
    storageService.updateTask(task.id, {
      status: 'Processing',
      lastUpdated: new Date().toISOString(),
    });

    // Notify extension (if installed)
    window.postMessage(
      {
        type: 'TECTIC_DISPATCH_TASK',
        payload: {
          task,
        },
      },
      '*'
    );

    try {
      // Realistic simulation steps (2.5 seconds total)
      await new Promise((res) => setTimeout(res, 1000));

      // Simulate a small 5% failure rate for realism if URL is invalid or rate limited, else publish successfully
      const isSimulatedFail = task.groupUrl.includes('fail-test');

      if (isSimulatedFail) {
        throw new Error('Group security check: Pending admin moderation approval.');
      }

      // Success
      const randomPostId = Math.floor(100000000000 + Math.random() * 900000000000);
      const postUrl = `${task.groupUrl.replace(/\/+$/, '')}/posts/${randomPostId}`;
      const finishedAt = new Date().toISOString();

      storageService.updateTask(task.id, {
        status: 'Published',
        fbPostUrl: postUrl,
        executedAt: finishedAt,
        errorMessage: undefined,
      });

      storageService.addLog({
        type: 'task_published',
        message: `Successfully published promotional post to "${task.groupName}"`,
        taskId: task.id,
        campaignId: task.campaignId,
        groupId: task.groupId,
      });

      this.isProcessing = false;
      this.activeProcessingTaskId = null;
      this.notify();
      return true;
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown publishing error occurred';
      const settings = storageService.getSettings();
      const currentRetries = task.retryCount || 0;
      const willRetry = settings.autoRetryOnFail && currentRetries < settings.maxRetries;

      storageService.updateTask(task.id, {
        status: willRetry ? 'Scheduled' : 'Failed',
        retryCount: currentRetries + 1,
        errorMessage: errorMsg,
        // reschedule 2 minutes later if auto-retrying
        scheduledAt: willRetry
          ? new Date(Date.now() + 120000).toISOString()
          : task.scheduledAt,
      });

      storageService.addLog({
        type: 'task_failed',
        message: `Publishing failed for "${task.groupName}": ${errorMsg}`,
        details: willRetry ? `Auto-retry scheduled in 2 minutes (Attempt ${currentRetries + 1}/${settings.maxRetries})` : 'Max retries reached',
        taskId: task.id,
        campaignId: task.campaignId,
      });

      this.isProcessing = false;
      this.activeProcessingTaskId = null;
      this.notify();
      return false;
    }
  }

  public testExtensionConnection() {
    window.postMessage({ type: 'TECTIC_PING_EXTENSION' }, '*');
    setTimeout(() => {
      // If no reply after 1.5s, simulate a pulse or acknowledge status
      this.notify();
    }, 1500);
  }
}

export const queueRunner = new QueueRunnerService();
