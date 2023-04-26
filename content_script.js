let speakerIcon = null;
let playButton = null;
let audio = null;

function createPlayButton() {
    if (!playButton) {
        playButton = document.createElement('button');
        playButton.innerHTML = 'Play TTS';
        playButton.style.position = 'fixed';
        playButton.style.zIndex = 10000;
        playButton.style.right = '10px';
        playButton.style.bottom = '10px';
        document.body.appendChild(playButton);
        playButton.addEventListener('click', () => {
            if (audio) {
                audio.play();
            }
        }, true);
    }
}

function playAudio() {
  if (audio) {
      audio.play();
  } else {
      setTimeout(playAudio, 100);
  }
}

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

async function playNextChunk(audioList) {
  if (audioList.length > 0) {
      const nextAudio = audioList.shift();
      audio = new Audio(nextAudio);
      audio.play();
      console.log("Playing audio chunk");
      audio.addEventListener('ended', () => {
          console.log("Audio chunk ended");
          playNextChunk(audioList);
      });
  }
}

async function speakHighlightedText(e) {
  e.stopPropagation();
  const fullText = window.getSelection().toString();
  
  if (fullText.length > 0) {
      // Split the text into 30-word chunks
      const words = fullText.split(' ');
      const chunks = [];
      for (let i = 0; i < words.length; i += 30) {
          chunks.push(words.slice(i, i + 30).join(' '));
      }
      console.log("Text split into chunks:", chunks);

      // Fetch the audio for each chunk and store them in an array
      const audioList = [];
      for (const chunk of chunks) {
          const formData = new FormData();
          formData.append('text', chunk);
          formData.append('history_prompt', 'Speaker 1 (en)'); // Replace with your desired prompt

          const requestOptions = {
              method: 'POST',
              mode: 'cors',
              body: formData,
          };
          console.log("API calling", chunks);
          try {
              const response = await fetch('https://deb5-35-247-169-249.ngrok.io/synthesize', requestOptions);
              const data = await response.json();
              const audioData = atob(data.audio_data);
              const audioBytes = new Uint8Array(audioData.length);
              for (let i = 0; i < audioData.length; i++) {
                  audioBytes[i] = audioData.charCodeAt(i);
              }

              const audioCtx = new AudioContext();
              const blob = new Blob([audioBytes.buffer], { type: "audio/wav" });
              const blobUrl = URL.createObjectURL(blob);
              audioList.push(blobUrl);
          } catch (error) {
              console.error('Error fetching synthesized speech:', error);
          }
      }

      console.log("Fetched audio for all chunks");
      playNextChunk(audioList);
  }
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