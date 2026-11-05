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
  "version": "1.1.0",
  "description": "Automated promotional post publisher, Meta account connector, and group notification tracker across Facebook Groups.",
  "permissions": [
    "storage",
    "tabs",
    "scripting",
    "alarms",
    "notifications",
    "cookies"
  ],
  "host_permissions": [
    "https://*.facebook.com/*",
    "https://facebook.com/*",
    "https://*.instagram.com/*",
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
      "matches": ["https://*.facebook.com/groups/*", "https://facebook.com/groups/*", "https://*.facebook.com/notifications*"],
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
    description: 'Service worker coordinating background publishing alarms, Meta session checking, and notification audits.',
    content: `// background.js - TecTic Bd Group Publisher Service Worker
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

// Periodic alarm for scheduled tasks & notification audits
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
`,
  },
  {
    name: 'popup.html',
    path: 'popup.html',
    description: 'Popup UI displaying active Meta profile, connected status, published queue, and approval/moderation counters.',
    content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>TecTic Bd Publisher</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    body { width: 340px; background: #F3F6FB; color: #111C2E; padding: 16px; font-size: 13px; }
    .header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; border-bottom: 1px solid #E2E8F0; padding-bottom: 8px; }
    .brand { font-weight: 700; font-size: 14px; color: #111C2E; display: flex; align-items: center; gap: 6px; }
    .brand-badge { background: #527CE4; color: white; padding: 2px 6px; border-radius: 4px; font-size: 10px; }
    .status-badge { font-size: 11px; padding: 2px 8px; border-radius: 12px; background: #DCFCE7; color: #16A34A; font-weight: 600; }
    .account-card { background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 8px; padding: 10px 12px; margin-bottom: 10px; display: flex; align-items: center; gap: 10px; }
    .avatar { width: 36px; height: 36px; border-radius: 50%; background: #1877F2; color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 14px; }
    .acc-name { font-weight: 700; font-size: 12px; color: #0F172A; }
    .acc-type { font-size: 10px; color: #64748B; }
    .card { background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 8px; padding: 12px; margin-bottom: 10px; }
    .card-title { font-size: 11px; color: #64748B; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px; }
    .stats-row { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 6px; text-align: center; }
    .stat-box { background: #F8FAFC; border: 1px solid #F1F5F9; border-radius: 6px; padding: 6px 2px; }
    .stat-val { font-size: 15px; font-weight: 700; color: #111C2E; font-family: monospace; }
    .stat-lbl { font-size: 9px; color: #64748B; margin-top: 2px; }
    .btn { display: block; width: 100%; padding: 8px 12px; border-radius: 6px; background: #527CE4; color: #FFFFFF; border: none; font-weight: 600; text-align: center; cursor: pointer; text-decoration: none; font-size: 12px; transition: background 0.15s ease; }
    .btn:hover { background: #3B67D3; }
    .footer { font-size: 10px; text-align: center; color: #94A3B8; margin-top: 8px; }
  </style>
</head>
<body>
  <div class="header">
    <div class="brand">
      <span>TecTic Bd</span>
      <span class="brand-badge">v1.1</span>
    </div>
    <div class="status-badge" id="statusPill">Connected</div>
  </div>

  <div class="account-card">
    <div class="avatar" id="accAvatar">TB</div>
    <div>
      <div class="acc-name" id="accName">TecTic Bd (Official Admin)</div>
      <div class="acc-type" id="accType">Connected Facebook Profile</div>
    </div>
  </div>

  <div class="card">
    <div class="card-title">Group Post Moderation & Notifications</div>
    <div class="stats-row">
      <div class="stat-box">
        <div class="stat-val" id="statApproved" style="color: #16A34A;">0</div>
        <div class="stat-lbl">Approved</div>
      </div>
      <div class="stat-box">
        <div class="stat-val" id="statPendingMod" style="color: #E7A23B;">0</div>
        <div class="stat-lbl">Pending Review</div>
      </div>
      <div class="stat-box">
        <div class="stat-val" id="statDeclined" style="color: #D94F55;">0</div>
        <div class="stat-lbl">Declined/Deleted</div>
      </div>
    </div>
  </div>

  <button class="btn" id="openDashboardBtn">Open Web Dashboard</button>

  <div class="footer">TecTic Bd • Meta Automation & Notification Inspector</div>
  <script src="popup.js"></script>
</body>
</html>`,
  },
  {
    name: 'popup.js',
    path: 'popup.js',
    description: 'Popup logic syncing with local extension storage, Meta ID state, and moderation metrics.',
    content: `// popup.js - TecTic Bd Extension Popup
document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get(['connected', 'metaAccount', 'moderationStats'], (data) => {
    const accName = document.getElementById('accName');
    const accType = document.getElementById('accType');
    const statApproved = document.getElementById('statApproved');
    const statPendingMod = document.getElementById('statPendingMod');
    const statDeclined = document.getElementById('statDeclined');

    if (data.metaAccount) {
      accName.textContent = data.metaAccount.name || 'TecTic Bd (Admin)';
      accType.textContent = (data.metaAccount.platform === 'facebook' ? 'Facebook ' : 'Instagram ') + (data.metaAccount.accountType || 'Profile');
    }

    if (data.moderationStats) {
      statApproved.textContent = data.moderationStats.approved || 0;
      statPendingMod.textContent = data.moderationStats.pending || 0;
      statDeclined.textContent = data.moderationStats.declined || 0;
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
    description: 'Facebook DOM automation script injecting post copy, handling media, and auditing group notification states.',
    content: `// content.js - Facebook Group Content Automation & Notification Inspector
(function () {
  console.log('[TecTic Bd] Facebook Automation & Notification Inspector Loaded on:', window.location.href);

  // Listen for publish and notification inspection requests
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'INJECT_POST') {
      performGroupPublish(request.postData)
        .then((result) => sendResponse({ success: true, result }))
        .catch((err) => sendResponse({ success: false, error: err.message }));
      return true;
    }

    if (request.action === 'INSPECT_GROUP_NOTIFICATIONS') {
      inspectGroupNotifications()
        .then((notifications) => sendResponse({ success: true, notifications }))
        .catch((err) => sendResponse({ success: false, error: err.message }));
      return true;
    }
  });

  async function performGroupPublish(postData) {
    console.log('[TecTic Bd] Publishing via connected Meta ID:', postData);

    const composerTrigger = document.querySelector(
      'div[role="button"][tabindex="0"] span:has-text("Write something..."), div[aria-label*="Create a public post"], div[aria-label*="Write something"]'
    ) || document.querySelector('div[role="button"][tabindex="0"]');

    if (!composerTrigger) {
      throw new Error('Facebook group composer box not found. Ensure you are logged into your connected Meta account.');
    }

    composerTrigger.click();
    await wait(1500);

    const editor = document.querySelector('div[role="textbox"][contenteditable="true"]');
    if (!editor) {
      throw new Error('Composer dialog opened but contenteditable input was not found.');
    }

    editor.focus();
    document.execCommand('insertText', false, postData.caption);
    await wait(1000);

    const postBtn = document.querySelector('div[aria-label="Post"][role="button"], div[aria-label="Publish"][role="button"]');
    if (!postBtn) {
      throw new Error('Post submit button was not detected.');
    }

    postBtn.click();
    await wait(3000);

    return {
      status: 'Published',
      timestamp: new Date().toISOString(),
      url: window.location.href
    };
  }

  async function inspectGroupNotifications() {
    // Scrape / inspect notifications drawer for group post approved/declined events
    const notifItems = Array.from(document.querySelectorAll('div[data-pagelet*="Notification"], div[role="feed"] div[role="article"]'));
    const detected: any[] = [];

    notifItems.forEach((el) => {
      const text = el.textContent || '';
      if (text.includes('approved your post') || text.includes('approved') || text.includes('is now active')) {
        detected.push({
          type: 'live_approved',
          text,
          timestamp: new Date().toISOString()
        });
      } else if (text.includes('declined your post') || text.includes('removed your post') || text.includes('deleted')) {
        detected.push({
          type: 'declined',
          text,
          timestamp: new Date().toISOString()
        });
      } else if (text.includes('pending approval') || text.includes('submitted for review')) {
        detected.push({
          type: 'pending_approval',
          text,
          timestamp: new Date().toISOString()
        });
      }
    });

    return detected;
  }

  function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
})();`,
  },
  {
    name: 'messaging.js',
    path: 'messaging.js',
    description: 'Relays messages between dashboard, Meta session credentials, and extension worker.',
    content: `// messaging.js - Web App Extension Bridge
(function () {
  console.log('[TecTic Bd] Extension Bridge Initialized with Meta Account Support');

  window.postMessage(
    {
      type: 'TECTIC_EXTENSION_HANDSHAKE',
      payload: {
        version: '1.1.0',
        metaReady: true
      }
    },
    '*'
  );

  window.addEventListener('message', (event) => {
    if (!event.data || typeof event.data !== 'object') return;

    if (event.data.type === 'TECTIC_PING_EXTENSION') {
      window.postMessage({
        type: 'TECTIC_EXTENSION_HANDSHAKE',
        payload: { version: '1.1.0', metaReady: true }
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

    if (event.data.type === 'TECTIC_TRIGGER_NOTIFICATION_SYNC') {
      chrome.runtime.sendMessage({ action: 'AUDIT_NOTIFICATIONS' }, (response) => {
        if (response && response.results) {
          response.results.forEach((notif) => {
            window.postMessage({
              type: 'TECTIC_EXTENSION_NEW_NOTIFICATION',
              payload: notif
            }, '*');
          });
        }
      });
    }
  });
})();`,
  },
  {
    name: 'publishing-engine.js',
    path: 'publishing-engine.js',
    description: 'Modular publishing orchestration engine managing tabs, Meta session cookies, and rate throttling.',
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
    console.log('[PublishingEngine] Publishing to group:', task.groupName, 'as Meta account:', task.metaAccountName);

    try {
      const tab = await chrome.tabs.create({
        url: task.groupUrl,
        active: false
      });

      await this.waitForTabLoaded(tab.id);

      const response = await new Promise((resolve) => {
        chrome.tabs.sendMessage(tab.id, {
          action: 'INJECT_POST',
          postData: {
            caption: task.caption,
            mediaUrls: task.mediaUrls,
            metaAccountId: task.metaAccountId
          }
        }, (res) => {
          resolve(res);
        });
      });

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

  async checkFacebookNotifications() {
    try {
      const tab = await chrome.tabs.create({
        url: 'https://www.facebook.com/notifications',
        active: false
      });
      await this.waitForTabLoaded(tab.id);

      const response = await new Promise((resolve) => {
        chrome.tabs.sendMessage(tab.id, { action: 'INSPECT_GROUP_NOTIFICATIONS' }, (res) => {
          resolve(res);
        });
      });

      chrome.tabs.remove(tab.id);
      return response && response.notifications ? response.notifications : [];
    } catch (e) {
      console.warn('[PublishingEngine] Notification check warning:', e);
      return [];
    }
  }

  waitForTabLoaded(tabId) {
    return new Promise((resolve) => {
      const listener = (id, changeInfo) => {
        if (id === tabId && changeInfo.status === 'complete') {
          chrome.tabs.onUpdated.removeListener(listener);
          setTimeout(resolve, 2500);
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
    chrome.alarms.create('TECTIC_NOTIFICATION_CHECK', {
      periodInMinutes: 5
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
