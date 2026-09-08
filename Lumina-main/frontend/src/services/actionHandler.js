/**
 * ACTION HANDLER
 * Executes Leo actions based on parsed intents
 * Controls app navigation and behavior
 */

import lessonNavService from './lessonNavigationService';
import { INTENT_TYPES } from './intentParser';
import { clickLeoElement } from '../utils/uiMapper';

/**
 * Execute intent-based action
 */
export const executeAction = async (intent, context = {}) => {
    console.log('[actionHandler] Executing intent:', intent);

    try {
        const { navigate, currentLessonId, onProgressRequest } = context;

        switch (intent.intent) {
            case INTENT_TYPES.NAVIGATE_LESSON:
                return handleNavigateLesson(intent, context);

            case INTENT_TYPES.NAVIGATE_SUBJECT:
                return handleNavigateSubject(intent, context);

            case INTENT_TYPES.NEXT_LESSON:
                return handleNextLesson(currentLessonId, context);

            case INTENT_TYPES.PREVIOUS_LESSON:
                return handlePreviousLesson(currentLessonId, context);

            case INTENT_TYPES.SHOW_PROGRESS:
                return handleShowProgress(context);

            case INTENT_TYPES.SHOW_SUBJECTS:
                return handleShowSubjects(context);

            case INTENT_TYPES.PLAY_GAME:
                return handlePlayGame(context);

            case INTENT_TYPES.NAVIGATE_FEATURE:
                return handleNavigateFeature(intent, context);

            case INTENT_TYPES.HELP:
                return handleHelp();

            case INTENT_TYPES.REPEAT:
                return handleRepeat(context);

            default:
                return {
                    action: 'respond',
                    response: 'I did not understand that. Can you repeat?',
                    navigationRequired: false,
                };
        }
    } catch (error) {
        console.error('[actionHandler] Error executing action:', error);
        return {
            action: 'error',
            response: 'I encountered an error. Please try again.',
            navigationRequired: false,
        };
    }
};

/**
 * Navigate to a specific lesson by name or search
 */
const handleNavigateLesson = (intent, context) => {
    try {
        const searchResults = lessonNavService.searchLessons(intent.target);

        if (searchResults.length === 0) {
            return {
                action: 'respond',
                response: `I could not find a lesson about "${intent.target}". What would you like to learn about?`,
                navigationRequired: false,
            };
        }

        if (searchResults.length === 1) {
            const lesson = searchResults[0];
            const route = `/lesson-player?id=${lesson.id}`;

            context.navigate?.(route);

            return {
                action: 'navigate',
                response: `Great! Starting ${lesson.title}. Let's learn about ${lesson.chapter}!`,
                navigationRequired: true,
                target: route,
                lesson,
            };
        }

        // Multiple matches - ask user to clarify
        const options = searchResults.slice(0, 3).map((l) => l.title);
        return {
            action: 'clarify',
            response: `I found several lessons. Did you mean: ${options.join(', or ')}?`,
            navigationRequired: false,
            options: searchResults,
        };
    } catch (error) {
        console.error('[actionHandler] Error in navigate lesson:', error);
        return {
            action: 'error',
            response: 'Could not navigate to that lesson.',
            navigationRequired: false,
        };
    }
};

/**
 * Navigate to a subject
 */
const handleNavigateSubject = (intent, context) => {
    try {
        const subjects = lessonNavService.getSubjects();
        const query = (intent.target || '').toLowerCase();

        const match = subjects.find(
            (s) =>
                s.name.toLowerCase().includes(query) ||
                query.includes(s.name.toLowerCase())
        );

        if (!match) {
            const available = subjects.map((s) => s.name).join(', ');
            return {
                action: 'respond',
                response: `We have: ${available}. Which one would you like?`,
                navigationRequired: false,
            };
        }

        const route = `/chapters?subject=${match.id}`;
        context.navigate?.(route);

        return {
            action: 'navigate',
            response: `Perfect! Let's explore ${match.name}. You have ${match.chapters} chapters to learn.`,
            navigationRequired: true,
            target: route,
        };
    } catch (error) {
        console.error('[actionHandler] Error in navigate subject:', error);
        return {
            action: 'error',
            response: 'Could not navigate to that subject.',
            navigationRequired: false,
        };
    }
};

/**
 * Go to next lesson
 */
const handleNextLesson = (currentLessonId, context) => {
    if (!currentLessonId) {
        return {
            action: 'respond',
            response: 'No current lesson. Which lesson would you like to start?',
            navigationRequired: false,
        };
    }

    try {
        const next = lessonNavService.getNextLesson(currentLessonId);

        if (!next) {
            return {
                action: 'respond',
                response: 'You have finished this section! Would you like to explore a new topic?',
                navigationRequired: false,
            };
        }

        const route = `/lesson-player?id=${next.id}`;
        context.navigate?.(route);

        return {
            action: 'navigate',
            response: `Moving on to the next lesson: ${next.title}. Let's go!`,
            navigationRequired: true,
            target: route,
        };
    } catch (error) {
        console.error('[actionHandler] Error in next lesson:', error);
        return {
            action: 'error',
            response: 'Could not move to the next lesson.',
            navigationRequired: false,
        };
    }
};

