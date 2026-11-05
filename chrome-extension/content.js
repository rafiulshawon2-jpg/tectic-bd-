(function () {
  console.log('[TecTic Bd] Facebook Automation & Notification Inspector Loaded on:', window.location.href);

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
    const notifItems = Array.from(document.querySelectorAll('div[data-pagelet*="Notification"], div[role="feed"] div[role="article"]'));
    const detected = [];

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
})();
