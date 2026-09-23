import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Breadcrumb, SectionHeader, Card, Badge, EmptyState } from '../App';

function SubjectView({ courses = [] }) {
  const { courseId, subjectId } = useParams();
  const navigate = useNavigate();

  const course = courses.find(c => c.id === courseId);
  const subject = course?.subjects?.find(s => s.id === subjectId);

  if (!course || !subject) {
    return (
      <div className="space-y-4">
        <Breadcrumb items={[{ label: 'Subject Not Found' }]} />
        <EmptyState
          title="Subject Not Found"
          description="The requested subject or course does not exist."
          actionText="Back to Home"
          onAction={() => navigate('/')}
        />
      </div>
    );
  }

  const chapters = subject.chapters || [];

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: course.title, link: `/course/${course.id}` },
          { label: subject.title }
        ]}
      />

      {/* Header Info */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center space-x-3 mb-2">
          <Badge type="info">{course.title}</Badge>
          <Badge type="purple">{chapters.length} Chapters</Badge>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          {subject.title}
        </h1>
        {subject.description && (
          <p className="text-gray-600 text-sm md:text-base">
            {subject.description}
          </p>
        )}
      </div>

      {/* Chapters Section */}
      <div>
        <SectionHeader
          title="Chapters"
          subtitle="Select a chapter to access video lessons and notes"
        />

        {chapters.length === 0 ? (
          <EmptyState
            title="No Chapters Found"
            description="No chapters have been added to this subject yet."
          />
        ) : (
          <div className="space-y-4">
            {chapters.map((chapter, index) => (
              <Link
                key={chapter.id}
                to={`/course/${course.id}/subject/${subject.id}/chapter/${chapter.id}`}
                className="block"
              >
                <Card className="p-5 hover:border-indigo-500 hover:shadow-md transition group">
                  <div className="flex items-start sm:items-center justify-between flex-col sm:flex-row gap-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center font-bold text-sm group-hover:bg-indigo-600 group-hover:text-white transition flex-shrink-0">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900 group-hover:text-indigo-600 transition">
                          {chapter.title}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {chapter.lessons ? `${chapter.lessons.length} Lessons` : '0 Lessons'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center text-sm font-semibold text-indigo-600 self-end sm:self-center">
                      <span>Explore Chapter &rarr;</span>
                    </div>
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

export default SubjectView;
