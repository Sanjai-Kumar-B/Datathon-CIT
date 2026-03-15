import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ChildLayout from './Layout';
import { getRecommendations } from '../services/api';
import RecommendationCard from './RecommendationCard';

const MissionCompleted = () => {
    const navigate = useNavigate();
    const [recommendation, setRecommendation] = useState(null);
    const studentId = localStorage.getItem("user_id") || "S_CHILD_01";

    useEffect(() => {
        const fetchRec = async () => {
            try {
                const data = await getRecommendations(studentId);
                if (data && data.length > 0) {
                    setRecommendation(data[0]);
                }
            } catch (error) {
                console.error("Rec Error:", error);
            }
        };
        fetchRec();
    }, [studentId]);

    return (
        <ChildLayout>
            <div className="flex flex-1 flex-col items-center justify-center px-6 py-20 text-center min-h-screen pt-32">
                <div className="mb-12 relative">
                    <div className="absolute -inset-8 bg-[#4ade80]/20 rounded-full blur-3xl animate-pulse"></div>
                    <div className="relative bg-white dark:bg-slate-800 size-48 rounded-[3rem] border-b-[16px] border-[#4ade80] shadow-2xl flex items-center justify-center">
                        <span className="material-symbols-outlined text-[100px] text-[#4ade80] animate-bounce">emoji_events</span>
                    </div>
                </div>

                <h1 className="text-slate-900 dark:text-white text-6xl font-black mb-4 tracking-tighter uppercase">
                    Master Voyager! 🚀
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-xl font-bold mb-16 max-w-xl">
                    You've crushed this mission. Collecting your stars now! ⭐⭐⭐
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center w-full max-w-5xl">
                    <div className="flex flex-col gap-6">
                        <button 
                            onClick={() => navigate('/child/missions')}
                            className="bg-primary text-white py-8 rounded-[2.5rem] text-3xl font-black uppercase tracking-widest shadow-2xl hover:brightness-110 transition-all border-b-[12px] border-primary/20 active:translate-y-2 active:border-b-0"
                        >
                            Next Mission
                        </button>
                        <button 
                            onClick={() => navigate('/child')}
                            className="text-slate-400 font-black hover:text-primary transition-colors uppercase tracking-widest text-sm"
                        >
                            Back to my ship
                        </button>
                    </div>

                    <div className="flex justify-center">
                        {recommendation && <RecommendationCard recommendation={recommendation} />}
                    </div>
                </div>
                
                {/* Confetti-like decoration or icons */}
                <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-10">
                    <span className="material-symbols-outlined absolute top-20 left-20 text-[#4ade80] text-[150px] rotate-12">star</span>
                    <span className="material-symbols-outlined absolute top-40 right-40 text-[#4ade80] text-9xl -rotate-12">auto_awesome</span>
                    <span className="material-symbols-outlined absolute bottom-40 left-1/4 text-primary text-[200px] rotate-45">verified</span>
                </div>
            </div>
        </ChildLayout>
    );
};

export default MissionCompleted;
