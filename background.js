chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'getSelectedVoice') {
      chrome.storage.sync.get('selectedVoice', (data) => {
        let selectedVoiceName = null;
        if (data.selectedVoice) {
          const selectedVoice = speechSynthesis.getVoices().find((voice) => voice.name === data.selectedVoice);
          if (selectedVoice) {
            selectedVoiceName = selectedVoice.name;
          }
        }
        sendResponse({ selectedVoiceName: selectedVoiceName });
      });
      return true; // Required to use sendResponse asynchronously
    }
  });
chrome.storage.sync.get('useApi', (items) => {
  const useApi = items.useApi;
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {
      message: 'speak_text',
      useApi,
    });
  });
});