import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';

const LearningAssistantContext = createContext();

export const useLearningAssistant = () => {
    const context = useContext(LearningAssistantContext);
    if (!context) {
        throw new Error('useLearningAssistant must be used within LearningAssistantProvider');
    }
    return context;
};

export const LearningAssistantProvider = ({ children }) => {
    const [isSleeping, setIsSleeping] = useState(false);
    const [isHesitating, setIsHesitating] = useState(false);
    const [lastInteractionTime, setLastInteractionTime] = useState(Date.now());
    const [victoryTrigger, setVictoryTrigger] = useState(null);
    const [encouragementTrigger, setEncouragementTrigger] = useState(null);

    const hesitationTimeoutRef = useRef(null);
    const interactionTimeoutRef = useRef(null);

    // Track user interactions globally
    useEffect(() => {
        const handleInteraction = () => {
            setLastInteractionTime(Date.now());
            setIsHesitating(false);

            // Reset hesitation timeout
            if (hesitationTimeoutRef.current) {
                clearTimeout(hesitationTimeoutRef.current);
            }

            // Set new hesitation timeout (45 seconds of inactivity)
            if (!isSleeping) {
                hesitationTimeoutRef.current = setTimeout(() => {
                    setIsHesitating(true);
                }, 45000);
            }
        };

        // Listen to clicks, key presses, and touches
        window.addEventListener('click', handleInteraction);
        window.addEventListener('keydown', handleInteraction);
        window.addEventListener('touchstart', handleInteraction);

        return () => {
            window.removeEventListener('click', handleInteraction);
            window.removeEventListener('keydown', handleInteraction);
            window.removeEventListener('touchstart', handleInteraction);
            if (hesitationTimeoutRef.current) {
                clearTimeout(hesitationTimeoutRef.current);
            }
        };
    }, [isSleeping]);

    // Reset hesitation when assistant speaks (user received help)
    const resetHesitation = useCallback(() => {
        setIsHesitating(false);
        setLastInteractionTime(Date.now());
        if (hesitationTimeoutRef.current) {
            clearTimeout(hesitationTimeoutRef.current);
        }
    }, []);

    // Trigger victory celebration
    const celebrateVictory = useCallback((message = "You did it! Amazing job!") => {
        setVictoryTrigger({ id: Date.now(), message });
        resetHesitation();
    }, [resetHesitation]);

    // Trigger encouragement message
    const triggerEncouragement = useCallback((message) => {
        setEncouragementTrigger({ id: Date.now(), message });
        resetHesitation();
    }, [resetHesitation]);

    // Toggle sleep mode
    const toggleSleepMode = useCallback(() => {
        setIsSleeping(prev => !prev);
        setIsHesitating(false);
        if (hesitationTimeoutRef.current) {
            clearTimeout(hesitationTimeoutRef.current);
        }
    }, []);

    const value = {
        isSleeping,
        isHesitating,
        victoryTrigger,
        encouragementTrigger,
        celebrateVictory,
        triggerEncouragement,
        toggleSleepMode,
        resetHesitation,
    };

    return (
        <LearningAssistantContext.Provider value={value}>
            {children}
        </LearningAssistantContext.Provider>
    );
};
