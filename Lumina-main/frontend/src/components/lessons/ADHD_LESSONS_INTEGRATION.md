# ADHD Lessons Module - Integration Guide

## Overview

The ADHD Lessons Module is a specialized presentation layer for educational content that uses the existing lesson data API without requiring backend changes. It provides:

- **Micro-unit content** (2-3 lines per step)
- **Step-by-step navigation** (no free scrolling)
- **Quick interactions** (questions/tap-to-continue after each step)
- **Audio support** with text synchronization
- **Progress tracking** with step indicators
- **Pause/resume** functionality
- **Adaptive difficulty** based on performance

---

## File Structure

```
src/components/lessons/
├── ADHDLesson.jsx                    # Main lesson controller
├── ADHDLessonProgressBar.jsx         # Step progress indicator
├── ADHDLessonContentDisplay.jsx      # Content rendering
├── ADHDLessonInteraction.jsx         # Question/interaction handler
├── ADHD_LESSONS_INTEGRATION.md       # This file
└── __tests__/
    └── ADHDLesson.test.jsx           # Unit tests (optional)
```

---

## Component Architecture

### 1. ADHDLesson (Main Controller)

**Purpose**: Orchestrates the entire lesson flow

**Props**:
```javascript
{
  lessonId: string,           // Unique lesson identifier
  lessonData: object,         // Full lesson object from API
  onComplete: function,       // Callback when lesson completes
  onSave: function           // Callback to save progress
}
```

**Key Features**:
- Parses lesson content into micro-units
- Manages step navigation and progress
- Tracks performance (answers, mistakes)
- Handles pause/resume
- Triggers adaptive simplification

**State Flow**:
```
    ┌─────────────┐
    │   Loading   │
    └──────┬──────┘
           │
    ┌──────▼──────┐
    │   Ready     │ ◄──────────┐
    └──────┬──────┘           │
           │                  │
    ┌──────▼──────┐      ┌────┴────┐
    │   Running   ├─────►│  Paused │
    └──────┬──────┘      └─────────┘
           │
    ┌──────▼──────┐
    │  Completed  │
    └─────────────┘
```

**Usage**:
```jsx
import ADHDLesson from '@components/lessons/ADHDLesson';

<ADHDLesson
  lessonId="math_101"
  lessonData={lesson}
  onComplete={(result) => console.log('Completed:', result)}
  onSave={(progress) => saveProgress(progress)}
/>
```

---

### 2. ADHDLessonProgressBar

**Purpose**: Display step indicator and progress

**Props**:
```javascript
{
  currentStep: number,        // Current step (1-based)
  totalSteps: number,         // Total steps in lesson
  accuracy: number            // Percentage correct (0-100)
}
```

**Visual Output**:
```
📍 Step 2 of 8  [=====>----]  ✓ 85% Correct
```

---

### 3. ADHDLessonContentDisplay

**Purpose**: Render lesson content with optimal readability

**Props**:
```javascript
{
  step: object,               // Current step data
  stepNumber: number,         // Step index
  shouldSimplify: boolean     // Simplify content flag
}
```

**Step Object Structure**:
```javascript
{
  id: string,                 // Unique step ID
  type: 'title'|'content'|'summary'|'completion',
  content: string,            // Step text
  imageUrl: string,           // Optional image URL
  audioUrl: string,           // Optional audio URL
  interaction: string,        // Question or "tap-to-continue"
  interactionType: 'question'|'continue',
  options: array,             // Multiple choice options
  correctAnswer: string,      // Correct answer for validation
  explanation: string,        // Feedback explanation
  timeEstimate: number        // Estimated time (seconds)
}
```

**Rendering Features**:
- High contrast typography (1.2rem, 1.8 line-height)
- Clear spacing between elements
- Optional image display
- Dyslexia-friendly font (Nunito/Open Sans)
- Adaptive simplification for struggling students

---

### 4. ADHDLessonInteraction

**Purpose**: Handle quick questions and feedback

**Props**:
```javascript
{
  question: string,           // Question text
  options: array,             // Answer options (A, B, C, D)
  explanation: string,        // Explanation for correct/incorrect
  onAnswer: function         // Callback with selected answer
}
```

