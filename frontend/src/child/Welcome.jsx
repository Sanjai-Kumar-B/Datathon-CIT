import React from 'react';
import ChildLayout from './Layout';
import { useNavigate } from 'react-router-dom';

const ChildWelcome = () => {
    const navigate = useNavigate();

    return (
        <ChildLayout>
            <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
                <div className="absolute top-10 left-10 text-[#0ea5e9]">
                    <span className="material-symbols-outlined text-8xl">star</span>
                </div>
                <div className="absolute bottom-20 right-10 text-[#3b82f6]">
                    <span className="material-symbols-outlined text-9xl">rocket_launch</span>
                </div>
                <div className="absolute top-1/2 left-20 text-[#4ade80]">
                    <span className="material-symbols-outlined text-7xl">lightbulb</span>
                </div>
                <div className="absolute bottom-40 left-1/4 text-[#fbbf24]">
                    <span className="material-symbols-outlined text-8xl">school</span>
                </div>
            </div>

            <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center text-center px-4 py-8 justify-center min-h-[70vh]">
                <div className="mb-8 relative">
                    <div className="absolute -inset-4 bg-[#0ea5e9]/20 rounded-full blur-2xl animate-pulse"></div>
                    <div className="relative bg-white dark:bg-slate-800 p-8 rounded-full border-8 border-[#0ea5e9] shadow-2xl">
                        <span className="material-symbols-outlined text-[120px] md:text-[180px] text-[#0ea5e9] leading-none">smart_toy</span>
                    </div>
                    <div className="absolute -top-4 -right-4 bg-[#fbbf24] p-4 rounded-2xl rotate-12 shadow-lg border-4 border-white dark:border-slate-800">
                        <span className="material-symbols-outlined text-4xl text-white">sentiment_very_satisfied</span>
                    </div>
                </div>

                <div className="mb-12 space-y-4">
                    <h1 className="text-slate-900 dark:text-slate-100 text-4xl md:text-6xl font-black leading-tight tracking-tight px-4">
                        Hi! What do you want to <span className="text-[#0ea5e9] underline decoration-8 decoration-[#0ea5e9]/30">learn</span> today?
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-lg md:text-xl font-medium">Pick a mission and start your adventure!</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl px-4">
                    <button 
                        onClick={() => navigate('/child/missions')}
                        className="group flex flex-col items-center justify-center gap-4 bg-[#4ade80] hover:bg-green-500 text-white p-8 rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95 border-b-8 border-green-700"
                    >
                        <span className="material-symbols-outlined text-6xl group-hover:animate-bounce">play_circle</span>
                        <span className="text-2xl font-black uppercase tracking-wider">Start Learning</span>
                    </button>
                    <button 
                        onClick={() => navigate('/child/missions')}
                        className="group flex flex-col items-center justify-center gap-4 bg-[#3b82f6] hover:bg-blue-600 text-white p-8 rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95 border-b-8 border-blue-800"
                    >
                        <span className="material-symbols-outlined text-6xl group-hover:animate-spin">history</span>
                        <span className="text-2xl font-black uppercase tracking-wider">Continue Last</span>
                    </button>
                </div>
            </div>
        </ChildLayout>
    );
};

export default ChildWelcome;
