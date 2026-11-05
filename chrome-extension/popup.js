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
});
