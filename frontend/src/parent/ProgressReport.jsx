import React, { useState, useEffect } from 'react';
import ParentLayout from './Layout';
import { getStudentProgress } from '../services/api';
import Loader from '../components/Loader';

const ProgressReport = () => {
    const [progress, setProgress] = useState({});
    const [completedCount, setCompletedCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProgress = async () => {
            try {
                const studentId = localStorage.getItem("student_id") || "S_TEST_999";
                const data = await getStudentProgress(studentId);
                setProgress(data.progress_summary);
                setCompletedCount(data.completed_activities);
            } catch (error) {
                console.error("Error loading progress:", error);
            } finally {
                setLoading(false);
            }
        };
        loadProgress();
    }, []);

    const calculateOverallMastery = () => {
        const scores = Object.values(progress);
        if (scores.length === 0) return 0;
        const sum = scores.reduce((a, b) => a + b, 0);
        return Math.round(sum / scores.length);
    };

    if (loading) return <ParentLayout><Loader message="Generating Alex's report..." /></ParentLayout>;

    const overall = calculateOverallMastery();

    return (
        <ParentLayout>
            <div className="max-w-5xl mx-auto px-6 py-12">
                <div className="mb-12">
                    <h2 className="text-4xl font-bold tracking-tight mb-2 text-slate-900 dark:text-white">Alex's Learning Journey</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-lg">Detailed progress and mastery report based on real performance.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-2xl shadow-sm text-center">
                        <div className={`size-32 rounded-full flex items-center justify-center mx-auto mb-6 ${overall > 50 ? 'bg-green-50 dark:bg-green-900/20' : 'bg-amber-50 dark:bg-amber-900/20'}`}>
                            <span className={`text-4xl font-black ${overall > 50 ? 'text-green-600' : 'text-amber-600'}`}>{overall}%</span>
                        </div>
                        <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">Overall Mastery</h3>
                        <p className="text-sm text-slate-500">Alex has completed {completedCount} activities so far.</p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-2xl shadow-sm">
                        <h3 className="text-xl font-bold mb-6 text-slate-900 dark:text-white">Topic Performance</h3>
                        <div className="space-y-6">
                            {Object.entries(progress).length > 0 ? (
                                Object.entries(progress).map(([topic, score], idx) => (
                                    <div key={idx}>
                                        <div className="flex justify-between mb-2">
                                            <span className="text-sm font-bold capitalize text-slate-700 dark:text-slate-300">{topic}</span>
                                            <span className="text-sm font-bold text-blue-600">{score}%</span>
                                        </div>
                                        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                                            <div className="bg-blue-500 h-full rounded-full" style={{ width: `${score}%` }}></div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-slate-400 text-sm italic">No topic data available yet.</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-2xl shadow-sm">
                    <h3 className="text-xl font-bold mb-6 text-slate-900 dark:text-white">Recent Milestones</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/30 opacity-50">
                            <span className="material-symbols-outlined text-blue-600 mb-2">auto_awesome</span>
                            <h4 className="font-bold text-blue-900 dark:text-blue-100">Alphabet Hero</h4>
                            <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">Recognized all letters from A to Z.</p>
                        </div>
                        <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-xl border border-green-100 dark:border-green-900/30 opacity-50">
                            <span className="material-symbols-outlined text-green-600 mb-2">calculate</span>
                            <h4 className="font-bold text-green-900 dark:text-green-100">Math Explorer</h4>
                            <p className="text-xs text-green-700 dark:text-green-300 mt-1">Solved 10 addition puzzles today.</p>
                        </div>
                        <div className="p-4 bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-100 dark:border-amber-900/30">
                            <span className="material-symbols-outlined text-amber-600 mb-2">grade</span>
                            <h4 className="font-bold text-amber-900 dark:text-amber-100">Starter Achievement</h4>
                            <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">Successfully connected to the companion ecosystem!</p>
                        </div>
                    </div>
                </div>
            </div>
        </ParentLayout>
    );
};

export default ProgressReport;
