import React, { useState } from 'react';
import { db } from '../services/firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { SectionHeader, Card, Button, Modal, Badge } from '../App';

function AdminDashboard({ courses = [], setCourses }) {
  const [activeTab, setActiveTab] = useState('courses');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);

  // Modal states
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [isChapterModalOpen, setIsChapterModalOpen] = useState(false);
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);

  // Form states
  const [courseForm, setCourseForm] = useState({ title: '', category: '', description: '', thumbnail: '', telegramLink: '' });
  const [subjectForm, setSubjectForm] = useState({ title: '', description: '' });
  const [chapterForm, setChapterForm] = useState({ title: '', description: '' });
  const [lessonForm, setLessonForm] = useState({ title: '', description: '', videoUrl: '', pdfUrl: '', telegramUrl: '', duration: '' });

  // Handle Course Add/Edit
  const handleSaveCourse = async (e) => {
    e.preventDefault();
    try {
      if (selectedCourse?.id) {
        const courseRef = doc(db, 'courses', selectedCourse.id);
        await updateDoc(courseRef, courseForm);
        setCourses(courses.map(c => c.id === selectedCourse.id ? { ...c, ...courseForm } : c));
      } else {
        const docRef = await addDoc(collection(db, 'courses'), { ...courseForm, subjects: [] });
        setCourses([...courses, { id: docRef.id, ...courseForm, subjects: [] }]);
      }
      setIsCourseModalOpen(false);
      setCourseForm({ title: '', category: '', description: '', thumbnail: '', telegramLink: '' });
    } catch (error) {
      console.error("Error saving course: ", error);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        await deleteDoc(doc(db, 'courses', courseId));
        setCourses(courses.filter(c => c.id !== courseId));
      } catch (error) {
        console.error("Error deleting course: ", error);
      }
    }
  };

  // Handle Subject Add
  const handleAddSubject = async (e) => {
    e.preventDefault();
    if (!selectedCourse) return;

    const newSubject = {
      id: Date.now().toString(),
      ...subjectForm,
      chapters: []
    };

    const updatedSubjects = [...(selectedCourse.subjects || []), newSubject];
    const updatedCourse = { ...selectedCourse, subjects: updatedSubjects };

    try {
      await updateDoc(doc(db, 'courses', selectedCourse.id), { subjects: updatedSubjects });
      setCourses(courses.map(c => c.id === selectedCourse.id ? updatedCourse : c));
      setSelectedCourse(updatedCourse);
      setIsSubjectModalOpen(false);
      setSubjectForm({ title: '', description: '' });
    } catch (error) {
      console.error("Error adding subject: ", error);
    }
  };

  // Handle Chapter Add
  const handleAddChapter = async (e) => {
    e.preventDefault();
    if (!selectedCourse || !selectedSubject) return;

    const newChapter = {
      id: Date.now().toString(),
      ...chapterForm,
      lessons: []
    };

    const updatedSubjects = selectedCourse.subjects.map(s => {
      if (s.id === selectedSubject.id) {
        return { ...s, chapters: [...(s.chapters || []), newChapter] };
      }
      return s;
    });

    const updatedCourse = { ...selectedCourse, subjects: updatedSubjects };

    try {
      await updateDoc(doc(db, 'courses', selectedCourse.id), { subjects: updatedSubjects });
      setCourses(courses.map(c => c.id === selectedCourse.id ? updatedCourse : c));
      setSelectedCourse(updatedCourse);
      setSelectedSubject(updatedSubjects.find(s => s.id === selectedSubject.id));
      setIsChapterModalOpen(false);
      setChapterForm({ title: '', description: '' });
    } catch (error) {
      console.error("Error adding chapter: ", error);
    }
  };

  // Handle Lesson Add
  const handleAddLesson = async (e) => {
    e.preventDefault();
    if (!selectedCourse || !selectedSubject || !selectedChapter) return;

    const newLesson = {
      id: Date.now().toString(),
      ...lessonForm
    };

    const updatedSubjects = selectedCourse.subjects.map(s => {
      if (s.id === selectedSubject.id) {
        const updatedChapters = s.chapters.map(ch => {
          if (ch.id === selectedChapter.id) {
            return { ...ch, lessons: [...(ch.lessons || []), newLesson] };
          }
          return ch;
        });
        return { ...s, chapters: updatedChapters };
      }
      return s;
    });

    const updatedCourse = { ...selectedCourse, subjects: updatedSubjects };

    try {
      await updateDoc(doc(db, 'courses', selectedCourse.id), { subjects: updatedSubjects });
      setCourses(courses.map(c => c.id === selectedCourse.id ? updatedCourse : c));
      setSelectedCourse(updatedCourse);
      const updatedSub = updatedSubjects.find(s => s.id === selectedSubject.id);
      setSelectedSubject(updatedSub);
      setSelectedChapter(updatedSub.chapters.find(ch => ch.id === selectedChapter.id));
      setIsLessonModalOpen(false);
      setLessonForm({ title: '', description: '', videoUrl: '', pdfUrl: '', telegramUrl: '', duration: '' });
    } catch (error) {
      console.error("Error adding lesson: ", error);
    }
  };

  return (
    <div className="space-y-6">
      <SectionHeader title="Admin Management Panel" subtitle="Manage courses, subjects, chapters, and lessons" />

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('courses')}
          className={`py-2 px-4 font-medium text-sm border-b-2 ${
            activeTab === 'courses' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Courses ({courses.length})
        </button>
      </div>

      {/* Courses Tab Content */}
      {activeTab === 'courses' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">All Courses</h2>
            <Button onClick={() => { setSelectedCourse(null); setCourseForm({ title: '', category: '', description: '', thumbnail: '', telegramLink: '' }); setIsCourseModalOpen(true); }}>
              + Add New Course
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {courses.map(course => (
              <Card key={course.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{course.title}</h3>
                    <p className="text-sm text-gray-500">{course.category} | {course.subjects?.length || 0} Subjects</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="secondary" onClick={() => { setSelectedCourse(course); setCourseForm(course); setIsCourseModalOpen(true); }}>
                      Edit
                    </Button>
                    <Button variant="danger" onClick={() => handleDeleteCourse(course.id)}>
                      Delete
                    </Button>
                  </div>
                </div>

                {/* Sub-management for Subjects */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-gray-700">Subjects</span>
                    <button
                      onClick={() => { setSelectedCourse(course); setIsSubjectModalOpen(true); }}
                      className="text-xs text-indigo-600 font-bold hover:underline"
                    >
                      + Add Subject
                    </button>
                  </div>
                  <div className="space-y-2">
                    {course.subjects?.map(subject => (
                      <div key={subject.id} className="bg-gray-50 p-3 rounded-lg text-sm border border-gray-200">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-gray-800">{subject.title}</span>
                          <button
                            onClick={() => { setSelectedCourse(course); setSelectedSubject(subject); setIsChapterModalOpen(true); }}
                            className="text-xs text-indigo-600 font-bold hover:underline"
                          >
                            + Add Chapter
                          </button>
                        </div>

                        {/* Chapters list */}
                        <div className="pl-4 mt-2 space-y-1">
                          {subject.chapters?.map(chapter => (
                            <div key={chapter.id} className="flex justify-between items-center text-xs bg-white p-2 rounded border border-gray-100">
                              <span>📖 {chapter.title} ({chapter.lessons?.length || 0} Lessons)</span>
                              <button
                                onClick={() => { setSelectedCourse(course); setSelectedSubject(subject); setSelectedChapter(chapter); setIsLessonModalOpen(true); }}
                                className="text-xs text-green-600 font-bold hover:underline"
                              >
                                + Add Lesson
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Course Modal */}
      <Modal isOpen={isCourseModalOpen} onClose={() => setIsCourseModalOpen(false)} title={selectedCourse?.id ? "Edit Course" : "Add Course"}>
        <form onSubmit={handleSaveCourse} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Course Title</label>
            <input type="text" required value={courseForm.title} onChange={e => setCourseForm({...courseForm, title: e.target.value})} className="w-full border p-2 rounded mt-1" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <input type="text" value={courseForm.category} onChange={e => setCourseForm({...courseForm, category: e.target.value})} className="w-full border p-2 rounded mt-1" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea value={courseForm.description} onChange={e => setCourseForm({...courseForm, description: e.target.value})} className="w-full border p-2 rounded mt-1"></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Thumbnail URL</label>
            <input type="text" value={courseForm.thumbnail} onChange={e => setCourseForm({...courseForm, thumbnail: e.target.value})} className="w-full border p-2 rounded mt-1" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Telegram Link</label>
            <input type="text" value={courseForm.telegramLink} onChange={e => setCourseForm({...courseForm, telegramLink: e.target.value})} className="w-full border p-2 rounded mt-1" />
          </div>
          <Button type="submit">Save Course</Button>
        </form>
      </Modal>

      {/* Subject Modal */}
      <Modal isOpen={isSubjectModalOpen} onClose={() => setIsSubjectModalOpen(false)} title="Add Subject">
        <form onSubmit={handleAddSubject} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Subject Title</label>
            <input type="text" required value={subjectForm.title} onChange={e => setSubjectForm({...subjectForm, title: e.target.value})} className="w-full border p-2 rounded mt-1" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea value={subjectForm.description} onChange={e => setSubjectForm({...subjectForm, description: e.target.value})} className="w-full border p-2 rounded mt-1"></textarea>
          </div>
          <Button type="submit">Add Subject</Button>
        </form>
      </Modal>

      {/* Chapter Modal */}
      <Modal isOpen={isChapterModalOpen} onClose={() => setIsChapterModalOpen(false)} title="Add Chapter">
        <form onSubmit={handleAddChapter} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Chapter Title</label>
            <input type="text" required value={chapterForm.title} onChange={e => setChapterForm({...chapterForm, title: e.target.value})} className="w-full border p-2 rounded mt-1" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea value={chapterForm.description} onChange={e => setChapterForm({...chapterForm, description: e.target.value})} className="w-full border p-2 rounded mt-1"></textarea>
          </div>
          <Button type="submit">Add Chapter</Button>
        </form>
      </Modal>

      {/* Lesson Modal */}
      <Modal isOpen={isLessonModalOpen} onClose={() => setIsLessonModalOpen(false)} title="Add Lesson">
        <form onSubmit={handleAddLesson} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Lesson Title</label>
            <input type="text" required value={lessonForm.title} onChange={e => setLessonForm({...lessonForm, title: e.target.value})} className="w-full border p-2 rounded mt-1" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Video Embed / Youtube URL</label>
            <input type="text" value={lessonForm.videoUrl} onChange={e => setLessonForm({...lessonForm, videoUrl: e.target.value})} className="w-full border p-2 rounded mt-1" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">PDF Notes Link</label>
            <input type="text" value={lessonForm.pdfUrl} onChange={e => setLessonForm({...lessonForm, pdfUrl: e.target.value})} className="w-full border p-2 rounded mt-1" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Telegram Discussion Link</label>
            <input type="text" value={lessonForm.telegramUrl} onChange={e => setLessonForm({...lessonForm, telegramUrl: e.target.value})} className="w-full border p-2 rounded mt-1" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Duration (e.g. 45 mins)</label>
            <input type="text" value={lessonForm.duration} onChange={e => setLessonForm({...lessonForm, duration: e.target.value})} className="w-full border p-2 rounded mt-1" />
          </div>
          <Button type="submit">Add Lesson</Button>
        </form>
      </Modal>
    </div>
  );
}

export default AdminDashboard;
