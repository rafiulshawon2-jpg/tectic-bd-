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
});
