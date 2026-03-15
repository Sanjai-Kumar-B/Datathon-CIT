import React, { useState } from 'react';
import TeacherLayout from './Layout';
import { teacherService, publishActivity } from '../services/api';
import Loader from '../components/Loader';

const FlashcardGenerator = () => {
    const [topic, setTopic] = useState('Numbers');
    const [age, setAge] = useState(4);
    const [count, setCount] = useState(5);
    const [loading, setLoading] = useState(false);
    const [publishing, setPublishing] = useState(false);
    const [cards, setCards] = useState([
        { id: 1, front: '1', back: 'Apple', emoji: '🍎', color: 'bg-red-50' },
        { id: 2, front: '2', back: 'Ball', emoji: '⚽', color: 'bg-blue-50' },
        { id: 3, front: '3', back: 'Star', emoji: '⭐', color: 'bg-yellow-50' },
    ]);
    const [published, setPublished] = useState(false);

    const handleGenerate = async () => {
        setLoading(true);
        setPublished(false);
        try {
            const params = new URLSearchParams(window.location.search);
            const resourceId = params.get('resourceId');
            const lang = localStorage.getItem("language") || "en";
            
            // Pass resourceId to backend if present
            const data = await teacherService.generateFlashcards(topic, age, count, lang, resourceId);
            
            // Mapping API response to our UI format
            const formattedCards = data.flashcards.map((c, i) => ({
                id: i + 1,
                front: c.front,
                back: c.back,
                emoji: c.emoji || '✨',
                color: 'bg-primary/5'
            }));
            setCards(formattedCards);
            return formattedCards; // Return for automated flows
        } catch (error) {
            console.error("Flashcard Generation Error:", error);
            alert("Failed to generate flashcards. Using temporary cards for your demo.");
            return null;
        } finally {
            setLoading(false);
        }
    };

    const handlePublish = async (cardsToPublish = null) => {
        setPublishing(true);
        const dataToPublish = cardsToPublish || cards;
        
        if (!dataToPublish || dataToPublish.length === 0) {
            setPublishing(false);
            return;
        }

        try {
            const tid = localStorage.getItem("user_id") || "T_DEMO_01";
            const sid = localStorage.getItem("student_id") || "S_CHILD_01";
            await publishActivity(
                tid, 
                sid, 
                "flashcards", 
                { topic, flashcards: dataToPublish }
            );
            setPublished(true);
            setTimeout(() => setPublished(false), 3000);
        } catch (error) {
            console.error("Publish Error:", error);
            alert("Could not publish to student feed.");
        } finally {
            setPublishing(false);
        }
    };

    // Resource Awareness: Check if we're generating for a specific resource
    React.useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const resId = params.get('resourceId');
        const autoPub = params.get('autoPublish');
        
        const init = async () => {
            if (resId) {
                setTopic(`Resource: ${resId.substring(0, 8)}`);
                const generatedCards = await handleGenerate();
                
                if (autoPub === 'true' && generatedCards) {
                    // Slight delay to let the user see the cards before publishing
                    setTimeout(() => {
                        handlePublish(generatedCards);
                    }, 1500);
                }
            }
        };
        init();
    }, []);

    return (
        <TeacherLayout>
            <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-slate-50 dark:bg-background-dark pt-16">
                {/* Left Sidebar: Configuration Panel */}
                <aside className="w-80 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-background-dark/30 overflow-y-auto p-6 flex flex-col gap-8">
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-6 flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm">settings</span> Configuration
                        </h3>
                        <div className="space-y-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-slate-900 dark:text-white">Topic</label>
                                <input 
                                    className="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:border-primary focus:ring-primary transition-all p-3 text-slate-900 dark:text-white" 
                                    type="text" 
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-semibold text-slate-900 dark:text-white">Target Age</label>
                                    <input 
                                        className="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:border-primary focus:ring-primary p-3 text-slate-900 dark:text-white" 
                                        type="number" 
                                        value={age}
                                        onChange={(e) => setAge(e.target.value)}
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-semibold text-slate-900 dark:text-white">Card Count</label>
                                    <input 
                                        className="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:border-primary focus:ring-primary p-3 text-slate-900 dark:text-white" 
                                        type="number" 
                                        value={count}
                                        onChange={(e) => setCount(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="pt-4">
                                <button 
                                    onClick={handleGenerate}
                                    disabled={loading}
                                    className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition-transform active:scale-95 disabled:opacity-50"
                                >
                                    <span className="material-symbols-outlined">magic_button</span>
                                    {loading ? 'Generating...' : 'Regenerate Cards'}
                                </button>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Content: Preview Grid */}
                <section className="flex-1 overflow-y-auto p-8">
                    <div className="max-w-5xl mx-auto">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Preview Grid</h1>
                                <p className="text-slate-500 text-sm">Review your flashcards before finalizing.</p>
                            </div>
                            <div className="flex gap-3">
                                <button 
                                    onClick={handlePublish}
                                    disabled={publishing || published}
                                    className={`px-6 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 transition-all duration-500 shadow-xl active:scale-95 border-2 ${
                                        published 
                                            ? 'bg-green-500 border-green-500 text-white scale-105' 
                                            : 'bg-primary border-primary text-white hover:bg-white hover:text-primary shadow-primary/30'
                                    }`}
                                >
                                    <span className={`material-symbols-outlined text-lg ${published ? 'animate-bounce' : ''}`}>
                                        {published ? 'check_circle' : 'bolt'}
                                    </span>
                                    {publishing ? 'Publishing...' : published ? 'Successfully Published!' : 'Publish to Students'}
                                </button>
                                <button className="px-5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-sm font-semibold flex items-center gap-2 hover:bg-slate-50 transition-colors text-slate-900 dark:text-white shadow-sm">
                                    <span className="material-symbols-outlined text-lg">print</span> Print
                                </button>
                            </div>
                        </div>

                        {/* Success Animation Overlay */}
                        {published && (
                            <div className="fixed inset-0 pointer-events-none z-[100] flex items-center justify-center overflow-hidden">
                                <div className="absolute inset-0 bg-green-500/5 backdrop-blur-[2px] animate-pulse"></div>
                                <div className="relative animate-success-pop flex flex-col items-center">
                                    <div className="text-9xl mb-4 bg-white rounded-full p-8 shadow-2xl text-green-500">
                                        <span className="material-symbols-outlined !text-7xl">celebration</span>
                                    </div>
                                    <h2 className="text-4xl font-black text-slate-900 drop-shadow-sm">Ready for Learning!</h2>
                                </div>
                                <style>{`
                                    @keyframes success-pop {
                                        0% { transform: scale(0) rotate(-10deg); opacity: 0; }
                                        70% { transform: scale(1.1) rotate(5deg); opacity: 1; }
                                        100% { transform: scale(1) rotate(0); opacity: 1; }
                                    }
                                    .animate-success-pop {
                                        animation: success-pop 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
                                    }
                                `}</style>
                            </div>
                        )}

                        {loading ? (
                            <div className="flex justify-center py-20">
                                <Loader message="Creating visual aids..." />
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {cards.map((card) => (
                                    <div key={card.id} className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col aspect-[3/4] group transition-all hover:shadow-xl hover:border-primary/30">
                                        <div className="flex-1 p-6 flex flex-col items-center justify-center gap-6">
                                            <div className="text-7xl font-black text-primary">{card.front}</div>
                                            <div className={`w-32 h-32 ${card.color} dark:bg-slate-700 rounded-full flex items-center justify-center text-6xl`}>{card.emoji}</div>
                                            <div className="text-2xl font-bold tracking-wide text-slate-900 dark:text-white">{card.back}</div>
                                        </div>
                                        <div className="p-3 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2 text-slate-400">
                                            <button className="p-1.5 hover:text-primary transition-colors"><span className="material-symbols-outlined text-lg">edit</span></button>
                                            <button className="p-1.5 hover:text-red-500 transition-colors"><span className="material-symbols-outlined text-lg">delete</span></button>
                                        </div>
                                    </div>
                                ))}
                                <button className="rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center aspect-[3/4] hover:border-primary hover:bg-primary/5 transition-all text-slate-400 hover:text-primary">
                                    <span className="material-symbols-outlined text-4xl mb-2">add_circle</span>
                                    <span className="font-bold">Add Manual Card</span>
                                </button>
                            </div>
                        )}

                        {/* Bottom Action Bar */}
                        <div className="mt-12 flex flex-wrap gap-4 items-center justify-center bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700">
                            <button className="bg-primary px-8 py-3 rounded-xl text-white font-bold flex items-center gap-2 hover:bg-primary/90 transition-all active:scale-95 shadow-lg shadow-primary/20">
                                <span className="material-symbols-outlined">play_arrow</span>
                                Start Teaching Mode
                            </button>
                            <button 
                                onClick={handlePublish}
                                disabled={publishing || published}
                                className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all active:scale-95 ${
                                    published 
                                        ? 'bg-green-500 text-white' 
                                        : 'bg-primary/10 text-primary hover:bg-primary/20'
                                }`}
                            >
                                <span className="material-symbols-outlined">{published ? 'check_circle' : 'school'}</span>
                                {publishing ? 'Sending...' : published ? 'Sent to Students!' : 'Send to Classroom'}
                            </button>
                            <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block"></div>
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-medium text-slate-500">Auto-save: <span className="text-green-500">Enabled</span></span>
                                <span className="material-symbols-outlined text-green-500">cloud_done</span>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </TeacherLayout>
    );
};

export default FlashcardGenerator;
