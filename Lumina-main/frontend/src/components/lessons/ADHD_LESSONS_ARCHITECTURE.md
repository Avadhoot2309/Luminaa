# ADHD Lessons Module - Architecture & Data Flow

## System Architecture Diagram

```
┌────────────────────────────────────────────────────────────────┐
│                     React Application                           │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Lesson Page / Router                         │  │
│  │                                                           │  │
│  │  if (profile.condition === 'ADHD')                       │  │
│  │    ↓ Route to ADHDLesson                                 │  │
│  │  else                                                    │  │
│  │    ↓ Route to StandardLesson                             │  │
│  └──────────────────────────────────────────────────────────┘  │
│           │                                                     │
│           ▼                                                     │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │         ADHDLesson (Main Controller)                     │  │
│  │                                                           │  │
│  │  State:                                                  │  │
│  │  - currentStep                                           │  │
│  │  - lessonSteps (parsed)                                  │  │
│  │  - answers                                               │  │
│  │  - mistakeCount                                          │  │
│  │  - sessionState (loading/ready/paused/completed)        │  │
│  │  - shouldSimplify                                        │  │
│  │                                                           │  │
│  │  Methods:                                                │  │
│  │  - parseLessonIntoMicroUnits()                           │  │
│  │  - handleNextStep()                                      │  │
│  │  - handlePreviousStep()                                  │  │
│  │  - handlePauseLesson()                                   │  │
│  │  - loadProgressFromStorage()                             │  │
│  └──────────────────────────────────────────────────────────┘  │
│           │                                                     │
│     ┌─────┼─────┐                                               │
│     │     │     │                                               │
│     ▼     ▼     ▼                                               │
│  ┌────┐ ┌──────┐ ┌──────────────┐                              │
│  │Bar │ │Content│ │Interaction   │                              │
│  └────┘ └──────┘ └──────────────┘                              │
│                                                                  │
│  Local Storage: localStorage[`adhd_lesson_{id}`]               │
│  Persists: { stepIndex, answers, mistakes }                    │
│                                                                  │
└────────────────────────────────────────────────────────────────┘
     │
     ▼
┌────────────────────────────────────────────────────────────────┐
│              Optional Backend Integration                       │
│                                                                  │
│  GET  /api/lessons/{id}                                        │
│  POST /api/lessons/{id}/progress                               │
│  POST /api/lessons/{id}/complete                               │
└────────────────────────────────────────────────────────────────┘
```

---

## Data Flow Diagram

### Lesson Loading Flow

```
User Opens Lesson
        │
        ▼
   ADHDLesson mounts
        │
        ├─ useEffect ✓
        │     │
        │     ├─ API: GET /api/lessons/{id}
        │     │  ↓
        │     │  Load lessonData
        │     │
        │     └─ parseLessonIntoMicroUnits()
        │          │
        │          ├─ Extract title
        │          ├─ Parse content into chunks (2-3 lines each)
        │          ├─ Extract summary
        │          └─ Add completion step
        │          ↓
        │        Array of steps
        │          ↓
        │        setLessonSteps([...])
        │
        └─ loadProgressFromStorage()
             │
             ├─ Check localStorage[`adhd_lesson_{id}`]
             ├─ If found: setCurrentStep(saved.stepIndex)
             └─ If not: Start at 0
        
        State: Ready
        ↓
        Render ADHDLessonProgressBar
        Render ADHDLessonContentDisplay (step 0)
        Render ADHDLessonInteraction or Continue button
```

### Step Navigation Flow

```
Current Step Display
        │
        ├─ Show step[n]
        ├─ Show progress bar "Step n of total"
        └─ Show accuracy "85% Correct"
        
        ▼
    User Input
        │
    ┌───┴────────────────────────┐
    │                            │
    ▼                            ▼
Next Button              Previous Button
    │                            │
    ▼                            ▼
Is Question?             currentStep > 0?
    │                            │
    ├─ Yes: Show options   ├─ Yes: setCurrentStep(n-1)
    │       Wait for answer └─ No: Disable button
    │
    └─ No: Tap-to-continue
         handleNextStep()
              │
              ├─ Record answer (if question)
              ├─ Save to answers[]
              ├─ Increment mistakeCount (if wrong)
              ├─ Check: mistakes >= threshold?
              │   └─ Yes: setShouldSimplify(true)
              │
              ├─ Save to localStorage
              ├─ onSave(progress) callback
              │
              ├─ If n < total: setCurrentStep(n+1)
              └─ Else: handleLessonComplete()
```

### Mistake & Adaptation Flow

