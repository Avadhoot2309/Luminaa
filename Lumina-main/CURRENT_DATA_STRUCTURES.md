# Lumina Platform - Current Data Structures & Module Organization

## Overview
The Lumina platform currently has a hierarchical data model with specialized modules for different learning needs (Low Vision, ADHD, Dyslexia). Here's what data we have:

---

## 1. USER PROFILE DATA STRUCTURE

### Profile Object
```javascript
{
  // Identity
  uid: string,                          // Firebase UID
  studentId: string,                    // Local student ID
  name: string,
  email: string,
  grade: number,                        // 1-10
  age: number,
  
  // Disabilities/Accessibility Flags
  disabilities: [                       // Array of disability types
    "Low Vision",                       // ✅ Specific Low Vision module
    "ADHD",                             // ✅ Specific ADHD Dashboard
    "Dyslexia",                         // ✅ Game & content adaptations
    "Blindness",                        // Checked in games
    "Low Hearing",
    "Hard of Hearing"
  ],
  
  // Learning Profile
  learningStyle: string,                // dyslexic, visual, auditory
  focusMode: string,                    // e.g., "high" for ADHD
  
  // Accessibility Traits
  traits: {
    highContrast: boolean,              // For visual needs
    dyslexia: boolean,
    adhd: boolean,
    impairment: string                  // e.g., "visual"
  },
  
  // Progress & History
  progress: {
    lessonsCompleted: number,
    gamesPlayed: number,
    totalPoints: number,
    streak: number
  },
  
  // Timestamps
  createdAt: timestamp,
  updatedAt: timestamp
}
```

---

## 2. SYLLABUS DATA STRUCTURE

### Location: `frontend/src/data/syllabusData.js`

```javascript
{
  grade: "1",                           // Grade level
  ageGroup: "6-7",                      // Age group
  
  subjects: [
    {
      id: "evs",                        // Subject ID
      name: "Environmental Studies",
      icon: "🌿",
      color: "#2E8B57",
      gradient: ["#1a472a", "#2E8B57"],
      
      chapters: [
        {
          id: "evs-ch1",
          chapterNumber: 1,
          title: "My Family",
          ncertRef: "NCERT EVS Class 1, Chapter 1",
          
          lessons: [
            {
              id: "evs-ch1-l1",
              title: "Family Members 👨‍👩‍👧",
              duration: "10 mins",
              difficulty: "easy",                // easy | medium | hard
              illustration: "/assets/visuals/family.png",
              
              // Story Section
              story: {
                text: "Full narrative text",
                chunks: [                       // ADHD-optimized chunks (≤12 words)
                  "Families are like a warm hug! 🤗",
                  "Some families are small, and some are big.",
                  "..."
                ],
                keywords: ["family", "mother", "father"],
                funFact: "Did you know?...",
                visualHints: {                  // For Low Vision
                  "mother": "👩",
                  "father": "👨",
                  "..."
                }
              },
              
              // Video Section
              video: {
                title: "All About Families – for Kids",
                url: "https://www.youtube-nocookie.com/embed/...",
                duration: "3:12"
              },
              
              // Activities Section
              activities: [
                {
                  id: "act1",
                  type: "tap",                   // tap | count | voice | match | camera | draw
                  question: "Who is part of YOUR family?",
                  options: ["👨‍👩‍👧 Family", "🚗 Car", ...],
                  answer: "👨‍👩‍👧 Family",
                  feedback: {
                    correct: "Yes! People are family!",
                    wrong: "Hmm, that's not a person!"
                  }
                },
                {
                  id: "act2",
                  type: "match",
                  pairs: [
                    { word: "Mother", image: "👩", matchId: "m1" },
                    { word: "Father", image: "👨", matchId: "m2" },
                    ...
                  ]
                },
                {
                  id: "act3",
                  type: "voice",
                  phrase: "Family",
                  question: "Can you say 'Family'? 🎤",
                  keywords: ["family", "famil"]
                }
              ],
              
              // Quiz Section
              quiz: [
                {
                  id: "q1",
                  question: "Do family members help each other?",
                  options: ["Yes, always! ✅", "No ❌", ...],
                  answer: "Yes, always! ✅",
                  explanation: "Helping is what makes a family strong!"
                }
              ]
            }
          ]
        }
      ]
    },
    
    // More subjects: Mathematics, English, Hindi
  ]
}
```

### Subjects Currently Available:
- 📚 Environmental Studies (EVS)
- ➕ Mathematics
- 🔤 English
- 🇮🇳 Hindi

---

## 3. GAMES DATA STRUCTURE

### Location: All games have similar structure

```javascript
// LowVisionGames.jsx - Games List
const games = [
  {
    id: "memory-match",
    name: t('games.memory_match'),
    path: "/game/memory-match",
    desc: t('games.memory_match_desc'),
    number: 1
  },
  // ... 6 games total
]

// Individual Game Data
{
  id: string,
  title: string,
  icon: emoji,
  color: hex,
  path: string,
  
  // Disability Support
  supportedFor: ["Low Vision", "ADHD", "Dyslexia"],
  
  // Game Config
  difficulty: "easy" | "medium" | "hard",
  duration: "5 mins",
  targetAudience: "Grade 1-3"
}
```

