import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, User } from 'lucide-react';

export default function Header({ title }) {
    const navigate = useNavigate();
    return (
        <header className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-slate-900">{title}</h1>

            <div className="flex items-center gap-4">
                <div className="relative w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search startups, sectors..."
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    />
                </div>

                <button
                    onClick={() => navigate('/notifications')}
                    className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                >
                    <Bell size={20} />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
            </div>
        </header>
    );
}
