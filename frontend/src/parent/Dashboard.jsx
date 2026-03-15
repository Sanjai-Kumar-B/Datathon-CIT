import React, { useState, useEffect } from 'react';
import ParentLayout from './Layout';
import { useNavigate } from 'react-router-dom';
import { getStudentProgress, getRecommendations, getStudentFeed } from '../services/api';
import Loader from '../components/Loader';

const ParentDashboard = () => {
    const navigate = useNavigate();
    const [progress, setProgress] = useState({});
    const [completedCount, setCompletedCount] = useState(0);
    const [recs, setRecs] = useState([]);
    const [recentActivities, setRecentActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const userRole = localStorage.getItem("user_role");
    const demoStudentId = userRole === 'parent' ? "S_CHILD_01" : localStorage.getItem("user_id") || "S_CHILD_01";
    const studentId = demoStudentId;

    useEffect(() => {
        const loadData = async () => {
            try {
                const [progData, recData, feedData] = await Promise.all([
                    getStudentProgress(studentId),
                    getRecommendations(studentId),
                    getStudentFeed(studentId)
                ]);
                setProgress(progData.progress_summary || {});
                setCompletedCount(progData.completed_activities || 0);
                
                // Handle single recommendation object by wrapping it in an array
                setRecs(recData ? [recData] : []);
                
                // Access 'activities' array from feed response
                const activities = feedData.activities || [];
                setRecentActivities(activities.filter(m => m.status === 'completed').slice(0, 3));
            } catch (error) {
                console.error("Error loading parent data:", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [studentId]);

    return (
        <ParentLayout>
            <div className="max-w-6xl w-full mx-auto px-6 py-12 pt-24">
                <header className="mb-12 flex items-end justify-between">
                    <div>
                        <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-2">Hello, Parent! 👋</h2>
                        <p className="text-slate-500 font-bold">Here is your child's learning journey at a glance.</p>
                    </div>
                    <div className="hidden md:block text-right">
                        <p className="text-[10px] font-black uppercase tracking-tighter text-slate-400">Reporting for</p>
                        <p className="font-bold text-slate-900 dark:text-white underline decoration-primary decoration-4 underline-offset-4">Alex Johnson</p>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                    {/* Insights Card */}
                    <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-xl border-b-8 border-slate-100 dark:border-slate-700">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-black flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">monitoring</span>
                                Skill Mastery
                            </h3>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {Object.entries(progress).length > 0 ? Object.entries(progress).map(([topic, score]) => (
                                <div key={topic} className="space-y-3">
                                    <div className="flex justify-between items-end">
                                        <span className="font-bold text-sm uppercase tracking-widest text-slate-400">{topic}</span>
                                        <span className="font-black text-primary">{score}%</span>
                                    </div>
                                    <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded-full">
                                        <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${score}%` }}></div>
                                    </div>
                                </div>
                            )) : (
                                <div className="col-span-2 py-10 text-center bg-slate-50 dark:bg-slate-900 rounded-3xl border-2 border-dashed border-slate-200">
                                    <p className="text-slate-400 font-bold uppercase tracking-widest">No activities completed yet</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* AI Assistant Hook */}
                    <div className="bg-primary p-8 rounded-[2.5rem] text-white flex flex-col justify-between shadow-xl shadow-primary/20 relative overflow-hidden group">
                        <div className="absolute -right-4 -top-4 size-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                        <div className="relative z-10">
                            <span className="material-symbols-outlined text-4xl mb-4">smart_toy</span>
                            <h3 className="text-2xl font-black mb-4 leading-tight">Need help with home learning?</h3>
                            <p className="font-medium text-white/80 leading-relaxed mb-6 italic">"How can I help my child learn persistence through games?"</p>
                        </div>
                        <button 
                            onClick={() => navigate('/parent/assistant')}
                            className="relative z-10 bg-white text-primary py-4 rounded-2xl font-black uppercase text-sm hover:bg-slate-50 transition-colors shadow-lg"
                        >
                            Ask AI Assistant ➝
                        </button>
                    </div>
                </div>

                {/* Recent Activities Section - Notion Style */}
                <section className="mb-16">
                    <h3 className="text-xl font-black mb-6 flex items-center gap-3 text-slate-900 dark:text-white">
                        <span className="material-symbols-outlined text-primary">history</span>
                        Recent Successes
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {recentActivities.map((activity, idx) => (
                            <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl flex items-start gap-4 hover:border-primary/50 transition-colors">
                                <div className="size-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-primary shrink-0">
                                    <span className="material-symbols-outlined text-xl">
                                        {activity.activity_type === 'video' ? 'movie' : 'style'}
                                    </span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate max-w-[150px]">
                                        {activity.activity_details?.topic || activity.activity_type}
                                    </h4>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">
                                        Completed {new Date(activity.completed_at || activity.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        ))}
                        {recentActivities.length === 0 && (
                            <div className="col-span-3 py-6 px-8 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-center">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">New achievements will appear here soon!</p>
                            </div>
                        )}
                    </div>
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Recommendations */}
                    <section>
                        <h3 className="text-2xl font-black mb-8 flex items-center gap-3">
                            <span className="material-symbols-outlined text-primary">auto_awesome</span>
                            Next Recommended Steps
                        </h3>
                        <div className="space-y-4">
                            {recs.map((rec, idx) => (
                                <div key={idx} className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] shadow-md border-b-4 border-slate-100 dark:border-slate-700 flex items-center gap-6 group hover:translate-x-2 transition-all">
                                    <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                        <span className="material-symbols-outlined text-3xl">play_lesson</span>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-black text-lg text-slate-900 dark:text-white">
                                            {rec.activity || "Recommended Activity"}
                                        </h4>
                                        <p className="text-slate-500 font-medium text-sm">{rec.reason}</p>
                                    </div>
                                </div>
                            ))}
                            {recs.length === 0 && <p className="text-slate-400 font-bold">More suggestions coming as your child learns!</p>}
                        </div>
                    </section>

                    {/* Quick Stats */}
                    <section>
                        <h3 className="text-2xl font-black mb-8 flex items-center gap-3">
                            <span className="material-symbols-outlined text-primary">bolt</span>
                            Quick Stats
                        </h3>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="bg-slate-900 text-white p-6 rounded-3xl text-center">
                                <h4 className="text-4xl font-black mb-1">{completedCount}</h4>
                                <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Missions Done</p>
                            </div>
                            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl text-center shadow-md border-b-4 border-slate-100 dark:border-slate-700">
                                <h4 className="text-4xl font-black mb-1 text-primary">85%</h4>
                                <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Efficiency</p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </ParentLayout>
    );
};

export default ParentDashboard;
