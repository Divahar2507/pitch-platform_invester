import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, FileText, Calendar, DollarSign, PieChart } from 'lucide-react';
import api from '../../services/api';

export default function MyPitches() {
    const [pitches, setPitches] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchPitches();
    }, []);

    const fetchPitches = async () => {
        try {
            const response = await api.get('/pitches/my');
            setPitches(response.data);
        } catch (error) {
            console.error('Failed to fetch pitches:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="text-center py-8">Loading pitches...</div>;
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">My Pitches</h1>
                    <p className="text-slate-500 mt-1">Manage your pitch decks and fundraising campaigns.</p>
                </div>
                <button
                    onClick={() => navigate('/upload-pitch')}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus size={20} />
                    <span>New Pitch</span>
                </button>
            </div>

            {pitches.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
                    <FileText size={48} className="mx-auto text-slate-300 mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 mb-2">No pitches yet</h3>
                    <p className="text-slate-500 mb-6">Upload your first pitch deck to start fundraising.</p>
                    <button
                        onClick={() => navigate('/upload-pitch')}
                        className="text-blue-600 font-medium hover:text-blue-700"
                    >
                        Create your first pitch &rarr;
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pitches.map((pitch) => (
                        <div key={pitch.id} className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                                    <FileText size={24} />
                                </div>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize 
                                    ${pitch.status === 'draft' ? 'bg-slate-100 text-slate-600' :
                                        pitch.status === 'under_review' ? 'bg-orange-100 text-orange-600' :
                                            'bg-green-100 text-green-600'}`}>
                                    {pitch.status.replace('_', ' ')}
                                </span>
                            </div>

                            <h3 className="text-lg font-semibold text-slate-900 mb-2">{pitch.title}</h3>
                            <p className="text-slate-500 text-sm mb-4 line-clamp-2">{pitch.description}</p>

                            <div className="space-y-2 mb-4">
                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                    <DollarSign size={16} className="text-slate-400" />
                                    <span>{pitch.raising_amount || 'Amount not set'}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                    <PieChart size={16} className="text-slate-400" />
                                    <span>{pitch.equity_percentage || 'Equity not set'}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                    <Calendar size={16} className="text-slate-400" />
                                    <span>{new Date(pitch.created_at).toLocaleDateString()}</span>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-100 flex gap-2">
                                <a
                                    href={pitch.pitch_file_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 px-3 py-2 text-center text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                                >
                                    View Deck
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
