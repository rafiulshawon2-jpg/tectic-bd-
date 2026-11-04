(function () {
  console.log('[TecTic Bd] Facebook Automation Script Loaded on:', window.location.href);

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'INJECT_POST') {
      performGroupPublish(request.postData)
        .then((result) => sendResponse({ success: true, result }))
        .catch((err) => sendResponse({ success: false, error: err.message }));
      return true;
    }
  });

  async function performGroupPublish(postData) {
    console.log('[TecTic Bd] Preparing to publish post to group:', postData);

    const composerTrigger = document.querySelector(
      'div[role="button"][tabindex="0"] span:has-text("Write something..."), div[aria-label*="Create a public post"], div[aria-label*="Write something"]'
    ) || document.querySelector('div[role="button"][tabindex="0"]');

    if (!composerTrigger) {
      throw new Error('Could not find Facebook group post composer box. Please verify you are logged in and a member of this group.');
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

  function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
})();
