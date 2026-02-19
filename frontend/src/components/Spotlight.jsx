import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tag, Database, Cpu, MessageSquare, Shield, AlertTriangle, CheckCircle, Terminal } from 'lucide-react';

const Spotlight = ({ email, loading }) => {
    if (!email && !loading) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-panel p-12 text-center flex flex-col items-center justify-center gap-4 border-2 border-dashed border-slate-200"
            >
                <div className="bg-slate-50 p-4 rounded-full text-slate-300">
                    <MessageSquare size={48} />
                </div>
                <p className="text-slate-400 font-medium text-lg">Select an email to view detailed threat analysis.</p>
            </motion.div>
        );
    }

    const isSpam = email?.is_spam;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`glass-panel p-0 mb-8 overflow-hidden border-2 ${isSpam ? 'border-rose-500/30' : 'border-emerald-500/30'} shadow-2xl`}
        >
            {/* Header Section */}
            <div className={`relative p-6 border-b ${isSpam ? 'bg-gradient-to-r from-rose-50 to-white border-rose-100' : 'bg-gradient-to-r from-emerald-50 to-white border-emerald-100'}`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-2xl shadow-lg ${isSpam ? 'bg-rose-500 text-white shadow-rose-500/30' : 'bg-emerald-500 text-white shadow-emerald-500/30'}`}>
                            {isSpam ? <Shield size={24} /> : <CheckCircle size={24} />}
                        </div>
                        <div>
                            <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">Analysis Spotlight</h2>
                            <div className="flex items-center gap-2">
                                <Cpu size={12} className="text-slate-400" />
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">AI-Powered Threat Intelligence</p>
                            </div>
                        </div>
                    </div>

                    <div className={`px-5 py-2.5 rounded-full text-sm font-black uppercase tracking-wide flex items-center gap-3 shadow-inner
                        ${isSpam ? 'bg-rose-100 text-rose-600 border border-rose-200' : 'bg-emerald-100 text-emerald-600 border border-emerald-200'}`}>
                        <span className="relative flex h-3 w-3">
                            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isSpam ? 'bg-rose-500' : 'bg-emerald-500'}`}></span>
                            <span className={`relative inline-flex rounded-full h-3 w-3 ${isSpam ? 'bg-rose-600' : 'bg-emerald-600'}`}></span>
                        </span>
                        {isSpam ? "Threat Detected" : "Clean Message"}
                    </div>
                </div>

                {/* Decorative Background Blur */}
                <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-20 transform translate-x-1/2 -translate-y-1/2 pointer-events-none
                    ${isSpam ? 'bg-rose-500' : 'bg-emerald-500'}`}></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
                {/* Email Content Viewer */}
                <div className="lg:col-span-2 p-8 bg-white/50 backdrop-blur-sm">
                    <div className="mb-6 space-y-3 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                        <div className="flex items-start gap-3">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1 w-16">Subject</span>
                            <span className="text-slate-800 font-bold text-lg leading-tight">{email?.subject}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider w-16">From</span>
                            <span className="text-slate-600 font-mono text-sm bg-slate-100 px-2 py-1 rounded-md border border-slate-200">{email?.sender}</span>
                        </div>
                    </div>

                    <div className="relative group">
                        <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 border border-slate-200 px-2 py-1 rounded shadow-sm">Raw Content</span>
                        </div>
                        <div className="absolute -inset-1 bg-gradient-to-r from-violet-500 to-pink-500 rounded-xl blur opacity-10 group-hover:opacity-20 transition duration-1000 group-hover:duration-200"></div>

                        {loading ? (
                            <div className="relative bg-white h-[300px] flex flex-col items-center justify-center text-slate-400 rounded-xl border border-slate-200">
                                <Cpu className="animate-bounce mb-4 text-violet-500" size={32} />
                                <span className="animate-pulse font-medium">Analyzing content patterns...</span>
                            </div>
                        ) : (
                            <div
                                className="relative bg-white prose prose-sm max-w-none text-slate-600 rounded-xl border border-slate-200 p-6 h-[300px] overflow-y-auto custom-scrollbar font-sans text-sm leading-relaxed shadow-inner"
                                dangerouslySetInnerHTML={{ __html: email?.highlighted_body || email?.body }}
                            />
                        )}
                    </div>
                </div>

                {/* NLP Insights Panel */}
                <div className="bg-slate-50/80 p-6 flex flex-col gap-6 backdrop-blur-md">

                    {/* Security Score (Visual Only for now) */}
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                            <Terminal size={14} /> Confidence Score
                        </h4>
                        <div className="relative pt-1">
                            <div className="flex mb-2 items-center justify-between">
                                <div className="text-right">
                                    <span className={`text-2xl font-black inline-block ${isSpam ? 'text-rose-600' : 'text-emerald-600'}`}>
                                        {isSpam ? '98%' : '100%'}
                                    </span>
                                </div>
                                <div className={`text-xs font-bold px-2 py-1 rounded ${isSpam ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                    {isSpam ? 'HIGH RISK' : 'SAFE'}
                                </div>
                            </div>
                            <div className="overflow-hidden h-2 mb-1 text-xs flex rounded-full bg-slate-100">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: isSpam ? '98%' : '100%' }}
                                    transition={{ duration: 1, delay: 0.5 }}
                                    className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${isSpam ? 'bg-rose-500' : 'bg-emerald-500'}`}
                                ></motion.div>
                            </div>
                        </div>
                    </div>

                    {/* Keywords */}
                    <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <Tag size={14} /> Trigger Words
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {email?.keywords && email.keywords.length > 0 ? (
                                email.keywords.map((keyword, i) => (
                                    <motion.span
                                        key={i}
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="px-3 py-1 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-[11px] font-bold rounded-lg shadow-md shadow-violet-500/20"
                                    >
                                        #{keyword}
                                    </motion.span>
                                ))
                            ) : (
                                <span className="text-xs text-slate-400 italic bg-slate-100 px-3 py-1 rounded-lg">No triggers found.</span>
                            )}
                        </div>
                    </div>

                    {/* Entities */}
                    <div className="flex-1 overflow-hidden flex flex-col">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <Database size={14} /> Named Entities
                        </h4>

                        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden flex-1 relative shadow-sm h-[200px]">
                            <div className="absolute inset-0 overflow-y-auto custom-scrollbar">
                                {email?.entities && email.entities.length > 0 ? (
                                    <table className="w-full text-xs">
                                        <thead className="bg-slate-50 border-b border-slate-100 sticky top-0 z-10">
                                            <tr>
                                                <th className="px-3 py-2 text-left font-bold text-slate-400 uppercase tracking-wider text-[10px]">Type</th>
                                                <th className="px-3 py-2 text-left font-bold text-slate-400 uppercase tracking-wider text-[10px]">Value</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50">
                                            {email.entities.map((ent, i) => (
                                                <tr key={i} className="group hover:bg-slate-50 transition-colors">
                                                    <td className="px-3 py-2">
                                                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-600 border border-indigo-100">
                                                            {ent.label}
                                                        </span>
                                                    </td>
                                                    <td className="px-3 py-2 text-slate-700 font-medium break-all">{ent.text}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-xs text-slate-300 italic p-4 gap-2">
                                        <Database size={24} className="opacity-20" />
                                        No named entities detected.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </motion.div>
    );
};

export default Spotlight;
