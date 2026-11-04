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

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'TECTIC_SCHEDULE_TICK') {
    scheduler.checkAndExecuteDueTasks();
  }
});

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
