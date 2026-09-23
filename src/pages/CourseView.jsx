import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Breadcrumb, SectionHeader, Card, Badge, EmptyState } from '../App';

function CourseView({ courses = [] }) {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const course = courses.find(c => c.id === courseId);

  if (!course) {
    return (
      <div className="space-y-4">
        <Breadcrumb items={[{ label: 'Course Not Found' }]} />
        <EmptyState
          title="Course Not Found"
          description="The requested course does not exist or may have been removed."
          actionText="Back to Home"
          onAction={() => navigate('/')}
        />
      </div>
    );
  }

  const subjects = course.subjects || [];

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: course.title }
        ]}
      />

      {/* Course Detail Banner */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="md:flex">
          {course.thumbnail && (
            <div className="md:w-1/3">
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-48 md:h-full object-cover"
              />
            </div>
          )}
          <div className={`p-6 ${course.thumbnail ? 'md:w-2/3' : 'w-full'}`}>
            <div className="flex items-center space-x-2 mb-2">
              {course.category && <Badge type="purple">{course.category}</Badge>}
              <Badge type="info">{subjects.length} Subjects</Badge>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              {course.title}
            </h1>
            <p className="text-gray-600 text-sm md:text-base mb-4">
              {course.description || 'No description provided.'}
            </p>
            {course.telegramLink && (
              <a
                href={course.telegramLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg shadow-sm transition"
              >
                Join Telegram Discussion Group
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Subjects Section */}
      <div>
        <SectionHeader
          title="Subjects"
          subtitle="Select a subject to view chapters and learning material"
        />

        {subjects.length === 0 ? (
          <EmptyState
            title="No Subjects Available"
            description="There are no subjects added under this course yet."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((subject) => (
              <Link
                key={subject.id}
                to={`/course/${course.id}/subject/${subject.id}`}
              >
                <Card className="h-full flex flex-col hover:border-indigo-500 hover:shadow-md transition group p-5">
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center font-bold text-lg group-hover:bg-indigo-600 group-hover:text-white transition">
                      {subject.title ? subject.title.charAt(0).toUpperCase() : 'S'}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition">
                        {subject.title}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {subject.chapters ? `${subject.chapters.length} Chapters` : '0 Chapters'}
                      </p>
                    </div>
                  </div>
                  {subject.description && (
                    <p className="text-xs text-gray-600 line-clamp-2 mb-3">
                      {subject.description}
                    </p>
                  )}
                  <div className="mt-auto pt-3 border-t border-gray-100 flex justify-between items-center text-xs text-indigo-600 font-semibold">
                    <span>View Chapters &rarr;</span>
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

export default CourseView;
