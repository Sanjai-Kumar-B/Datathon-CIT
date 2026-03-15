import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const TeacherSidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const navItems = [
        { name: 'Dashboard', icon: 'dashboard', path: '/teacher' },
        { name: 'AI Lesson Planner', icon: 'auto_awesome', path: '/teacher/lesson-planner' },
        { name: 'Flashcards', icon: 'style', path: '/teacher/flashcards' },
        { name: 'Video Generator', icon: 'movie', path: '/teacher/video-generator' },
        { name: 'Resources', icon: 'folder_open', path: '/teacher/resources' },
        { name: 'Student Insights', icon: 'analytics', path: '/teacher/insights' },
        { name: 'Parent Communication', icon: 'chat', path: '/teacher/communication' },
    ];

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    return (
        <aside className="w-64 flex-shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-y-auto">
            <div className="flex flex-col h-full p-4 gap-6">
                {/* User Profile */}
                <div className="flex items-center gap-3 px-2 py-4">
                    <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden">
                        <img 
                            alt="Sarah Profile" 
                            className="w-full h-full object-cover" 
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD_mf6uiRIUB_mtHIzngR2H5GOLJ_B6XcXxX59pbi6xYgdI6aFxnPV3C9-7Z50_1WiJNzTLKKd2UkvcI3DrPQ8eoKo-qlgD2jCevSWhWJyJ4mhBeksV71rqRZXn-i2u7G3LpwYXUfx2adCdc5H1tdPEky67yC7LTD5AH9RBtE8hWGbwMg04r4ynRwp42uW8VcxtUa0SyHJ1Ah8iSgRuvqp61Sas5CFWt-dZG1ODwmg9Beu-cfySXw4rgU3Q8SzpNZRz6NRVOLqEMBK1"
                        />
                    </div>
                    <div className="flex flex-col text-slate-900 dark:text-white">
                        <h1 className="text-sm font-semibold leading-none">Sarah</h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Teacher Account</p>
                    </div>
                </div>

                {/* Navigation Links */}
                <nav className="flex flex-col gap-1">
                    {navItems.map((item) => (
                        <button
                            key={item.name}
                            onClick={() => navigate(item.path)}
                            className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-colors ${
                                location.pathname === item.path
                                    ? 'bg-primary text-white shadow-sm shadow-primary/30'
                                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                            }`}
                        >
                            <span className="material-symbols-outlined">{item.icon}</span>
                            <span className="text-sm font-medium">{item.name}</span>
                        </button>
                    ))}
                    
                    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <button className="flex items-center gap-3 px-3 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 w-full text-left font-medium text-sm">
                            <span className="material-symbols-outlined text-sm">settings</span>
                            <span>Settings</span>
                        </button>
                        <button 
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 w-full text-left font-medium text-sm mt-1"
                        >
                            <span className="material-symbols-outlined text-sm">logout</span>
                            <span>Logout</span>
                        </button>
                    </div>
                </nav>
            </div>
        </aside>
    );
};

export default TeacherSidebar;
