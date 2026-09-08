# 🐯 Leo - Voice-First AI Learning Assistant

## Overview
Leo is your new voice-first AI learning companion, replacing the previous emoji-based assistant. Leo is powered by a cute tiger Lottie animation and uses Web Speech API for real-time voice interactions.

## ✨ Features

### 1. **Voice Input (Speech Recognition)**
- Click the **🎤 Talk** button to start listening
- Leo will transcribe your voice in real-time
- Supports all voice commands and queries

### 2. **Voice Output (Text-to-Speech)**
- Leo responds to commands with voice feedback
- Warm, friendly tone (pitch: 1.1, rate: 0.95)
- All responses are spoken aloud to the student

### 3. **Cute Tiger Animation**
- Lottie animation of a cute tiger in purple circle
- Floats gently when idle
- Pulses when listening (🎙️ indicator appears)
- Bounces when speaking (🔊 indicator appears)

### 4. **Voice Agent Commands**
Leo understands and responds to:

| Command | Leo's Response |
|---------|---|
| "Hello" / "Hi" / "Hey" | Greets you warmly |
| "What can you do?" / "Help" | Lists capabilities |
| "Who are you?" | Introduces himself as Leo |
| "Thank you" / "Thanks" | Acknowledges gratitude |
| "Quit" / "Exit" / "Goodbye" | Says goodbye |
| Any other text | Echoes and asks for clarity |

### 5. **Visual Feedback**
- **🎙️ Listening pulse** - Leo is listening to you
- **🔊 Speaking pulse** - Leo is responding
- **Transcript display** - Shows what Leo heard you say
- **Smooth animations** - Floating, pulsing, and bouncing effects

## 🚀 How to Use Leo

### Step 1: Open the App
Navigate to any page on Lumina platform (home, login, dashboard, etc.)

### Step 2: Click the "🎤 Talk" Button
The button appears in the bottom-right corner with the tiger animation

### Step 3: Grant Microphone Permission
When prompted by your browser, click "Allow" to give Leo access to your microphone
- **Chrome/Edge**: Settings icon → Site settings → Microphone
- **Firefox**: Click the microphone icon in the address bar

### Step 4: Speak Your Command
- Say your command clearly
- Leo will show "🎙️" indicator while listening
- Transcript appears above the button

### Step 5: Leo Responds
- Leo speaks the response aloud
- Shows "🔊" indicator while speaking
- Can ask follow-up questions

## 📋 Keyboard Accessibility
- **Tab key**: Navigate to "🎤 Talk" button
- **Enter**: Activate microphone listening
- **Escape**: Cancel listening

## 🔧 Technical Details

### Component: GlobalAssistant.jsx
**Location**: `src/components/GlobalAssistant.jsx`

**Key Functions**:
```javascript
// Initialize Leo on page load
useEffect(() => {
  loadAnimation(); // Load tiger Lottie JSON
  ttsService.speak("Hi I am Leo"); // Welcome message
}, [isInitialized]);

// Process voice commands
processVoiceCommand(command)

// Toggle voice listening
toggleListening()
```

### Animation
**File**: `public/assets/leo-tiger.json`
- Cute Tiger Lottie animation
- Plays automatically when listening
- No manual configuration needed

### Speech Recognition Setup
- **Engine**: Web Speech API (standard browser)
- **Language**: English (en-US)
- **Continuous**: False (stops after final result)
- **Interim Results**: Yes (shows live transcription)

### Text-to-Speech Settings
- **Service**: ttsService (uses browser Web Audio API)
- **Pitch**: 1.1 (friendly, approachable tone)
- **Rate**: 0.95 (clear, easy to understand)
- **Volume**: 1.0 (full volume)

## 🎮 Integration with Games

To trigger Leo responses in games:

```javascript
// Inside your game component
import ttsService from '../services/ttsService';

// When player wins
ttsService.speak("Congratulations! You won!", {
  rate: 0.95,
  pitch: 1.1,
});

// When player needs help
ttsService.speak("Try looking at the clues again", {
  rate: 0.95,
  pitch: 1.1,
});
```

## 🛠️ Configuration

