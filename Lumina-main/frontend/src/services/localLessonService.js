import { syllabusData } from "../data/syllabusData";

export const getAllSubjects = () => syllabusData.subjects;

export const getSubjectById = (subjectId) =>
  syllabusData.subjects.find(s => s.id === subjectId);

export const getChapterById = (subjectId, chapterId) => {
  const subject = getSubjectById(subjectId);
  return subject?.chapters.find(c => c.id === chapterId);
};

export const getFullLesson = async (lessonId) => {
  for (const subject of syllabusData.subjects) {
    for (const chapter of subject.chapters) {
      const lesson = chapter.lessons.find(l => l.id === lessonId);
      if (lesson) {
        return {
          lesson,
          subject,
          chapter,
          adaptedText: lesson.story.text,
          chunks: lesson.story.chunks,
          videoResources: lesson.video,
          activities: lesson.activities,
          quiz: lesson.quiz
        };
      }
    }
  }
  return null;
};

export const getLessonsBySubject = (subjectId) => {
  const subject = getSubjectById(subjectId);
  if (!subject) return [];
  return subject.chapters.flatMap(ch =>
    ch.lessons.map(l => ({ ...l, chapterTitle: ch.title }))
  );
};
