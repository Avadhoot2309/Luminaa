# ADHD Dashboard - Technical Architecture

## 📐 Component Hierarchy

```
StudentDashboard (Entry Point)
├── Conditional Check: profile?.condition === 'ADHD'
├── If TRUE → ADHDDashboard (Recommended for ADHD students)
└── If FALSE → Standard Dashboard (Default for all other students)
```

---

## 🏗️ ADHDDashboard Component Structure

```
ADHDDashboard
├── Header (Navigation)
│   ├── Logo + Title
│   ├── Nav Links (Lessons, Games)
│   └── Student Name Badge
│
├── Main Content (5 Sections)
│   ├── 1. Today's Focus Section
│   │   └── Task Cards (Max 2)
│   │       ├── Completion State (Checkbox)
│   │       ├── Priority Badge
│   │       └── Click Handler
│   │
│   ├── 2. Focus Timer Section
│   │   ├── Large Timer Display (3.5rem)
│   │   ├── Start/Pause Button
│   │   ├── Reset Button
│   │   └── Duration Selector (5/10/15/25m)
│   │
│   ├── 3. Streak + Progress Section
│   │   ├── Streak Indicator (🔥 Counter)
│   │   └── Daily Progress Bar (0-5 tasks)
│   │
│   ├── 4. Encouragement Message
│   │   └── Dynamic Text (based on streak count)
│   │
│   ├── 5. Warning/Alert Sections (Conditional)
│   │   ├── Inactivity Warning (> 10 mins)
│   │   └── Fatigue Warning (> 15 mins)
│   │
│   └── 6. Main Actions Grid (3 Only)
│       ├── Continue Lesson (Highlights on inactivity)
│       ├── New Lesson
│       └── Quick Game (Highlights on fatigue)
```

---

## 🔄 State Management Flow

```javascript
// ┌─────────────────────────────────────────┐
// │ Component Mount                         │
// └────────────┬────────────────────────────┘
//              │
//              ↓
// ┌─────────────────────────────────────────┐
// │ Initialize States:                      │
// │  - Timer (0s, 600s duration)            │
// │  - Tasks (2 default)                    │
// │  - Activity (now)                       │
// │  - Streak (0 or from profile)           │
// │  - Fatigue (0)                          │
// └────────────┬────────────────────────────┘
//              │
//              ↓
// ┌─────────────────────────────────────────┐
// │ Start Interval Loops:                   │
// │  1. Timer: 1s if running                │
// │  2. Inactivity: Every 30s               │
// └────────────┬────────────────────────────┘
//              │
//              ├─────────────────────────────┐
//              │                             │
//              ↓                             ↓
//     Timer Updates           Inactivity Check
//         |                         |
//         └────────┬────────────────┘
//                  ↓
//         Triggers Activity Detection:
//         - Calculate minutes since activity
//         - Update fatigue level
//         - Show/hide warnings
//         - Change button colors
```

---

## 📊 Activity Detection Algorithm

```
Current Time - Last Activity Time = Inactivity Duration (minutes)

if (inactivityMinutes > 15) {
  setFatigueLevel(100)           // 🔴 High Fatigue
  setShowFatigueWarning(true)    // Show warning popup
  // Button: "Continue Lesson" → RED
  // Button: "Quick Game" → GREEN
}
else if (inactivityMinutes > 10) {
  setFatigueLevel(75)            // 🟠 Medium Fatigue
  // Button: "Continue Lesson" → RED (highlight)
  // Button: "Quick Game" → NORMAL
}
else if (inactivityMinutes > 5) {
  setFatigueLevel(50)            // 🟡 Low Fatigue
  // All buttons → NORMAL
}
else {
  setFatigueLevel(0)             // ✅ Fresh
  setShowFatigueWarning(false)
  // All buttons → NORMAL
}
```

---

## ⏱️ Timer Logic

```javascript
// Timer Initialization
timerSeconds = 0
timerDuration = selectedMinutes * 60  // 300, 600, 900, or 1500

// Timer Loop (runs if isTimerRunning = true)
setInterval(() => {
  if (timerSeconds < timerDuration) {
    setTimerSeconds(timerSeconds + 1)
  } else {
    setIsTimerRunning(false)  // Auto-stop at duration
  }
}, 1000)  // Check every second

// Display Format
formatTime(seconds) = 
  minutes = Math.floor(seconds / 60)
  secs = seconds % 60
  return `${minutes.padStart(2, '0')}:${secs.padStart(2, '0')}`
  
// Example:
// 125 seconds → "02:05"
// 600 seconds → "10:00"
```

