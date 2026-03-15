import React, { useState, useEffect } from 'react';
import TeacherLayout from './Layout';
import { getClassProgress } from '../services/api';
import Loader from '../components/Loader';

const StudentInsights = () => {
    const [students, setStudents] = useState([]);
    const [stats, setStats] = useState({ alphabet: 0, logic: 0, geometry: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadAnalytics = async () => {
            try {
                // For demo purposes using a default class ID or teacher's associated class
                const data = await getClassProgress("C_PLAYGROUP_01");
                setStudents(data.students);
                
                // Calculate class averages for summary cards
                let a = 0, l = 0, g = 0, count = data.students.length;
                data.students.forEach(s => {
                    a += s.topic_progress['Alphabet'] || 0;
                    l += s.topic_progress['Numbers'] || 0;
                    g += s.topic_progress['Shapes'] || 0;
                });
                if (count > 0) {
                    setStats({
                        alphabet: Math.round(a / count),
                        logic: Math.round(l / count),
                        geometry: Math.round(g / count)
                    });
                }
            } catch (error) {
                console.error("Error loading insights:", error);
            } finally {
                setLoading(false);
            }
        };
        loadAnalytics();
    }, []);

    if (loading) return <TeacherLayout><Loader message="Analyzing student performance..." /></TeacherLayout>;

    return (
        <TeacherLayout>
            <div className="p-8 max-w-7xl mx-auto w-full">
                <header className="mb-10">
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white">Classroom Insights</h2>
                    <p className="text-slate-500 mt-1">Real-time performance analytics for Class Playgroup A.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-primary/10 shadow-sm">
                        <div className="flex items-center gap-3 mb-4 text-primary">
                            <span className="material-symbols-outlined">spellcheck</span>
                            <p className="text-sm font-bold uppercase tracking-wider">Alphabet Mastery</p>
                        </div>
                        <h3 className="text-4xl font-black">{stats.alphabet}%</h3>
                        <div className="mt-4 h-3 bg-slate-100 dark:bg-slate-700 rounded-full">
                            <div className="h-full bg-primary rounded-full" style={{ width: `${stats.alphabet}%` }}></div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-primary/10 shadow-sm">
                        <div className="flex items-center gap-3 mb-4 text-purple-500">
                            <span className="material-symbols-outlined">calculate</span>
                            <p className="text-sm font-bold uppercase tracking-wider">Numbers & Logic</p>
                        </div>
                        <h3 className="text-4xl font-black">{stats.logic}%</h3>
                        <div className="mt-4 h-3 bg-slate-100 dark:bg-slate-700 rounded-full">
                            <div className="h-full bg-purple-500 rounded-full" style={{ width: `${stats.logic}%` }}></div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-primary/10 shadow-sm">
                        <div className="flex items-center gap-3 mb-4 text-blue-500">
                            <span className="material-symbols-outlined">category</span>
                            <p className="text-sm font-bold uppercase tracking-wider">Shapes & Geometry</p>
                        </div>
                        <h3 className="text-4xl font-black">{stats.geometry}%</h3>
                        <div className="mt-4 h-3 bg-slate-100 dark:bg-slate-700 rounded-full">
                            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${stats.geometry}%` }}></div>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-3xl border border-primary/10 overflow-hidden shadow-sm">
                    <div className="p-8 border-b border-primary/10 flex justify-between items-center">
                        <h3 className="font-bold text-xl text-slate-900 dark:text-white">Individual Progress</h3>
                        <button className="text-primary text-sm font-bold hover:underline">Download Report</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 dark:bg-slate-900 text-slate-400 font-black uppercase text-[10px] tracking-widest">
                                <tr>
                                    <th className="px-8 py-5">Student Name</th>
                                    <th className="px-8 py-5">Topic Proficiency</th>
                                    <th className="px-8 py-5">Engagement</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-primary/5">
                                {students.map((s) => (
                                    <tr key={s.student_id} className="hover:bg-primary/5 transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="size-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                                                    {s.name.charAt(0)}
                                                </div>
                                                <span className="font-bold text-slate-900 dark:text-white">{s.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-wrap gap-2 text-[10px] font-black uppercase">
                                                {Object.entries(s.topic_progress).map(([topic, score]) => (
                                                    <span key={topic} className={`px-2 py-1 rounded-lg ${
                                                        score >= 80 ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'
                                                    }`}>
                                                        {topic}: {score}%
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2">
                                                <div className="flex -space-x-2">
                                                    {[1, 2, 3].map(i => <div key={i} className="size-2 rounded-full bg-green-500"></div>)}
                                                </div>
                                                <span className="text-green-600 font-bold">High</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </TeacherLayout>
    );
};

export default StudentInsights;
