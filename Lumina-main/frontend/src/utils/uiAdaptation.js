/**
 * UI ADAPTATION LOGIC
 * Transforms UI based on Leo's recommendations
 * Handles fonts, spacing, highlighting, and colors
 */

/**
 * Apply UI changes to the DOM
 * @param {Object} uiChanges - { font_size, font_family, highlight, spacing, color_hint }
 * @param {string} targetSelector - CSS selector for content area
 */
export const applyUIChanges = (uiChanges, targetSelector = '.lesson-content') => {
    try {
        const target = document.querySelector(targetSelector);
        if (!target) {
            console.warn('[uiAdaptation] Target element not found:', targetSelector);
            return;
        }

        // Reset previous adaptations
        resetUIChanges(target);

        // Apply font size
        if (uiChanges.font_size) {
            target.classList.add(`font-size-${uiChanges.font_size}`);
            target.style.fontSize = getFontSizeValue(uiChanges.font_size);
        }

        // Apply font family
        if (uiChanges.font_family === 'open_dyslexic') {
            target.style.fontFamily = '"OpenDyslexic", sans-serif';
            target.style.letterSpacing = '0.1em';
            target.style.wordSpacing = '0.2em';
        }

        // Apply spacing
        if (uiChanges.spacing === 'wide') {
            target.style.lineHeight = '2';
            target.style.padding = '2rem';
        }

        // Apply highlighting
        if (uiChanges.highlight && Array.isArray(uiChanges.highlight)) {
            highlightText(target, uiChanges.highlight);
        }

        // Apply color hint
        if (uiChanges.color_hint) {
            target.style.borderLeft = `4px solid ${getColorForHint(uiChanges.color_hint)}`;
            target.style.paddingLeft = '1rem';
        }

        console.log('[uiAdaptation] Applied changes:', uiChanges);
    } catch (error) {
        console.error('[uiAdaptation] Error:', error);
    }
};

/**
 * Get font size value in CSS units
 */
const getFontSizeValue = (size) => {
    const sizeMap = {
        normal: '1rem',
        large: '1.25rem',
        extra_large: '1.5rem',
    };
    return sizeMap[size] || '1rem';
};

/**
 * Highlight specific text in target element
 */
const highlightText = (element, textsToHighlight) => {
    const content = element.innerHTML;
    let highlighted = content;

    textsToHighlight.forEach((text) => {
        const regex = new RegExp(`\\b${text}\\b`, 'gi');
        highlighted = highlighted.replace(
            regex,
            `<mark class="leo-highlight">$&</mark>`
        );
    });

    element.innerHTML = highlighted;
};

/**
 * Get color for different hint types
 */
const getColorForHint = (hint) => {
    const colorMap = {
        neutral: '#3b82f6', // blue
        warning: '#f59e0b', // amber
        success: '#10b981', // emerald
        error: '#ef4444', // red
    };
    return colorMap[hint] || '#3b82f6';
};

/**
 * Reset all UI adaptations
 */
export const resetUIChanges = (element) => {
    // Remove font adaptations
    element.style.fontFamily = '';
    element.style.fontSize = '';
    element.style.lineHeight = '';
    element.style.letterSpacing = '';
    element.style.wordSpacing = '';
    element.style.padding = '';
    element.style.borderLeft = '';
    element.style.paddingLeft = '';

    // Remove highlighting
    const marks = element.querySelectorAll('.leo-highlight');
    marks.forEach((mark) => {
        while (mark.firstChild) {
            element.insertBefore(mark.firstChild, mark);
        }
        mark.remove();
    });

    // Remove classes
    element.classList.remove(
        'font-size-large',
        'font-size-extra_large',
        'font-family-dyslexic',
        'spacing-wide'
    );
};

/**
 * Create a visual indicator that Leo is adapting
 */
export const showAdaptationIndicator = () => {
    const indicator = document.createElement('div');
    indicator.className = 'leo-adaptation-indicator';
    indicator.textContent = '✨ Adjusting for you...';
    indicator.style.cssText = `
    position: fixed;
    bottom: 100px;
    right: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.875rem;
    animation: slideIn 0.3s ease-out;
    z-index: 999;
  `;

    document.body.appendChild(indicator);

    setTimeout(() => {
        indicator.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => indicator.remove(), 300);
    }, 2000);
};

/**
 * Apply animation styles globally
 */
export const injectAdaptationStyles = () => {
    if (document.getElementById('leo-adaptation-styles')) return;

    const style = document.createElement('style');
    style.id = 'leo-adaptation-styles';
    style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    @keyframes slideOut {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(100%);
        opacity: 0;
      }
    }

    .leo-highlight {
      background-color: #fef3c7;
      padding: 2px 4px;
      border-radius: 3px;
      font-weight: 500;
    }

    .font-size-large {
      font-size: 1.25rem;
    }

    .font-size-extra_large {
      font-size: 1.5rem;
    }

    .spacing-wide {
      line-height: 2;
      letter-spacing: 0.05em;
    }

    @font-face {
      font-family: 'OpenDyslexic';
      src: url('https://cdn.jsdelivr.net/gh/antijingoist/open-dyslexic@latest/OpenDyslexic-Regular.woff2') format('woff2');
    }
  `;

    document.head.appendChild(style);
};

export default {
    applyUIChanges,
    resetUIChanges,
    showAdaptationIndicator,
    injectAdaptationStyles,
};
