import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ChildLayout from './Layout';
import { getStudentFeed, completeActivity } from '../services/api';
import Loader from '../components/Loader';

const MissionPlay = () => {
    const { missionId } = useParams();
    const navigate = useNavigate();
    const [mission, setMission] = useState(null);
    const [loading, setLoading] = useState(true);
    const [completing, setCompleting] = useState(false);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [step, setStep] = useState('video'); // 'video' or 'flashcards'

    useEffect(() => {
        const fetchMissionDetails = async () => {
            try {
                const studentId = localStorage.getItem("student_id") || "S_CHILD_01";
                const data = await getStudentFeed(studentId);
                const found = data.find(m => m.id === missionId);
                setMission(found);
                
                // Set initial step based on available content
                const hasVideo = found?.activity_details?.content?.video_url || found?.activity_details?.video_url;
                if (hasVideo) {
                    setStep('video');
                } else {
                    setStep('flashcards');
                }
            } catch (error) {
                console.error("Error fetching mission details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMissionDetails();
    }, [missionId]);

    const handleNext = () => {
        if (mission?.activity_details?.content?.flashcards) {
            const total = mission.activity_details.content.flashcards.length;
            if (currentCardIndex < total - 1) {
                setCurrentCardIndex(prev => prev + 1);
            }
        }
    };

    const handleBack = () => {
        if (currentCardIndex > 0) {
            setCurrentCardIndex(prev => prev - 1);
        }
    };

    const handleFinish = async () => {
        setCompleting(true);
        try {
            const studentId = localStorage.getItem("student_id") || "S_TEST_999";
            await completeActivity(
                studentId, 
                mission.activity_id, 
                mission.activity_details.topic || "General", 
                100 // Demo score
            );
            navigate('/child/completed');
        } catch (error) {
            console.error("Error completing activity:", error);
            alert("Oops! Something went wrong. Try again.");
        } finally {
            setCompleting(false);
        }
    };

    if (loading) return <ChildLayout><Loader message="Getting your mission ready..." /></ChildLayout>;
    if (!mission) return <ChildLayout><div className="p-20 text-center">Mission not found!</div></ChildLayout>;

    const flashcards = mission.activity_details?.content?.flashcards || mission.activity_details?.flashcards || [];
    const videoUrl = mission.activity_details?.content?.video_url || mission.activity_details?.video_url;

    // Derived flags to decide if we should show specific sections
    const hasVideo = !!videoUrl;
    const hasFlashcards = flashcards.length > 0;

    return (
        <ChildLayout>
            <div className="flex flex-1 flex-col items-center px-6 py-8 md:px-20 lg:px-40 pt-24">
                <div className="mb-8 flex w-full max-w-3xl items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                            {mission.activity_details.topic || mission.title}
                        </h1>
                        <p className="text-primary font-black text-sm uppercase tracking-widest">{mission.activity_type} Mission</p>
                    </div>
                    <button 
                        onClick={() => navigate('/child/missions')}
                        className="size-12 rounded-2xl bg-white dark:bg-slate-800 shadow-lg flex items-center justify-center text-slate-400 hover:text-red-500 transition-all border-b-4 border-slate-100 active:border-b-0 active:translate-y-1"
                    >
                        <span className="material-symbols-outlined font-black">close</span>
                    </button>
                </div>

                <div className="w-full max-w-4xl">
                    {step === 'video' && hasVideo ? (
                        <div className="flex flex-col gap-8">
                            <div className="aspect-video bg-black rounded-[2.5rem] overflow-hidden shadow-2xl border-b-[12px] border-slate-900 border-x-4 border-t-4 border-slate-800">
                                <video controls autoPlay className="w-full h-full object-cover">
                                    <source src={videoUrl} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            </div>
                            <div className="flex flex-col items-center gap-6">
                                <p className="text-slate-500 font-bold text-lg text-center bg-white dark:bg-slate-800 px-8 py-3 rounded-full shadow-sm border border-slate-100 dark:border-slate-700">Watch the lesson carefully! 🍿</p>
                                <button 
                                    onClick={() => hasFlashcards ? setStep('flashcards') : handleFinish()}
                                    className="px-16 py-5 rounded-[2.5rem] bg-primary text-white font-black text-xl uppercase tracking-widest shadow-2xl hover:brightness-110 transition-all border-b-[10px] border-primary-dark active:border-b-0 active:translate-y-2 flex items-center gap-4"
                                >
                                    {hasFlashcards ? 'Next: Flashcards ➝' : 'Complete Mission!'}
                                </button>
                            </div>
                        </div>
                    ) : (step === 'flashcards' || !hasVideo) && hasFlashcards ? (
                        <div className="flex flex-col gap-8 max-w-xl mx-auto">
                            {/* Simple Card View */}
                            <div className="aspect-[4/3] bg-white dark:bg-slate-800 rounded-[40px] shadow-2xl border-b-[16px] border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-300 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-2 bg-slate-100/50">
                                    <div className="h-full bg-primary transition-all duration-500" style={{ width: `${((currentCardIndex + 1) / flashcards.length) * 100}%` }}></div>
                                </div>
                                <div className="text-9xl mb-6 transform hover:scale-110 transition-transform cursor-pointer drop-shadow-lg">
                                    {flashcards[currentCardIndex].emoji}
                                </div>
                                <h2 className="text-5xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">
                                    {flashcards[currentCardIndex].front}
                                </h2>
                                <p className="text-2xl font-bold text-primary">
                                    {flashcards[currentCardIndex].back}
                                </p>
                            </div>

                            {/* Controls */}
                            <div className="flex items-center justify-between gap-4">
                                <button 
                                    onClick={handleBack}
                                    disabled={currentCardIndex === 0}
                                    className="h-20 w-20 rounded-3xl bg-white dark:bg-slate-800 shadow-xl flex items-center justify-center text-slate-400 hover:text-primary disabled:opacity-30 disabled:hover:text-slate-400 transition-all border-b-8 border-slate-100 active:border-b-0 active:translate-y-2"
                                >
                                    <span className="material-symbols-outlined text-5xl font-black">arrow_back</span>
                                </button>
                                
                                <div className="flex-1 flex justify-center gap-3">
                                    {flashcards.map((_, idx) => (
                                        <div key={idx} className={`h-4 rounded-full transition-all ${idx === currentCardIndex ? 'bg-primary w-12' : 'bg-slate-200 w-4'}`}></div>
                                    ))}
                                </div>

                                {currentCardIndex < flashcards.length - 1 ? (
                                    <button 
                                        onClick={handleNext}
                                        className="h-20 w-20 rounded-3xl bg-white dark:bg-slate-800 shadow-xl flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all border-b-8 border-slate-100 active:border-b-0 active:translate-y-2"
                                    >
                                        <span className="material-symbols-outlined text-5xl font-black">arrow_forward</span>
                                    </button>
                                ) : (
                                    <button 
                                        onClick={handleFinish}
                                        disabled={completing}
                                        className="h-20 px-10 rounded-3xl bg-[#4ade80] text-white font-black uppercase tracking-tight shadow-2xl hover:bg-green-500 transition-all border-b-8 border-green-700 active:border-b-0 active:translate-y-2 flex items-center gap-3 disabled:opacity-50"
                                    >
                                        {completing ? '...' : (
                                            <>
                                                <span className="material-symbols-outlined text-3xl">emoji_events</span>
                                                Finish!
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-slate-800 rounded-[3rem] p-16 text-center shadow-2xl border-b-[12px] border-slate-200">
                            <div className="size-24 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-8">
                                <span className="material-symbols-outlined text-6xl text-slate-300">smart_toy</span>
                            </div>
                            <h2 className="text-2xl font-black mb-4 uppercase tracking-tighter">Your Mission is Ready!</h2>
                            <p className="text-slate-500 font-bold uppercase tracking-widest mb-10 italic">"Let's learn something new today."</p>
                            <button 
                                onClick={handleFinish}
                                disabled={completing}
                                className="w-full bg-[#4ade80] py-6 rounded-3xl text-white font-black text-xl uppercase transition-all shadow-xl hover:bg-green-500 border-b-8 border-green-700 active:border-b-0 active:translate-y-2"
                            >
                                {completing ? 'Saving...' : 'Complete Mission!'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </ChildLayout>
    );
};

export default MissionPlay;
