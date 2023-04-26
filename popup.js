document.addEventListener('DOMContentLoaded', function() {
    const speakButton = document.getElementById('speakButton');
    const inputText = document.getElementById('inputText');
  
    speakButton.addEventListener('click', function() {
      const text = inputText.value;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US'; // Set the language as desired, e.g., 'en-US' for English
      speechSynthesis.speak(utterance);
    });
  });
  
  