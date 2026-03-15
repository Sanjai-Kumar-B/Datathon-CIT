import React from 'react';
import ParentLayout from './Layout';

const ParentActivities = () => {
    const activities = [
        { title: 'Alphabet Recognition', type: 'Flashcards', status: 'In Progress' },
        { title: 'Counting 1-10', type: 'Video', status: 'Completed' },
        { title: 'Animal Sound identification', type: 'Rhyme', status: 'Not Started' },
    ];

    return (
        <ParentLayout>
            <div className="p-8 max-w-4xl mx-auto w-full">
                <h2 className="text-3xl font-black mb-8 text-slate-900 dark:text-white">Child Activities</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {activities.map((act, i) => (
                        <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                            <div>
                                <h4 className="font-bold text-slate-900 dark:text-white">{act.title}</h4>
                                <p className="text-xs text-slate-500">{act.type}</p>
                            </div>
                            <span className="text-xs font-bold px-3 py-1 bg-primary/10 text-primary rounded-full">{act.status}</span>
                        </div>
                    ))}
                </div>
            </div>
        </ParentLayout>
    );
};

export default ParentActivities;
