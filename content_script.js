let speakerIcon = null;
let playButton = null;
let audio = null;
let voiceSelection = null;
let stopPlayback = false;
let stopButton = null;
let downloadButton = null;
function createStopButton() {
  if (!stopButton) {
    stopButton = document.createElement('button');
    stopButton.innerHTML = 'Stop TTS';
    stopButton.style.position = 'fixed';
    stopButton.style.zIndex = 10000;
    stopButton.style.right = '10px';
    stopButton.style.bottom = '10px';
    stopButton.style.display = 'none'; // Initially hide the stop button
    stopButton.addEventListener('click', () => {
      if (audio) {
        audio.pause();
        stopPlayback = true;
      }
      if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
      }
      hideStopButton(); // Hide the stop button when clicked
    });
    document.body.appendChild(stopButton);
  }
}

function showStopButton() {
  if (stopButton) {
    stopButton.style.display = 'block';
  }
}

function hideStopButton() {
  if (stopButton) {
    stopButton.style.display = 'none';
  }
}




function waitForVoices() {
  return new Promise((resolve) => {
    const id = setInterval(() => {
      if (speechSynthesis.getVoices().length !== 0) {
        clearInterval(id);
        resolve();
      }
    }, 10);
  });
}
function createApiTtsStopButton() {
  const stopButton = document.createElement('button');
  stopButton.innerHTML = 'Stop API TTS';
  stopButton.style.position = 'fixed';
  stopButton.style.zIndex = 10000;
  stopButton.style.right = '10px';
  stopButton.style.bottom = '10px';
  stopButton.addEventListener('click', () => {
    if (audio) {
      audio.pause();
      stopPlayback = true;
    }
  });
  document.body.appendChild(stopButton);
}
async function speakTextUsingBrowserTTS(text) {
  console.log("speakTextUsingBrowserTTS called");
  await waitForVoices(); // Add this line
  chrome.storage.local.get(['selectedVoiceBrowser'], (items) => {
    const selectedVoiceBrowser = items.selectedVoiceBrowser;
    console.log("selectedVoiceBrowser:", selectedVoiceBrowser);
    const voice = speechSynthesis.getVoices().find((v) => v.voiceURI === selectedVoiceBrowser);
    const utterance = new SpeechSynthesisUtterance(text);
    if (voice) {
      utterance.voice = voice;
    }
    speechSynthesis.speak(utterance);
  });
}
function createDownloadButton(blob) {
  console.log('Blob:', blob); // Add this line
  if (!downloadButton) {
    downloadButton = document.createElement('a');
    downloadButton.innerHTML = 'Download TTS';
    downloadButton.download = 'tts_audio.wav';
    downloadButton.style.position = 'fixed';
    downloadButton.style.zIndex = 10000;
    downloadButton.style.right = '10px';
    downloadButton.style.bottom = '50px';
    document.body.appendChild(downloadButton);
  }
  const url = URL.createObjectURL(blob);
  downloadButton.href = url;
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
    speakerIcon.addEventListener('mousedown', (e) => {
      chrome.storage.local.get('useApi', (items) => {
        speakHighlightedText(e, items.useApi);
      });
    }, true);
    document.body.appendChild(speakerIcon);
  }
  speakerIcon.style.left = Math.min(x - 32, window.innerWidth - 32) + 'px';
  speakerIcon.style.top = Math.min(y - 32, window.innerHeight - 32) + 'px';
  speakerIcon.style.display = 'block';
}


function hideSpeakerIcon() {
  if (speakerIcon) {
    speakerIcon.style.display = 'none';
  }
}

async function playNextChunk(audioList) {
  if (audioList.length > 0 && !stopPlayback) {
    const nextAudio = audioList.shift();
    audio = new Audio(nextAudio);
    audio.play();
    console.log("Playing audio chunk");
    audio.addEventListener('ended', () => {
      console.log("Audio chunk ended");
      playNextChunk(audioList);
    });
  } else {
    stopPlayback = false;
  }
}