### To customize Leo's welcome message
**File**: `src/components/GlobalAssistant.jsx` (line ~30)
```javascript
const welcomeMsg = "Hi I am Leo"; // Change this text
```

### To add new voice commands
**File**: `src/components/GlobalAssistant.jsx` (line ~115)
Add new conditions in `processVoiceCommand()`:
```javascript
if (command.includes('new keyword')) {
    response = "Leo's response here";
}
```

### To change Leo's voice settings
**File**: `src/components/GlobalAssistant.jsx` (line ~135)
```javascript
ttsService.speak(response, {
    rate: 0.95,      // Speech speed (0.5-2.0)
    pitch: 1.1,      // Voice pitch (0.5-2.0)
    volume: 1.0,     // Volume (0.0-1.0)
});
```

## 🎨 Styling

**CSS File**: `src/components/GlobalAssistant.css`

### Main Classes
- `.leo-assistant-container` - Main wrapper (fixed bottom-right)
- `.leo-character` - Tiger animation circle
- `.leo-controls` - Button container
- `.leo-listen-btn` - Talk button
- `.leo-transcript` - Text display box

### Animation Classes
- `.listening` - Applied when Leo is listening
- `.speaking` - Applied when Leo is speaking
- `.active` - Applied to button when active

### Responsive Breakpoints
- **Desktop**: 140px character, 32px offset
- **Tablet** (≤768px): 120px character, 24px offset
- **Mobile** (≤480px): 100px character, 16px offset

## ⚙️ Browser Support

| Browser | Speech Recognition | Text-to-Speech | Status |
|---------|---|---|---|
| Chrome / Edge | ✅ | ✅ | Fully supported |
| Firefox | ✅ | ✅ | Fully supported |
| Safari | ⚠️ | ✅ | Limited speech recognition |
| Mobile Browsers | ⚠️ | ✅ | Varies by device |

**Note**: Requires HTTPS for microphone access on production

## 🔐 Privacy & Permissions

- **Microphone Access**: Required only when clicking "🎤 Talk"
- **Data**: Speech processed locally in browser
- **No Tracking**: Leo doesn't store voice history
- **Permissions Reset**: Can be reset in browser settings

## 🐛 Troubleshooting

### Issue: "Microphone not working"
**Solution**: 
1. Grant microphone permission in browser settings
2. Check browser console for errors (F12)
3. Ensure HTTPS in production

### Issue: "Leo not speaking"
**Solution**:
1. Check system volume is not muted
2. Verify `ttsService` is loaded
3. Clear browser cache and reload

### Issue: "Speech recognition stops immediately"
**Solution**:
1. Check browser's speech recognition permissions
2. Try speaking more clearly
3. Reduce background noise

### Issue: "Tiger animation not showing"
**Solution**:
1. Verify `leo-tiger.json` exists in `public/assets/`
2. Check browser console for animation load errors
3. Fallback emoji 🐯 should appear if animation fails

## 📝 Files Changed

### Completely Replaced:
- `src/components/GlobalAssistant.jsx` - Now voice-first Leo component
- `src/components/GlobalAssistant.css` - New Leo styling

### Newly Added:
- `public/assets/leo-tiger.json` - Tiger Lottie animation

### Unchanged:
- `src/contexts/LearningAssistantContext.jsx` (no longer used)
- `src/hooks/useGameVictory.js` (optional)
- `src/App.jsx` (provider wrapper remains)

## 🎯 Next Steps

1. **Test voice commands** by clicking "🎤 Talk"
2. **Customize commands** by editing `processVoiceCommand()`
3. **Integrate with games** using `ttsService.speak()`
4. **Add personality** by tweaking Leo's responses
5. **Monitor console** for any errors during use

## 💡 Example Commands to Try

```
"Hello Leo"
"What can you do?"
"Who are you?"
"Help me please"
"Thank you Leo"
"Tell me a joke"
"Goodbye"
```

## 📞 Support

For issues or questions:
1. Check browser console (F12 → Console tab)
2. Verify all files are in correct locations
3. Test in a different browser
4. Check that `leo-tiger.json` is valid JSON

---

**Leo is ready to help your students learn!** 🐯✨
