import React from 'react';
import { Pie, Line, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    ArcElement
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    ArcElement
);

const Charts = ({ chartData }) => {
    if (!chartData) return null;

    const { spam_vs_ham, monthly_data } = chartData;

    const pieData = {
        labels: spam_vs_ham.labels,
        datasets: [
            {
                label: 'Messages',
                data: spam_vs_ham.data,
                backgroundColor: ['#f43f5e', '#10b981'],
                borderColor: '#ffffff',
                borderWidth: 2,
                hoverOffset: 20, // Creates a "pop-out" 3D effect on hover
                offset: 5,
                shadowOffsetX: 3,
                shadowOffsetY: 3,
                shadowBlur: 10,
                shadowColor: 'rgba(0,0,0,0.5)',
            },
        ],
    };

    const pieOptions = {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
            padding: 20
        },
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    usePointStyle: true,
                    font: { family: "'Inter', sans-serif", size: 12, weight: 'bold' },
                    padding: 20,
                    color: '#475569'
                }
            },
            tooltip: {
                backgroundColor: 'rgba(30, 41, 59, 0.9)',
                padding: 12,
                cornerRadius: 8,
                titleFont: { size: 13, family: "'Inter', sans-serif" },
                bodyFont: { size: 13, family: "'Inter', sans-serif" },
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.1)'
            }
        },
        elements: {
            arc: {
                // enhancing the 3D feel with rounded corners if supported or just clean segments
                borderWidth: 0
            }
        }
    };

    const monthlyBarData = {
        labels: monthly_data.labels,
        datasets: [
            {
                label: 'Spam',
                data: monthly_data.datasets[0].data,
                backgroundColor: '#f43f5e',
                borderRadius: 4,
                barPercentage: 0.6,
                categoryPercentage: 0.8
            },
            {
                label: 'Safe (Ham)',
                data: monthly_data.datasets[1].data,
                backgroundColor: '#10b981',
                borderRadius: 4,
                barPercentage: 0.6,
                categoryPercentage: 0.8
            }
        ]
    };

    const monthlyBarOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(226, 232, 240, 0.4)',
                    drawBorder: false,
                },
                ticks: {
                    color: '#64748b',
                    font: { family: "'Inter', sans-serif", weight: '500' },
                    precision: 0
                }
            },
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    color: '#64748b',
                    font: { family: "'Inter', sans-serif", weight: '500' }
                }
            },
        },
        plugins: {
            legend: {
                position: 'top',
                align: 'end',
                labels: {
                    usePointStyle: true,
                    boxWidth: 10,
                    font: { family: "'Inter', sans-serif", size: 12, weight: '600' },
                    color: '#475569'
                }
            },
            tooltip: {
                backgroundColor: 'rgba(30, 41, 59, 0.9)',
                padding: 12,
                titleFont: { family: "'Inter', sans-serif", size: 13 },
                bodyFont: { family: "'Inter', sans-serif", size: 12 },
                cornerRadius: 8,
                displayColors: false,
            }
        },
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
            <div className="glass-panel p-6 lg:col-span-2 h-[380px] flex flex-col">
                <h3 className="text-lg font-bold text-slate-800 mb-2">Spam Distribution</h3>
                <div className="flex-1 relative flex items-center justify-center p-2">
                    <Pie data={pieData} options={pieOptions} />
                    {/* Shadow for depth */}
                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-48 h-4 bg-black/10 blur-xl rounded-[100%] pointer-events-none"></div>
                </div>
            </div>

            <div className="glass-panel p-6 lg:col-span-3 h-[380px] flex flex-col">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Monthly Trends</h3>
                <div className="flex-1 relative">
                    <Bar data={monthlyBarData} options={monthlyBarOptions} />
                </div>
            </div>
        </div>
    );
};

export default Charts;
