import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { db } from './services/firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';

// Component imports
import Home from './pages/Home';
import CourseView from './pages/CourseView';
import SubjectView from './pages/SubjectView';
import ChapterView from './pages/ChapterView';
import LessonView from './pages/LessonView';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';

function App() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'courses'));
        const courseData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setCourses(courseData);
      } catch (error) {
        console.error("Error fetching courses: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    if (userData && userData.role === 'admin') {
      setIsAdmin(true);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setIsAdmin(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading Free Study Campus...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <header className="bg-indigo-600 text-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <Link to="/" className="flex items-center space-x-3">
              <span className="text-2xl font-bold tracking-tight">FREE STUDY CAMPUS</span>
            </Link>
            <nav className="flex items-center space-x-4">
              <Link to="/" className="hover:text-indigo-200 px-3 py-2 rounded-md text-sm font-medium">
                Home
              </Link>
              {isAdmin ? (
                <>
                  <Link to="/admin" className="bg-indigo-700 hover:bg-indigo-800 px-3 py-2 rounded-md text-sm font-medium">
                    Admin Panel
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link to="/login" className="bg-white text-indigo-600 hover:bg-indigo-50 px-3 py-2 rounded-md text-sm font-medium">
                  Admin Login
                </Link>
              )}
            </nav>
          </div>
        </header>

        <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Routes>
            <Route path="/" element={<Home courses={courses} />} />
            <Route path="/course/:courseId" element={<CourseView courses={courses} />} />
            <Route path="/course/:courseId/subject/:subjectId" element={<SubjectView courses={courses} />} />
            <Route path="/course/:courseId/subject/:subjectId/chapter/:chapterId" element={<ChapterView courses={courses} />} />
            <Route path="/course/:courseId/subject/:subjectId/chapter/:chapterId/lesson/:lessonId" element={<LessonView courses={courses} />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route
              path="/admin/*"
              element={
                isAdmin ? (
                  <AdminDashboard courses={courses} setCourses={setCourses} />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
          </Routes>
        </main>
        <footer className="bg-gray-800 text-white mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-2">FREE STUDY CAMPUS</h3>
                <p className="text-gray-400 text-sm">
                  Empowering students with free, high-quality educational materials, video lectures, and study notes.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
                <ul className="space-y-1 text-sm text-gray-300">
                  <li>
                    <Link to="/" className="hover:text-white">Home</Link>
                  </li>
                  <li>
                    <a href="https://t.me/freestudycampus" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                      Telegram Channel
                    </a>
                  </li>
                  <li>
                    <Link to="/login" className="hover:text-white">Admin Login</Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Community & Support</h3>
                <p className="text-gray-400 text-sm mb-3">
                  Join our Telegram community for instant updates, new batch alerts, and discussion.
                </p>
                <a
                  href="https://t.me/freestudycampus"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-md shadow-sm"
                >
                  Join Telegram
                </a>
              </div>
            </div>
            <div className="border-t border-gray-700 mt-6 pt-4 text-center text-xs text-gray-400">
              <p>&copy; {new Date().getFullYear()} Free Study Campus. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

// Utility components and layout helpers
export function SectionHeader({ title, subtitle, icon }) {
  return (
    <div className="border-b border-gray-200 pb-4 mb-6">
      <div className="flex items-center space-x-3">
        {icon && <span className="text-2xl">{icon}</span>}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
}

export function EmptyState({ title, description, actionText, onAction }) {
  return (
    <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300 p-6">
      <svg
        className="mx-auto h-12 w-12 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
        />
      </svg>
      <h3 className="mt-2 text-sm font-medium text-gray-900">{title || 'No content found'}</h3>
      <p className="mt-1 text-sm text-gray-500">{description || 'Get started by creating new content.'}</p>
      {actionText && onAction && (
        <div className="mt-6">
          <button
            type="button"
            onClick={onAction}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {actionText}
          </button>
        </div>
      )}
    </div>
  );
}

export function Breadcrumb({ items }) {
  return (
    <nav className="flex mb-4" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        <li className="inline-flex items-center">
          <Link to="/" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-indigo-600">
            Home
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={index}>
            <div className="flex items-center">
              <svg className="w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
              </svg>
              {item.link ? (
                <Link to={item.link} className="ml-1 text-sm font-medium text-gray-700 hover:text-indigo-600 md:ml-2">
                  {item.label}
                </Link>
              ) : (
                <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">{item.label}</span>
              )}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
}
export function Card({ children, className = '', onClick }) {
  return (
    <div 
      onClick={onClick}
      className={`bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </div>
  );
}

export function Badge({ children, type = 'info' }) {
  const styles = {
    info: 'bg-blue-100 text-blue-800 border-blue-200',
    success: 'bg-green-100 text-green-800 border-green-200',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    danger: 'bg-red-100 text-red-800 border-red-200',
    purple: 'bg-purple-100 text-purple-800 border-purple-200'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[type] || styles.info}`}>
      {children}
    </span>
  );
}

export function Button({ children, onClick, type = 'button', variant = 'primary', className = '', disabled = false }) {
  const baseStyle = 'inline-flex items-center justify-center px-4 py-2 border text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-150';
  
  const variants = {
    primary: 'border-transparent text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500',
    secondary: 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-indigo-500',
    danger: 'border-transparent text-white bg-red-600 hover:bg-red-700 focus:ring-red-500',
    outline: 'border-indigo-600 text-indigo-600 bg-transparent hover:bg-indigo-50 focus:ring-indigo-500'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variants[variant] || variants.primary} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {children}
    </button>
  );
}

export function LoadingSpinner({ size = 'medium', message }) {
  const sizeClasses = {
    small: 'w-5 h-5 border-2',
    medium: 'w-8 h-8 border-3',
    large: 'w-12 h-12 border-4'
  };

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <div className={`${sizeClasses[size] || sizeClasses.medium} border-indigo-600 border-t-transparent rounded-full animate-spin mb-2`}></div>
      {message && <p className="text-sm text-gray-500 font-medium">{message}</p>}
    </div>
  );
}

export function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose}></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                {title && <h3 className="text-lg leading-6 font-medium text-gray-900 border-b pb-3 mb-4">{title}</h3>}
                <div className="mt-2">{children}</div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
