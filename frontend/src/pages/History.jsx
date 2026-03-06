import { useState, useEffect } from 'react';
import api from '../api';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, Utensils, Flame, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const History = () => {
    const { t, i18n } = useTranslation();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [log, setLog] = useState(null);
    const [loading, setLoading] = useState(false);

    // Generate calendar days for current view
    const [currentMonth, setCurrentMonth] = useState(new Date());

    useEffect(() => {
        const dateStr = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
        fetchLogForDate(dateStr);
    }, [selectedDate]);

    const fetchLogForDate = async (date) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await api.get(`/api/logs/${date}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setLog(res.data);
        } catch (err) {
            console.error(err);
            setLog(null);
        } finally {
            setLoading(false);
        }
    };

    const nextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    };

    const prevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    };

    const renderCalendar = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        let firstDay = new Date(year, month, 1).getDay();
        firstDay = firstDay === 0 ? 6 : firstDay - 1; // shift so Monday is 0
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // Adjust array sizes for days
        const days = [];
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="p-2"></div>);
        }

        for (let d = 1; d <= daysInMonth; d++) {
            const date = new Date(year, month, d);
            const isSelected = date.toDateString() === selectedDate.toDateString();
            const isToday = date.toDateString() === new Date().toDateString();

            days.push(
                <button
                    key={d}
                    onClick={() => setSelectedDate(date)}
                    className={`p-2 rounded-full w-10 h-10 flex items-center justify-center text-sm font-bold mx-auto transition-all ${isSelected ? 'bg-primary text-white shadow-lg shadow-primary/40' :
                        isToday ? 'bg-slate-800 text-white' : 'hover:bg-slate-800 text-slate-400'
                        }`}
                >
                    {d}
                </button>
            );
        }
        return days;
    };

    return (
        <div className="p-6 max-w-lg mx-auto pb-32">
            <h1 className="text-3xl font-bold mb-6">{t('history')}</h1>

            <div className="glass-card p-6 mb-8">
                <div className="flex justify-between items-center mb-6">
                    <button onClick={prevMonth} className="p-2 glass-card hover:bg-slate-800 rounded-xl"><ChevronLeft size={20} /></button>
                    <h2 className="font-bold text-lg capitalize">
                        {currentMonth.toLocaleString(i18n.language === 'bg' ? 'bg-BG' : 'en-US', { month: 'long', year: 'numeric' })}
                    </h2>
                    <button onClick={nextMonth} className="p-2 glass-card hover:bg-slate-800 rounded-xl"><ChevronRight size={20} /></button>
                </div>

                <div className="grid grid-cols-7 gap-1 text-center mb-2">
                    {['mo', 'tu', 'we', 'th', 'fr', 'sa', 'su'].map(day => (
                        <div key={day} className="text-xs font-bold text-slate-500 uppercase">{t(day)}</div>
                    ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                    {renderCalendar()}
                </div>
            </div>

            {loading ? (
                <div className="text-center py-10">
                    <div className="w-8 h-8 rounded-full border-t-2 border-primary animate-spin mx-auto mb-4"></div>
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={selectedDate.toDateString()}
                >
                    <div className="flex justify-between items-end mb-6">
                        <h3 className="text-xl font-bold capitalize">{selectedDate.toLocaleDateString(i18n.language === 'bg' ? 'bg-BG' : 'en-US', { weekday: 'short', day: 'numeric', month: 'long' })}</h3>
                        <div className="text-primary font-bold text-xl flex items-center gap-1">
                            <Flame size={20} /> {log?.totals?.calories || 0} kcal
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mb-8">
                        <div className="bg-blue-500/10 border border-blue-500/20 p-3 rounded-2xl text-center">
                            <p className="text-[10px] text-blue-400 uppercase font-bold">{t('protein')}</p>
                            <p className="font-black text-blue-100">{log?.totals?.protein || 0}g</p>
                        </div>
                        <div className="bg-green-500/10 border border-green-500/20 p-3 rounded-2xl text-center">
                            <p className="text-[10px] text-green-400 uppercase font-bold">{t('carbs')}</p>
                            <p className="font-black text-green-100">{log?.totals?.carbs || 0}g</p>
                        </div>
                        <div className="bg-orange-500/10 border border-orange-500/20 p-3 rounded-2xl text-center">
                            <p className="text-[10px] text-orange-400 uppercase font-bold">{t('fat')}</p>
                            <p className="font-black text-orange-100">{log?.totals?.fat || 0}g</p>
                        </div>
                        <div className="bg-purple-500/10 border border-purple-500/20 p-3 rounded-2xl text-center">
                            <p className="text-[10px] text-purple-400 uppercase font-bold">{t('fiber')}</p>
                            <p className="font-black text-purple-100">{log?.totals?.fiber || 0}g</p>
                        </div>
                        <div className="bg-pink-500/10 border border-pink-500/20 p-3 rounded-2xl text-center">
                            <p className="text-[10px] text-pink-400 uppercase font-bold">{t('sugar')}</p>
                            <p className="font-black text-pink-100">{log?.totals?.sugar || 0}g</p>
                        </div>
                        <div className="bg-slate-500/10 border border-slate-500/20 p-3 rounded-2xl text-center">
                            <p className="text-[10px] text-slate-400 uppercase font-bold">{t('sodium')}</p>
                            <p className="font-black text-slate-100">{log?.totals?.sodium || 0}mg</p>
                        </div>
                    </div>

                    <h4 className="font-bold text-slate-400 uppercase tracking-widest text-xs mb-4">{t('recent_meals')}</h4>

                    <div className="space-y-3">
                        {log?.entries?.length > 0 ? (
                            log.entries.map((entry, i) => (
                                <div key={i} className="glass-card p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 bg-slate-800 rounded-xl">
                                            <Utensils size={18} className="text-slate-400" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm">{entry.foodName}</p>
                                            <p className="text-[10px] text-slate-500 uppercase">{t(entry.mealType) || entry.mealType}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-sm text-primary">+{entry.calories}</p>
                                        <p className="text-[10px] text-slate-500 uppercase">kcal</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center p-8 bg-slate-900/50 rounded-3xl border border-dashed border-slate-700">
                                <p className="text-slate-500">{t('no_meals_today')}</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default History;
