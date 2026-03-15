import React, { useState } from 'react';
import ParentLayout from './Layout';
import { teacherService } from '../services/api';
import Loader from '../components/Loader';

const ParentAssistant = () => {
    const [messages, setMessages] = useState([
        { 
            role: 'assistant', 
            content: 'Hi! I am your AI Parenting Assistant. How can I help you support your child\'s learning today?',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMessage = {
            role: 'user',
            content: input,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, userMessage]);
        const currentInput = input;
        setInput('');
        setLoading(true);

        try {
            // Reusing the teacher-assistant endpoint for parental guidance
            const response = await teacherService.askAssistant(currentInput, 5); // Default age for guidance
            
            const aiMessage = {
                role: 'assistant',
                content: response.suggestion || response.answer || response,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error("AI Assistant Error:", error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: "I'm sorry, I encountered an error. Please try again.",
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ParentLayout>
            <div className="flex flex-col h-[calc(100vh-64px)] bg-slate-50 dark:bg-slate-950 pt-16">
                <header className="h-16 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 px-8 flex items-center justify-between shrink-0">
                    <h2 className="font-black text-lg text-slate-900 dark:text-white uppercase tracking-tight">Parenting Assistant</h2>
                </header>

                <div className="flex-1 overflow-y-auto p-8 space-y-8">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} gap-4`}>
                            <div className={`${msg.role === 'user' ? 'max-w-xl' : 'max-w-2xl w-full'}`}>
                                <div className={`p-6 rounded-[2rem] shadow-sm ${
                                    msg.role === 'user' 
                                        ? 'bg-primary text-white rounded-tr-none' 
                                        : 'bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-900 dark:text-slate-100'
                                }`}>
                                    <p className="text-sm leading-relaxed font-bold">{msg.content}</p>
                                </div>
                                <p className={`text-[10px] mt-2 text-slate-400 font-black uppercase ${msg.role === 'user' ? 'text-right' : ''}`}>
                                    {msg.role === 'assistant' ? `AI GUIDE • ${msg.time}` : `YOU • ${msg.time}`}
                                </p>
                            </div>
                        </div>
                    ))}
                    {loading && <div className="flex justify-start gap-4"><Loader message="Consulting educational experts..." /></div>}
                </div>

                <div className="p-6 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
                    <div className="max-w-4xl mx-auto flex items-center gap-4">
                        <input 
                            className="flex-1 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-primary rounded-2xl px-6 py-4 text-sm font-bold shadow-sm outline-none transition-all text-slate-900 dark:text-white" 
                            placeholder="Ask about behaviors, topics, or progress..." 
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        />
                        <button 
                            onClick={handleSend}
                            className="bg-primary text-white size-14 rounded-2xl flex items-center justify-center hover:brightness-110 shadow-lg shadow-primary/20 active:scale-95 transition-all"
                        >
                            <span className="material-symbols-outlined font-black">send</span>
                        </button>
                    </div>
                </div>
            </div>
        </ParentLayout>
    );
};

export default ParentAssistant;
