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
    chrome.runtime.sendMessage({ type: 'getSelectedVoice' }, (response) => {
      const voiceName = response.selectedVoiceName;
      const formData = new FormData();
      formData.append('text', text);
      formData.append('voice', voiceName);

      const requestOptions = {
        method: 'POST',
        mode: 'cors',
        body: formData,
        
      };

      
      
      console.log("Sending request:", requestOptions); 
      fetch('https://e506-35-247-169-249.ngrok.io/synthesize', requestOptions)
        .then((response) => {
            console.log("Received response:", response);
            return response.blob();
        })
        .then((data) => {
          const audio = new Audio(URL.createObjectURL(data));
          audio.play();
        })
        .catch((error) => {
            console.error('Error fetching synthesized speech:', error);
        });
    });
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