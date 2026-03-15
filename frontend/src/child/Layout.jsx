import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const ChildLayout = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-[#f0f9ff] dark:bg-[#0c4a6e] font-display antialiased">
            <header className="flex items-center justify-between whitespace-nowrap px-6 py-4 md:px-10 lg:px-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
                    <div className="flex items-center justify-center p-2 bg-[#0ea5e9] rounded-xl text-white">
                        <span className="material-symbols-outlined text-2xl">smart_toy</span>
                    </div>
                    <h2 className="text-slate-900 dark:text-slate-100 text-xl font-black leading-tight tracking-tight uppercase">AI Companion</h2>
                </div>
                <div className="flex flex-1 justify-end gap-4 items-center">
                    <div className="hidden md:flex flex-col items-end mr-2 text-slate-900 dark:text-white">
                        <span className="text-xs font-bold text-slate-500 uppercase">Explorer</span>
                        <span className="text-sm font-black text-[#0ea5e9]">Level 12</span>
                    </div>
                    <div className="bg-[#0ea5e9]/10 p-1 rounded-full border-2 border-[#0ea5e9]/20">
                        <div 
                            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10" 
                            style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCOph0prLJBcpcxv4jQWc1PYbKhjGOG9qfVOjKofyX8uWGfs-wSNMJ2WJL7EeqB_3-5wnqugnr7vlOw1Iq8pRLvdqBNp0qSyo7b4RNyLTGK-yEF0HHYDmQTGaZznHMR26y0_Mx53AVwe-TfBL3u4wOypXkxeaKlIlms3fRqcB7ZVnslvO1EAh-lXEOEYc5mtlHpyidzdLNZLLsGbkgEurIecCBJVl5HpCg5QMgbjx9RRsWqruzcpQkX39iVooHcP0i8Ich_f-bRiMqX')" }}
                        ></div>
                    </div>
                </div>
            </header>

            <main className="flex-1 flex flex-col relative overflow-hidden">
                {children}
            </main>

            <nav className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-6 py-4 flex justify-around items-center sticky bottom-0 z-50">
                <button 
                    onClick={() => navigate('/child')}
                    className={`flex flex-col items-center gap-1 ${location.pathname === '/child' ? 'text-[#0ea5e9]' : 'text-slate-400'}`}
                >
                    <span className="material-symbols-outlined text-2xl">home</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest">Home</span>
                </button>
                <button className="flex flex-col items-center gap-1 text-slate-400 hover:text-[#0ea5e9] transition-colors">
                    <span className="material-symbols-outlined text-2xl">menu_book</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest">Library</span>
                </button>
                <button className="flex flex-col items-center gap-1 text-slate-400 hover:text-[#0ea5e9] transition-colors">
                    <span className="material-symbols-outlined text-2xl">workspace_premium</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest">Badges</span>
                </button>
                <button className="flex flex-col items-center gap-1 text-slate-400 hover:text-[#0ea5e9] transition-colors">
                    <span className="material-symbols-outlined text-2xl">settings</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest">Settings</span>
                </button>
            </nav>
        </div>
    );
};

export default ChildLayout;
