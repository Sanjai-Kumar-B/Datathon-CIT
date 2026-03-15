import React, { useState, useEffect } from 'react';
import TeacherLayout from './Layout';
import { teacherService, generateVideo } from '../services/api';
import Loader from '../components/Loader';

const VideoGenerator = () => {
    const [resources, setResources] = useState([]);
    const [selectedResourceId, setSelectedResourceId] = useState('');
    const [generating, setGenerating] = useState(false);
    const [videoUrl, setVideoUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [publishing, setPublishing] = useState(false);
    const [published, setPublished] = useState(false);

    // Dynamic ID retrieval with demo fallbacks
    const getTeacherId = () => localStorage.getItem("user_id") || "T_DEMO_01";
    const getStudentId = () => localStorage.getItem("student_id") || "S_CHILD_01";

    const fetchResources = async () => {
        const tid = getTeacherId();
        try {
            const data = await teacherService.getResources(tid);
            setResources(data);
        } catch (error) {
            console.error("Fetch Resources Error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResources();
    }, []);

    const handleGenerate = async () => {
        if (!selectedResourceId) return alert("Please select a resource first.");
        setGenerating(true);
        setVideoUrl(null);
        setPublished(false);
        try {
            const result = await generateVideo(selectedResourceId);
            setVideoUrl(result.video_url);
        } catch (error) {
            console.error("Video Generation Error:", error);
            const errorMsg = error.response?.data?.detail || error.message || "Unknown error";
            alert(`Video generation failed: ${errorMsg}\n\nCheck if your resource has content in the library.`);
        } finally {
            setGenerating(false);
        }
    };

    const handlePublish = async () => {
        setPublishing(true);
        try {
            const resource = resources.find(r => r.id === selectedResourceId);
            await teacherService.publishActivity(
                getTeacherId(),
                getStudentId(),
                "video",
                { title: resource?.title || "Educational Video", video_url: videoUrl, topic: resource?.title }
            );
            setPublished(true);
            setTimeout(() => setPublished(false), 3000);
        } catch (error) {
            console.error("Publish Error:", error);
            alert("Failed to publish video to classroom.");
        } finally {
            setPublishing(false);
        }
    };

    return (
        <TeacherLayout>
            <div className="p-8 max-w-4xl mx-auto">
                <header className="mb-10">
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white">AI Video Generator</h2>
                    <p className="text-slate-500 mt-2">Transform your uploaded resources into engaging animated learning videos.</p>
                </header>

                <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 shadow-sm">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-400 uppercase mb-3">1. Select Source Resource</label>
                            {loading ? (
                                <div className="p-4 bg-slate-50 rounded-xl">Loading resources...</div>
                            ) : (
                                <select 
                                    className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50 dark:bg-slate-900 outline-none focus:ring-2 focus:ring-primary"
                                    value={selectedResourceId}
                                    onChange={(e) => setSelectedResourceId(e.target.value)}
                                >
                                    <option value="">-- Choose a resource --</option>
                                    {resources.map(res => (
                                        <option key={res.id} value={res.id}>{res.title} ({res.type})</option>
                                    ))}
                                </select>
                            )}
                        </div>

                        <div className="pt-4">
                            <button 
                                onClick={handleGenerate}
                                disabled={generating || !selectedResourceId}
                                className="w-full bg-primary text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-primary/30 flex items-center justify-center gap-3 hover:brightness-110 active:scale-95 disabled:opacity-50 transition-all"
                            >
                                <span className="material-symbols-outlined text-3xl">movie_edit</span>
                                {generating ? 'Generating Video (may take a few minutes)...' : 'Generate Learning Video'}
                            </button>
                        </div>
                    </div>
                </div>

                {generating && (
                    <div className="mt-12 flex justify-center">
                        <Loader message="AI is drafting the script, generating visuals, and assembling your video..." />
                    </div>
                )}

                {videoUrl && (
                    <div className="mt-12 animate-fade-in">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <span className="material-symbols-outlined text-green-500">
                                {videoUrl.endsWith('.png') ? 'image' : 'check_circle'}
                            </span>
                            {videoUrl.endsWith('.png') ? 'Lesson Preview Ready!' : 'Video Ready!'}
                        </h3>
                        <div className="aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl relative">
                            {videoUrl.endsWith('.png') ? (
                                <div className="w-full h-full relative">
                                    <img 
                                        src={`http://localhost:8000${videoUrl}`} 
                                        alt="Lesson Preview" 
                                        className="w-full h-full object-cover" 
                                    />
                                    <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white p-6 text-center">
                                        <span className="material-symbols-outlined text-6xl mb-4">movie_edit</span>
                                        <p className="text-lg font-bold">Visual Storyboard Generated</p>
                                        <p className="text-sm opacity-80 max-w-md">The AI has generated the educational visuals. (Final video assembly requires FFmpeg on the server).</p>
                                    </div>
                                </div>
                            ) : (
                                <video controls className="w-full h-full">
                                    <source src={`http://localhost:8000${videoUrl}`} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            )}
                        </div>
                        <div className="mt-6 flex gap-4">
                            <button 
                                onClick={handlePublish}
                                disabled={publishing || published}
                                className={`flex-1 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                                    published ? 'bg-green-500 text-white' : 'bg-primary text-white hover:brightness-110 shadow-lg shadow-primary/20'
                                }`}
                            >
                                <span className="material-symbols-outlined text-lg">{published ? 'check_circle' : 'campaign'}</span>
                                {publishing ? 'Publishing...' : published ? 'Published!' : 'Publish to Feed'}
                            </button>
                            <a 
                                href={`http://localhost:8000${videoUrl}`} 
                                download 
                                className="flex-1 py-4 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl font-bold border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-center"
                            >
                                <span className="material-symbols-outlined text-lg">download</span>
                                Download
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </TeacherLayout>
    );
};

export default VideoGenerator;
