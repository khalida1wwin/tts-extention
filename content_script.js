let speakerIcon = null;

function showSpeakerIcon(x, y) {
  if (!speakerIcon) {
    speakerIcon = document.createElement('img');
    speakerIcon.src = chrome.extension.getURL('icon.png');
    speakerIcon.style.position = 'fixed';
    speakerIcon.style.zIndex = 9999;
    speakerIcon.style.cursor = 'pointer';
    speakerIcon.style.width = '32px';
    speakerIcon.style.height = '32px';
    speakerIcon.addEventListener('mousedown', speakHighlightedText, true);
    document.body.appendChild(speakerIcon);
  }
  speakerIcon.style.left = (x - 32) + 'px';
  speakerIcon.style.top = (y - 32) + 'px';
  speakerIcon.style.display = 'block';
}

function hideSpeakerIcon() {
  if (speakerIcon) {
    speakerIcon.style.display = 'none';
  }
}

function speakHighlightedText(e) {
  e.stopPropagation();
  const text = window.getSelection().toString();
  if (text.length > 0) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    speechSynthesis.speak(utterance);
  }
  hideSpeakerIcon();
}

document.addEventListener('mouseup', (e) => {
  const selectedText = window.getSelection().toString();
  if (selectedText.length > 0) {
    showSpeakerIcon(e.pageX, e.pageY);
  } else {
    hideSpeakerIcon();
  }
});

document.addEventListener('mousedown', () => {
  hideSpeakerIcon();
});
