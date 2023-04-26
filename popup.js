const voiceSelect = document.getElementById('voiceSelect');

function loadVoices() {
  const voices = speechSynthesis.getVoices();
  voices.forEach((voice) => {
    const option = document.createElement('option');
    option.textContent = voice.name;
    option.value = voice.name;
    voiceSelect.appendChild(option);
  });
}

function saveVoiceSelection() {
  const selectedVoice = voiceSelect.value;
  chrome.storage.sync.set({ selectedVoice: selectedVoice });
}

// Load voices when speechSynthesis is updated or the popup is opened
speechSynthesis.addEventListener('voiceschanged', loadVoices);
document.addEventListener('DOMContentLoaded', loadVoices);

// Save the user's voice selection
voiceSelect.addEventListener('change', saveVoiceSelection);

// Load the user's saved voice selection
chrome.storage.sync.get('selectedVoice', (data) => {
  if (data.selectedVoice) {
    voiceSelect.value = data.selectedVoice;
  }
});
