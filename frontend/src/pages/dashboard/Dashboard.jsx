import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, DollarSign, Activity, Eye, ArrowRight, Briefcase } from 'lucide-react';
import Header from '../../components/layout/Header';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';

export default function Dashboard() {
    const { user } = useAuth();

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    // Quick Stats Config
    const stats = user?.role === 'startup' ? [
        { label: 'Profile Views', value: '1,234', change: '+12%', icon: Eye, color: 'blue' },
        { label: 'Pitch Downloads', value: '56', change: '+5%', icon: ArrowRight, color: 'emerald' },
        { label: 'Interest Level', value: 'High', change: 'Top 10%', icon: Activity, color: 'purple' },
    ] : [
        { label: 'Total Investments', value: '$4.2M', change: '+20%', icon: DollarSign, color: 'emerald' },
        { label: 'Active Deals', value: '12', change: '+2', icon: Briefcase, color: 'blue' },
        { label: 'Portfolio Growth', value: '18.5%', change: '+1.2%', icon: TrendingUp, color: 'purple' },
    ];

    return (
        <div className="max-w-7xl mx-auto pb-10">
            <Header title={`Welcome back, ${user?.email?.split('@')[0] || 'Member'}`} />

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-8"
            >
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            whileHover={{ y: -5 }}
                            className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-xl bg-${stat.color}-50 text-${stat.color}-600`}>
                                    <stat.icon size={24} />
                                </div>
                                <span className="flex items-center text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                                    {stat.change}
                                </span>
                            </div>
                            <h3 className="text-slate-500 text-sm font-medium">{stat.label}</h3>
                            <p className="text-3xl font-bold text-slate-900 mt-1">{stat.value}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Main Content Split: Activity & Quick Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent Activity Feed */}
                    <motion.div
                        variants={itemVariants}
                        className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-slate-900">Recent Activity</h2>
                            <Button variant="ghost" size="sm">View All</Button>
                        </div>

                        <div className="space-y-6">
                            {[1, 2, 3, 4].map((i) => (
                                <ActivityItem key={i} index={i} role={user?.role} />
                            ))}
                        </div>
                    </motion.div>

                    {/* Quick Actions / Sidebar Widget */}
                    <motion.div variants={itemVariants} className="space-y-6">
                        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg shadow-blue-200">
                            <h3 className="text-lg font-bold mb-2">Premium Features</h3>
                            <p className="text-blue-100 text-sm mb-6">Unlock advanced analytics and direct messaging with premium.</p>
                            <Button className="w-full bg-white text-blue-700 hover:bg-blue-50 border-none">Upgrade Now</Button>
                        </div>

                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                            <h3 className="font-bold text-slate-900 mb-4">Quick Actions</h3>
                            <div className="space-y-3">
                                <Button variant="outline" className="w-full justify-start text-slate-600">
                                    <Briefcase size={16} className="mr-2" />
                                    {user?.role === 'startup' ? 'Update Pitch Deck' : 'Find New Startups'}
                                </Button>
                                <Button variant="outline" className="w-full justify-start text-slate-600">
                                    <Users size={16} className="mr-2" />
                                    {user?.role === 'startup' ? 'Investor Matching' : 'Review Portfolio'}
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}

function ActivityItem({ index, role }) {
    const isStartup = role === 'startup';
    const text = isStartup
        ? ['New view from Sequoia Capital', 'Your pitch deck was downloaded', 'New message from Angel Investor', 'Match score updated']
        : ['New pitch: SolarGrid AI', 'Startup match found: EduTech Pro', 'Meeting scheduled with Founder', 'Portfolio update available'];

    return (
        <div className="flex gap-4 items-start group">
            <div className="relative">
                <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors z-10 relative">
                    <Activity size={18} />
                </div>
                {index !== 4 && <div className="absolute top-10 left-1/2 -translate-x-1/2 w-0.5 h-16 bg-slate-100 -z-0"></div>}
            </div>
            <div className="flex-1 pt-1">
                <p className="text-sm font-medium text-slate-900">{text[index - 1] || 'Activity Logged'}</p>
                <p className="text-xs text-slate-500 mt-1">2 hours ago</p>
            </div>
            <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity">
                Detail
            </Button>
        </div>
    );
}
