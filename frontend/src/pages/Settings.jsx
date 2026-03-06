import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Globe, Save, RotateCcw, ArrowLeft, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Settings = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [serverUrl, setServerUrl] = useState('');
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

    const defaultUrl = import.meta.env.VITE_API_URL || '';

    useEffect(() => {
        const savedUrl = localStorage.getItem('SERVER_URL');
        setServerUrl(savedUrl || defaultUrl);
    }, [defaultUrl]);

    const handleLanguageChange = (e) => {
        i18n.changeLanguage(e.target.value);
    };

    const handleSave = () => {
        if (!serverUrl && serverUrl !== '') { // Allow empty to reset
            // Proceed
        }

        try {
            if (serverUrl && !serverUrl.startsWith('http://') && !serverUrl.startsWith('https://')) {
                throw new Error('URL must start with http:// or https://');
            }

            if (serverUrl) {
                localStorage.setItem('SERVER_URL', serverUrl.trim());
            } else {
                localStorage.removeItem('SERVER_URL');
            }

            setIsError(false);
            setMessage(t('saved_successfully'));

            window.dispatchEvent(new Event('storage'));
        } catch (err) {
            setIsError(true);
            setMessage(err.message);
        }
    };

    const handleReset = () => {
        localStorage.removeItem('SERVER_URL');
        setServerUrl(defaultUrl);
        setIsError(false);
        setMessage(t('saved_successfully'));
        window.dispatchEvent(new Event('storage'));
    };

    return (
        <div className="p-6 max-w-lg mx-auto pb-32">
            <header className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 hover:bg-slate-800 rounded-full transition-colors"
                >
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-3xl font-bold">{t('settings_title')}</h1>
            </header>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-8 mb-6"
            >
                <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl">
                        <Globe size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">{t('language')}</h2>
                    </div>
                </div>

                <select
                    value={i18n.language}
                    onChange={handleLanguageChange}
                    className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl p-4 focus:outline-none focus:border-primary transition-all font-bold text-lg"
                >
                    <option value="en">🇺🇸 {t('english')}</option>
                    <option value="bg">🇧🇬 {t('bulgarian')}</option>
                </select>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-card p-8"
            >
                <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-primary/10 text-primary rounded-2xl">
                        <Globe size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">API Network</h2>
                    </div>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="text-[10px] uppercase font-bold text-slate-500 ml-4 mb-2 block">
                            {t('api_base_url')}
                        </label>
                        <input
                            type="text"
                            value={serverUrl}
                            onChange={(e) => setServerUrl(e.target.value)}
                            placeholder="http://192.168.1.X:5000"
                            className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl p-4 focus:outline-none focus:border-primary transition-all font-mono text-sm"
                        />
                    </div>

                    {message && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className={`p-4 rounded-2xl text-sm font-bold border ${isError
                                ? 'bg-red-500/10 text-red-400 border-red-500/30'
                                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                } flex items-start gap-3`}
                        >
                            {isError ? <AlertCircle size={18} className="shrink-0" /> : <Save size={18} className="shrink-0" />}
                            <span>{message}</span>
                        </motion.div>
                    )}

                    <div className="grid grid-cols-2 gap-4 pt-4">
                        <button
                            onClick={handleSave}
                            className="premium-gradient p-4 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                        >
                            <Save size={18} /> {t('save_settings')}
                        </button>
                        <button
                            onClick={handleReset}
                            className="bg-slate-800 hover:bg-slate-700 p-4 rounded-2xl font-black uppercase text-[10px] sm:text-xs tracking-widest flex items-center justify-center gap-2 transition-all"
                        >
                            <RotateCcw size={18} /> {t('reset_settings')}
                        </button>
                    </div>
                </div>
            </motion.div>

            <div className="mt-12 p-6 bg-slate-900/50 rounded-3xl border border-dashed border-slate-800 text-center">
                <p className="text-xs text-slate-500 uppercase font-black tracking-widest mb-4">Diagnostics</p>
                <div className="text-[10px] space-y-2 text-slate-500 font-mono">
                    <p>Current: {serverUrl}</p>
                    <p>Build Default: {defaultUrl || 'None'}</p>
                </div>
            </div>
        </div>
    );
};

export default Settings;