---

## 🎬 User Interaction Flow

```
User Opens Dashboard
        ↓
Is profile?.condition === 'ADHD'?
    ↙          ↘
  YES          NO
   │            └─→ Render Standard Dashboard
   ↓
Render ADHD Dashboard
        ↓
User Sees:
  - 2 tasks in "Today's Focus"
  - 3 main action buttons
  - Focus timer (paused)
  - Streak counter
  - Progress bar
        ↓
User Interaction Triggers Activity Recording:
  ├─ Click task → recordActivity()
  ├─ Start timer → recordActivity()
  ├─ Select language → recordActivity()
  ├─ Click any button → recordActivity()
  └─ Complete task → recordActivity() + streak++
        ↓
Activity Detected:
  - lastActivityTime = NOW
  - inactivityMinutes = 0
  - fatigueLevel = 0
  - Warnings hidden
        ↓
Wait 5 seconds (no action)
        ↓
30-second timer fires:
  inactivityMinutes = 0.083 (< 5)
  → State unchanged, all normal
        ↓
Wait 10 more seconds (no action)
        ↓
30-second timer fires:
  inactivityMinutes = 0.333 (5-10 range)
  → fatigueLevel = 50, warnings hidden
        ↓
Wait 10 more seconds (no action)
        ↓
30-second timer fires:
  inactivityMinutes = 0.667 (10-15 range)
  → fatigueLevel = 75
  → "Continue Lesson" button TURNS RED
  → No warning yet
        ↓
Wait 5 more seconds (no action)
        ↓
30-second timer fires:
  inactivityMinutes > 0.917 (15+ minutes)
  → fatigueLevel = 100
  → showFatigueWarning = TRUE
  → RED warning banner appears: "⚠️ Ready for a break?"
  → "Quick Game" button TURNS GREEN
        ↓
User clicks "Quick Game":
  - recordActivity() → lastActivityTime = NOW
  - navigate('/games')
  - All warnings disappear
  - Timer resets
```

---

## 🎨 Styling Architecture

### CSS-in-JS Approach
All styles are inline JavaScript objects. No external CSS files needed.

```javascript
const C = {
  // Color System
  navy: '#0F172A',
  blue: '#2563EB',
  slate: '#F8FAFC',
  // ... other colors
}

const Fonts = {
  heading: "'Fraunces', serif",
  body: "'Nunito', sans-serif"
}

// Applied to elements
style={{
  backgroundColor: C.blue,
  fontFamily: Fonts.heading,
  padding: '24px',
  // ... more styles
}}
```

### Responsive Behavior
- Fixed pixel values for desktop
- No media queries (assumes desktop-first)
- Touch-friendly: buttons min 200px height
- Font scaling: headings 2-3.5rem, body 0.85-1.3rem

---

## 🔐 Data Flow Diagram

```
┌──────────────────────┐
│  ProfileContext      │
│  - student data      │
│  - condition field   │
│  - streak counter    │
└──────┬───────────────┘
       │
       ↓
┌──────────────────────┐
│ StudentDashboard     │
│ (Entry Point)        │
│                      │
│ if condition='ADHD'  │
│   render ADHD        │
│ else                 │
│   render Standard    │
└──────┬───────────────┘
       │
       ↓
┌──────────────────────┐
│ ADHDDashboard        │
│                      │
│ Local States:        │
│  - timerSeconds      │
│  - todayTasks        │
│  - inactivityMinutes │
│  - fatigueLevel      │
│  - currentStreak     │
│                      │
│ Effects:             │
│  - Timer interval    │
│  - Activity monitor  │
└──────┬───────────────┘
       │
       ├──────────────────────────────┐
       │                              │
       ↓                              ↓
┌────────────────┐          ┌──────────────────┐
│ Render UI      │          │ Track Events     │
│ (JSX)          │          │ (Analytics)      │
│                │          │                  │
│ - Header       │          │ - Task complete  │
│ - Tasks        │          │ - Timer session  │
│ - Timer        │          │ - Navigation     │
│ - Streak       │          │ - Inactivity     │
│ - Actions      │          │ - Fatigue level  │
│ - Warnings     │          └──────────────────┘
└────────────────┘
```

---

## 🔌 Integration Points

### 1. Profile Context Integration
```javascript
const { profile } = useProfile()

profile structure:
{
  id: "student_123",
  name: "John",
  grade: 6,
  condition: "ADHD",      // ← REQUIRED for rendering
  streak: 0,
  // ... other fields
}
```

