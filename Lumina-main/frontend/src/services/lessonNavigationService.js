/**
 * LESSON NAVIGATION SERVICE
 * Manages navigation between lessons, chapters, and content
 * Connects Leo to Luminaaa's lesson structure
 */

import { syllabusData } from '../data/syllabusData';

/**
 * Get all available lessons
 */
export const getAllLessons = () => {
    const lessons = [];

    syllabusData.subjects.forEach((subject) => {
        subject.chapters.forEach((chapter) => {
            chapter.lessons.forEach((lesson) => {
                lessons.push({
                    id: lesson.id,
                    title: lesson.title,
                    subject: subject.name,
                    subjectId: subject.id,
                    chapter: chapter.title,
                    chapterId: chapter.id,
                    difficulty: lesson.difficulty,
                    duration: lesson.duration,
                });
            });
        });
    });

    return lessons;
};

/**
 * Get all subjects
 */
export const getSubjects = () => {
    return syllabusData.subjects.map((s) => ({
        id: s.id,
        name: s.name,
        icon: s.icon,
        chapters: s.chapters.length,
    }));
};

/**
 * Get chapters for a subject
 */
export const getChaptersForSubject = (subjectId) => {
    const subject = syllabusData.subjects.find((s) => s.id === subjectId);
    if (!subject) return [];

    return subject.chapters.map((ch) => ({
        id: ch.id,
        number: ch.chapterNumber,
        title: ch.title,
        lessons: ch.lessons.length,
    }));
};

/**
 * Get lessons for a chapter
 */
export const getLessonsForChapter = (chapterId) => {
    let lessons = [];

    syllabusData.subjects.forEach((subject) => {
        const chapter = subject.chapters.find((ch) => ch.id === chapterId);
        if (chapter) {
            lessons = chapter.lessons.map((l) => ({
                id: l.id,
                title: l.title,
                duration: l.duration,
                difficulty: l.difficulty,
            }));
        }
    });

    return lessons;
};

/**
 * Get a specific lesson by ID
 */
export const getLessonById = (lessonId) => {
    let lesson = null;

    syllabusData.subjects.forEach((subject) => {
        subject.chapters.forEach((chapter) => {
            const found = chapter.lessons.find((l) => l.id === lessonId);
            if (found) {
                lesson = {
                    ...found,
                    subject: subject.name,
                    subjectId: subject.id,
                    chapter: chapter.title,
                    chapterId: chapter.id,
                };
            }
        });
    });

    return lesson;
};

/**
 * Search lessons by keyword
 */
export const searchLessons = (query) => {
    const normalizedQuery = query.toLowerCase();
    const allLessons = getAllLessons();

    return allLessons.filter(
        (lesson) =>
            lesson.title.toLowerCase().includes(normalizedQuery) ||
            lesson.subject.toLowerCase().includes(normalizedQuery) ||
            lesson.chapter.toLowerCase().includes(normalizedQuery)
    );
};

/**
 * Get next lesson in sequence
 */
export const getNextLesson = (currentLessonId) => {
    const allLessons = getAllLessons();
    const currentIndex = allLessons.findIndex((l) => l.id === currentLessonId);

    if (currentIndex >= 0 && currentIndex < allLessons.length - 1) {
        return allLessons[currentIndex + 1];
    }

    return null;
};

/**
 * Get previous lesson in sequence
 */
export const getPreviousLesson = (currentLessonId) => {
    const allLessons = getAllLessons();
    const currentIndex = allLessons.findIndex((l) => l.id === currentLessonId);

    if (currentIndex > 0) {
        return allLessons[currentIndex - 1];
    }

    return null;
};

/**
 * Match lesson from voice input
 * "go to fractions" → finds lesson about fractions
 */
export const findLessonFromVoice = (voiceInput) => {
    return searchLessons(voiceInput);
};

/**
 * Get lesson suggestions based on student level
 */
export const getLessonSuggestions = (subjectId, difficulty = 'easy') => {
    const subject = syllabusData.subjects.find((s) => s.id === subjectId);
    if (!subject) return [];

    const suggestions = [];

    subject.chapters.forEach((chapter) => {
        chapter.lessons.forEach((lesson) => {
            if (lesson.difficulty === difficulty || !difficulty) {
                suggestions.push({
                    id: lesson.id,
                    title: lesson.title,
                    difficulty: lesson.difficulty,
                });
            }
        });
    });

    return suggestions.slice(0, 5); // Return top 5
};

export default {
    getAllLessons,
    getSubjects,
    getChaptersForSubject,
    getLessonsForChapter,
    getLessonById,
    searchLessons,
    getNextLesson,
    getPreviousLesson,
    findLessonFromVoice,
    getLessonSuggestions,
};
