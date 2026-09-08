import React from 'react';

/**
 * ADHD Lesson Progress Bar
 * 
 * Features:
 * - Step indicator (e.g., "Step 2 of 8")
 * - Avoid percentage overload
 * - Visual progress bar
 * - Accuracy meter
 */
export default function ADHDLessonProgressBar({ currentStep, totalSteps, accuracy }) {
    const progressPercentage = (currentStep / totalSteps) * 100;

    return (
        <header style={headerStyle}>
            <div style={headerContentStyle}>
                {/* STEP INDICATOR */}
                <div style={stepIndicatorStyle}>
                    <span style={stepTextStyle}>
                        📍 Step {currentStep} of {totalSteps}
                    </span>
                </div>

                {/* PROGRESS BAR */}
                <div style={progressBarContainerStyle}>
                    <div style={{ ...progressBarStyle, width: `${progressPercentage}%` }}></div>
                </div>

                {/* ACCURACY BADGE */}
                <div style={accuracyBadgeStyle}>
                    ✓ {accuracy}% Correct
                </div>
            </div>
        </header>
    );
}

// ============================================================
// STYLES
// ============================================================
const headerStyle = {
    backgroundColor: 'white',
    borderBottom: '2px solid #E2E8F0',
    padding: '16px 20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    position: 'sticky',
    top: 0,
    zIndex: 100
};

const headerContentStyle = {
    maxWidth: '600px',
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    flexWrap: 'wrap'
};

const stepIndicatorStyle = {
    minWidth: 'fit-content'
};

const stepTextStyle = {
    fontSize: '0.95rem',
    fontWeight: '700',
    color: '#2563EB'
};

const progressBarContainerStyle = {
    flex: 1,
    minWidth: '120px',
    height: '8px',
    backgroundColor: '#E2E8F0',
    borderRadius: '4px',
    overflow: 'hidden'
};

const progressBarStyle = {
    height: '100%',
    backgroundColor: '#10B981',
    transition: 'width 0.4s ease',
    borderRadius: '4px'
};

const accuracyBadgeStyle = {
    padding: '6px 12px',
    backgroundColor: '#DBEAFE',
    color: '#0C4A6E',
    borderRadius: '20px',
    fontSize: '0.85rem',
    fontWeight: '700',
    minWidth: 'fit-content'
};