### 2. Accessibility Context Integration
```javascript
const { isDyslexiaMode } = useAccessibility()

// Applies OpenDyslexic font if enabled
fontFamily: isDyslexiaMode ? "'OpenDyslexic', sans-serif" : Fonts.body
```

### 3. React Router Integration
```javascript
const navigate = useNavigate()

// Navigation handlers
navigate('/subjects')     // Lessons
navigate('/games')        // Games
navigate('/settings')     // Settings
```

### 4. Translation (i18n) Integration
```javascript
const { t } = useTranslation()

t('dashboard.lessons')
t('dashboard.games')
t('common.logout')
```

---

## 📈 Performance Considerations

### Interval Cleanup
```javascript
// ✅ Good - Proper cleanup
useEffect(() => {
  const interval = setInterval(() => { /* ... */ }, 30000)
  return () => clearInterval(interval)
}, [])

// ❌ Bad - Memory leak
setInterval(() => { /* ... */ }, 30000) // No cleanup!
```

### State Update Batching
```javascript
// ✅ Efficient - Multiple updates in one handler
const handleCompleteTask = (taskId) => {
  setTodayTasks(tasks => /* update */)
  setCurrentStreak(streak + 1)
  // React batches these into one re-render
}

// ❌ Inefficient - Separate operations
setTodayTasks(...)
setCurrentStreak(...)
setFatigueLevel(...)
// Each could trigger separate re-renders
```

### Timer Memory Usage
```javascript
// Current approach: Clean ref on unmount
const timerIntervalRef = useRef(null)

useEffect(() => {
  if (isTimerRunning) {
    timerIntervalRef.current = setInterval(() => { /* ... */ }, 1000)
  }
  return () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current)
    }
  }
}, [isTimerRunning])
```

---

## 🧪 Unit Test Structure

```javascript
describe('ADHDDashboard', () => {
  
  test('renders when profile.condition is ADHD', () => {
    // Mock ProfileContext with condition='ADHD'
    // Assert ADHD dashboard renders
  })
  
  test('timer starts and increments', () => {
    // Click start button
    // Assert timerSeconds increases every 1s
    // Assert display updates
  })
  
  test('inactivity detection triggers after 30s', () => {
    // Don't interact for 30+ seconds
    // Assert inactivityMinutes > 0
    // Assert fatigue warnings show
  })
  
  test('task completion increments streak', () => {
    // Click task checkbox
    // Assert currentStreak increases
    // Assert task marked completed
  })
  
  test('buttons highlight based on fatigue', () => {
    // Wait 10+ minutes without interaction
    // Assert 'Continue Lesson' button is RED
    // Wait 15+ minutes
    // Assert warning popup shows
    // Assert 'Quick Game' button is GREEN
  })
  
  test('navigation works for all links', () => {
    // Click Lessons link
    // Assert navigate('/subjects') called
    // Click Games link
    // Assert navigate('/games') called
  })
})
```

---

## 🚀 Deployment Checklist

- [ ] ADHDDashboard.jsx compiles without errors
- [ ] StudentDashboard.jsx imports ADHDDashboard correctly
- [ ] Conditional rendering works: `profile?.condition === 'ADHD'`
- [ ] Timer interval cleans up on unmount
- [ ] Activity detection runs every 30 seconds
- [ ] All navigation links point to correct routes
- [ ] Styling renders correctly (colors, fonts, sizes)
- [ ] No console errors or warnings
- [ ] Responsive on desktop screens
- [ ] Accessibility features work (dyslexia mode, language)
- [ ] All buttons are clickable (min 200px height)
- [ ] Timer display is readable (3.5rem font)
- [ ] Warnings display with correct styling
- [ ] Profile context provides condition field
- [ ] Build size doesn't exceed limits

---

## 📞 Debugging Tips

### Check if ADHD Dashboard Is Rendering
```javascript
// Add temporary log at top of ADHDDashboard
console.log('🧠 ADHD Dashboard Loaded')

// Check DevTools console - should see message
```

### Verify Profile Condition
```javascript
// In StudentDashboard.jsx
console.log('Profile condition:', profile?.condition)

// Should output: "ADHD" or undefined
```

### Test Timer Interval
```javascript
// In ADHDDashboard timer useEffect
console.log('Timer tick:', timerSeconds)

// Should see increasing numbers when timer is running
```

### Monitor Activity Detection
```javascript
// In inactivity detection useEffect
console.log('Inactivity minutes:', minutesSinceActivity)
console.log('Fatigue level:', fatigueLevel)

// Should see values update every 30 seconds
```

---

**Last Updated**: April 2026
**Status**: Complete ✅