### Games Currently Available:
1. ✅ **Memory Match** 🧠 - Full Low Vision support (dark mode)
2. ✅ **Math Race** 🏎️ - Accessible
3. ✅ **Word Jump** 🏃 - Full High Contrast support
4. ✅ **Word Search** 🔍 - Functional
5. ✅ **Focus Flash** ⚡ - Low Vision support
6. ✅ **Phonetic Pop** 🫧 - Has Low Vision flag

---

## 4. DASHBOARD MODULES DATA STRUCTURE

### Standard Student Dashboard
```javascript
{
  navItems: [
    { id: "lessons", label: "Lessons", path: "/subjects", icon: "📖" },
    { id: "games", label: "Games", path: "/games", icon: "🎮" },
    { id: "ebooks", label: "E-Books", path: "/library", icon: "📚" },
    { id: "resources", label: "Resources", action: () => {}, icon: "📄" },
    { id: "labs", label: "Labs", action: () => {}, icon: "🧪" },
    { id: "settings", label: "Settings", action: () => {}, icon: "⚙️" }
  ],
  
  labs: [
    { id: "math", label: "Math", icon: "➕", path: "/labs/math" },
    { id: "sky-writer", label: "Sky Writer", icon: "✍️", path: "/labs/sky-writer" },
    { id: "forest-phonics", label: "Forest Phonics", icon: "🌳", path: "/labs/forest-phonics" },
    { id: "sound-buttons", label: "Sound Buttons", icon: "🔘", path: "/labs/sound-buttons" },
    { id: "dino-decoder", label: "Dino Decoder", icon: "🦖", path: "/labs/dino-decoder" }
  ]
}
```

### ADHD Dashboard (Specific)
```javascript
{
  // ADHD-specific data
  energyLevel: 0-100,                   // User engagement metric
  rewardPoints: number,                 // Gamification points
  breakDue: boolean,                    // Reminds to take break (every 20 min)
  hyperfocus: boolean,                  // Session mode
  taskDifficulty: "easy|medium|hard",   // Adaptive difficulty
  
  timerSeconds: number,                 // Hyperfocus timer
  timerDuration: number,                // Session length (default 5 min)
  
  // ADHD Suggestions
  breaksSuggestions: [
    "🚶 Take a 2-min walk",
    "🤸 Do 5 jumping jacks",
    "💧 Drink water",
    "🧘 Stretch for 1 min",
    "👀 Look away from screen"
  ],
  
  quickWins: [
    { emoji: "⭐", task: "Read 1 sentence", points: 5 },
    { emoji: "✨", task: "Write 1 word", points: 5 },
    { emoji: "🎯", task: "Click one button", points: 3 }
  ],
  
  tasksRemaining: [
    { id: 1, name: "Math - Q1", difficulty: "easy", urgency: "high" },
    { id: 2, name: "Reading", difficulty: "medium", urgency: "medium" },
    { id: 3, name: "Project", difficulty: "hard", urgency: "low" }
  ]
}
```

### Low Vision Dashboard (Specific)
```javascript
{
  // State Management
  mode: "home | subjects | lessons | lesson | activity",
  selectedSubject: object,
  selectedLesson: object,
  steps: [                              // Sequential lesson breakdown
    { type: "story", text: string },
    { type: "video", title: string, url: string },
    { type: "activity", activity: object },
    { type: "quiz", quiz: array }
  ],
  stepIndex: number,                    // Current step
  inActivity: boolean,
  
  // Audio
  femaleVoiceRef: speechSynthesisVoice,
  
  // Features
  navItems: [
    "Lessons",
    "Games (→ /low-vision-games)",
    "Library",
    "Settings"
  ]
}
```

### Low Vision Games Screen (NEW)
```javascript
// frontend/src/pages/games/LowVisionGames.jsx
{
  games: [
    {
      id: "memory-match",
      name: "Memory Match",
      path: "/game/memory-match",
      desc: "Match pairs of cards",
      number: 1
    },
    // ... 6 games total
  ],
  
  // State
  selectedGameIndex: number | null,
  
  // Features
  speakRef: speechSynthesisVoice,       // TTS for announcements
  keyboardNavigation: true,             // Arrow keys + ENTER
  contrast: "WCAG AAA",                 // 21:1 black on white
  fontSize: {
    header: "56px",
    title: "32px",
    text: "20-24px"
  }
}
```

---

## 5. ACCESSIBILITY & TRANSFORMATION DATA

### Content Transform Service
```javascript
// transformContent(rawText, disabilities)
{
  original_text: string,
  
  // Dyslexia Adaptations
  dyslexia_simplified_text: string | null,
  
  // ADHD Adaptations
  chunked_lessons: [
    { chunk: string, length: number }  // ≤ 5 chunks, ~12 words each
  ] | null,
  
  // Low Vision Adaptations
  high_contrast_text: string | null,
  
  // Audio for all
  audio_script: string
}
```

