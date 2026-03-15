import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await authService.login(formData);
            
            localStorage.setItem("user_id", response.id);
            localStorage.setItem("user_role", response.role);
            localStorage.setItem("user_name", response.name);
            
            if (response.role === 'teacher') navigate('/teacher');
            else if (response.role === 'parent') navigate('/parent');
            else navigate('/child');
        } catch (err) {
            setError(err.response?.data?.detail || 'Login failed. Check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-10 border border-slate-100">
                <h2 className="text-3xl font-black text-slate-900 mb-2">Welcome Back</h2>
                <p className="text-slate-500 mb-8">Sign in to continue your learning journey.</p>

                {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">{error}</div>}

                <form onSubmit={handleLogin} className="space-y-6">
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
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full py-4 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:brightness-110 transition-all disabled:opacity-50"
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                    <p className="text-sm text-slate-500">
                        Don't have an account? 
                        <button onClick={() => navigate('/register')} className="ml-1 font-bold text-primary hover:underline">Register now</button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
