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
  