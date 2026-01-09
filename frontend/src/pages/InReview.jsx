import React, { useState, useEffect } from 'react';
import { FileText, Clock, CheckCircle } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function InReview() {
    const [pitches, setPitches] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const role = user?.role || 'startup';

    useEffect(() => {
        // For startup: fetch my pitches and filter
        // For investor: fetch assigned matches/reviews (placeholder for now)
        if (role === 'startup') {
            fetchStartupReviews();
        } else {
            setLoading(false); // Investor view not fully implemented backend-side for "assigned" reviews
        }
    }, [role]);

    const fetchStartupReviews = async () => {
        try {
            const response = await api.get('/pitches/my');
            // Filter where status is NOT draft
            const inReview = response.data.filter(p => p.status !== 'draft');
            setPitches(inReview);
        } catch (error) {
            console.error('Failed to fetch reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="text-center py-8">Loading...</div>;

    if (role === 'investor') {
        return (
            <div>
                <h1 className="text-2xl font-bold text-slate-900 mb-6">In Review</h1>
                <div className="p-8 bg-white rounded-xl border border-slate-200 text-center text-slate-500">
                    <p>Pitch review assignments will appear here.</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900">In Review</h1>
                <p className="text-slate-500 mt-1">Track the status of your submitted pitches.</p>
            </div>

            {pitches.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
                    <Clock size={48} className="mx-auto text-slate-300 mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 mb-2">No active reviews</h3>
                    <p className="text-slate-500">Pitches you submit will appear here while they are being reviewed by investors.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {pitches.map((pitch) => (
                        <div key={pitch.id} className="bg-white p-6 rounded-xl border border-slate-200 flex items-center gap-6">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0
                                ${pitch.status === 'funded' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                                {pitch.status === 'funded' ? <CheckCircle size={24} /> : <Clock size={24} />}
                            </div>

                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-slate-900">{pitch.title}</h3>
                                <p className="text-slate-500 text-sm">Submitted on {new Date(pitch.created_at).toLocaleDateString()}</p>
                            </div>

                            <div className="text-right">
                                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium capitalize
                                    ${pitch.status === 'funded' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                                    {pitch.status.replace('_', ' ')}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
