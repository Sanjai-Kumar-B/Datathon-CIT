import React, { useState } from 'react';
import TeacherLayout from './Layout';
import { teacherService } from '../services/api';

const ParentCommunication = () => {
    const [message, setMessage] = useState('');
    const [language, setLanguage] = useState('Tamil');
    const [translation, setTranslation] = useState('');
    const [loading, setLoading] = useState(false);

    const languages = ['Tamil', 'Hindi', 'Telugu', 'Malayalam', 'Kannada'];

    const handleTranslate = async () => {
        if (!message) return;
        setLoading(true);
        try {
            const result = await teacherService.translateText(message, language);
            setTranslation(result.translated_text);
        } catch (error) {
            console.error("Translation error:", error);
            // Fallback for demo
            setTranslation("अன்புள்ள பெற்றோர்களே, (Mock Translation)");
        } finally {
            setLoading(false);
        }
    };

    return (
        <TeacherLayout>
            <div className="p-8 max-w-5xl mx-auto space-y-8">
                <div className="space-y-2">
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Bridge the Language Gap</h1>
                    <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
                        Translate classroom updates instantly to ensure every parent stays informed.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                        <h3 className="font-bold text-lg text-slate-900 dark:text-white">Message Content</h3>
                        <textarea 
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="w-full min-h-[200px] p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-primary/50 text-slate-800 dark:text-white"
                            placeholder="Dear Parents, we are planning a field trip..."
                        />
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase">Target Language</label>
                            <div className="grid grid-cols-2 gap-2">
                                {languages.map((lang) => (
                                    <button 
                                        key={lang}
                                        onClick={() => setLanguage(lang)}
                                        className={`py-2 px-3 rounded-lg border font-medium text-sm transition-all ${
                                            language === lang 
                                            ? 'border-primary bg-primary/10 text-primary font-bold' 
                                            : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                                        }`}
                                    >
                                        {lang}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <button 
                            onClick={handleTranslate}
                            disabled={loading}
                            className="w-full py-4 bg-primary text-white rounded-lg font-bold shadow-lg hover:brightness-110 transition-all disabled:opacity-50"
                        >
                            {loading ? 'Translating...' : 'Generate Translation'}
                        </button>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
                        <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-4">Translated Message</h3>
                        <div className="flex-1 bg-slate-50 dark:bg-slate-800/50 p-6 rounded-lg border border-dashed border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-300 italic min-h-[200px]">
                            {translation || "Translation will appear here..."}
                        </div>
                        <div className="mt-6 flex gap-3">
                            <button className="flex-1 py-3 px-4 rounded-lg border border-slate-300 dark:border-slate-600 font-bold text-slate-700 dark:text-white hover:bg-slate-100 transition-all">
                                Copy Text
                            </button>
                            <button className="flex-1 py-3 px-4 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold hover:opacity-90 transition-all">
                                Send to Parents
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </TeacherLayout>
    );
};

export default ParentCommunication;
