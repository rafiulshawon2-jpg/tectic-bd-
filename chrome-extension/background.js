import { PublishingEngine } from './publishing-engine.js';
import { Scheduler } from './scheduler.js';

const engine = new PublishingEngine();
const scheduler = new Scheduler(engine);

chrome.runtime.onInstalled.addListener(() => {
  console.log('[TecTic Bd Extension v1.1.0] Installed. Meta session manager active.');
  chrome.storage.local.set({
    connected: true,
    activeCampaign: null,
    queueStats: { pending: 0, completed: 0, failed: 0 },
    moderationStats: { approved: 0, pending: 0, declined: 0 }
  });
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'TECTIC_SCHEDULE_TICK') {
    scheduler.checkAndExecuteDueTasks();
  }
  if (alarm.name === 'TECTIC_NOTIFICATION_CHECK') {
    engine.checkFacebookNotifications();
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'GET_STATUS') {
    chrome.storage.local.get(['connected', 'activeCampaign', 'queueStats', 'moderationStats', 'metaAccount'], (data) => {
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

  if (message.action === 'AUDIT_NOTIFICATIONS') {
    engine.checkFacebookNotifications().then((results) => {
      sendResponse({ success: true, results });
    });
    return true;
  }
});
