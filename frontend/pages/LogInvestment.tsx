import * as React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Loader2, DollarSign, Calendar, Building2, FileText, ArrowLeft, CheckCircle2 } from 'lucide-react';

const LogInvestment: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        startup_name: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        round: 'Seed',
        notes: '',
        status: 'Active'
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await api.createInvestment({
                ...formData,
                amount: parseFloat(formData.amount)
            });
            setSuccess(true);
            setTimeout(() => {
                navigate('/portfolio');
            }, 1500);
        } catch (err: any) {
            setError(err.message || 'Failed to log investment');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center text-slate-500 hover:text-slate-800 transition-colors mb-6 font-medium"
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
            </button>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50">
                    <h1 className="text-2xl font-bold text-slate-900">Log New Investment</h1>
                    <p className="text-slate-500 mt-1">Record a new addition to your investment portfolio</p>
                </div>

                <div className="p-8">
                    {success ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in zoom-in duration-300">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                <CheckCircle2 className="w-8 h-8 text-green-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Investment Logged!</h3>
                            <p className="text-slate-500">Redirecting to your portfolio...</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Section 1: Basic Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-slate-700">Startup Name</label>
                                    <div className="relative">
                                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                        <input
                                            type="text"
                                            name="startup_name"
                                            value={formData.startup_name}
                                            onChange={handleChange}
                                            required
                                            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-slate-900"
                                            placeholder="e.g. Acme Corp"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-slate-700">Investment Amount ($)</label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                        <input
                                            type="number"
                                            name="amount"
                                            value={formData.amount}
                                            onChange={handleChange}
                                            required
                                            min="0"
                                            step="0.01"
                                            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-slate-900"
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: Details */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-slate-700">Date Invested</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                        <input
                                            type="date"
                                            name="date"
                                            value={formData.date}
                                            onChange={handleChange}
                                            required
                                            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-slate-900"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-slate-700">Round</label>
                                    <select
                                        name="round"
                                        value={formData.round}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-slate-900"
                                    >
                                        <option value="Pre-Seed">Pre-Seed</option>
                                        <option value="Seed">Seed</option>
                                        <option value="Series A">Series A</option>
                                        <option value="Series B">Series B</option>
                                        <option value="Series C+">Series C+</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-slate-700">Status</label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-slate-900"
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Exited">Exited</option>
                                        <option value="Needs Attention">Needs Attention</option>
                                    </select>
                                </div>
                            </div>

                            {/* Section 3: Notes */}
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-slate-700">Notes (Optional)</label>
                                <div className="relative">
                                    <FileText className="absolute left-3 top-4 text-slate-400 w-5 h-5" />
                                    <textarea
                                        name="notes"
                                        value={formData.notes}
                                        onChange={handleChange}
                                        rows={4}
                                        className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-slate-900 resize-none"
                                        placeholder="Add any additional details about this investment..."
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="p-4 bg-red-50 text-red-700 rounded-xl text-sm font-medium flex items-center">
                                    {error}
                                </div>
                            )}

                            <div className="flex justify-end pt-4 border-t border-slate-100">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/30 flex items-center gap-2"
                                >
                                    {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Log Investment'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LogInvestment;
