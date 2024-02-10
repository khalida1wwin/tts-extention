# Disclaimer! 
- This is an early version! You might find a few bugs!

# why would you want to use this?
1. Faster than any other TTS extensions (The browser voice is almost instant)
2. State-of-the-art natural TTS voices (bark API)

# Installation 

TTS-Extention API on Google colab (Bark_TTS_API.ipynb):
1. Run all the cells (make sure you use GPU)
2. Get the ngrok.io link (make sure it has s in https because sometimes it only gives http)
3. Paste the link in the extension fetch in content_script.js (there is a comment that will show you where)

Text-to-speech Google Chrome extension: 
To use on Google Chrome:
1. Go to chrome://extensions/
2. Enable "Developer mode" using the toggle in the top right corner
3. Click "Load unpacked" and select the folder containing this extension (clone this repo) 
4. The tts extension should now appear in the list of extensions and the toolbar (check the puzzle icon)

To use the extension:
1. Select your voice from the drop-down menu
2. Highlight the text you want 
3. Click on the speaker icon that shows up after you highlight the text

Tips:
1. Make sure to reload the extension when you edit its files
2. Force restart the pages you want to test after you install the extension 
3. Check the Google Colab if your text has been sent


# This should work on all Chromium browsers:
- Tested on Google Chrome, Microsoft Edge, and Brave 
- For Firefox try the Firefox manifest.json after deleting the old one

# Thanks to suno-ai for their amazing models:
https://github.com/suno-ai/bark



# TO DO:
1. Reading speed
2. Only skim the text give a summary and read it
