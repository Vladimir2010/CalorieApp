import { useState, useEffect } from 'react';
import api from '../api';
import { motion } from 'framer-motion';
import { Utensils, Zap, Flame, Droplets } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const Home = () => {
    const [log, setLog] = useState(null);
    const [loading, setLoading] = useState(true);
    const today = new Date().toISOString().split('T')[0];

    useEffect(() => {
        fetchTodayLog();
    }, []);

    const fetchTodayLog = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await api.get(`/api/logs/${today}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setLog(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const macroData = [
        { name: 'Protein', value: log?.totals?.protein || 0, color: '#3b82f6' },
        { name: 'Carbs', value: log?.totals?.carbs || 0, color: '#22c55e' },
        { name: 'Fat', value: log?.totals?.fat || 0, color: '#f59e0b' }
    ];

    return (
        <div className="p-6 max-w-lg mx-auto mb-10">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
                        CalorieApp
                    </h1>
                    <p className="text-slate-400">Welcome back, Hero!</p>
                </div>
                <div className="w-12 h-12 rounded-full overflow-hidden border border-primary/30 shadow-lg shadow-primary/20">
                    <img src="/icon.jpg" alt="Icon" className="w-full h-full object-cover" />
                </div>
            </header>

            {/* Total Calories Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-8 mb-6 relative overflow-hidden"
            >
                <div className="relative z-10 flex justify-between items-end">
                    <div>
                        <span className="text-slate-400 text-sm font-medium uppercase tracking-widest">Total Intake</span>
                        <div className="flex items-baseline gap-2">
                            <h2 className="text-5xl font-black">{log?.totals?.calories || 0}</h2>
                            <span className="text-slate-400 font-medium">kcal</span>
                        </div>
                    </div>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
                    <Flame size={128} className="text-primary" />
                </div>
            </motion.div>

            {/* Macros Grid */}
            <div className="grid grid-cols-3 gap-4 mb-8">
                {macroData.map((macro) => (
                    <div key={macro.name} className="glass-card p-4 flex flex-col items-center">
                        <span className="text-xs text-slate-400 mb-1">{macro.name}</span>
                        <span className="text-lg font-bold">{macro.value}g</span>
                        <div className="w-full h-1 bg-slate-800 rounded-full mt-2">
                            <div
                                className="h-full rounded-full"
                                style={{ width: '60%', backgroundColor: macro.color }}
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Meals */}
            <h3 className="text-xl font-bold mb-4">Recent Meals</h3>
            <div className="space-y-4">
                {log?.entries?.length > 0 ? (
                    log.entries.map((entry, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="glass-card p-4 flex items-center justify-between"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-slate-800 rounded-2xl">
                                    <Utensils size={20} className="text-primary" />
                                </div>
                                <div>
                                    <p className="font-semibold">{entry.foodName}</p>
                                    <p className="text-xs text-slate-400 uppercase tracking-wider">{entry.mealType}</p>
                                </div>
                            </div>
                            <p className="font-bold">+{entry.calories} kcal</p>
                        </motion.div>
                    ))
                ) : (
                    <div className="text-center p-8 bg-slate-900/50 rounded-3xl border border-dashed border-slate-700">
                        <p className="text-slate-500">No meals logged today yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
