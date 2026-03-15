import React, { useState, useEffect } from 'react';
import TeacherLayout from './Layout';
import { useNavigate } from 'react-router-dom';
import { getClassProgress } from '../services/api';
import Loader from '../components/Loader';

const TeacherDashboard = () => {
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const loadAnalytics = async () => {
            try {
                // In a real app, teachers would belong to classes. For now, we'll stick to a default class for this teacher.
                const teacherId = localStorage.getItem("user_id");
                const classId = "C_PLAYGROUP_01"; 
                const data = await getClassProgress(classId);
                setStudents(data.students);
            } catch (error) {
                console.error("Error loading class analytics:", error);
            } finally {
                setLoading(false);
            }
        };
        loadAnalytics();
    }, []);

    // Summary metrics derived from analytics if available
    const metrics = [
        { label: 'Total Students', value: students.length.toString(), change: 'Active', icon: 'groups', color: 'primary' },
        { label: 'Completed Tasks', value: students.reduce((acc, s) => acc + Object.keys(s.topic_progress).length, 0).toString(), change: '+5 today', icon: 'task_alt', color: 'secondary' },
        { label: 'Avg Mastery', value: students.length > 0 ? (Math.round(students.reduce((acc, s) => {
            const scores = Object.values(s.topic_progress);
            return acc + (scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0);
        }, 0) / students.length)) + '%' : '0%', change: 'Class average', icon: 'trending_up', color: 'primary' },
        { label: 'AI Assistance', value: 'Enabled', change: 'Gemini 1.5 Pro', icon: 'psychology', color: 'secondary' },
    ];

    const suggestedTopics = [
        { id: '123', topic: 'Numbers 1-10', subject: 'Math Fundamentals', icon: 'numbers' },
        { id: 'category', topic: 'Shapes', subject: 'Geometry Basics', icon: 'category' },
        { id: 'palette', topic: 'Colors', subject: 'Visual Arts', icon: 'palette' },
    ];

    if (loading) return <TeacherLayout><Loader message="Loading class performance..." /></TeacherLayout>;

    return (
        <TeacherLayout>
            <div className="p-8 max-w-[1200px] mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Good morning, Sarah!</h2>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">Here's how your Playgroup class is performing today.</p>
                    </div>
                </div>

                {/* Metric Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {metrics.map((m, idx) => (
                        <div key={idx} className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{m.label}</p>
                                <span className={`material-symbols-outlined text-${m.color}`}>{m.icon}</span>
                            </div>
                            <p className="text-3xl font-bold text-slate-900 dark:text-slate-50">{m.value}</p>
                            <p className="text-xs mt-2 flex items-center gap-1 font-medium text-slate-400">
                                {m.change}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Quick Actions */}
                <div className="mb-8">
                    <h3 className="text-lg font-bold mb-4 text-slate-900 dark:text-white">Quick Actions</h3>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <button 
                            onClick={() => navigate('/teacher/lesson-planner')}
                            className="flex items-center justify-center flex-col gap-2 p-4 bg-primary/10 border border-primary/20 rounded-xl hover:bg-primary/20 transition-all text-primary"
                        >
                            <span className="material-symbols-outlined text-[32px]">add_box</span>
                            <span className="text-sm font-bold">New Lesson</span>
                        </button>
                        <button 
                            onClick={() => navigate('/teacher/flashcards')}
                            className="flex items-center justify-center flex-col gap-2 p-4 bg-secondary/10 border border-secondary/20 rounded-xl hover:bg-secondary/20 transition-all text-secondary"
                        >
                            <span className="material-symbols-outlined text-[32px]">flash_on</span>
                            <span className="text-sm font-bold">Generate Flashcards</span>
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent Performance Table */}
                    <div className="lg:col-span-2">
                        <h3 className="text-lg font-bold mb-4 text-slate-900 dark:text-white">Student Progress</h3>
                        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                                        <tr>
                                            <th className="px-6 py-4 font-semibold text-slate-900 dark:text-white">Student Name</th>
                                            <th className="px-6 py-4 font-semibold text-slate-900 dark:text-white">Top Subjects</th>
                                            <th className="px-6 py-4 font-semibold text-slate-900 dark:text-white">Status</th>
                                            <th className="px-6 py-4 font-semibold text-right text-slate-900 dark:text-white">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {students.length > 0 ? students.map((s) => (
                                            <tr key={s.student_id} className="hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="size-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-xs font-bold">{s.name.charAt(0)}</div>
                                                        <span className="font-medium text-slate-900 dark:text-white">{s.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex gap-1 flex-wrap">
                                                        {Object.keys(s.topic_progress).length > 0 ? Object.keys(s.topic_progress).slice(0, 2).map((t, i) => (
                                                            <span key={i} className="px-2 py-0.5 bg-primary/5 text-primary text-[10px] uppercase font-black rounded-lg">{t}</span>
                                                        )) : <span className="text-slate-400 italic">No data</span>}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 capitalize`}>
                                                        Active
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button className="text-primary hover:text-primary/80 font-medium text-xs">Full Details</button>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan="4" className="px-6 py-12 text-center text-slate-400 italic">No students found in this class yet.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <h3 className="text-lg font-bold mb-4 text-slate-900 dark:text-white">AI Pedagogical Tips</h3>
                        <div className="p-6 bg-primary/5 rounded-2xl border border-primary/20">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="material-symbols-outlined text-primary">psychology</span>
                                <h4 className="font-bold text-primary">Class Insights</h4>
                            </div>
                            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-4 italic">
                                "The class is excelling at Literacy but requires more hands-on activities for Numeracy basics. Group-based counting games are recommended for next week."
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </TeacherLayout>
    );
};

export default TeacherDashboard;
