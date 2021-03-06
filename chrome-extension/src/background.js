const isDevMode = () => !('update_url' in chrome.runtime.getManifest());
const productionURL = 'https://gitcodeshare.com';
const developmentURL = 'http://localhost:3000';
const getURL = () => (isDevMode() ? developmentURL : productionURL);

chrome.browserAction.onClicked.addListener(popup => {
  let URL = `${getURL()}/api/auth/github/`;
  chrome.tabs.create({ url: URL });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status !== 'complete') return;

  chrome.tabs.executeScript(
    tabId,
    {
      code: 'var injected = window.gitCodeShare; window.gitCodeShare = true; injected;',
      runAt: 'document_start',
    },
    res => {
      if (chrome.runtime.lastError || res[0]) return;
      chrome.tabs.executeScript(tabId, {
        file: 'src/index.js', // TODO: This file name will be replace with our bundle file.
        runAt: 'document_start',
      });
    },
  );
});
