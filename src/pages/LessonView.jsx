import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Breadcrumb, Card, Badge, EmptyState, Button } from '../App';

function LessonView({ courses = [] }) {
  const { courseId, subjectId, chapterId, lessonId } = useParams();
  const navigate = useNavigate();

  const course = courses.find(c => c.id === courseId);
  const subject = course?.subjects?.find(s => s.id === subjectId);
  const chapter = subject?.chapters?.find(ch => ch.id === chapterId);
  const lesson = chapter?.lessons?.find(l => l.id === lessonId);

  if (!course || !subject || !chapter || !lesson) {
    return (
      <div className="space-y-4">
        <Breadcrumb items={[{ label: 'Lesson Not Found' }]} />
        <EmptyState
          title="Lesson Not Found"
          description="The requested lesson does not exist or may have been removed."
          actionText="Back to Home"
          onAction={() => navigate('/')}
        />
      </div>
    );
  }

  // Helper to convert standard YouTube links to embed links if necessary
  const getEmbedUrl = (url) => {
    if (!url) return '';
    if (url.includes('youtube.com/embed/')) return url;
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return url;
  };

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: course.title, link: `/course/${course.id}` },
          { label: subject.title, link: `/course/${course.id}/subject/${subject.id}` },
          { label: chapter.title, link: `/course/${course.id}/subject/${subject.id}/chapter/${chapter.id}` },
          { label: lesson.title }
        ]}
      />

      {/* Lesson Header */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center space-x-2 mb-2">
          <Badge type="info">{chapter.title}</Badge>
          {lesson.duration && <Badge type="purple">{lesson.duration}</Badge>}
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          {lesson.title}
        </h1>
        {lesson.description && (
          <p className="text-gray-600 text-sm md:text-base">
            {lesson.description}
          </p>
        )}
      </div>

      {/* Video Embed Section */}
      {lesson.videoUrl && (
        <Card className="p-4 sm:p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <span className="mr-2">🎥</span> Video Lecture
          </h2>
          <div className="aspect-w-16 aspect-h-9 w-full bg-black rounded-lg overflow-hidden relative" style={{ minHeight: '350px' }}>
            <iframe
              src={getEmbedUrl(lesson.videoUrl)}
              title={lesson.title}
              className="w-full h-full absolute inset-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </Card>
      )}

      {/* Notes / PDF Links Section */}
      {lesson.pdfUrl && (
        <Card className="p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-2 flex items-center">
            <span className="mr-2">📄</span> Study Notes & PDF
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Download or view the accompanying notes for this lesson.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href={lesson.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow transition"
            >
              Open PDF Notes
            </a>
          </div>
        </Card>
      )}

      {/* Additional Resources / Telegram */}
      {lesson.telegramUrl && (
        <Card className="p-6 bg-blue-50 border-blue-200">
          <h2 className="text-lg font-bold text-blue-900 mb-2 flex items-center">
            <span className="mr-2">💬</span> Discussion & Homework
          </h2>
          <p className="text-sm text-blue-800 mb-4">
            Join the Telegram thread for this specific lesson to discuss doubts and submit homework.
          </p>
          <a
            href={lesson.telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow transition"
          >
            Open Telegram Discussion
          </a>
        </Card>
      )}
    </div>
  );
}

export default LessonView;
