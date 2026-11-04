export interface ExtensionFile {
  name: string;
  path: string;
  description: string;
  content: string;
}

export const EXTENSION_FILES: ExtensionFile[] = [
  {
    name: 'manifest.json',
    path: 'manifest.json',
    description: 'Manifest V3 configuration, permissions, host rules, and background service worker registration.',
    content: `{
  "manifest_version": 3,
  "name": "TecTic Bd – Smart Group Publisher",
  "version": "1.0.0",
  "description": "Automated promotional post publisher and scheduler across Facebook Groups for TecTic Bd.",
  "permissions": [
    "storage",
    "tabs",
    "scripting",
    "alarms",
    "notifications"
  ],
  "host_permissions": [
    "https://*.facebook.com/*",
    "https://facebook.com/*",
    "http://localhost/*",
    "https://*/*"
  ],
  "action": {
    "default_popup": "popup.html",
    "default_title": "TecTic Bd – Group Publisher"
  },
  "background": {
    "service_worker": "background.js",
    "type": "module"
  },
  "content_scripts": [
    {
      "matches": ["https://*.facebook.com/groups/*", "https://facebook.com/groups/*"],
      "js": ["content.js"],
      "run_at": "document_idle"
    },
    {
      "matches": ["http://localhost:3000/*", "https://*.run.app/*"],
      "js": ["messaging.js"],
      "run_at": "document_start"
    }
  ]
}`,
  },
  {
    name: 'background.js',
    path: 'background.js',
    description: 'Service worker coordinating background publishing alarms, queue synchronization, and tab automation.',
    content: `// background.js - TecTic Bd Group Publisher Service Worker
import { PublishingEngine } from './publishing-engine.js';
import { Scheduler } from './scheduler.js';

const engine = new PublishingEngine();
const scheduler = new Scheduler(engine);

chrome.runtime.onInstalled.addListener(() => {
  console.log('[TecTic Bd Extension] Installed and registered.');
  chrome.storage.local.set({
    connected: true,
    activeCampaign: null,
    queueStats: { pending: 0, completed: 0, failed: 0 }
  });
});

// Alarm listener for scheduled posting intervals
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'TECTIC_SCHEDULE_TICK') {
    scheduler.checkAndExecuteDueTasks();
  }
});

// Communication bridge from content scripts and popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'GET_STATUS') {
    chrome.storage.local.get(['connected', 'activeCampaign', 'queueStats'], (data) => {
      sendResponse(data);
    });
    return true;
  }

  if (message.action === 'SYNC_QUEUE') {
    scheduler.syncTasks(message.tasks);
    sendResponse({ success: true, count: message.tasks.length });
    return true;
  }

  if (message.action === 'PUBLISH_TASK_NOW') {
    engine.publishTask(message.task).then((result) => {
      sendResponse(result);
    });
    return true;
  }
});
`,
  },
  {
    name: 'popup.html',
    path: 'popup.html',
    description: 'Compact popup user interface for viewing extension bridge status and active campaign queue stats.',
    content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>TecTic Bd Publisher</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    body { width: 340px; background: #F3F6FB; color: #111C2E; padding: 16px; font-size: 13px; }
    .header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; border-bottom: 1px solid #E2E8F0; padding-bottom: 10px; }
    .brand { font-weight: 700; font-size: 14px; color: #111C2E; display: flex; align-items: center; gap: 6px; }
    .brand-badge { background: #527CE4; color: white; padding: 2px 6px; border-radius: 4px; font-size: 10px; }
    .status-badge { font-size: 11px; padding: 2px 8px; border-radius: 12px; background: #DCFCE7; color: #16A34A; font-weight: 600; display: inline-flex; align-items: center; gap: 4px; }
    .card { background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 8px; padding: 12px; margin-bottom: 12px; }
    .card-title { font-size: 11px; color: #64748B; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px; }
    .campaign-name { font-weight: 600; font-size: 13px; color: #0F172A; margin-bottom: 8px; }
    .stats-row { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; text-align: center; }
    .stat-box { background: #F8FAFC; border: 1px solid #F1F5F9; border-radius: 6px; padding: 8px 4px; }
    .stat-val { font-size: 16px; font-weight: 700; color: #111C2E; }
    .stat-lbl { font-size: 10px; color: #64748B; margin-top: 2px; }
    .btn { display: block; width: 100%; padding: 8px 12px; border-radius: 6px; background: #527CE4; color: #FFFFFF; border: none; font-weight: 600; text-align: center; cursor: pointer; text-decoration: none; font-size: 12px; transition: background 0.15s ease; }
    .btn:hover { background: #3B67D3; }
    .footer { font-size: 11px; text-align: center; color: #94A3B8; margin-top: 10px; }
  </style>
</head>
<body>
  <div class="header">
    <div class="brand">
      <span>TecTic Bd</span>
      <span class="brand-badge">v1.0</span>
    </div>
    <div class="status-badge" id="statusPill">Connected</div>
  </div>

  <div class="card">
    <div class="card-title">Active Campaign</div>
    <div class="campaign-name" id="campaignName">TecTic Bd Promotional Launch</div>
    <div class="stats-row">
      <div class="stat-box">
        <div class="stat-val" id="statPending" style="color: #527CE4;">0</div>
        <div class="stat-lbl">Pending</div>
      </div>
      <div class="stat-box">
        <div class="stat-val" id="statCompleted" style="color: #16A34A;">0</div>
        <div class="stat-lbl">Published</div>
      </div>
      <div class="stat-box">
        <div class="stat-val" id="statFailed" style="color: #D94F55;">0</div>
        <div class="stat-lbl">Failed</div>
      </div>
    </div>
  </div>

  <button class="btn" id="openDashboardBtn">Open Web Dashboard</button>

  <div class="footer">TecTic Bd • Smart Group Publisher</div>
  <script src="popup.js"></script>
</body>
</html>`,
  },
  {
    name: 'popup.js',
    path: 'popup.js',
    description: 'Popup script fetching runtime campaign statistics and providing quick navigation to the web dashboard.',
    content: `// popup.js - TecTic Bd Extension Popup
document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get(['connected', 'activeCampaign', 'queueStats'], (data) => {
    const statusPill = document.getElementById('statusPill');
    const campaignName = document.getElementById('campaignName');
    const statPending = document.getElementById('statPending');
    const statCompleted = document.getElementById('statCompleted');
    const statFailed = document.getElementById('statFailed');

    if (data.activeCampaign) {
      campaignName.textContent = data.activeCampaign.name;
    }

    if (data.queueStats) {
      statPending.textContent = data.queueStats.pending || 0;
      statCompleted.textContent = data.queueStats.completed || 0;
      statFailed.textContent = data.queueStats.failed || 0;
    }
  });

  document.getElementById('openDashboardBtn').addEventListener('click', () => {
    chrome.tabs.create({ url: 'http://localhost:3000' });
  });
});`,
  },
  {
    name: 'content.js',
    path: 'content.js',
    description: 'Injected Facebook DOM script that automates opening the group composer, inputting text, and handling posting.',
    content: `// content.js - Facebook Group Content Automation Script
(function () {
  console.log('[TecTic Bd] Facebook Automation Script Loaded on:', window.location.href);

  // Listen for publish requests from background worker
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'INJECT_POST') {
      performGroupPublish(request.postData)
        .then((result) => sendResponse({ success: true, result }))
        .catch((err) => sendResponse({ success: false, error: err.message }));
      return true; // async reply
    }
  });

  async function performGroupPublish(postData) {
    console.log('[TecTic Bd] Preparing to publish post to group:', postData);

    // 1. Locate write post button / box
    const composerTrigger = document.querySelector(
      'div[role="button"][tabindex="0"] span:has-text("Write something..."), div[aria-label*="Create a public post"], div[aria-label*="Write something"]'
    ) || document.querySelector('div[role="button"][tabindex="0"]');

    if (!composerTrigger) {
      throw new Error('Could not find Facebook group post composer box. Please verify you are logged in and a member of this group.');
    }

    // Trigger click on composer
    composerTrigger.click();
    await wait(1500);

    // 2. Locate editable contenteditable area
    const editor = document.querySelector('div[role="textbox"][contenteditable="true"]');
    if (!editor) {
      throw new Error('Composer dialog opened but contenteditable input was not found.');
    }

    // Insert post caption text
    editor.focus();
    document.execCommand('insertText', false, postData.caption);
    await wait(1000);

    // 3. Locate Post submission button
    const postBtn = document.querySelector('div[aria-label="Post"][role="button"], div[aria-label="Publish"][role="button"]');
    if (!postBtn) {
      throw new Error('Post submit button was not detected.');
    }

    // Simulated click
    postBtn.click();
    await wait(3000);

    return {
      status: 'Published',
      timestamp: new Date().toISOString(),
      url: window.location.href
    };
  }

  function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
})();`,
  },
  {
    name: 'messaging.js',
    path: 'messaging.js',
    description: 'Web application bridge content script relaying messages between the React web app and Chrome Extension.',
    content: `// messaging.js - Dashboard to Extension Communication Bridge
(function () {
  console.log('[TecTic Bd] Web App Extension Bridge Initialized');

  // Notify web app that extension is active
  window.postMessage(
    {
      type: 'TECTIC_EXTENSION_HANDSHAKE',
      payload: {
        version: '1.0.0',
        ready: true
      }
    },
    '*'
  );

  // Relay window messages from web dashboard to chrome.runtime
  window.addEventListener('message', (event) => {
    if (!event.data || typeof event.data !== 'object') return;

    if (event.data.type === 'TECTIC_PING_EXTENSION') {
      window.postMessage({
        type: 'TECTIC_EXTENSION_HANDSHAKE',
        payload: { version: '1.0.0', ready: true }
      }, '*');
    }

    if (event.data.type === 'TECTIC_DISPATCH_TASK') {
      chrome.runtime.sendMessage({
        action: 'PUBLISH_TASK_NOW',
        task: event.data.payload.task
      }, (response) => {
        window.postMessage({
          type: 'TECTIC_EXTENSION_UPDATE_TASK',
          payload: {
            taskId: event.data.payload.task.id,
            status: response && response.success ? 'Published' : 'Failed',
            errorMessage: response && response.error
          }
        }, '*');
      });
    }
  });
})();`,
  },
  {
    name: 'publishing-engine.js',
    path: 'publishing-engine.js',
    description: 'Modular publishing orchestration engine managing tabs, intervals, delays, and anti-spam measures.',
    content: `// publishing-engine.js - Modular Facebook Publishing Engine
export class PublishingEngine {
  constructor() {
    this.activeTask = null;
    this.isBusy = false;
  }

  async publishTask(task) {
    if (this.isBusy) {
      return { success: false, error: 'Engine is currently processing another task.' };
    }

    this.isBusy = true;
    this.activeTask = task;
    console.log('[PublishingEngine] Starting publish sequence for group:', task.groupName);

    try {
      // 1. Open group in a background tab
      const tab = await chrome.tabs.create({
        url: task.groupUrl,
        active: false
      });

      // 2. Wait for page load
      await this.waitForTabLoaded(tab.id);

      // 3. Inject and trigger posting action
      const response = await new Promise((resolve) => {
        chrome.tabs.sendMessage(tab.id, {
          action: 'INJECT_POST',
          postData: {
            caption: task.caption,
            mediaUrls: task.mediaUrls
          }
        }, (res) => {
          resolve(res);
        });
      });

      // 4. Close the tab gracefully after execution
      await new Promise(r => setTimeout(r, 2000));
      chrome.tabs.remove(tab.id);

      this.isBusy = false;
      this.activeTask = null;

      if (!response || !response.success) {
        throw new Error(response ? response.error : 'No response from page content script');
      }

      return { success: true, details: response.result };
    } catch (err) {
      this.isBusy = false;
      this.activeTask = null;
      console.error('[PublishingEngine] Publishing error:', err);
      return { success: false, error: err.message };
    }
  }

  waitForTabLoaded(tabId) {
    return new Promise((resolve) => {
      const listener = (id, changeInfo) => {
        if (id === tabId && changeInfo.status === 'complete') {
          chrome.tabs.onUpdated.removeListener(listener);
          setTimeout(resolve, 2500); // safety buffer for Facebook dynamic React hydration
        }
      };
      chrome.tabs.onUpdated.addListener(listener);
    });
  }
}
`,
  },
  {
    name: 'scheduler.js',
    path: 'scheduler.js',
    description: 'Task queue scheduler and alarm countdown tracker.',
    content: `// scheduler.js - Scheduling and Queue Dispatcher
export class Scheduler {
  constructor(engine) {
    this.engine = engine;
    this.tasks = [];
    this.initAlarm();
  }

  initAlarm() {
    chrome.alarms.create('TECTIC_SCHEDULE_TICK', {
      periodInMinutes: 1
    });
  }

  syncTasks(taskList) {
    this.tasks = taskList || [];
    this.updateStats();
  }

  updateStats() {
    const pending = this.tasks.filter(t => t.status === 'Scheduled').length;
    const completed = this.tasks.filter(t => t.status === 'Published').length;
    const failed = this.tasks.filter(t => t.status === 'Failed').length;

    chrome.storage.local.set({
      queueStats: { pending, completed, failed }
    });
  }

  async checkAndExecuteDueTasks() {
    const now = Date.now();
    const dueTask = this.tasks.find(
      t => t.status === 'Scheduled' && new Date(t.scheduledAt).getTime() <= now
    );

    if (dueTask) {
      console.log('[Scheduler] Executing due task:', dueTask.id, dueTask.groupName);
      dueTask.status = 'Processing';
      this.updateStats();

      const result = await this.engine.publishTask(dueTask);
      dueTask.status = result.success ? 'Published' : 'Failed';
      this.updateStats();
    }
  }
}
`,
  },
];
