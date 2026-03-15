import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ChildLayout from './Layout';
import { getStudentFeed } from '../services/api';
import Loader from '../components/Loader';

const MissionFeed = () => {
    const navigate = useNavigate();
    const [missions, setMissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const studentId = localStorage.getItem("user_id") || "S_CHILD_01"; // Fallback for demo

    useEffect(() => {
        const fetchFeed = async () => {
            try {
                const data = await getStudentFeed(studentId);
                setMissions(data);
            } catch (error) {
                console.error("Feed Error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchFeed();
    }, [studentId]);

    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD'];

    return (
        <ChildLayout>
            <div className="p-8 max-w-6xl mx-auto pt-24">
                <header className="mb-12 text-center">
                    <h1 className="text-5xl font-black text-slate-900 dark:text-white mb-4">Hello, Explorer! 🚀</h1>
                    <p className="text-xl text-slate-500 font-bold">Ready for your missions today?</p>
                </header>

                {loading ? (
                    <div className="flex justify-center py-20"><Loader message="Finding your daily missions..." /></div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {missions.length > 0 ? missions.map((m, idx) => (
                            <div 
                                key={m.id} 
                                onClick={() => navigate(`/child/mission/${m.id}`)}
                                className="group relative bg-white dark:bg-slate-800 rounded-[3rem] p-8 shadow-xl hover:shadow-2xl transition-all cursor-pointer overflow-hidden border-b-[12px] active:translate-y-2 active:border-b-0"
                                style={{ borderColor: colors[idx % colors.length] }}
                            >
                                <div className="size-20 rounded-3xl mb-6 flex items-center justify-center text-4xl shadow-lg" style={{ background: colors[idx % colors.length] + '20' }}>
                                    <span className="group-hover:scale-125 transition-transform duration-300">
                                        {m.type === 'Flashcards' ? '🎴' : '📺'}
                                    </span>
                                </div>
                                <h3 className="text-2xl font-black mb-2 text-slate-900 dark:text-white">{m.title}</h3>
                                <p className="text-slate-500 font-bold mb-6 italic">"A fun {m.type.toLowerCase()} mission just for you!"</p>
                                <div className="flex items-center gap-2 text-primary font-black uppercase text-xs tracking-widest">
                                    <span>Let's Go</span>
                                    <span className="material-symbols-outlined">arrow_forward_ios</span>
                                </div>
                            </div>
                        )) : (
                            <div className="col-span-full text-center py-20 bg-white/50 dark:bg-white/5 rounded-[3rem] border-4 border-dashed border-slate-200">
                                <p className="text-2xl font-black text-slate-400">All missions completed for today! 🎉</p>
                                <button onClick={() => navigate('/child/missions')} className="mt-6 px-10 py-4 bg-primary text-white rounded-[2rem] font-black text-xl shadow-xl shadow-primary/20">Find More</button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </ChildLayout>
    );
};

export default MissionFeed;