async function speakHighlightedText(e, useApi = true) {
  e.stopPropagation();
  showStopButton();
  const fullText = window.getSelection().toString();
  // Get the selected voice from the storage
  chrome.storage.local.get(['useApi', 'selectedVoice'], async (items) => {
  // const useApi = items.useApi;
  const selectedVoice = items.selectedVoice || 'Unconditional';
  console.log('Use API:', useApi);
  console.log('Selected voice:', selectedVoice);
  
  if (fullText.length > 0) {
      if (useApi) {
          // Split the text into 30-word chunks
          const words = fullText.split(' ');
          const chunks = [];
          const audioCtx = new AudioContext();
          for (let i = 0; i < words.length; i += 30) {
              chunks.push(words.slice(i, i + 30).join(' '));
          }
          console.log("Text split into chunks:", chunks);

          // Fetch the audio for each chunk and store them in an array
          const audioList = [];
          const audioBuffers = [];
          for (const chunk of chunks) {
              const formData = new FormData();
              formData.append('text', chunk);
              if (selectedVoice) {
                formData.append('history_prompt', selectedVoice);
              }else{
                formData.append('history_prompt', 'Unconditional');
              }
              formData.append('history_prompt', 'Speaker 1 (en)'); // Replace with your desired prompt

              const requestOptions = {
                  method: 'POST',
                  mode: 'cors',
                  body: formData,
              };
              console.log("API calling", chunks);
              try {
                  const response = await fetch('https://4492-34-141-153-61.ngrok.io/synthesize', requestOptions);
                  const data = await response.json();
                  const audioData = atob(data.audio_data);
                  const audioBytes = new Uint8Array(audioData.length);
                  for (let i = 0; i < audioData.length; i++) {
                      audioBytes[i] = audioData.charCodeAt(i);
                  }

                  
                  const blob = new Blob([audioBytes.buffer], { type: "audio/wav" });
                  const blobUrl = URL.createObjectURL(blob);
                  audioList.push(blobUrl);
                  // Decode the audio data and store the resulting AudioBuffer
                  const decodedAudio = await audioCtx.decodeAudioData(audioBytes.buffer);
                  audioBuffers.push(decodedAudio);
              } catch (error) {
                  console.error('Error fetching synthesized speech:', error);
              }
          }
          const fullBuffer = concatAudioBuffers(audioCtx, audioBuffers);
          // Convert the full AudioBuffer to a Blob and create the Download button
          const fullBlob = await (await audioBufferToWaveBlob(fullBuffer));


          createDownloadButton(fullBlob);



          console.log("Fetched audio for all chunks");
          playNextChunk(audioList);
        
      } else {
        speakTextUsingBrowserTTS(fullText);
      }
    }
  });
}
async function audioBufferToWaveBlob(audioBuffer) {
  const numberOfChannels = audioBuffer.numberOfChannels;
  const lengthInSamples = audioBuffer.length;
  const sampleRate = audioBuffer.sampleRate;

  const waveHeader = new ArrayBuffer(44);
  const waveData = new Int16Array(lengthInSamples * numberOfChannels);

  for (let channelIndex = 0; channelIndex < numberOfChannels; channelIndex++) {
    const channelData = audioBuffer.getChannelData(channelIndex);

    for (let i = 0; i < lengthInSamples; i++) {
      const floatSample = channelData[i];
      const intSample = Math.round(floatSample * 32767); // Convert float to 16-bit PCM
      waveData[i * numberOfChannels + channelIndex] = intSample;
    }
  }

  const waveDataView = new DataView(waveHeader);

  waveDataView.setUint32(0, 0x52494646, false); // "RIFF"
  waveDataView.setUint32(4, 36 + waveData.byteLength, true);
  waveDataView.setUint32(8, 0x57415645, false); // "WAVE"
  waveDataView.setUint32(12, 0x666d7420, false); // "fmt "
  waveDataView.setUint32(16, 16, true); // Subchunk1Size (16 for PCM)
  waveDataView.setUint16(20, 1, true); // AudioFormat (1 for PCM)
  waveDataView.setUint16(22, numberOfChannels, true);
  waveDataView.setUint32(24, sampleRate, true);
  waveDataView.setUint32(28, sampleRate * numberOfChannels * 2, true); // ByteRate
  waveDataView.setUint16(32, numberOfChannels * 2, true); // BlockAlign
  waveDataView.setUint16(34, 16, true); // BitsPerSample
  waveDataView.setUint32(36, 0x64617461, false); // "data"
  waveDataView.setUint32(40, waveData.byteLength, true);

  return new Blob([waveHeader, waveData], { type: "audio/wav" });
}

// Function to concatenate multiple AudioBuffers
function concatAudioBuffers(audioCtx, buffers) {
  const numberOfChannels = buffers[0].numberOfChannels;
  const totalLength = buffers.reduce((acc, buf) => acc + buf.length, 0);
  const result = audioCtx.createBuffer(numberOfChannels, totalLength, buffers[0].sampleRate);

  for (let channelIndex = 0; channelIndex < numberOfChannels; channelIndex++) {
    let offset = 0;
    for (const buffer of buffers) {
      result.copyToChannel(buffer.getChannelData(channelIndex), channelIndex, offset);
      offset += buffer.length;
    }
  }

  return result;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === 'speak_text') {
    const e = new MouseEvent('mousedown');
    speakHighlightedText(e, request.useApi);
  }
});



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

createStopButton();