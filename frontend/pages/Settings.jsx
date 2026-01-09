import * as React from 'react';
import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { User, Save, Building2, Wallet, Globe, Linkedin, FileText, UserCircle } from 'lucide-react';
// Add missing Loader2 import since I used it above
import { Loader2 } from 'lucide-react';

const Settings = () => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const userData = await api.getMe();
            setUser(userData);

            let profileData;
            if (userData.role === 'startup') {
                profileData = await api.getMyStartupProfile();
            } else if (userData.role === 'investor') {
                profileData = await api.getMyInvestorProfile();
            }
            setProfile(profileData || {});
        } catch (e) {
            console.error("Failed to fetch settings data", e);
            setError("Failed to load profile data");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError(null);
        setSuccess(null);

        try {
            if (user.role === 'startup') {
                await api.updateStartupProfile(profile);
            } else {
                await api.updateInvestorProfile(profile);
            }
            setSuccess("Profile updated successfully!");
        } catch (err) {
            setError(err.message || "Failed to update profile");
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (field, value) => {
        setProfile((prev) => ({ ...prev, [field]: value }));
    };

    if (loading) return <div className="p-8">Loading settings...</div>;

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
                <p className="text-slate-500 mt-1">Manage your profile and account preferences</p>
            </div>

            {error && <div className="p-4 bg-red-50 text-red-600 rounded-xl">{error}</div>}
            {success && <div className="p-4 bg-emerald-50 text-emerald-600 rounded-xl">{success}</div>}

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="p-6 border-b border-slate-100 bg-slate-50">
                    <h2 className="font-bold text-lg text-slate-900">Profile Details</h2>
                    <p className="text-sm text-slate-500">Update your public profile information</p>
                </div>

                <form onSubmit={handleSave} className="p-8 space-y-6">
                    {/* Common Fields */}
                    {user?.role === 'startup' ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Company Name</label>
                                    <div className="relative">
                                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            type="text"
                                            value={profile.company_name || ''}
                                            onChange={(e) => handleChange('company_name', e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Industry</label>
                                    <input
                                        type="text"
                                        value={profile.industry || ''}
                                        onChange={(e) => handleChange('industry', e.target.value)}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Founder Name</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            type="text"
                                            value={profile.founder_name || ''}
                                            onChange={(e) => handleChange('founder_name', e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="e.g. John Doe"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Website URL</label>
                                    <div className="relative">
                                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            type="text"
                                            value={profile.website_url || ''}
                                            onChange={(e) => handleChange('website_url', e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="https://example.com"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">LinkedIn URL</label>
                                    <div className="relative">
                                        <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            type="text"
                                            value={profile.founder_linkedin || ''}
                                            onChange={(e) => handleChange('founder_linkedin', e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="https://linkedin.com/in/..."
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Resume / Deck URL</label>
                                    <div className="relative">
                                        <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            type="text"
                                            value={profile.resume_url || ''}
                                            onChange={(e) => handleChange('resume_url', e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Link to PDF/Doc"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Founder Bio</label>
                                <textarea
                                    rows={4}
                                    value={profile.founder_bio || ''}
                                    onChange={(e) => handleChange('founder_bio', e.target.value)}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Tell us about your background..."
                                />
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Investor Fields */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Firm Name</label>
                                    <div className="relative">
                                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            type="text"
                                            value={profile.firm_name || ''}
                                            onChange={(e) => handleChange('firm_name', e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Preferred Stage</label>
                                    <input
                                        type="text"
                                        value={profile.preferred_stage || ''}
                                        onChange={(e) => handleChange('preferred_stage', e.target.value)}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Contact Name</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            type="text"
                                            value={profile.contact_name || ''}
                                            onChange={(e) => handleChange('contact_name', e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="e.g. Jane Smith"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Website URL</label>
                                    <div className="relative">
                                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            type="text"
                                            value={profile.website_url || ''}
                                            onChange={(e) => handleChange('website_url', e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="https://vc-firm.com"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">LinkedIn URL</label>
                                    <div className="relative">
                                        <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            type="text"
                                            value={profile.linkedin_url || ''}
                                            onChange={(e) => handleChange('linkedin_url', e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="https://linkedin.com/in/..."
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Min Check Size ($)</label>
                                    <div className="relative">
                                        <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            type="number"
                                            value={profile.min_check_size || ''}
                                            onChange={(e) => handleChange('min_check_size', parseFloat(e.target.value))}
                                            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Max Check Size ($)</label>
                                    <div className="relative">
                                        <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            type="number"
                                            value={profile.max_check_size || ''}
                                            onChange={(e) => handleChange('max_check_size', parseFloat(e.target.value))}
                                            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Bio / Investment Thesis</label>
                                <textarea
                                    rows={4}
                                    value={profile.bio || ''}
                                    onChange={(e) => handleChange('bio', e.target.value)}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Describe your investment focus..."
                                />
                            </div>
                        </>
                    )}

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={saving}
                            className="px-6 py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                            {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>

            {/* Account Info Card (Read Only for now) */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="p-6 border-b border-slate-100 bg-slate-50">
                    <h2 className="font-bold text-lg text-slate-900">Account Information</h2>
                </div>
                <div className="p-8">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                            <UserCircle size={32} className="text-slate-400" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Email Address</p>
                            <p className="text-lg font-bold text-slate-900">{user?.email}</p>
                        </div>
                    </div>
                    {/* Could add password reset here later */}
                </div>
            </div>
        </div>
    );
};

export default Settings;
