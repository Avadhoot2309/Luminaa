import React, { createContext, useContext, useState, useEffect } from 'react';

const AccessibilityContext = createContext();

export const AccessibilityProvider = ({ children }) => {
    const [isDyslexiaMode, setIsDyslexiaMode] = useState(() => {
        // Load from localStorage on mount
        const saved = localStorage.getItem('lumina-dyslexia-mode');
        return saved ? JSON.parse(saved) : false;
    });

    const [fontSizeMultiplier, setFontSizeMultiplier] = useState(() => {
        const saved = localStorage.getItem('lumina-font-size');
        return saved ? parseFloat(saved) : 1;
    });

    const [highContrast, setHighContrast] = useState(() => {
        const saved = localStorage.getItem('lumina-high-contrast');
        return saved ? JSON.parse(saved) : false;
    });

    // Apply dyslexia font to HTML element
    useEffect(() => {
        const htmlElement = document.documentElement;
        if (isDyslexiaMode) {
            htmlElement.classList.add('dyslexia-mode');
            document.body.style.fontFamily = "'OpenDyslexic', 'Nunito', sans-serif";
        } else {
            htmlElement.classList.remove('dyslexia-mode');
            document.body.style.fontFamily = "'Nunito', sans-serif";
        }
        localStorage.setItem('lumina-dyslexia-mode', JSON.stringify(isDyslexiaMode));
    }, [isDyslexiaMode]);

    // Apply font size
    useEffect(() => {
        document.body.style.fontSize = `${16 * fontSizeMultiplier}px`;
        localStorage.setItem('lumina-font-size', fontSizeMultiplier.toString());
    }, [fontSizeMultiplier]);

    // Apply high contrast
    useEffect(() => {
        if (highContrast) {
            document.documentElement.classList.add('high-contrast-mode');
        } else {
            document.documentElement.classList.remove('high-contrast-mode');
        }
        localStorage.setItem('lumina-high-contrast', JSON.stringify(highContrast));
    }, [highContrast]);

    const toggleDyslexiaMode = () => {
        setIsDyslexiaMode(!isDyslexiaMode);
    };

    const updateFontSize = (multiplier) => {
        setFontSizeMultiplier(Math.max(0.8, Math.min(2, multiplier)));
    };

    const toggleHighContrast = () => {
        setHighContrast(!highContrast);
    };

    return (
        <AccessibilityContext.Provider
            value={{
                isDyslexiaMode,
                toggleDyslexiaMode,
                fontSizeMultiplier,
                updateFontSize,
                highContrast,
                toggleHighContrast,
            }}
        >
            {children}
        </AccessibilityContext.Provider>
    );
};

export const useAccessibility = () => {
    const context = useContext(AccessibilityContext);
    if (!context) {
        throw new Error('useAccessibility must be used within AccessibilityProvider');
    }
    return context;
};
