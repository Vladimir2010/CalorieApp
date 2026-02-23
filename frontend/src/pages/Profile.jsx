import { useState, useEffect } from 'react';
import api from '../api';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Settings, LogOut, ChevronRight, Save, X, Activity } from 'lucide-react';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const [formData, setFormData] = useState({
        username: '',
        age: '',
        height: '',
        weight: '',
        dailyCalories: ''
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('/api/auth/me', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser(res.data);
            setFormData({
                username: res.data.username,
                age: res.data.profile?.age || '',
                height: res.data.profile?.height || '',
                weight: res.data.profile?.weight || '',
                dailyCalories: res.data.goals?.dailyCalories || '2000'
            });
        } catch (err) {
            console.error(err);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        try {
            const token = localStorage.getItem('token');
            const updateData = {
                username: formData.username,
                profile: {
                    age: Number(formData.age),
                    height: Number(formData.height),
                    weight: Number(formData.weight)
                },
                goals: {
                    dailyCalories: Number(formData.dailyCalories)
                }
            };

            await api.put('/api/auth/me', updateData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setMessage('Profile updated successfully! ✨');
            setIsEditing(false);
            fetchProfile();
        } catch (err) {
            setMessage('Update failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.dispatchEvent(new Event('storage'));
        window.location.href = '/login';
    };

    return (
        <div className="p-6 max-w-lg mx-auto pb-32">
            <h1 className="text-3xl font-bold mb-8">My Profile</h1>

            <div className="flex items-center gap-6 mb-10">
                <div className="w-24 h-24 premium-gradient rounded-3xl flex items-center justify-center shadow-lg shadow-primary/20">
                    <User size={48} className="text-white" />
                </div>
                <div>
                    <h2 className="text-2xl font-black">{user?.username || 'User'}</h2>
                    <p className="text-slate-400">{user?.email}</p>
                    <div className="mt-2 inline-block bg-emerald-500/10 px-3 py-1 rounded-full text-xs font-bold text-emerald-500">
                        Olympiad Competitor 🏆
                    </div>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {!isEditing ? (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-4"
                    >
                        {message && (
                            <div className="bg-emerald-500/20 text-emerald-400 p-4 rounded-2xl text-sm font-bold border border-emerald-500/30">
                                {message}
                            </div>
                        )}

                        <div className="glass-card p-6 flex items-center justify-between group cursor-pointer" onClick={() => setIsEditing(true)}>
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-500/10 text-blue-500 rounded-2xl">
                                    <Settings size={20} />
                                </div>
                                <div>
                                    <p className="font-bold">Edit Settings</p>
                                    <p className="text-xs text-slate-500">Update goals, weight, height</p>
                                </div>
                            </div>
                            <ChevronRight size={20} className="text-slate-700 group-hover:text-white transition-colors" />
                        </div>

                        <div className="glass-card p-8">
                            <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-6">Current Metrics</p>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <p className="text-xs text-slate-400 mb-1">Weight</p>
                                    <p className="text-xl font-black">{user?.profile?.weight || '--'} <span className="text-sm font-normal text-slate-500">kg</span></p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 mb-1">Height</p>
                                    <p className="text-xl font-black">{user?.profile?.height || '--'} <span className="text-sm font-normal text-slate-500">cm</span></p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 mb-1">Age</p>
                                    <p className="text-xl font-black">{user?.profile?.age || '--'} <span className="text-sm font-normal text-slate-500">yrs</span></p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 mb-1">Daily Goal</p>
                                    <p className="text-xl font-black text-primary">{user?.goals?.dailyCalories || '2000'} <span className="text-sm font-normal text-slate-500">kcal</span></p>
                                </div>
                            </div>
                        </div>

                        <div className="glass-card p-6 flex items-center justify-between group cursor-pointer" onClick={handleLogout}>
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-red-500/10 text-red-500 rounded-2xl">
                                    <LogOut size={20} />
                                </div>
                                <div>
                                    <p className="font-bold text-red-500">Log Out</p>
                                    <p className="text-xs text-slate-500">Securely exit your account</p>
                                </div>
                            </div>
                            <ChevronRight size={20} className="text-slate-700 group-hover:text-white transition-colors" />
                        </div>
                    </motion.div>
                ) : (
                    <motion.form
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        onSubmit={handleUpdate}
                        className="glass-card p-8 space-y-6"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-black uppercase tracking-widest text-xs text-primary">Edit Settings</h3>
                            <button type="button" onClick={() => setIsEditing(false)} className="text-slate-500 hover:text-white">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] uppercase font-bold text-slate-500 ml-4 mb-2 block">Username</label>
                                <input
                                    type="text"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl p-4 focus:outline-none focus:border-primary transition-all font-bold"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] uppercase font-bold text-slate-500 ml-4 mb-2 block">Age</label>
                                    <input
                                        type="number"
                                        value={formData.age}
                                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                        className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl p-4 focus:outline-none focus:border-primary transition-all font-bold"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase font-bold text-slate-500 ml-4 mb-2 block">Weight (kg)</label>
                                    <input
                                        type="number"
                                        value={formData.weight}
                                        onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                                        className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl p-4 focus:outline-none focus:border-primary transition-all font-bold"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] uppercase font-bold text-slate-500 ml-4 mb-2 block">Height (cm)</label>
                                <input
                                    type="number"
                                    value={formData.height}
                                    onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                                    className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl p-4 focus:outline-none focus:border-primary transition-all font-bold"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] uppercase font-bold text-slate-500 ml-4 mb-2 block">Daily Calorie Goal</label>
                                <input
                                    type="number"
                                    value={formData.dailyCalories}
                                    onChange={(e) => setFormData({ ...formData, dailyCalories: e.target.value })}
                                    className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl p-4 focus:outline-none focus:border-primary transition-all font-bold text-primary"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full premium-gradient p-5 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-lg shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : <><Save size={20} /> Save Changes</>}
                        </button>

                        <button
                            type="button"
                            onClick={() => setIsEditing(false)}
                            className="w-full text-slate-500 text-xs font-bold py-2 mt-2"
                        >
                            Cancel
                        </button>
                    </motion.form>
                )}
            </AnimatePresence>

            {/* Academic Info placeholder */}
            <div className="mt-12 p-6 bg-slate-900/50 rounded-3xl border border-slate-800 text-center">
                <img src="/icon.jpg" alt="CalorieApp Logo" className="w-12 h-12 mx-auto mb-4 rounded-xl opacity-50" />
                <p className="text-xs text-slate-500 uppercase font-black tracking-widest mb-2">Project info</p>
                <p className="text-sm text-slate-400">CalorieApp developed for IT Olympiad 2026. Powered by Groq/Llama 4 Vision & MongoDB Cloud.</p>
            </div>
        </div>
    );
};

export default Profile;
