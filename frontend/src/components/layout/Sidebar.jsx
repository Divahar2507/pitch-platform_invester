import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    LayoutDashboard,
    Search,
    Briefcase,
    MessageSquare,
    Settings,
    LogOut,
    FileText,
    PieChart,
    Rocket
} from 'lucide-react';
import { clsx } from 'clsx';

export default function Sidebar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const role = user?.role || 'startup'; // Default fallback

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const NavItem = ({ to, icon: Icon, label }) => (
        <NavLink
            to={to}
            className={({ isActive }) => clsx(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors mb-1",
                isActive
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            )}
        >
            <Icon size={20} />
            <span>{label}</span>
        </NavLink>
    );

    return (
        <div className="w-64 h-screen bg-white border-r border-slate-200 flex flex-col fixed left-0 top-0">
            <div className="p-6">
                <div className="flex items-center gap-2 text-blue-600">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                        <Rocket size={20} className="fill-current" />
                    </div>
                    <span className="text-xl font-bold text-slate-900">VentureFlow</span>
                </div>
                <div className="mt-1 text-xs text-slate-500 pl-10">
                    {role === 'startup' ? 'Founder Portal' : 'Investor Portal'}
                </div>
            </div>

            <nav className="flex-1 px-4 py-4 overflow-y-auto">
                <NavItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" />

                {role === 'investor' && (
                    <>
                        <NavItem to="/browse-pitches" icon={Search} label="Browse Pitches" />
                        <NavItem to="/portfolio" icon={PieChart} label="My Portfolio" />
                        <NavItem to="/in-review" icon={FileText} label="In Review" />
                    </>
                )}

                {role === 'startup' && (
                    <>
                        <NavItem to="/my-pitches" icon={Briefcase} label="My Pitches" />
                        <NavItem to="/upload-pitch" icon={FileText} label="Upload Pitch" />
                        <NavItem to="/in-review" icon={FileText} label="In Review" />
                    </>
                )}

                <NavItem to="/messages" icon={MessageSquare} label="Messages" />
            </nav>

            <div className="p-4 border-t border-slate-200">
                <NavItem to="/settings" icon={Settings} label="Settings" />
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors mt-1"
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>

            {/* User Profile Snippet */}
            <div className="p-4 border-t border-slate-200 flex items-center gap-3">
                <img
                    src={`https://ui-avatars.com/api/?name=${user?.email || 'User'}&background=random`}
                    alt="Profile"
                    className="w-10 h-10 rounded-full"
                />
                <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-medium text-slate-900 truncate">{user?.email}</p>
                    <p className="text-xs text-slate-500 capitalize">{role}</p>
                </div>
            </div>
        </div>
    );
}
