import React, { useState, useEffect } from 'react';
import TeacherLayout from './Layout';
import { teacherService } from '../services/api';
import Loader from '../components/Loader';

const Resources = () => {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [uploadData, setUploadData] = useState({ title: '', type: 'Document', sourceUrl: '', file: null });

    // Fallback for demo environment
    const getTeacherId = () => localStorage.getItem("user_id") || "T_DEMO_01";

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

    const handleUpload = async (e) => {
        e.preventDefault();
        setUploading(true);
        const tid = getTeacherId();

        const typeMap = {
            "Document (PDF/DOCX)": uploadData.file?.name?.endsWith(".docx") ? "docx" : "pdf",
            "YouTube Link": "youtube",
            "Web URL": "web",
            "Image": "image",
            "Audio": "audio",
            "Video File": "video"
        };

        try {
            const formData = new FormData();
            formData.append('teacher_id', tid);
            formData.append('title', uploadData.title);
            formData.append('resource_type', typeMap[uploadData.type] || "pdf");
            
            if (uploadData.file) {
                formData.append('file', uploadData.file);
            } else if (uploadData.sourceUrl) {
                formData.append('source_url', uploadData.sourceUrl);
            }

            const response = await teacherService.uploadResource(formData);
            console.log("Upload Success:", response);
            setShowUploadModal(false);
            setUploadData({ title: '', type: 'Document', sourceUrl: '', file: null });
            fetchResources();
        } catch (error) {
            console.error("Upload Error:", error);
            alert("Failed to upload resource. Ensure the file is supported and the URL is valid.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <TeacherLayout>
            <div className="p-8">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">Resource Library</h2>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">Manage and ingest educational materials for your classes.</p>
                    </div>
                </header>

                <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold uppercase text-slate-400">Your Resources</h3>
                    </div>
                    <button 
                        onClick={() => setShowUploadModal(true)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-bold shadow-md shadow-primary/20 hover:brightness-110 transition-all"
                    >
                        <span className="material-symbols-outlined text-lg">upload</span>
                        Upload New Resource
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20"><Loader message="Loading library..." /></div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {resources.map((res) => (
                            <div key={res.id} className="group bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-xl transition-all duration-300">
                                <div className="p-5">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase ${
                                            res.type === 'YouTube' || res.type === 'Video' ? 'bg-red-100 text-red-600' : 
                                            res.type === 'Audio' ? 'bg-purple-100 text-purple-600' :
                                            res.type === 'Image' ? 'bg-amber-100 text-amber-600' :
                                            'bg-blue-100 text-blue-600'
                                        }`}>{res.type}</span>
                                    </div>
                                    <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-2 truncate">{res.title}</h3>
                                    <p className="text-xs text-slate-500 mb-4 line-clamp-3">{res.content}</p>
                                    <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center">
                                        <div className="text-[10px] text-slate-400">
                                            Added {new Date(res.created_at).toLocaleDateString()}
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            <button 
                                                onClick={() => window.location.href = `/teacher/flashcards?resourceId=${res.id}`}
                                                className="px-3 py-1 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-full transition-all duration-300 flex items-center gap-1 text-[10px] font-bold shadow-sm active:scale-95"
                                                title="Preview AI Flashcards"
                                            >
                                                <span className="material-symbols-outlined text-xs">visibility</span>
                                                Preview
                                            </button>
                                            <button 
                                                onClick={() => window.location.href = `/teacher/flashcards?resourceId=${res.id}&autoPublish=true`}
                                                className="px-3 py-1 bg-green-500/10 text-green-600 hover:bg-green-600 hover:text-white rounded-full transition-all duration-300 flex items-center gap-1 text-[10px] font-bold shadow-sm active:scale-95 border border-green-500/20"
                                                title="Generate & Publish to Students in one click"
                                            >
                                                <span className="material-symbols-outlined text-xs">bolt</span>
                                                Smart Publish
                                            </button>
                                            <button className="p-1 text-slate-400 hover:text-slate-600 transition-colors ml-auto">
                                                <span className="material-symbols-outlined text-sm">more_horiz</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        
                        <div 
                            onClick={() => setShowUploadModal(true)}
                            className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl flex flex-col items-center justify-center p-8 text-center bg-slate-50/50 dark:bg-slate-800/20 hover:bg-slate-100/50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group"
                        >
                            <div className="size-14 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400 group-hover:text-primary transition-all mb-4">
                                <span className="material-symbols-outlined text-3xl">add</span>
                            </div>
                            <p className="font-bold text-slate-700 dark:text-slate-300">Add New Resource</p>
                        </div>
                    </div>
                )}

                {/* Upload Modal */}
                {showUploadModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                        <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl p-8 animate-fade-in-up">
                            <h3 className="text-xl font-bold mb-6">Upload Learning Resource</h3>
                            <form onSubmit={handleUpload} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Title</label>
                                    <input required type="text" className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-primary outline-none" placeholder="e.g. Solar System Overview" onChange={e => setUploadData({...uploadData, title: e.target.value})}/>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Type</label>
                                    <select className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 outline-none" onChange={e => setUploadData({...uploadData, type: e.target.value})}>
                                        <option>Document (PDF/DOCX)</option>
                                        <option>YouTube Link</option>
                                        <option>Web URL</option>
                                        <option>Image</option>
                                        <option>Audio</option>
                                        <option>Video File</option>
                                    </select>
                                </div>
                                {['YouTube Link', 'Web URL'].includes(uploadData.type) ? (
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Source URL</label>
                                        <input required type="url" className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 outline-none font-medium" placeholder="https://..." onChange={e => setUploadData({...uploadData, sourceUrl: e.target.value})}/>
                                        <p className="text-[10px] text-slate-400 mt-1">Direct link to the content for AI analysis.</p>
                                    </div>
                                ) : (
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase mb-1">File</label>
                                        <input type="file" className="w-full p-3 text-xs" onChange={e => setUploadData({...uploadData, file: e.target.files[0]})}/>
                                    </div>
                                )}
                                <div className="flex gap-3 mt-8">
                                    <button type="button" disabled={uploading} onClick={() => setShowUploadModal(false)} className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold">Cancel</button>
                                    <button disabled={uploading} type="submit" className="flex-1 py-3 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 flex flex-col items-center justify-center">
                                        {uploading ? (
                                            <div className="flex flex-col items-center gap-1">
                                                <span className="text-sm">Processing...</span>
                                                <div className="w-20 h-1 bg-white/20 rounded-full overflow-hidden">
                                                    <div className="w-full h-full bg-white animate-progress-ind"></div>
                                                </div>
                                            </div>
                                        ) : 'Upload & Ingest'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </TeacherLayout>
    );
};

export default Resources;
