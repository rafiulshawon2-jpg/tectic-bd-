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
