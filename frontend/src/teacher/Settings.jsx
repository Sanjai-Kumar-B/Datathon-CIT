import React, { useState } from 'react';
import TeacherLayout from './Layout';

const TeacherSettings = () => {
    const [profile, setProfile] = useState({
        name: 'Sarah',
        email: 'sarah@example.com',
        school: 'Greenwood Preschool',
        language: 'English'
    });

    return (
        <TeacherLayout>
            <div className="p-8 max-w-2xl mx-auto w-full">
                <h2 className="text-3xl font-black mb-8 text-slate-900 dark:text-white">Account Settings</h2>
                
                <div className="space-y-6">
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white">Profile Information</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase">Name</label>
                                <input 
                                    type="text" 
                                    value={profile.name} 
                                    className="w-full mt-1 p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase">Email</label>
                                <input 
                                    type="email" 
                                    value={profile.email} 
                                    className="w-full mt-1 p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                                    readOnly
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm text-center">
                        <button className="w-full py-3 bg-primary text-white rounded-lg font-bold shadow-lg hover:brightness-110 transition-all">
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </TeacherLayout>
    );
};

export default TeacherSettings;