### Adaptive Engine Config
```javascript
{
  isHighContrast: boolean,              // For visual impairment
  isDyslexia: boolean,                  // Font & text changes
  isADHD: boolean,                      // Layout & timing changes
  
  ttsRate: 0.8 (ADHD) | 1.0 (normal),  // Speech speed
  pitch: 1.1
}
```

---

## 6. ROUTES CURRENTLY AVAILABLE

### Standard Routes
- `/` - Landing page
- `/login` - Login
- `/register` - Register
- `/dashboard` - Main Student Dashboard
- `/low-vision` - Low Vision Dashboard (NEW)
- `/low-vision-games` - Low Vision Games Screen (NEW)
- `/adhd-demo` - ADHD Dashboard demo

### Lesson Routes
- `/subjects` - Subject selection
- `/chapters/:subjectId` - Chapter listing
- `/lesson/:lessonId` - Lesson player

### Game Routes
- `/games` - Standard Games Screen
- `/low-vision-games` - Low Vision Games Screen (NEW)
- `/game/memory-match` - Individual game
- `/game/math-race`
- `/game/word-jump`
- `/game/word-search`
- `/game/focus-flash`
- `/game/phonetic-pop`
- `/game/sign-match`
- `/game/emoji-emotion`

### Other Routes
- `/library` - E-Book Library
- `/reader/:bookId` - E-Book Reader
- `/labs/:labId` - Lab activities
- `/teacher-dashboard` - Teacher console
- `/student/:id` - Student detail (admin)

---

## 7. DATA FLOW DIAGRAM

```
User Login
    ↓
ProfileContext (fetches disabilities)
    ↓
StudentDashboard (checks for Low Vision, ADHD, etc.)
    ↓
IF Low Vision:
  → Navigate to LowVisionDashboard (/low-vision)
       ↓
    - Sequential lesson mode (one step at a time)
    - Audio announcements (female voice TTS)
    - Large fonts (56px+ headers)
    - High contrast (black on white)
    - Simple navigation
       ↓
    IF click "Games":
      → LowVisionGames (/low-vision-games) [NEW]
           ↓
         - 6 accessible games
         - Keyboard navigation (arrows)
         - Audio guidance
         - Large text
         - Maximum contrast
    ELSE:
      → LowVisionSubjects/Lessons (sequential view)

ELSE IF ADHD:
  → ADHDDashboard
       ↓
    - Energy level tracking
    - Break reminders
    - Hyperfocus timer
    - Quick wins
    - Simplified layout

ELSE IF Dyslexia:
  → Standard Dashboard (with content transformation)
       ↓
    - OpenDyslexic font option
    - Content simplification
    - Game adaptations

ELSE:
  → Standard Student Dashboard
       ↓
    - All features accessible
```

---

## 8. CURRENT DATA SUMMARY

### What We Have:
✅ **Subjects**: 4 (EVS, Math, English, Hindi)
✅ **Lessons**: ~50+ across all subjects
✅ **Games**: 8 total
  - 5 games with specific low vision support
  - Low Vision Games screen (new)
✅ **Disabilities Tracked**: 6 types
  - Low Vision ✅ (dedicated dashboard + games)
  - ADHD ✅ (dedicated dashboard)
  - Dyslexia ✅ (content transformation)
  - Blindness (partial)
  - Low Hearing
  - Hard of Hearing
✅ **Activities**: 6 types
  - tap, count, voice, match, camera, draw
✅ **Lab Modules**: 5 (Math, Sky Writer, Forest Phonics, Sound Buttons, Dino Decoder)

### What's Missing/Future:
⚠️ Analytics data (no learning analytics stored)
⚠️ Detailed progress metrics per lesson
⚠️ Teacher progress reports
⚠️ Community features
⚠️ Parent dashboard
⚠️ Adaptive difficulty based on performance

---

## 9. KEY OBSERVATIONS FOR LOW VISION MODULE

### Strengths:
✅ Dedicated LowVisionDashboard with sequential view
✅ Audio announcements (female voice preference)
✅ Large fonts consistently applied
✅ High contrast colors (black/white)
✅ No distracting visual elements
✅ Simple navigation flow
✅ Keyboard accessible
✅ Dedicated Low Vision Games screen

### Data Points Being Tracked:
- Current lesson/step (stepIndex)
- User energy level (implicit via UI interaction)
- Completion status (mode transitions)
- Break timing (in Low Vision Dashboard)

### Could Be Enhanced:
🔧 Granular low vision progress tracking (time per step, attempts)
🔧 Low vision learning analytics (accuracy, speed, preferences)
🔧 Customizable fonts for low vision (Verdana, Arial)
🔧 Zoom level preferences
🔧 Color scheme preferences (white-on-black alternative)
🔧 Haptic feedback support
🔧 Screen reader integration logging
