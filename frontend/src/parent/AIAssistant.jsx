import React, { useState } from 'react';
import ParentLayout from './Layout';
import { teacherService } from '../services/api'; // Reusing for now as it's a general AI assistant
import Loader from '../components/Loader';

const ParentAIAssistant = () => {
    const [messages, setMessages] = useState([
        { role: 'assistant', content: "Hello! I'm your AI Parenting Assistant. How can I help you support Alex's learning journey today?" }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        setMessages(prev => [...prev, { role: 'user', content: input }]);
        const currentInput = input;
        setInput('');
        setLoading(true);

        try {
            const response = await teacherService.askAssistant(currentInput, 4); // Alex is 4
            setMessages(prev => [...prev, { role: 'assistant', content: response.suggestion || response.answer }]);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'assistant', content: "I'm sorry, I'm having trouble connecting right now." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ParentLayout>
            <div className="max-w-4xl mx-auto px-6 py-12">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white">AI Parenting Assistant</h2>
                    <p className="text-slate-500">Get tips, activity ideas, and guided learning paths for your child.</p>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm flex flex-col h-[500px]">
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-4 rounded-xl ${
                                    msg.role === 'user' 
                                        ? 'bg-[#ec5b13] text-white rounded-tr-none' 
                                        : 'bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-900 dark:text-white'
                                }`}>
                                    <p className="text-sm">{msg.content}</p>
                                </div>
                            </div>
                        ))}
                        {loading && <Loader message="Thinking..." />}
                    </div>

                    <div className="p-4 border-t border-slate-100 dark:border-slate-800">
                        <div className="relative">
                            <input 
                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 pr-12 focus:ring-2 focus:ring-[#ec5b13] focus:border-transparent outline-none text-slate-900 dark:text-white"
                                placeholder="Ask about Alex's progress or new activities..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            />
                            <button 
                                onClick={handleSend}
                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#ec5b13] text-white p-2 rounded-lg hover:bg-[#d45111]"
                            >
                                <span className="material-symbols-outlined">send</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </ParentLayout>
    );
};

export default ParentAIAssistant;
