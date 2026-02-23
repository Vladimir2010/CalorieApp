import { useState, useRef } from 'react';
import api from '../api';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera as CameraIcon, Upload, Loader2, Check, X, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';

const Camera = () => {
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState(null);
    const [mealType, setMealType] = useState('lunch');
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
            setResult(null);
        }
    };

    const handleAnalyze = async () => {
        if (!image) return;
        setAnalyzing(true);
        const formData = new FormData();
        formData.append('image', image);

        try {
            const token = localStorage.getItem('token');
            const res = await api.post('/api/ai/analyze', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            });
            setResult(res.data.data);
        } catch (err) {
            alert('Analysis failed: ' + (err.response?.data?.message || 'Check connection'));
        } finally {
            setAnalyzing(false);
        }
    };

    const handleConfirm = async () => {
        try {
            const token = localStorage.getItem('token');
            const date = new Date().toISOString().split('T')[0];

            // First, we might need to search for this food in our DB or the AI provides macros.
            // Our backend 'addEntry' expects a foodId. 
            // IMPROVEMENT: If AI returns a new food, we should probably create it or our backend should handle 'name' directly.
            // For now, let's assume we create a 'temp' food or use a general 'AI Detected' food ID.
            // SIMPLIFICATION for Demo: Create the food first.

            const foodRes = await api.post('/api/foods', {
                name: result.name,
                calories: result.calories,
                protein: result.protein || 0,
                carbs: result.carbs || 0,
                fat: result.fat || 0,
                servingSize: { amount: 1, unit: 'portion' }
            }, { headers: { Authorization: `Bearer ${token}` } });

            await api.post('/api/logs', {
                date,
                foodId: foodRes.data._id,
                quantity: 1,
                mealType
            }, { headers: { Authorization: `Bearer ${token}` } });

            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#22c55e', '#3b82f6', '#f59e0b']
            });

            // Reset
            setImage(null);
            setPreview(null);
            setResult(null);
            alert('Success! Food added to your log.');
        } catch (err) {
            alert('Failed to log: ' + err.message);
        }
    };

    return (
        <div className="p-6 max-w-lg mx-auto">
            <h1 className="text-3xl font-bold mb-6">AI Scanner</h1>

            <div className="glass-card aspect-square mb-6 overflow-hidden flex flex-col items-center justify-center relative">
                {preview ? (
                    <img src={preview} alt="Food" className="w-full h-full object-cover" />
                ) : (
                    <div className="text-center p-10">
                        <CameraIcon size={64} className="text-slate-700 mb-4 mx-auto" />
                        <p className="text-slate-500 font-medium">Capture or upload your meal</p>
                    </div>
                )}

                <AnimatePresence>
                    {analyzing && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/80 backdrop-blur-md flex flex-col items-center justify-center"
                        >
                            <Loader2 size={48} className="text-primary animate-spin mb-4" />
                            <p className="font-bold tracking-widest uppercase text-xs">AI is analyzing...</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {!result ? (
                <div className="space-y-4">
                    <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                    />

                    {!preview ? (
                        <button
                            onClick={() => fileInputRef.current.click()}
                            className="w-full premium-gradient py-4 rounded-2xl font-bold flex items-center justify-center gap-2"
                        >
                            <CameraIcon size={20} /> Take Photo
                        </button>
                    ) : (
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => fileInputRef.current.click()}
                                className="glass-card py-4 font-bold flex items-center justify-center gap-2"
                            >
                                <RefreshCw size={20} /> Retake
                            </button>
                            <button
                                onClick={handleAnalyze}
                                disabled={analyzing}
                                className="premium-gradient py-4 rounded-2xl font-bold flex items-center justify-center gap-2"
                            >
                                <Upload size={20} /> Analyze
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-6 border-primary/50"
                >
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <span className="text-primary text-xs font-bold uppercase tracking-widest">Detection Result</span>
                            <h2 className="text-2xl font-black">{result.name}</h2>
                            <p className="text-slate-400">Confidence: {Math.round(result.confidence * 100)}%</p>
                        </div>
                        <div className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-bold">
                            {result.calories} kcal
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mb-6">
                        <div className="bg-slate-900/50 p-2 rounded-xl text-center">
                            <p className="text-[10px] text-slate-500 uppercase">Protein</p>
                            <p className="font-bold">{result.protein}g</p>
                        </div>
                        <div className="bg-slate-900/50 p-2 rounded-xl text-center">
                            <p className="text-[10px] text-slate-500 uppercase">Carbs</p>
                            <p className="font-bold">{result.carbs}g</p>
                        </div>
                        <div className="bg-slate-900/50 p-2 rounded-xl text-center">
                            <p className="text-[10px] text-slate-500 uppercase">Fat</p>
                            <p className="font-bold">{result.fat}g</p>
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="text-xs text-slate-500 uppercase font-bold block mb-2">Meal Type</label>
                        <div className="flex gap-2">
                            {['breakfast', 'lunch', 'dinner', 'snack'].map(type => (
                                <button
                                    key={type}
                                    onClick={() => setMealType(type)}
                                    className={`flex-1 py-2 text-[10px] uppercase font-bold rounded-lg transition-all ${mealType === type ? 'bg-primary text-white' : 'bg-slate-800 text-slate-500'
                                        }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={() => setResult(null)}
                            className="flex-1 glass-card py-4 font-bold flex items-center justify-center gap-2"
                        >
                            <X size={20} /> Reject
                        </button>
                        <button
                            onClick={handleConfirm}
                            className="flex-1 premium-gradient py-4 rounded-2xl font-bold flex items-center justify-center gap-2"
                        >
                            <Check size={20} /> Add to Log
                        </button>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default Camera;
