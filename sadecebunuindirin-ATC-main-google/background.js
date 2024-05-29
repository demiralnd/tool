chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete' && /^https?:/.test(tab.url)) {
      chrome.scripting.executeScript({
          target: { tabId: tabId },
          files: ['content.js']
      }).then(() => {
          console.log('Content script injected successfully.');
      }).catch(err => console.error('Failed to inject content script:', err));
  }
});
