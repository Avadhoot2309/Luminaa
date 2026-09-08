/**
 * UI MAPPER
 * Scans the DOM for interactive elements and maps them for the AI agent.
 */

export const getInteractiveElements = () => {
    // Select common interactive tags and elements with roles
    const selector = 'button, a[href], input, select, textarea, [role="button"], [role="link"], .clickable';
    const elements = document.querySelectorAll(selector);
    
    const mapped = [];

    elements.forEach((el, index) => {
        // Basic visibility checks
        const style = window.getComputedStyle(el);
        const isVisible = style.display !== 'none' && 
                          style.visibility !== 'hidden' && 
                          el.offsetWidth > 0 && 
                          el.offsetHeight > 0;

        if (!isVisible) return;

        // Get descriptive text "as written"
        // Priority: aria-label (for icons), direct innerText, placeholder
        let text = el.ariaLabel || el.innerText || el.placeholder || el.title || '';
        
        // Clean up text (remove extra spaces, icons/emojis if possible)
        text = text.trim().replace(/\s+/g, ' ');

        // If no text, try to find text in children (especially for complex buttons)
        if (!text && el.children.length > 0) {
            text = Array.from(el.querySelectorAll('span, p, div'))
                .map(c => c.innerText)
                .join(' ')
                .trim();
        }

        // Final fallback for inputs
        if (!text && el.tagName === 'INPUT') {
            const label = document.querySelector(`label[for="${el.id}"]`);
            if (label) text = label.innerText;
        }

        // Generate a unique selector or use ID
        const id = el.id || `leo-el-${index}`;
        if (!el.id) el.setAttribute('data-leo-id', id);

        mapped.push({
            id: id,
            tag: el.tagName.toLowerCase(),
            text: text.substring(0, 50), // Limit text length
            role: el.getAttribute('role') || el.tagName.toLowerCase()
        });
    });

    return mapped;
};

/**
 * Find and click an element by its Leo ID
 */
export const clickLeoElement = (id) => {
    const el = document.getElementById(id) || document.querySelector(`[data-leo-id="${id}"]`);
    if (el) {
        // Visual feedback
        const originalOutline = el.style.outline;
        el.style.outline = '4px solid #E8920C';
        el.style.outlineOffset = '2px';
        el.style.transition = 'outline 0.3s ease';

        setTimeout(() => {
            el.style.outline = originalOutline;
            el.click();
        }, 600);
        
        return true;
    }
    return false;
};

export default {
    getInteractiveElements,
    clickLeoElement
};
