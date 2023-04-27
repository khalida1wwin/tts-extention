# Disclaimer! 
- This an early version, and you might find few bugs!

# tts-extention
Google colab (Bark_TTS_API.ipynb):
1. run the all the cells (make sure you use gpu)
2. get the ngrok.io link (make sure it has s in https because sometimes it only gives http)
3. paste the link in the extention fetch in content_script.js (there is a comment that will show you where)

text to speech google chrome extension 
To use on Google Chrome:
1. Go to chrome://extensions/
2. Enable "Developer mode" using the toggle in the top right corner
3. Click "Load unpacked" and select the folder containing this extension (clone this repo) 
4. tts extension should now appear in the list of extensions and in the toolbar (check the puzzle icon)

# This should work on all browsers chromium browsers
- tested on google chrome, brave 
- for firefox try the firefox manifest.json after the deleting the old one
