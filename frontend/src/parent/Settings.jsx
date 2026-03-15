import React from 'react';
import ParentLayout from './Layout';

const ParentSettings = () => {
    return (
        <ParentLayout>
            <div className="p-8 max-w-2xl mx-auto w-full">
                <h2 className="text-3xl font-black mb-8 text-slate-900 dark:text-white">Parent Settings</h2>
                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                    <p className="text-slate-500 dark:text-slate-400">Configure your parent dashboard preferences and child profiles.</p>
                    <div className="py-4 border-t border-slate-100 dark:border-slate-800">
                        <h4 className="font-bold text-slate-900 dark:text-white">Child Profiles</h4>
                        <div className="mt-2 text-sm text-[#ec5b13] font-medium">Alex (Playgroup) - Active</div>
                    </div>
                </div>
            </div>
        </ParentLayout>
    );
};

export default ParentSettings;
