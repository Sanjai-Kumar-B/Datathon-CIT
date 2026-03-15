import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const ParentLayout = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const navItems = [
        { name: 'Home', path: '/parent' },
        { name: 'AI Assistant', path: '/parent/assistant' },
        { name: 'Settings', path: '/parent/settings' },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark antialiased">
            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-50 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
                <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
                        <div className="bg-[#ec5b13] p-1.5 rounded-lg flex items-center justify-center">
                            <span className="material-symbols-outlined text-white text-xl">school</span>
                        </div>
                        <h1 className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">AI Learning</h1>
                    </div>
                    <nav className="hidden md:flex items-center gap-8">
                        {navItems.map((item) => (
                            <button
                                key={item.name}
                                onClick={() => navigate(item.path)}
                                className={`text-sm font-medium transition-colors ${
                                    location.pathname === item.path
                                        ? 'text-[#ec5b13]'
                                        : 'text-slate-500 dark:text-slate-400 hover:text-[#ec5b13]'
                                }`}
                            >
                                {item.name}
                            </button>
                        ))}
                    </nav>
                    <div className="flex items-center gap-4">
                        <button className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                            <span className="material-symbols-outlined">notifications</span>
                        </button>
                        <div 
                            className="size-9 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden border border-slate-200 dark:border-slate-800 bg-cover bg-center" 
                            style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDf9QqhLE3Disc3p4ugMg86H5KqGgtZcdI9WvNn8bVNbqM-QV4jt2MJzC_m16aL0GDs5FcKWeA9WnfN6LIpuQd0wSseRN8EESYWX9QYraZgpn2F2Tct4LrZZndMK2xHtBhDA6mI9mOoSvcHqjy1aglwtOZkGE5CTIpxH67DA6x0z0eP6hmObSTFCDuGIJ-0egOZV_GArghpgvzLUZGH3uKrphuVDdCeuHIajsLJWK3rA1TB_rLykq2_FeUWesmJyl9sRQ0Bw9x_bXjs')" }}
                        >
                        </div>
                    </div>
                </div>
            </header>
            
            <main className="flex-1">
                {children}
            </main>

            <footer className="mt-auto py-12 border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-background-dark/50">
                <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2 opacity-50">
                        <span className="material-symbols-outlined text-slate-900 dark:text-white">school</span>
                        <span className="text-sm font-medium text-slate-900 dark:text-white">AI Learning Companion © 2024</span>
                    </div>
                    <div className="flex gap-8">
                        <a className="text-sm text-slate-400 hover:text-slate-600" href="#">Privacy Policy</a>
                        <a className="text-sm text-slate-400 hover:text-slate-600" href="#">Parental Controls</a>
                        <a className="text-sm text-slate-400 hover:text-slate-600" href="#">Help Center</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default ParentLayout;
