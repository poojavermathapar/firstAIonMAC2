# Brain Buddies · Play & Say

A separate, child-friendly revision of Brain Buddies. Open dist/index.html for learning games. To use the microphone reliably, serve dist over localhost or HTTPS.

With Python installed:

    cd /Users/pvthome/firstAIonMAC2/brain-buddies-play/dist
    python3 -m http.server 8000

Then visit http://localhost:8000.

- Four learning adventures, three levels, read-aloud instructions, and saved stars.
- Voice notes: record up to 60 seconds, replay, download, and delete.
- Microphone access is requested only when Start recording is pressed.
- Audio is stored in IndexedDB on the current browser/device. It is not uploaded. Clearing browser data removes notes. Download notes to keep a separate copy.
- Speech uses the browser's speech synthesis service; available voices vary.
- Learning content and generators are reused from the original Brain Buddies.
- Private Sites project registered, but not published: this environment lacks Node and cannot download it under its network restrictions.

Verification: JavaScript syntax and generated learning rounds checked with macOS JavaScriptCore. Interactive browser and real microphone verification remain to be performed.
