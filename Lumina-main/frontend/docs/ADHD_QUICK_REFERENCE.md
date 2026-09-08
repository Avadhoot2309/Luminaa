# ADHD Dashboard - Quick Reference Card

## 🎯 What Is It?
An automatic, ADHD-optimized dashboard that renders when a student's profile has `condition: "ADHD"`. No toggles, no switches—just automatic detection and rendering.

---

## ✅ Quick Setup (5 Minutes)

### Step 1: Update Profile Model
Add `condition` field to student profile:
```javascript
{
  id: "student_123",
  name: "John",
  condition: "ADHD"  // ← This line triggers ADHD dashboard
}
```

### Step 2: Verify Integration
StudentDashboard.jsx already has the conditional logic:
```javascript
{profile?.condition === 'ADHD' ? (
  <ADHDDashboard />
) : (
  // Standard dashboard
)}
```

### Step 3: Deploy
```bash
npm run build
# Deploy dist/ folder
```

**That's it!** ✅ ADHD students automatically see the optimized dashboard.

---

## 📱 What Students See

### Layout Overview
```
┌─ Top Navigation ─────────┐
│ Lumina | Lessons Games   │
├──────────────────────────┤
│                          │
│  📋 TODAY'S FOCUS        │
│  ☑ Task 1  [⚡ Priority] │
│  ☑ Task 2  [📌 Recom]   │
│                          │
│  ⏱️ FOCUS TIMER          │
│  ╔════════════════════╗  │
│  ║      09:45         ║  │
│  ╚════════════════════╝  │
│  ▶ Start | 🔄 Reset     │
│  [5m] [10m] [15m] [25m] │
│                          │
│  🔥 Streak  │  Progress  │
│  ═════════  │  ████░░░░  │
│                          │
│  💬 Great work! 🌟       │
│                          │
│  📖  ✨  🎮              │
│ Continue New  Quick      │
│  Lesson  Lesson Game     │
│                          │
└──────────────────────────┘
```

---

## ⚙️ Key Features

| Feature | Details |
|---------|---------|
| **Today's Focus** | Max 2 tasks only (no clutter) |
| **Focus Timer** | 5/10/15/25 minute options |
| **Streak Counter** | Tracks daily task completion |
| **Progress Bar** | Visual completion status |
| **Smart Alerts** | Highlights buttons based on inactivity/fatigue |
| **Only 3 Actions** | Continue, New Lesson, Quick Game |
| **Encouragement** | Dynamic messages based on streak |

---

## 🔄 Behavior

### Inactivity Detection (Every 30s)
- **No activity for 5+ mins**: Fatigue level increases
- **No activity for 10+ mins**: "Continue Lesson" button turns RED
- **No activity for 15+ mins**: Warning popup shows, "Quick Game" turns GREEN

### Task Completion
- Click task checkbox
- Streak counter +1
- Progress bar updates
- Encouragement message changes

### Timer
- Start: Begin countdown
- Pause: Pause countdown
- Reset: Set to 0
- Duration select: Choose 5/10/15/25 mins

---

## 🎨 Design Principles

✅ **Large clickable areas** (200px+ height)  
✅ **Minimal options** (2 tasks, 3 actions, 5-min timer)  
✅ **High contrast colors** (Blue, Red, Green)  
✅ **Clear visual feedback** (Color changes, animations)  
✅ **No distractions** (Focused navigation, less content)  
✅ **Encouraging messages** (Positive reinforcement)  

---

## 🔧 For Developers

### File Locations
```
frontend/src/pages/ADHDDashboard.jsx      ← Main component
frontend/src/pages/StudentDashboard.jsx   ← Entry point with routing
frontend/docs/ADHD_DASHBOARD_GUIDE.md     ← Full documentation
frontend/docs/ADHD_DASHBOARD_ARCHITECTURE.md ← Technical reference
```

### Key States
```javascript
timerSeconds          // 0-1500 (timer display)
timerDuration         // 300, 600, 900, 1500 (selected duration)
isTimerRunning        // true/false
inactivityMinutes     // 0-60+
fatigueLevel          // 0-100
currentStreak         // count
todayTasks            // Array of 2 tasks
showFatigueWarning    // true/false
```

### Key Functions
```javascript
recordActivity()      // Resets inactivity timer
handleToggleTimer()   // Start/pause timer
handleCompleteTask()  // Mark task done, streak++
handleNavigate()      // Navigate + record activity
```

---

## 🐛 Common Issues

### ADHD dashboard not showing?
```javascript
// Check this in console:
console.log(profile?.condition)  // Should print "ADHD"
```

### Timer not working?
```javascript
// Verify interval is running:
// 1. Click Start button
// 2. Open DevTools console
// 3. Timer should update every 1 second
```

### Inactivity not detected?
```javascript
// Wait 15+ seconds without clicking anything
// Should see:
// - Progress bar color changes
// - Warning popup appears
// - Button colors change
```

---

## 📊 Analytics to Track

| Event | Endpoint |
|-------|----------|
| Task completed | `POST /api/tasks/{id}/complete` |
| Timer session | `POST /api/sessions/timer` |
| Lesson started | `POST /api/lessons/{id}/start` |
| Game started | `POST /api/games/{id}/start` |
| Streak updated | `PATCH /api/students/{id}/streak` |

---

## 🎓 Teacher Instructions

### Creating ADHD Student Profile
1. Teacher dashboard → Create student
2. Name: "John"
3. Grade: 6
4. **Condition**: "ADHD" ← Select this
5. Click Save

### Checking Dashboard
1. Login as student (John)
2. Should see ADHD-optimized dashboard
3. Only 2 tasks visible
4. Only 3 action buttons
5. Large focus timer

---

## ✅ Testing Checklist

- [ ] ADHD dashboard renders for ADHD students
- [ ] Standard dashboard renders for others
- [ ] Focus timer starts/stops
- [ ] Timer updates every second
- [ ] Tasks can be marked complete
- [ ] Streak increments correctly
- [ ] Inactivity detected after 5+ mins
- [ ] Warning appears after 15+ mins
- [ ] Buttons highlight based on state
- [ ] All navigation works
- [ ] Logout works
- [ ] Dyslexia font toggle works
- [ ] Language selection works

---

## 🚀 Deployment Commands

```bash
# Build for production
npm run build

# Start development server
npm run dev

# Check for errors
npm run lint
```

---

## 📞 Support

**Question**: How do I customize tasks?
**Answer**: Edit `setTodayTasks` state in ADHDDashboard.jsx (line ~37)

**Question**: Can I change timer durations?
**Answer**: Yes, modify the button options in the duration selector (line ~325)

**Question**: How do I track analytics?
**Answer**: Use `recordActivity()` function + backend API integration

**Question**: Can students toggle standard/ADHD dashboard?
**Answer**: No. By design, it's automatic based on profile condition.

---

## 📈 Next Steps

1. **Setup**: Add `condition` field to student profiles
2. **Test**: Create test ADHD student, verify dashboard
3. **Deploy**: Run `npm run build` and deploy
4. **Monitor**: Check analytics for usage patterns
5. **Iterate**: Gather teacher/student feedback, adjust timers/tasks as needed

---

**Status**: ✅ Production Ready  
**Version**: 1.0  
**Last Updated**: April 2026

For detailed documentation, see:
- `ADHD_DASHBOARD_GUIDE.md` (Full guide)
- `ADHD_DASHBOARD_ARCHITECTURE.md` (Technical deep dive)
