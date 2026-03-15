import React from 'react';
import TeacherSidebar from './Sidebar';

const TeacherLayout = ({ children }) => {
    return (
        <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 font-display">
            <TeacherSidebar />
            <main className="flex-1 overflow-y-auto">
                {children}
            </main>
        </div>
    );
};

export default TeacherLayout;
