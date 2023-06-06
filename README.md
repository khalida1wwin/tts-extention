# Disclaimer! 
- This is an early version, and you might find few bugs!

# why would you want to use this?
1. Faster than any other tts extentions (The browser voice is almost instant)
2. State of the art natural tts voices (bark api)

# Installation 

tts-extention API on Google colab (Bark_TTS_API.ipynb):
1. run all the cells (make sure you use gpu)
2. get the ngrok.io link (make sure it has s in https because sometimes it only gives http)
3. paste the link in the extension fetch in content_script.js (there is a comment that will show you where)

Text-to-speech google chrome extension: 
To use on Google Chrome:
1. Go to chrome://extensions/
2. Enable "Developer mode" using the toggle in the top right corner
3. Click "Load unpacked" and select the folder containing this extension (clone this repo) 
4. tts extension should now appear in the list of extensions and in the toolbar (check the puzzle icon)

To use the extension:
1. Select your voice from the drop-down menu
2. Highlight the text you want 
3. click on the speaker icon that shows up after you highlight the text

Tips:
1. make sure to reload the extension when you edit its files
2. force restart the pages you want to test after you install the extension 
3. check the google colab if your text has been sent


# This should work on all Chromium browsers:
- tested on google chrome, Microsoft Edge, and Brave 
- for firefox try the Firefox manifest.json after deleting the old one

# Thanks to suno-ai for their amazing models:
https://github.com/suno-ai/bark



# TO DO:
1. Reading speed
2. only skim the text and give a summary and read it