```
Answer Question
        │
        ▼
Check Correctness
        │
    ┌───┴────────┐
    │            │
    ▼            ▼
Correct?       Wrong?
    │            │
    ├─ Show ✅  ├─ Show ❌
    ├─ Green BG ├─ Red BG
    ├─ Auto-    ├─ Show explanation
    │ advance   ├─ Allow retry
    │ after 2s  │
    │           └─ mistakeCount++
    │               │
    │               ├─ mistakes == 1: Continue
    │               ├─ mistakes == 2: 
    │               │   setShouldSimplify(true)
    │               │   Show: "Simplified content"
    │               │
    │               └─ Next step renders with
    │                   first 2 sentences only
    │
    └─ Save to answers[]
        { stepId, answer, isCorrect, timestamp }
```

### Completion & Results Flow

```
Last Step Completed
        │
        ▼
handleLessonComplete()
        │
    ┌───┴─────────────────┐
    │                     │
    ▼                     ▼
Calculate Stats     Send to Backend
    │               POST /api/lessons/{id}/complete
    ├─ Accuracy     │
    ├─ TimeSpent    ├─ results = {
    ├─ MistakeCount │    lessonId,
    └─ Steps        │    completed: true,
        │           │    answers,
        ▼           │    accuracy,
        │           │    timeSpent
        │           │  }
        │           └─ await response
        ▼           │
    onComplete({...})  Clear localStorage
        │               localStorage.removeItem()
        │
    setSessionState('completed')
        │
        ▼
Render CompletionScreen
    ├─ ✅ Lesson Complete!
    ├─ Accuracy: 85%
    ├─ Steps: 8
    ├─ Time: 3m 45s
    ├─ Motivational message (based on accuracy)
    └─ Buttons: Back to Dashboard / Review
```

---

## Pause & Resume Flow

```
Lesson In Progress (Step 3 of 8)
        │
        ▼
User clicks ⏸️ Pause
        │
        ├─ setSessionState('paused')
        ├─ setPausedAt(now)
        │
        ├─ Save to localStorage:
        │  {
        │    stepIndex: 3,
        │    answers: [...],
        │    mistakes: 1,
        │    pausedAt: timestamp
        │  }
        │
        ├─ onSave(progress) callback
        │
        └─ Render paused banner:
           "⏸️ Lesson Paused - Click Resume"
        
     [User leaves browser]
     [Returns later]
            │
            ▼
     useEffect - loadProgressFromStorage()
            │
            ├─ Get localStorage[`adhd_lesson_{id}`]
            ├─ setCurrentStep(3)
            ├─ setAnswers([...])
            └─ setSessionState('paused')
            
            ▼
     Show banner + Resume button
            │
            ▼
     User clicks Resume
            │
            ├─ setSessionState('ready')
            ├─ Show step 3 again
            └─ Continue where left off
```

---

## Component Render Tree

```
<ADHDLesson>
│
├─ {sessionState === 'loading'}
│  └─ <LoadingScreen />
│
├─ {sessionState === 'completed'}
│  └─ <CompletionScreen />
│
└─ {sessionState !== 'completed'}
   │
   ├─ <ADHDLessonProgressBar
   │    currentStep={2}
   │    totalSteps={8}
   │    accuracy={85}
   │  />
   │
   ├─ {pausedBanner && <PausedBanner />}
   │
   ├─ <main>
   │  └─ <ADHDLessonContentDisplay
   │      step={lessonSteps[1]}
   │      shouldSimplify={false}
   │    />
   │
   ├─ {stepData?.audioUrl && 
   │    <AudioPlayer 
   │      url={stepData.audioUrl}
   │      highlightText={stepData.content}
   │    />
   │  }
   │
   ├─ {stepData?.interactionType === 'question'
   │    ? <ADHDLessonInteraction
   │        question={...}
   │        options={[...]}
   │        onAnswer={handleNextStep}
   │      />
   │    : <ContinueButton />
   │  }
   │
   └─ <NavigationControls>
      ├─ <BackButton />
      └─ <PauseButton />
```

---

## State Management Diagram

```
ADHDLesson Component State:

┌─────────────────────────────────────────┐
│ currentStep: number                     │
│ (0-based index into lessonSteps)        │
└─────────────────────────────────────────┘
        │
        └─ Updates: handleNextStep(), handlePreviousStep()

┌─────────────────────────────────────────┐
│ lessonSteps: Step[]                     │
│ Parsed content + metadata for each step │
└─────────────────────────────────────────┘
        │
        └─ Set once: useEffect + parseLessonIntoMicroUnits()

┌─────────────────────────────────────────┐
│ answers: Answer[]                       │
│ [{stepId, answer, isCorrect, timestamp}]│
└─────────────────────────────────────────┘
        │
        └─ Appended: handleNextStep()

┌─────────────────────────────────────────┐
│ mistakeCount: number                    │
│ Triggers simplification at threshold    │
└─────────────────────────────────────────┘
        │
        └─ Incremented: handleNextStep() if wrong

┌─────────────────────────────────────────┐
│ shouldSimplify: boolean                 │
│ Simplifies content at next step         │
└─────────────────────────────────────────┘
        │
        └─ Set: handleNextStep() when mistakes >= 2

┌─────────────────────────────────────────┐
│ sessionState: 'loading'|'ready'|        │
│              'paused'|'completed'       │
└─────────────────────────────────────────┘
        │
        └─ Updates: All action handlers
```