/**
 * Go to previous lesson
 */
const handlePreviousLesson = (currentLessonId, context) => {
    if (!currentLessonId) {
        return {
            action: 'respond',
            response: 'No current lesson to go back from.',
            navigationRequired: false,
        };
    }

    try {
        const prev = lessonNavService.getPreviousLesson(currentLessonId);

        if (!prev) {
            return {
                action: 'respond',
                response: 'You are at the beginning. Ready to start learning?',
                navigationRequired: false,
            };
        }

        const route = `/lesson-player?id=${prev.id}`;
        context.navigate?.(route);

        return {
            action: 'navigate',
            response: `Going back to: ${prev.title}. Let's review!`,
            navigationRequired: true,
            target: route,
        };
    } catch (error) {
        console.error('[actionHandler] Error in previous lesson:', error);
        return {
            action: 'error',
            response: 'Could not move to the previous lesson.',
            navigationRequired: false,
        };
    }
};

/**
 * Show student progress
 */
const handleShowProgress = (context) => {
    const progress = context.studentProgress || {};

    return {
        action: 'show_progress',
        response: `You are making great progress! Keep it up! 🌟`,
        navigationRequired: false,
        showProgressPanel: true,
        progress,
    };
};

/**
 * Show all subjects
 */
const handleShowSubjects = (context) => {
    const subjects = lessonNavService.getSubjects();
    const subjectList = subjects.map((s) => `${s.icon} ${s.name}`).join(', ');

    context.navigate?.('/subjects');

    return {
        action: 'navigate',
        response: `Here are all the subjects we have: ${subjectList}. Pick one to start!`,
        navigationRequired: true,
        target: '/subjects',
        subjects,
    };
};

/**
 * Play a game
 */
const handlePlayGame = (context) => {
    context.navigate?.('/games');

    return {
        action: 'navigate',
        response: 'Let us find a fun game for you to play! 🎮',
        navigationRequired: true,
        target: '/games',
    };
};

/**
 * Navigate to a specific app feature (login, teacher-dashboard, etc)
 */
const handleNavigateFeature = (intent, context) => {
    const feature = (intent.target || '').toLowerCase();
    
    const featureMap = {
        'login': { route: '/login', label: 'the login screen' },
        'teacher-dashboard': { route: '/teacher-dashboard', label: 'the teacher console' },
        'home': { route: '/', label: 'the home page' },
        'onboarding': { route: '/onboarding', label: 'the onboarding journey' }
    };

    const match = featureMap[feature] || Object.values(featureMap).find(f => feature.includes(f.label));

    if (!match) {
        return {
            action: 'respond',
            response: `I'm not sure how to go to "${feature}". I can take you to the login screen, home, or the teacher console.`,
            navigationRequired: false
        };
    }

    context.navigate?.(match.route);

    return {
        action: 'navigate',
        response: `Of course! Taking you to ${match.label} now.`,
        navigationRequired: true,
        target: match.route
    };
};

/**
 * Help
 */
const handleHelp = () => {
    return {
        action: 'respond',
        response:
            'I can help you! Try saying: "Go to math", "Next lesson", "Show my progress", or "Play a game". What would you like to do?',
        navigationRequired: false,
    };
};

/**
 * Repeat
 */
const handleRepeat = (context) => {
    const lastMessage = context.lastLeoMessage || '';

    return {
        action: 'repeat',
        response: lastMessage || 'I do not have anything to repeat.',
        navigationRequired: false,
    };
};

/**
 * Format action result for UI display
 */
export const formatActionResult = (actionResult) => {
    return {
        message: actionResult.response || '',
        requiresNavigation: actionResult.navigationRequired || false,
        route: actionResult.target,
        metadata: {
            action: actionResult.action,
            options: actionResult.options,
            progress: actionResult.progress,
        },
    };
};

/**
 * Executes a direct action from Claude (e.g. click_element)
 */
export const executeClaudeAction = (claudeResult, context = {}) => {
    console.log('[actionHandler] Executing Claude action:', claudeResult.action);
    
    if (claudeResult.action === 'click_element' && claudeResult.element_id) {
        const success = clickLeoElement(claudeResult.element_id);
        if (success) {
            return {
                message: claudeResult.response,
                requiresNavigation: false,
                metadata: { action: 'click_element', target: claudeResult.element_id }
            };
        }
    }

    return formatActionResult({
        response: claudeResult.response,
        navigationRequired: claudeResult.action === 'navigate',
        action: claudeResult.action
    });
};

export default {
    executeAction,
    executeClaudeAction,
    formatActionResult,
};
