import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, ChevronDown, Rocket, DollarSign, TrendingUp, Search } from 'lucide-react';
import Header from '../../components/layout/Header';
import { Button } from '../../components/ui/Button';
import api from '../../services/api';

const INDUSTRIES = ['All', 'Fintech', 'Healthcare', 'AI/ML', 'E-commerce', 'SaaS', 'CleanTech'];
const STAGES = ['All', 'Pre-Seed', 'Seed', 'Series A', 'Series B'];

export default function BrowsePitches() {
    const [pitches, setPitches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedIndustry, setSelectedIndustry] = useState('All');
    const [selectedStage, setSelectedStage] = useState('All');

    useEffect(() => {
        const fetchPitches = async () => {
            setLoading(true);
            try {
                const params = {};
                if (selectedIndustry !== 'All') params.industry = selectedIndustry;
                if (selectedStage !== 'All') params.stage = selectedStage;

                const res = await api.get('/pitches/feed', { params });
                setPitches(res.data);
            } catch (err) {
                console.error("Failed to load pitches", err);
                // Fallback data only on error (network issue)
                setPitches([
                    { id: 1, title: "EcoCharge", industry: "CleanTech", description: "Revolutionary battery swapping network for EVs.", stage: "Seed", raisingAmount: "$2.5M", equity: "15%", matchScore: 92 },
                    { id: 2, title: "MediSync", industry: "Healthcare", description: "AI-powered patient triage system for hospitals.", stage: "Series A", raisingAmount: "$5M", equity: "10%", matchScore: 88 },
                    { id: 3, title: "FinFlow", industry: "Fintech", description: "Automated cash flow management for SMEs.", stage: "Seed", raisingAmount: "$1.2M", equity: "12%", matchScore: 85 }
                ]);
            } finally {
                setLoading(false);
            }
        };
        fetchPitches();
    }, [selectedIndustry, selectedStage]);

    // Use pitches directly as backend handles filtering
    const filteredPitches = pitches;

    return (
        <div className="max-w-7xl mx-auto pb-10">
            <Header title="Browse Pitches" />

            {/* Filters Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide no-scrollbar">
                    {INDUSTRIES.map((ind) => (
                        <button
                            key={ind}
                            onClick={() => setSelectedIndustry(ind)}
                            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${selectedIndustry === ind
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                                : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-300 hover:text-blue-600'
                                }`}
                        >
                            {ind}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:border-blue-400 transition-colors">
                            <Filter size={16} />
                            <span>{selectedStage === 'All' ? 'Stage' : selectedStage}</span>
                            <ChevronDown size={14} />
                        </button>
                        {/* Simple Dropdown for Stage */}
                        <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 p-1 hidden group-focus-within:block z-20">
                            {STAGES.map(stage => (
                                <button
                                    key={stage}
                                    onClick={() => setSelectedStage(stage)}
                                    className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg"
                                >
                                    {stage}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            ) : (
                <motion.div
                    layout
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    <AnimatePresence>
                        {filteredPitches.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="col-span-full text-center py-20"
                            >
                                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Search size={24} className="text-slate-400" />
                                </div>
                                <h3 className="text-lg font-medium text-slate-900">No pitches found</h3>
                                <p className="text-slate-500">Try adjusting your filters to see more results.</p>
                            </motion.div>
                        ) : (
                            filteredPitches.map((pitch, index) => (
                                <PitchCard key={pitch.id || index} pitch={pitch} index={index} />
                            ))
                        )}
                    </AnimatePresence>
                </motion.div>
            )}
        </div>
    );
}

function PitchCard({ pitch, index }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 flex flex-col h-full"
        >
            <div className="h-48 bg-gradient-to-br from-slate-100 to-slate-200 relative overflow-hidden">
                {pitch.bannerUrl ? (
                    <img src={pitch.bannerUrl} alt={pitch.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <Rocket size={48} />
                    </div>
                )}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-slate-900 shadow-sm border border-white/50">
                    {pitch.matchScore ? `${pitch.matchScore}% Match` : 'New'}
                </div>
            </div>

            <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-3">
                    <div>
                        <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">{pitch.title}</h3>
                        <p className="text-sm text-slate-500 font-medium">{pitch.industry || 'Tech'}</p>
                    </div>
                    {/* Placeholder for Logo */}
                    <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shadow-sm">
                        <span className="text-xs font-bold text-slate-400">{pitch.title?.substring(0, 2).toUpperCase()}</span>
                    </div>
                </div>

                <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-3 flex-1">
                    {pitch.description}
                </p>

                <div className="grid grid-cols-2 gap-4 mb-6 pt-6 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                            <DollarSign size={14} />
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 uppercase font-semibold">Raising</p>
                            <p className="text-sm font-bold text-slate-900">{pitch.raising_amount || 'TBD'}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                            <TrendingUp size={14} />
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 uppercase font-semibold">Equity</p>
                            <p className="text-sm font-bold text-slate-900">{pitch.equity_percentage || 'Neg.'}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-auto">
                    <Button variant="outline" className="w-full">View Deck</Button>
                    <Button className="w-full">Connect</Button>
                </div>
            </div>
        </motion.div>
    );
}
