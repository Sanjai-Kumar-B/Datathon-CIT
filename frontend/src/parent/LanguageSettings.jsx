import React, { useState } from 'react';
import ParentLayout from './Layout';

const LanguageSettings = () => {
    const [language, setLanguage] = useState('English');
    const [difficulty, setDifficulty] = useState('Standard');
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        setSaving(true);
        // Simulate Firestore update
        setTimeout(() => {
            setSaving(false);
            alert("Settings saved successfully! Learning path updated.");
        }, 1000);
    };

    const languages = ['English', 'Spanish', 'French', 'Hindi', 'Tamil', 'Mandarin'];

    return (
        <ParentLayout>
            <div className="max-w-4xl mx-auto px-6 py-20 pt-32">
                <header className="mb-12">
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tighter">AI Learning Settings</h2>
                    <p className="text-slate-500 font-bold">Customize how the AI interacts with your child.</p>
                </header>

                <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-10 shadow-2xl space-y-12 border-b-[12px] border-slate-100 dark:border-slate-900">
                    <section>
                        <h3 className="text-xl font-black mb-6 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">child_care</span>
                            Active Child Profile
                        </h3>
                        <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-700 flex items-center gap-4">
                            <div className="size-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-black">AJ</div>
                            <div>
                                <h4 className="font-bold text-slate-900 dark:text-white leading-none">Alex Johnson</h4>
                                <p className="text-xs text-slate-400 mt-1 uppercase font-black tracking-widest">Age 5 • Playgroup</p>
                            </div>
                            <div className="ml-auto">
                                <span className="px-3 py-1 rounded-full bg-green-100 text-green-600 text-[10px] font-black uppercase tracking-widest">Active</span>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h3 className="text-xl font-black mb-6 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">translate</span>
                            Preferred Language
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {languages.map(lang => (
                                <button 
                                    key={lang}
                                    onClick={() => setLanguage(lang)}
                                    className={`py-4 rounded-2xl font-black text-sm transition-all border-b-4 ${
                                        language === lang 
                                        ? 'bg-primary text-white border-primary/20 scale-105' 
                                        : 'bg-slate-50 text-slate-400 border-slate-100 hover:bg-slate-100'
                                    }`}
                                >
                                    {lang}
                                </button>
                            ))}
                        </div>
                        <p className="text-xs text-slate-400 mt-3 italic">* This will auto-translate AI responses to this language.</p>
                    </section>

                    <section>
                        <h3 className="text-xl font-black mb-6 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">psychology</span>
                            Adaptive Difficulty
                        </h3>
                        <div className="flex gap-4 p-2 bg-slate-50 dark:bg-slate-900 rounded-3xl">
                            {['Gentle', 'Standard', 'Advanced'].map(d => (
                                <button 
                                    key={d}
                                    onClick={() => setDifficulty(d)}
                                    className={`flex-1 py-4 rounded-2xl font-black text-sm transition-all ${
                                        difficulty === d 
                                        ? 'bg-white text-primary shadow-lg scale-100' 
                                        : 'bg-transparent text-slate-400 hover:text-slate-600'
                                    }`}
                                >
                                    {d}
                                </button>
                            ))}
                        </div>
                    </section>

                    <button 
                        onClick={handleSave}
                        disabled={saving}
                        className="w-full bg-primary text-white py-6 rounded-3xl font-black uppercase text-xl shadow-xl shadow-primary/20 hover:brightness-110 active:translate-y-1 transition-all disabled:opacity-50"
                    >
                        {saving ? 'Saving Choices...' : 'Save Preferences'}
                    </button>
                </div>
            </div>
        </ParentLayout>
    );
};

export default LanguageSettings;
