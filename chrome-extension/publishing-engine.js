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
