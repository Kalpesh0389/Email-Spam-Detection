import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, type }) => {
    const getStyles = () => {
        switch (type) {
            case 'spam':
                return {
                    accent: 'text-rose-500',
                    bgAccent: 'bg-rose-500',
                    gradient: 'from-rose-50 to-rose-100/50',
                    icon: '🚨'
                };
            case 'ham':
                return {
                    accent: 'text-emerald-500',
                    bgAccent: 'bg-emerald-500',
                    gradient: 'from-emerald-50 to-emerald-100/50',
                    icon: '✅'
                };
            default:
                return {
                    accent: 'text-violet-600',
                    bgAccent: 'bg-violet-600',
                    gradient: 'from-violet-50 to-violet-100/50',
                    icon: '📧'
                };
        }
    };

    const styles = getStyles();

    return (
        <motion.div
            whileHover={{ y: -5 }}
            className={`glass-panel p-6 relative overflow-hidden bg-gradient-to-br ${styles.gradient} border-b-4 ${styles.type === 'spam' ? 'border-rose-400' : styles.type === 'ham' ? 'border-emerald-400' : 'border-violet-400'}`}
        >
            <div className={`absolute -right-6 -top-6 w-32 h-32 rounded-full opacity-10 ${styles.bgAccent} blur-2xl`}></div>

            <div className="relative z-10">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-2">
                    <span>{styles.icon}</span> {title}
                </h3>
                <div className={`text-4xl font-extrabold ${styles.accent}`}>
                    {value}
                </div>
            </div>
        </motion.div>
    );
};

export default StatCard;