---

## API Integration Points

```
┌─────────────────────────────────────────────────────────┐
│  Optional Backend Integration                           │
│  (Lesson data can come from context or local state)     │
└─────────────────────────────────────────────────────────┘

1. Load Lesson
   ┌──────────────────────────────────┐
   │ GET /api/lessons/{id}            │
   │                                  │
   │ Response:                        │
   │ {                                │
   │   id, title, content, summary,   │
   │   titleAudio, summaryAudio       │
   │ }                                │
   └──────────────────────────────────┘

2. Save Progress (Optional)
   ┌──────────────────────────────────┐
   │ POST /api/lessons/{id}/progress  │
   │                                  │
   │ Body:                            │
   │ {                                │
   │   stepIndex, answers,            │
   │   mistakes, status               │
   │ }                                │
   └──────────────────────────────────┘

3. Complete Lesson (Optional)
   ┌──────────────────────────────────┐
   │ POST /api/lessons/{id}/complete  │
   │                                  │
   │ Body:                            │
   │ {                                │
   │   completed: true,               │
   │   answers, accuracy, timeSpent   │
   │ }                                │
   └──────────────────────────────────┘

All are optional - component works offline with localStorage
```

---

## localStorage Data Structure

```
Key: adhd_lesson_{lessonId}

Value:
{
  "stepIndex": 3,              // Current step (0-based)
  "timestamp": 1645123456000,  // Last saved
  "answers": [                 // All answers so far
    {
      "stepId": "content_0",
      "answer": "Photosynthesis",
      "isCorrect": true,
      "timestamp": 1645123400000
    },
    {
      "stepId": "content_1",
      "answer": "Water",
      "isCorrect": false,
      "timestamp": 1645123420000
    }
  ],
  "mistakes": 1,               // Total mistakes
  "status": "in-progress"      // or "paused"
}

Saved to localStorage:
- On component mount (if exists)
- On every next/previous/answer
- Not cleared until completion

Cleared:
- On lesson completion
- Manually by user/system
```

---

## Performance Optimization

```
Lazy Loading:
  ├─ Images load when step becomes visible
  └─ Audio buffers while previous step playing

Memoization:
  ├─ React.memo(ADHDLessonProgressBar)
  ├─ React.memo(ADHDLessonContentDisplay)
  └─ React.memo(ADHDLessonInteraction)

Caching:
  ├─ lessonSteps cached in state (not re-parsed)
  ├─ localStorage persists across sessions
  └─ Avoid re-fetching lesson data

Key Metrics:
  ├─ Load: < 1 second
  ├─ Step change: < 500ms
  ├─ Progress save: < 100ms
  └─ Total lesson: 2-5 minutes
```

---

## Error Handling

```
Try/Catch blocks:

1. Load Lesson
   ├─ Catch: setError(err)
   └─ Display: "Failed to load lesson"

2. Save Progress
   ├─ Catch: setError(err)
   ├─ Still saves to localStorage (offline-first)
   └─ Retry on next connection

3. localStorage
   ├─ Try: JSON.parse(saved)
   ├─ Catch: console.error(), continue
   └─ Start fresh if corruption

4. Graceful Degradation
   ├─ Audio fails → Continue without audio
   ├─ API fails → Use localStorage only
   ├─ Image fails → Show placeholder
   └─ Parse fails → Use raw content
```

---

## Testing Architecture

```
Unit Tests:
├─ parseLessonIntoMicroUnits()
│  └─ Verify correct step count
│
├─ simplifyContent()
│  └─ Verify first 2 sentences only
│
├─ calculateAccuracy()
│  └─ Verify correct/total calculation
│
└─ Navigation logic
   ├─ handleNextStep()
   ├─ handlePreviousStep()
   └─ handlePauseLesson()

Integration Tests:
├─ Full lesson flow
│  ├─ Load → Answer → Navigate → Complete
│  └─ Save progress throughout
│
├─ Pause & Resume
│  ├─ Pause at step 3
│  ├─ Reload page
│  └─ Verify resumes at step 3
│
└─ Callbacks
   ├─ onSave called correctly
   └─ onComplete called at end

E2E Tests:
├─ Student uses lesson
├─ Makes mistakes
├─ Pauses/resumes
└─ Completes with feedback
```

---

This architecture ensures:
✅ Clear data flow  
✅ Easy to debug  
✅ Scalable design  
✅ Offline-first approach  
✅ Production-ready  
