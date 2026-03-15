import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { authService } from '../services/api';

const Register = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [role, setRole] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        school: '',
        childName: '',
        childAge: ''
    });
    const [error, setError] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const userData = {
                ...formData,
                role: role,
                child_name: formData.childName,
                child_age: formData.childAge ? parseInt(formData.childAge) : null
            };
            const response = await authService.register(userData);
            
            // Store user info
            localStorage.setItem("user_id", response.id);
            localStorage.setItem("user_role", response.role);
            localStorage.setItem("user_name", response.name);
            
            setIsSuccess(true);
        } catch (err) {
            const detail = err.response?.data?.detail;
            if (Array.isArray(detail)) {
                setError(detail[0]?.msg || 'Registration failed');
            } else {
                setError(detail || 'Registration failed');
            }
        }
    };

    const handleProceed = () => {
        const userRole = localStorage.getItem("user_role");
        if (userRole === 'teacher') navigate('/teacher');
        else if (userRole === 'parent') navigate('/parent');
        else navigate('/child');
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-10 border border-slate-100">
                <h2 className="text-3xl font-black text-slate-900 mb-2">Create Account</h2>
                <p className="text-slate-500 mb-8">Join the AI Learning Companion today.</p>

                {isSuccess ? (
                    <div className="text-center py-6 space-y-6">
                        <div className="flex justify-center">
                            <div className="size-24 bg-green-100 rounded-full flex items-center justify-center text-green-600 animate-bounce">
                                <span className="material-symbols-outlined text-5xl">check_circle</span>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-slate-900">Registration Successful!</h3>
                            <p className="text-slate-500 mt-2">Welcome aboard, {formData.name}. Your {role} account is ready.</p>
                        </div>
                        <button 
                            onClick={handleProceed}
                            className="w-full py-4 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:brightness-110 transition-all"
                        >
                            Continue to {role.charAt(0).toUpperCase() + role.slice(1)} Dashboard
                        </button>
                    </div>
                ) : (
                    <>
                        {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">{error}</div>}

                        <form onSubmit={handleRegister} className="space-y-6">
                            {step === 1 && (
                                <div className="space-y-4">
                                    <label className="block text-sm font-bold text-slate-400 uppercase">Who are you?</label>
                                    <div className="grid grid-cols-1 gap-3">
                                        <button type="button" onClick={() => {setRole('teacher'); setStep(2);}} className="p-4 rounded-xl border-2 border-slate-100 hover:border-primary text-left transition-all">
                                            <h4 className="font-bold">I'm a Teacher</h4>
                                            <p className="text-xs text-slate-400">Manage classrooms and generate lessons.</p>
                                        </button>
                                        <button type="button" onClick={() => {setRole('parent'); setStep(2);}} className="p-4 rounded-xl border-2 border-slate-100 hover:border-primary text-left transition-all">
                                            <h4 className="font-bold">I'm a Parent</h4>
                                            <p className="text-xs text-slate-400">Track child progress and get guidance.</p>
                                        </button>
                                    </div>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase">Full Name</label>
                                        <input 
                                            type="text" required
                                            className="w-full mt-1 p-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-primary/50 outline-none"
                                            value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase">Email Address</label>
                                        <input 
                                            type="email" required
                                            className="w-full mt-1 p-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-primary/50 outline-none"
                                            value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase">Password</label>
                                        <input 
                                            type="password" required
                                            className="w-full mt-1 p-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-primary/50 outline-none"
                                            value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})}
                                        />
                                    </div>
                                    <button type="submit" className="w-full py-4 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:brightness-110 transition-all">
                                        Complete Registration
                                    </button>
                                    <button type="button" onClick={() => setStep(1)} className="w-full text-slate-400 text-sm font-medium hover:text-slate-600">Back</button>
                                </div>
                            )}
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default Register;
