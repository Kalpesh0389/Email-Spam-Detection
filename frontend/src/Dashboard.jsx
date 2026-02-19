import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, RefreshCw, ArrowLeft } from 'lucide-react';
import StatCard from './components/StatCard';
import Charts from './components/Charts';
import RecentEmails from './components/RecentEmails';
import Spotlight from './components/Spotlight';

const Dashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedEmailIndex, setSelectedEmailIndex] = useState(null);
    const [spotlightLoading, setSpotlightLoading] = useState(false);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            // Updated to point to Flask Backend
            const response = await axios.get('http://127.0.0.1:5000/api/dashboard-data');
            setData(response.data);

            // Set initial spotlight if available
            if (response.data.spotlight) {
                // If the spotlight email matches one in the list, highlight it
                // Logic can be improved if IDs were available
            }
            if (response.data.emails && response.data.emails.length > 0) {
                // Default select the first one if not set
                if (selectedEmailIndex === null) setSelectedEmailIndex(0);
            }

            setError(null);
        } catch (err) {
            console.error(err);
            setError('Failed to load dashboard data. Ensure backend is running.');
        } finally {
            setLoading(false);
        }
    };

    const spotlightRef = React.useRef(null);

    const handleEmailSelect = async (index) => {
        setSelectedEmailIndex(index);
        const email = data.emails[index];

        // Scroll to spotlight
        if (spotlightRef.current) {
            spotlightRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        setSpotlightLoading(true);
        try {
            const response = await axios.post('http://127.0.0.1:5000/api/analyze', { text: email.body });

            // Update the spotlight data in state
            // We'll create a composite object to pass to Spotlight component
            const newSpotlight = {
                ...email,
                ...response.data
            };

            setData(prev => ({
                ...prev,
                spotlight: newSpotlight
            }));

        } catch (err) {
            console.error(err);
        } finally {
            setSpotlightLoading(false);
        }
    };

    if (loading && !data) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-400">
                <div className="flex flex-col items-center gap-4">
                    <RefreshCw className="animate-spin" size={40} />
                    <p className="font-medium animate-pulse">Loading Threat Intelligence...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 text-danger">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-2">Connection Error</h2>
                    <p className="mb-6">{error}</p>
                    <button
                        onClick={fetchDashboardData}
                        className="px-6 py-2 bg-primary text-white rounded-full font-bold hover:bg-primary-dark transition-colors"
                    >
                        Retry Connection
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-8 max-w-7xl mx-auto">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel p-6 mb-8 flex justify-between items-center"
            >
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-800 mb-1">
                        Spam Analysis Dashboard
                    </h1>
                    <div className="flex items-center gap-2 text-slate-500 font-medium text-sm">
                        <Activity size={16} className="text-success" />
                        <span>Live Threat Intelligence</span>
                    </div>
                </div>

                <div className="flex gap-4">
                    <button onClick={fetchDashboardData} className="p-2 rounded-full hover:bg-white/50 transition-colors text-slate-500 hover:text-primary" title="Refresh Data">
                        <RefreshCw size={20} />
                    </button>
                    <Link to="/" className="px-6 py-2 rounded-full border border-white/50 bg-white/30 text-slate-700 font-bold text-sm hover:bg-white/80 transition-all shadow-sm flex items-center gap-2">
                        <ArrowLeft size={16} /> Back to Home
                    </Link>
                </div>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard title="Analyzed Messages" value={data?.stats?.total} type="total" />
                <StatCard title="Spam Threat" value={data?.stats?.spam} type="spam" />
                <StatCard title="Safe Inbox" value={data?.stats?.ham} type="ham" />
            </div>

            {/* Spotlight Section */}
            <div ref={spotlightRef}>
                <Spotlight email={data?.spotlight} loading={spotlightLoading} />
            </div>

            {/* Charts Section */}
            <Charts chartData={data?.chart_data} />

            {/* Recent Emails */}
            <RecentEmails
                emails={data?.emails}
                onSelect={handleEmailSelect}
                selectedIndex={selectedEmailIndex}
            />
        </div>
    );
};

export default Dashboard;