**Behavior**:
- Displays question and options
- Shows feedback after answer selection
- Auto-advances after 2 seconds if correct
- Allows retry for incorrect answers
- Provides explanation text

---

## Data Integration

### Expected Lesson Data Structure

```javascript
{
  id: string,
  title: string,
  titleAudio: string,         // Optional audio URL
  content: array|string,      // See content parsing below
  summary: string,
  summaryAudio: string,
  condition: 'ADHD',
  subject: string,
  grade: number
}
```

### Content Format Support

**Option 1: Structured Array** (Recommended)
```javascript
content: [
  {
    text: "Photosynthesis is the process by which plants convert sunlight into chemical energy.",
    imageUrl: "https://...",
    audioUrl: "https://...",
    question: "What do plants need for photosynthesis?",
    options: [
      "Water and sunlight",
      "Only sunlight",
      "Only water"
    ],
    correctAnswer: "Water and sunlight",
    explanation: "Plants need both water and sunlight for photosynthesis."
  },
  // ... more chunks
]
```

**Option 2: Text with Automatic Parsing**
```javascript
content: `
Photosynthesis is the process by which plants convert 
sunlight into chemical energy. It occurs in the leaves.

Chlorophyll absorbs light energy. This energy powers 
the chemical reactions that convert CO2 and water into glucose.

The overall equation is: 6CO2 + 6H2O + light → C6H12O6 + 6O2
`
```

The module automatically breaks text into micro-units (2-3 sentences per chunk).

---

## State & Progress Management

### Saving Progress

```javascript
const handleSave = (progress) => {
  // Progress object:
  {
    stepIndex: number,        // Current step
    timestamp: number,        // Save time
    answers: array,           // All answers
    mistakes: number,         // Total mistakes
    status: 'paused'|'in-progress'
  }
  
  // Send to backend or store locally
  saveProgressToBackend(progress);
};
```

### Local Storage

The component automatically saves to browser storage:
```javascript
// Key format: adhd_lesson_{lessonId}
localStorage.setItem('adhd_lesson_math_101', JSON.stringify({
  stepIndex: 5,
  answers: [/* ... */]
}));

// Automatically loaded on component mount
```

### Resume from Pause

```javascript
// Automatically restores to last completed step
// User sees "Step 5 of 8" indicator
// Can click "Resume" button to continue
```

---

## Adaptive Behavior

### Mistake-Triggered Simplification

```javascript
const mistakeThreshold = 2;

if (mistakeCount >= mistakeThreshold) {
  setShouldSimplify(true);
  
  // Content is simplified:
  // - First 2 sentences only
  // - Complex vocabulary simplified
  // - Extra whitespace added
}
```

### Simplification Algorithm

```javascript
const simplifyContent = (content) => {
  const sentences = content.split('. ');
  
  // Keep only first 2 sentences if more than 3
  if (sentences.length > 3) {
    return sentences.slice(0, 2).join('. ') + '.';
  }
  return content;
};
```

---

## Audio Integration

### Audio Support

Each step can have audio:

```javascript
step: {
  content: "...",
  audioUrl: "https://example.com/audio.mp3"
}

// Rendered with AudioPlayer component
<AudioPlayer
  url={audioUrl}
  onPlayChange={setIsAudioPlaying}
  highlightText={content}
/>
```

### Text-Audio Sync

The AudioPlayer can highlight text as audio plays (if available).

---

## Completion Flow

### Final Results

```javascript
const results = {
  lessonId: string,
  steps: number,              // Total steps
  completed: boolean,         // true if finished
  answers: array,             // All answers with correctness
  mistakeCount: number,
  timeSpent: number,          // Seconds
  accuracy: number            // Percentage
};

onComplete(results);
```

### Completion Screen

Shows:
- ✅ Lesson title
- Accuracy percentage
- Steps completed
- Time spent
- Motivational message (based on accuracy)

---

## Integration with Existing Lessons Module

### Option 1: Replace Lesson Rendering

```javascript
// In pages/Lessons.jsx or lessons list page
import ADHDLesson from '@components/lessons/ADHDLesson';

function LessonView({ lessonId, lessonData, userCondition }) {
  if (userCondition === 'ADHD') {
    return (
      <ADHDLesson
        lessonId={lessonId}
        lessonData={lessonData}
        onComplete={handleLessonComplete}
        onSave={handleProgressSave}
      />
    );
  }
  
  // Render default lesson for other conditions
  return <StandardLesson {...props} />;
}
```

