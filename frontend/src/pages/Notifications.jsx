import React, { useState } from 'react';
import { Eye, MessageSquare, Megaphone, Download, ChevronDown, Bell } from 'lucide-react';

export default function Notifications() {
    // Mock data based on the design
    const [notifications] = useState([
        {
            id: 1,
            type: 'view',
            title: 'New view on TechNova Series A Deck',
            description: 'Venture Capital Partners viewed your pitch deck from the simplified link.',
            time: '2m ago',
            icon: Eye,
            iconColor: 'text-blue-500',
            iconBg: 'bg-blue-50'
        },
        {
            id: 2,
            type: 'message',
            title: 'Message from Sarah Jenkins',
            description: '"Hi team, we reviewed the deck and have a few questions regarding the go-to-market strategy..."',
            time: '1h ago',
            icon: MessageSquare,
            iconColor: 'text-green-500',
            iconBg: 'bg-green-50'
        },
        {
            id: 3,
            type: 'feature',
            title: 'New Feature: AI Pitch Analysis',
            description: 'Get instant feedback on your pitch deck structure and content with our new AI tools.',
            time: '4h ago',
            icon: Megaphone,
            iconColor: 'text-orange-500',
            iconBg: 'bg-orange-50'
        },
        {
            id: 4,
            type: 'view',
            title: 'New view on TechNova Series A Deck',
            description: 'Sequoia Capital viewed your pitch deck.',
            time: 'Yesterday',
            icon: Eye,
            iconColor: 'text-blue-500',
            iconBg: 'bg-blue-50'
        },
        {
            id: 5,
            type: 'download',
            title: 'Deck Downloaded',
            description: 'Michael Chen downloaded "TechNova Financials Q3".',
            time: '2 days ago',
            icon: Download,
            iconColor: 'text-purple-500',
            iconBg: 'bg-purple-50'
        }
    ]);

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Notifications</h1>
                    <p className="text-slate-500 mt-1">Stay updated on your pitch activity and messages.</p>
                </div>

                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors font-medium">
                    All Notifications
                    <ChevronDown size={16} />
                </button>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="divide-y divide-slate-100">
                    {notifications.map((notification) => (
                        <div key={notification.id} className="p-6 hover:bg-slate-50 transition-colors cursor-pointer group">
                            <div className="flex gap-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${notification.iconBg} ${notification.iconColor} flex-shrink-0`}>
                                    <notification.icon size={20} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-start justify-between">
                                        <h3 className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                                            {notification.title}
                                        </h3>
                                        <span className="text-xs text-slate-400 whitespace-nowrap ml-4">{notification.time}</span>
                                    </div>
                                    <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                                        {notification.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
                    <span className="text-xs text-slate-400">End of notifications</span>
                </div>
            </div>
        </div>
    );
}
