import React, { useState } from 'react';
import TeacherLayout from './Layout';
import { teacherService } from '../services/api';
import Loader from '../components/Loader';

const LessonPlanner = () => {
    const [messages, setMessages] = useState([
        { 
            role: 'assistant', 
            content: 'Hello! I am your AI Lesson Assistant. What are you teaching today? Please tell me the topic and select the target age.',
            type: 'text',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
    ]);
    const [input, setInput] = useState('');
    const [age, setAge] = useState('5');
    const [loading, setLoading] = useState(false);

    const getTeacherId = () => localStorage.getItem("user_id") || "T_DEMO_01";

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMessage = {
            role: 'user',
            content: `${input} (Target Age: ${age})`,
            type: 'text',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, userMessage]);
        const currentInput = input;
        setInput('');
        setLoading(true);

        try {
            const response = await teacherService.askAssistant(currentInput, age);
            
            const aiMessage = {
                role: 'assistant',
                content: response,
                type: 'ai_response',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error("AI Assistant Error:", error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: "I'm sorry, I encountered an error. Please try again.",
                type: 'text',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <TeacherLayout>
            <div className="flex flex-col h-[calc(100vh-64px)] bg-slate-50 dark:bg-slate-900 pt-16">
                <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-8 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-4">
                        <h2 className="font-bold text-lg text-slate-900 dark:text-white">AI Lesson Planner</h2>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-8 space-y-8">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} gap-4`}>
                            {msg.role === 'assistant' && (
                                <div className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20">
                                    <span className="material-symbols-outlined text-sm">smart_toy</span>
                                </div>
                            )}
                            
                            <div className={`${msg.role === 'user' ? 'max-w-xl' : 'max-w-3xl w-full'}`}>
                                <div className={`p-5 rounded-2xl shadow-sm ${
                                    msg.role === 'user' 
                                        ? 'bg-primary text-white rounded-tr-none' 
                                        : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100'
                                }`}>
                                    {msg.type === 'ai_response' ? (
                                        <div className="space-y-6">
                                             <div>
                                                <div className="flex items-center gap-2 mb-2 text-primary">
                                                    <span className="material-symbols-outlined text-lg">description</span>
                                                    <h4 className="font-bold text-xs uppercase tracking-widest">Lesson Explanation</h4>
                                                </div>
                                                <p className="text-sm leading-relaxed">{msg.content.suggestion || msg.content.answer}</p>
                                            </div>
                                            
                                            {msg.content.activity && (
                                                <div className="bg-primary/5 dark:bg-primary/10 p-4 rounded-xl border border-primary/10">
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <span className="material-symbols-outlined text-primary text-lg">rocket_launch</span>
                                                        <h4 className="font-bold text-sm">Suggested Activities</h4>
                                                    </div>
                                                    <p className="text-sm leading-relaxed">{msg.content.activity}</p>
                                                </div>
                                            )}

                                            {msg.content.teaching_tips && (
                                                <div className="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-xl border border-amber-100 dark:border-amber-900/20">
                                                    <div className="flex items-center gap-2 mb-3 text-amber-600">
                                                        <span className="material-symbols-outlined text-lg">tips_and_updates</span>
                                                        <h4 className="font-bold text-sm">Pro Teaching Tips</h4>
                                                    </div>
                                                    <p className="text-sm leading-relaxed text-amber-900 dark:text-amber-200/80">{msg.content.teaching_tips}</p>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <p className="text-sm leading-relaxed font-medium">{msg.content}</p>
                                    )}
                                </div>
                                <p className={`text-[10px] mt-2 text-slate-400 font-bold uppercase ${msg.role === 'user' ? 'text-right' : ''}`}>
                                    {msg.role === 'assistant' ? `Intelligence Engine • ${msg.time}` : `You • ${msg.time}`}
                                </p>
                            </div>
                        </div>
                    ))}
                    {loading && <div className="flex justify-start gap-4"><Loader message="Analyzing pedagogy..." /></div>}
                </div>

                <div className="p-6 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
                    <div className="max-w-4xl mx-auto space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="flex-1 relative">
                                <input 
                                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-4 pr-16 focus:ring-2 focus:ring-primary focus:border-transparent text-sm shadow-sm transition-all outline-none text-slate-900 dark:text-white" 
                                    placeholder="Enter topic (e.g. Life Cycle of a Butterfly)..." 
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                />
                                <button className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary">
                                    <span className="material-symbols-outlined">mic</span>
                                </button>
                            </div>
                            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-2">
                                <span className="text-[10px] font-black text-slate-400 uppercase">Age</span>
                                <select 
                                    className="bg-transparent text-sm font-bold outline-none"
                                    value={age}
                                    onChange={(e) => setAge(e.target.value)}
                                >
                                    {[3, 4, 5, 6, 7, 8].map(a => <option key={a} value={a}>{a}</option>)}
                                </select>
                            </div>
                            <button 
                                onClick={handleSend}
                                className="bg-primary text-white size-12 rounded-2xl flex items-center justify-center hover:brightness-110 shadow-lg shadow-primary/30 transition-all active:scale-95"
                            >
                                <span className="material-symbols-outlined">auto_awesome</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </TeacherLayout>
    );
};

export default LessonPlanner;
