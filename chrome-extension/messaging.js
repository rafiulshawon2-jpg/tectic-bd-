(function () {
  console.log('[TecTic Bd] Web App Extension Bridge Initialized');

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
})();
