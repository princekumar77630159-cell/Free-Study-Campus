import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SectionHeader, Card, Badge, EmptyState } from '../App';

function Home({ courses = [] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...new Set(courses.map(course => course.category).filter(Boolean))];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          course.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl text-white p-8 md:p-12 shadow-lg">
        <div className="max-w-3xl">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
            Welcome to Free Study Campus
          </h1>
          <p className="text-indigo-100 text-lg md:text-xl mb-6">
            Access free educational courses, structured video lectures, study materials, and direct links to learning resources.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="https://t.me/freestudycampus"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-white text-indigo-600 font-semibold rounded-lg shadow hover:bg-indigo-50 transition"
            >
              Join Telegram Community
            </a>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="w-full md:w-1/2 relative">
          <input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          />
          <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${
                selectedCategory === category
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Course Grid */}
      <div>
        <SectionHeader title="Available Batches & Courses" subtitle="Explore structured courses and study materials" />

        {filteredCourses.length === 0 ? (
          <EmptyState
            title="No Courses Found"
            description={searchTerm ? "No courses match your search criteria." : "No courses have been added yet."}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map(course => (
              <Link key={course.id} to={`/course/${course.id}`}>
                <Card className="h-full flex flex-col hover:border-indigo-500 hover:shadow-lg transition group">
                  {course.thumbnail ? (
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition duration-300"
                    />
                  ) : (
                    <div className="w-full h-48 bg-indigo-50 flex items-center justify-center text-indigo-400 font-bold text-xl">
                      {course.title ? course.title.substring(0, 2).toUpperCase() : 'FC'}
                    </div>
                  )}
                  <div className="p-5 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-2">
                      {course.category && <Badge type="purple">{course.category}</Badge>}
                      <span className="text-xs text-gray-500">
                        {course.subjects ? `${course.subjects.length} Subjects` : '0 Subjects'}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition mb-2">
                      {course.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-4 flex-grow">
                      {course.description || 'No description available for this course.'}
                    </p>
                    <div className="pt-3 border-t border-gray-100 flex justify-between items-center text-xs text-indigo-600 font-semibold">
                      <span>Explore Content &rarr;</span>
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

export default Home;
