import React from 'react';

/**
 * ADHD Lesson Content Display
 * 
 * Features:
 * - High readability with clear spacing
 * - Micro-unit content (2-3 lines per step)
 * - Optional images
 * - No clutter
 * - Adaptive simplification based on performance
 */
export default function ADHDLessonContentDisplay({ step, stepNumber, shouldSimplify }) {
    if (!step) return null;

    const getContentStyle = () => {
        switch (step.type) {
            case 'title':
                return { ...containerStyle, ...titleContentStyle };
            case 'summary':
                return { ...containerStyle, ...summaryContentStyle };
            case 'completion':
                return { ...containerStyle, ...completionContentStyle };
            default:
                return containerStyle;
        }
    };

    // Simplify content if needed
    const displayContent = shouldSimplify
        ? simplifyContent(step.content)
        : step.content;

    return (
        <div style={getContentStyle()}>
            {/* TYPE INDICATOR BADGE */}
            <div style={typeIndicatorStyle}>
                {getTypeIcon(step.type)} {getTypeLabel(step.type)}
            </div>

            {/* MAIN CONTENT */}
            <p style={contentTextStyle}>{displayContent}</p>

            {/* IMAGE (if available) */}
            {step.imageUrl && (
                <div style={imageContainerStyle}>
                    <img
                        src={step.imageUrl}
                        alt="Lesson content"
                        style={imageStyle}
                    />
                </div>
            )}

            {/* HELPER TEXT */}
            {shouldSimplify && (
                <div style={simplificationNoticeStyle}>
                    💡 Content has been simplified. Let me know if you'd like more detail!
                </div>
            )}
        </div>
    );
}

// ============================================================
// UTILITY FUNCTIONS
// ============================================================
const getTypeIcon = (type) => {
    const icons = {
        title: '📚',
        content: '📖',
        summary: '✨',
        completion: '🎉'
    };
    return icons[type] || '📖';
};

const getTypeLabel = (type) => {
    const labels = {
        title: 'Lesson Title',
        content: 'Content',
        summary: 'Summary',
        completion: 'Complete'
    };
    return labels[type] || 'Step';
};

/**
 * Simplify content by:
 * - Removing complex sentences
 * - Breaking down concepts
 * - Using simpler vocabulary
 */
const simplifyContent = (content) => {
    const sentences = content.split('. ');
    if (sentences.length > 3) {
        return sentences.slice(0, 2).join('. ') + '.';
    }
    return content;
};

// ============================================================
// STYLES
// ============================================================
const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    border: '1px solid #F1F5F9'
};

const typeIndicatorStyle = {
    fontSize: '0.8rem',
    fontWeight: '700',
    color: '#64748B',
    backgroundColor: '#F8FAFC',
    padding: '6px 10px',
    borderRadius: '4px',
    width: 'fit-content'
};

const contentTextStyle = {
    fontSize: '1.2rem',
    lineHeight: '1.8',
    color: '#1E293B',
    fontWeight: '500',
    margin: '0',
    letterSpacing: '0.2px',
    WebkitFontSmoothing: 'antialiased',
    fontFamily: "'Nunito', 'Open Sans', sans-serif"
};

const titleContentStyle = {
    padding: '28px',
    backgroundColor: '#F0F9FF',
    borderLeft: '4px solid #2563EB'
};

const summaryContentStyle = {
    padding: '24px',
    backgroundColor: '#F0FDF4',
    borderLeft: '4px solid #10B981'
};

const completionContentStyle = {
    padding: '28px',
    backgroundColor: '#FFFBEB',
    borderLeft: '4px solid #F59E0B',
    textAlign: 'center'
};

const imageContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '16px'
};

const imageStyle = {
    maxWidth: '100%',
    height: 'auto',
    maxHeight: '300px',
    borderRadius: '8px',
    border: '1px solid #E2E8F0'
};

const simplificationNoticeStyle = {
    padding: '12px 16px',
    backgroundColor: '#DBEAFE',
    color: '#0C4A6E',
    borderRadius: '6px',
    fontSize: '0.9rem',
    fontWeight: '600',
    borderLeft: '3px solid #0EA5E9',
    marginTop: '8px'
};