### Option 2: Use as Wrapper

```javascript
// Wrap existing lesson content
<ADHDLesson
  lessonId={lessonData.id}
  lessonData={lessonData}
  onComplete={save}
  onSave={updateProgress}
>
  {/* Original lesson component */}
</ADHDLesson>
```

---

## API Integration

### Fetching Lesson Data

```javascript
// Existing API (no changes needed)
const lessonData = await fetchLesson(lessonId);

// Pass to ADHD component
<ADHDLesson
  lessonId={lessonId}
  lessonData={lessonData}
  onComplete={handleComplete}
  onSave={handleSave}
/>
```

### Saving Progress (Backend)

```javascript
// Backend endpoint (existing or new)
POST /api/lessons/{lessonId}/progress
{
  userId: string,
  stepIndex: number,
  answers: [
    { stepId, answer, isCorrect, timestamp },
    // ...
  ],
  mistakes: number,
  status: 'in-progress'|'paused'|'completed'
}
```

---

## Accessibility Features

### WCAG 2.1 Compliance

- ✓ High contrast colors (WCAG AA+)
- ✓ Large text sizes (min 16px)
- ✓ Clear visual hierarchy
- ✓ Semantic HTML
- ✓ Keyboard navigation (Tab, Enter)
- ✓ Screen reader support
- ✓ Focus indicators
- ✓ No auto-playing audio

### Dyslexia Considerations

- Font: Nunito, Open Sans (sans-serif)
- Line height: 1.8 (1.5x recommended)
- Letter spacing: 0.2-0.3px
- No ALL CAPS text
- Sufficient color contrast
- Clear button labels with emojis

---

## Testing

### Unit Tests (Examples)

```javascript
describe('ADHDLesson', () => {
  test('parses lesson into micro-units', () => {
    const lesson = { content: 'Long text...' };
    const steps = parseLessonIntoMicroUnits(lesson);
    expect(steps.length).toBeGreaterThan(0);
  });

  test('advances to next step', () => {
    const { getByText } = render(<ADHDLesson ... />);
    fireEvent.click(getByText('Got it! Next'));
    expect(screen.getByText(/Step 2/)).toBeInTheDocument();
  });

  test('saves progress on completion', () => {
    const onSave = jest.fn();
    render(<ADHDLesson onSave={onSave} ... />);
    // ... simulate lesson completion
    expect(onSave).toHaveBeenCalled();
  });
});
```

---

## Performance Considerations

### Optimization Tips

1. **Lazy load images**: Images load when step becomes visible
2. **Audio buffering**: Pre-buffer next step's audio while current plays
3. **Memoization**: Use React.memo for step components
4. **Local storage**: Cache parsed steps to avoid re-parsing

---

## Customization

### Adjusting Parameters

```javascript
// In ADHDLesson.jsx
const mistakeThreshold = 2;        // Trigger simplification after 2 mistakes
const autoAdvanceDelay = 2000;     // Auto-advance after correct answer (ms)
const contentChunkSize = 3;        // Max sentences per chunk
```

### Custom Styling

Override CSS variables or pass style objects:

```javascript
const customTheme = {
  primaryColor: '#2563EB',
  successColor: '#10B981',
  errorColor: '#EF4444',
  fontFamily: 'Open Dyslexic'
};
```

---

## Troubleshooting

### Issue: Content not parsing correctly

**Solution**: Ensure lesson data follows expected format. If using string format, separate paragraphs with double newlines.

### Issue: Audio not syncing

**Solution**: Verify audio URLs are accessible. Check AudioPlayer component configuration.

### Issue: Progress not saving

**Solution**: Verify localStorage is enabled. Check backend endpoint is correct.

---

## Summary

The ADHD Lessons Module provides a complete, step-by-step learning experience that:

✓ Breaks content into manageable micro-units  
✓ Guides users through lessons without distractions  
✓ Provides immediate feedback on comprehension  
✓ Adapts to student performance  
✓ Respects existing lesson data structure  
✓ Requires NO backend changes  
✓ Maintains full accessibility standards  

Integration is simple: replace lesson rendering with `<ADHDLesson />` component for ADHD students.
