import React, { useState, useEffect } from 'react';
import ChildLayout from './Layout';
import { getStudentFeed } from '../services/api';
import Loader from '../components/Loader';

const TopicSelection = () => {
    const [missions, setMissions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMissions = async () => {
            try {
                const studentId = localStorage.getItem("student_id") || "S_TEST_999";
                const data = await getStudentFeed(studentId);
                setMissions(data);
            } catch (error) {
                console.error("Error fetching missions:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMissions();
    }, []);

    return (
        <ChildLayout>
            <div className="flex flex-1 flex-col items-center px-6 py-8 md:px-20 lg:px-40">
                {/* Profile & Welcome Section */}
                <div className="mb-10 flex w-full max-w-3xl items-center gap-4">
                    <div className="h-16 w-16 overflow-hidden rounded-full border-4 border-[#0ea5e9] bg-[#0ea5e9]/20 shadow-lg">
                        <img 
                            alt="Child profile avatar" 
                            className="h-full w-full object-cover" 
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAmbdt910wtJm-da-HBjV8EnuS6AtD1lTvB1b678WNdYUX1T9t9lAqUEw6ALVcXIJgiqMLlJ4fbsSPP_1HO7-GiYBhAIMlLMmD-E4BSt2pzWuRbC_VS2CmBOBdAtFCmwp8x6vkJzA95PWzLolaDQnepmvjlH1nynwPKDvaL9dy5GX1fxVVLMzIRUsELX9IkptEsmEAo_iuVnXsxCqaw9MIyvMK87L2d1k8-JGTc5Mg_OLXopm7bq9mNNMBoEWUbolgT6mM_0YIQrVJj"
                        />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 dark:text-white">Hi, Little Explorer!</h1>
                        <p className="text-slate-500 dark:text-slate-400 font-medium">Ready for your missions today?</p>
                    </div>
                </div>

                {/* Learning Mode Selection Area */}
                <div className="flex w-full max-w-3xl flex-col gap-6">
                    <div className="mb-2">
                        <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white uppercase">Your Adventures</h2>
                        <p className="text-slate-500 dark:text-slate-400">Pick a mission from your teacher</p>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-10">
                            <Loader message="Loading missions..." />
                        </div>
                    ) : (
                        <div className="flex flex-col gap-5">
                            {missions.length > 0 ? (
                                missions.map((mission) => (
                                    <button 
                                        key={mission.id}
                                        onClick={() => navigate(`/child/mission/${mission.id}`)}
                                        className="group flex w-full items-center gap-6 rounded-3xl bg-white dark:bg-slate-800 p-6 shadow-sm ring-1 ring-slate-200 dark:ring-primary/20 transition-all hover:-translate-y-1 hover:shadow-xl active:scale-95"
                                    >
                                        <div className={`flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-2xl ${
                                            mission.activity_type === 'flashcards' ? 'bg-amber-100 text-amber-500' : 'bg-sky-100 text-sky-500'
                                        }`}>
                                            <span className="material-symbols-outlined text-5xl">
                                                {mission.activity_type === 'flashcards' ? 'style' : 'smart_display'}
                                            </span>
                                        </div>
                                        <div className="flex flex-col text-left">
                                            <span className="text-2xl font-black text-slate-900 dark:text-white">
                                                {mission.content.topic || 'New Activity'}
                                            </span>
                                            <p className="text-slate-500 dark:text-slate-400 font-medium uppercase text-sm">
                                                {mission.activity_type}
                                            </p>
                                        </div>
                                        <div className="ml-auto hidden sm:block">
                                            <span className="material-symbols-outlined text-slate-300 group-hover:text-[#0ea5e9] group-hover:translate-x-1 transition-all">chevron_right</span>
                                        </div>
                                    </button>
                                ))
                            ) : (
                                <div className="p-10 bg-white dark:bg-slate-800 rounded-3xl text-center border-2 border-dashed border-slate-200 dark:border-slate-700">
                                    <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">info</span>
                                    <p className="text-slate-500 font-bold uppercase tracking-widest">No missions yet. Ask your teacher!</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer Stats/Progress */}
                <div className="mt-12 flex w-full max-w-3xl items-center justify-between rounded-2xl bg-white dark:bg-white/5 p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600">
                            <span className="material-symbols-outlined">trending_up</span>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest leading-none">Your Progress</p>
                            <p className="text-sm font-black text-slate-900 dark:text-white leading-tight">Level 5: Explorer</p>
                        </div>
                    </div>
                    <div className="h-2 flex-1 mx-6 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
                        <div className="h-full bg-[#0ea5e9] rounded-full w-[65%] shadow-[0_0_10px_rgba(14,165,233,0.5)]"></div>
                    </div>
                    <button className="text-sm font-bold text-[#0ea5e9] hover:underline">View Roadmap</button>
                </div>
            </div>
            {/* Decorative Elements */}
            <div className="fixed bottom-0 left-0 -z-10 h-64 w-64 translate-x-[-20%] translate-y-[20%] rounded-full bg-[#0ea5e9]/10 blur-3xl"></div>
            <div className="fixed top-0 right-0 -z-10 h-96 w-96 translate-x-[20%] translate-y-[-20%] rounded-full bg-[#0ea5e9]/20 blur-3xl"></div>
        </ChildLayout>
    );
};

export default TopicSelection;
