import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Breadcrumb, SectionHeader, Card, Badge, EmptyState } from '../App';

function ChapterView({ courses = [] }) {
  const { courseId, subjectId, chapterId } = useParams();
  const navigate = useNavigate();

  const course = courses.find(c => c.id === courseId);
  const subject = course?.subjects?.find(s => s.id === subjectId);
  const chapter = subject?.chapters?.find(ch => ch.id === chapterId);

  if (!course || !subject || !chapter) {
    return (
      <div className="space-y-4">
        <Breadcrumb items={[{ label: 'Chapter Not Found' }]} />
        <EmptyState
          title="Chapter Not Found"
          description="The requested chapter does not exist or may have been removed."
          actionText="Back to Home"
          onAction={() => navigate('/')}
        />
      </div>
    );
  }

  const lessons = chapter.lessons || [];

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: course.title, link: `/course/${course.id}` },
          { label: subject.title, link: `/course/${course.id}/subject/${subject.id}` },
          { label: chapter.title }
        ]}
      />

      {/* Chapter Info Header */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center space-x-2 mb-2">
          <Badge type="info">{subject.title}</Badge>
          <Badge type="purple">{lessons.length} Lessons</Badge>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          {chapter.title}
        </h1>
        {chapter.description && (
          <p className="text-gray-600 text-sm md:text-base">
            {chapter.description}
          </p>
        )}
      </div>

      {/* Lessons Section */}
      <div>
        <SectionHeader
          title="Lessons & Study Material"
          subtitle="Select a lesson to watch videos or access notes"
        />

        {lessons.length === 0 ? (
          <EmptyState
            title="No Lessons Found"
            description="There are no lessons available in this chapter yet."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lessons.map((lesson, index) => (
              <Link
                key={lesson.id}
                to={`/course/${course.id}/subject/${subject.id}/chapter/${chapter.id}/lesson/${lesson.id}`}
              >
                <Card className="p-5 hover:border-indigo-500 hover:shadow-md transition group h-full flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-50 text-indigo-600 rounded-md">
                        Lesson {index + 1}
                      </span>
                      {lesson.duration && (
                        <span className="text-xs text-gray-500">
                          ⏱ {lesson.duration}
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition mb-2">
                      {lesson.title}
                    </h3>
                    {lesson.description && (
                      <p className="text-xs text-gray-600 line-clamp-2 mb-3">
                        {lesson.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 pt-3 border-t border-gray-100 text-xs font-medium text-indigo-600">
                    {lesson.videoUrl && (
                      <span className="bg-red-50 text-red-600 px-2 py-0.5 rounded">
                        Video
                      </span>
                    )}
                    {lesson.pdfUrl && (
                      <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded">
                        PDF Notes
                      </span>
                    )}
                    <span className="ml-auto font-semibold">Open &rarr;</span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ChapterView;
