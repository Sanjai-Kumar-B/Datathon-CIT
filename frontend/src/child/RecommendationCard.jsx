import React from 'react';
import { useNavigate } from 'react-router-dom';

const RecommendationCard = ({ recommendation }) => {
    const navigate = useNavigate();

    if (!recommendation) return null;

    return (
        <div className="bg-white dark:bg-slate-800 rounded-[3rem] p-8 shadow-2xl border-b-[12px] border-primary/20 max-w-sm w-full animate-in slide-in-from-bottom duration-500">
            <div className="flex items-center gap-3 mb-6 text-primary">
                <span className="material-symbols-outlined font-black">auto_awesome</span>
                <h4 className="font-black uppercase tracking-widest text-sm">AI Suggestion</h4>
            </div>
            
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
                {recommendation.title || "Ready for more fun?"}
            </h3>
            <p className="text-slate-500 font-bold mb-8 text-sm leading-relaxed">
                {recommendation.reason || "Based on your progress, you'll love this next mission!"}
            </p>

            <button 
                onClick={() => navigate(`/child/mission/${recommendation.activity_id}`)}
                className="w-full bg-primary text-white py-4 rounded-2xl font-black uppercase text-sm shadow-lg shadow-primary/20 hover:brightness-110 active:scale-95 transition-all"
            >
                Start Now 🚀
            </button>
        </div>
    );
};

export default RecommendationCard;
