import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, RefreshCw, Send, ShieldAlert, ShieldCheck, ArrowRight, Zap, Activity } from 'lucide-react';
import Spotlight from './Spotlight';

const Home = () => {
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleAnalyze = async (e) => {
        e.preventDefault();
        if (!text.trim()) return;

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await axios.post('http://127.0.0.1:5000/api/analyze', { text });
            // Adapt API response to match Spotlight component expectations if needed
            // The API returns { is_spam, entities, keywords, highlighted_body }
            // Spotlight expects an object with those keys plus subject/sender if available
            setResult({
                ...response.data,
                body: text, // Fallback
                subject: "Manual Analysis",
                sender: "You"
            });
        } catch (err) {
            console.error(err);
            setError('Analysis failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCheckLatest = async () => {
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await axios.get('http://127.0.0.1:5000/api/check-recent');
            setResult({
                ...response.data,
                // Ensure spotlight can render this
            });
        } catch (err) {
            console.error(err);
            if (err.response && err.response.status === 404) {
                setError('No emails found in the inbox.');
            } else {
                setError('Failed to fetch latest email.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-20 left-20 w-72 h-72 bg-violet-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
            <div className="absolute bottom-20 right-20 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-panel p-8 w-full max-w-2xl relative z-10 border-t-4 border-t-violet-500"
            >
                <div className="relative z-10">
                    <h2 className="text-4xl font-extrabold text-center mb-2 flex items-center justify-center gap-3">
                        <span className="bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent">
                            Spam Detective
                        </span>
                        <div className="bg-violet-100 p-2 rounded-xl text-violet-600">
                            <Mail size={28} />
                        </div>
                    </h2>
                    <p className="text-center text-slate-500 font-medium mb-8">AI-Powered Email Threat Analysis</p>

                    <form onSubmit={handleAnalyze} className="mb-8">
                        <div className="mb-6 relative group">
                            <textarea
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder="Paste your email content here for analysis..."
                                className="w-full h-40 p-4 rounded-xl border-2 border-slate-100 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 resize-none transition-all placeholder:text-slate-300 font-medium text-slate-700 bg-white/50 backdrop-blur-sm"
                                required
                            />
                            <div className="absolute bottom-3 right-3 text-slate-300">
                                <Zap size={16} fill="currentColor" />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-4 rounded-xl font-bold text-white shadow-lg shadow-violet-500/25 transition-all flex items-center justify-center gap-2 transform active:scale-[0.98]
                                ${loading ? 'bg-violet-400 cursor-wait' : 'bg-gradient-to-r from-violet-600 to-pink-600 hover:shadow-xl hover:-translate-y-1'}`}
                        >
                            {loading ? <RefreshCw className="animate-spin" /> : <Send size={20} />}
                            {loading ? 'Analyzing Intelligence...' : 'Analyze Text'}
                        </button>
                    </form>

                    <div className="flex items-center gap-4 mb-8">
                        <div className="h-px bg-slate-200 flex-1"></div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-1 rounded-full">OR</span>
                        <div className="h-px bg-slate-200 flex-1"></div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <button
                            onClick={handleCheckLatest}
                            disabled={loading}
                            className="py-3 px-6 rounded-xl border-2 border-emerald-500 text-emerald-600 font-bold hover:bg-emerald-50 transition-colors flex items-center justify-center gap-2"
                        >
                            <RefreshCw size={18} />
                            Check Latest
                        </button>

                        <button
                            onClick={() => navigate('/dashboard')}
                            className="py-3 px-6 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20 flex items-center justify-center gap-2"
                        >
                            <Activity size={18} />
                            Live Dashboard
                        </button>
                    </div>

                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="bg-rose-50 text-rose-600 p-4 rounded-xl text-center font-bold text-sm mb-6 border border-rose-100"
                            >
                                {error}
                            </motion.div>
                        )}

                        {result && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                            >
                                <Spotlight email={result} loading={false} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
};

export default Home;
