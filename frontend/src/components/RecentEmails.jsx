import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, ShieldCheck, Mail } from 'lucide-react';

const RecentEmails = ({ emails, onSelect, selectedIndex }) => {
    if (!emails || emails.length === 0) {
        return (
            <div className="glass-panel p-8 text-center text-slate-400 italic">
                No recent emails found.
            </div>
        );
    }

    return (
        <div className="glass-panel p-6 overflow-hidden">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-dark">Recent Intercepts</h3>
                <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                    Last {emails.length} Emails
                </span>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="border-b border-slate-100">
                            <th className="text-left py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                            <th className="text-left py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Subject</th>
                            <th className="text-left py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Sender</th>
                            <th className="text-left py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {emails.map((email, index) => (
                            <motion.tr
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                onClick={() => onSelect(index)}
                                className={`cursor-pointer transition-colors border-b border-slate-50 hover:bg-slate-50/80 ${selectedIndex === index ? 'bg-primary/5 border-primary/20' : ''
                                    }`}
                            >
                                <td className="py-3 px-4">
                                    {email.is_spam ? (
                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-danger/10 text-danger">
                                            <ShieldAlert size={12} /> Spam
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-success/10 text-success">
                                            <ShieldCheck size={12} /> Safe
                                        </span>
                                    )}
                                </td>
                                <td className="py-3 px-4 text-sm font-medium text-dark max-w-[200px] truncate">
                                    {email.subject || '(No Subject)'}
                                </td>
                                <td className="py-3 px-4 text-sm text-slate-600 max-w-[150px] truncate">
                                    {email.sender}
                                </td>
                                <td className="py-3 px-4 text-xs text-slate-400 whitespace-nowrap">
                                    {/* Date formatting could go here if needed */}
                                    {email.date ? new Date(email.date).toLocaleDateString() : '-'}
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RecentEmails;
