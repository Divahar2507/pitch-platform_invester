import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Rocket, Mail, Lock, Eye, EyeOff, Building, User, Phone } from 'lucide-react';
import api from '../../services/api';

export default function Register() {
    const [formData, setFormData] = useState({
        fullName: '',
        companyName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        role: 'startup' // Default to startup
    });

    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { register, login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            setIsLoading(false);
            return;
        }

        try {
            // 1. Register User
            await register(formData.email, formData.password, formData.role);

            // 2. Login
            await login(formData.email, formData.password);

            // 3. Create initial profile if Startup
            if (formData.role === 'startup' && formData.companyName) {
                try {
                    await api.post('/startup/profile', {
                        company_name: formData.companyName,
                        industry: "Technology", // Default
                        funding_stage: "Seed",   // Default
                        vision: "",
                        problem: "",
                        solution: ""
                    });
                } catch (profileError) {
                    console.error("Profile creation failed", profileError);
                    // Continue anyway, user can fix in dashboard
                }
            } else if (formData.role === 'investor') {
                // Investor profile creation could happen here too
                try {
                    await api.post('/investors/profile', {
                        firm_name: formData.companyName || "Independent Investor",
                        preferred_stage: "Seed",   // Default
                        focus_industries: "Technology"
                    });
                } catch (profileError) {
                    console.error("Profile creation failed", profileError);
                }
            }

            if (formData.role === 'investor') {
                navigate('/browse-pitches');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.detail || 'Registration failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex w-full">
            {/* Left Side - Visual */}
            <div className="hidden lg:flex flex-1 relative bg-blue-600">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-700 to-blue-500" />
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center mix-blend-multiply opacity-50" />

                <div className="relative z-10 flex flex-col justify-between h-full p-12 text-white">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-white/20 backdrop-blur rounded-lg flex items-center justify-center">
                            <Rocket size={20} className="text-white" />
                        </div>
                        <span className="text-xl font-bold">StartUpPitch</span>
                    </div>

                    <div className="max-w-md">
                        <h2 className="text-4xl font-bold mb-6">Start your fundraising journey today.</h2>
                        <p className="text-blue-100 text-lg mb-8">
                            Join thousands of startups connecting with top-tier investors. Create your pitch deck, track analytics, and get funded faster.
                        </p>

                        <div className="flex items-center gap-4">
                            <div className="flex -space-x-3">
                                {[1, 2, 3].map(i => (
                                    <img key={i} src={`https://i.pravatar.cc/100?img=${i + 20}`} className="w-10 h-10 rounded-full border-2 border-blue-600" alt="" />
                                ))}
                                <div className="w-10 h-10 rounded-full border-2 border-blue-600 bg-white/20 flex items-center justify-center text-xs font-bold">+2k</div>
                            </div>
                            <span className="text-sm font-medium">Trusted by founders worldwide</span>
                        </div>
                    </div>

                    <div className="text-sm text-blue-200">
                        © 2026 StartUpPitch Inc. Privacy Terms
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24 bg-white overflow-y-auto py-10">
                <div className="mx-auto w-full max-w-md">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">
                        Create your account
                    </h1>
                    <p className="text-slate-500 mb-8">
                        Get started with your free account today. No credit card required.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Role Selector */}
                        <div className="flex gap-4 mb-4">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, role: 'startup' })}
                                className={`flex-1 py-3 px-4 rounded-lg border-2 text-center text-sm font-medium transition-colors ${formData.role === 'startup' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}
                            >
                                I'm a Startup
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, role: 'investor' })}
                                className={`flex-1 py-3 px-4 rounded-lg border-2 text-center text-sm font-medium transition-colors ${formData.role === 'investor' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}
                            >
                                I'm an Investor
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="Full Name"
                                name="fullName"
                                placeholder="John Doe"
                                value={formData.fullName}
                                onChange={handleChange}
                            />
                            <Input
                                label={formData.role === 'startup' ? "Company Name" : "Firm Name"}
                                name="companyName"
                                placeholder={formData.role === 'startup' ? "Tech Innovations Inc." : "Venture Capital One"}
                                value={formData.companyName}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="Work Email"
                                name="email"
                                type="email"
                                placeholder="name@company.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                            <Input
                                label="Mobile Number"
                                name="phone"
                                placeholder="+1 (555) 000-0000"
                                value={formData.phone}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="relative">
                            <Input
                                label="Password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Create a password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-[34px] text-slate-400 hover:text-slate-600"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">Must be at least 8 characters.</p>

                        <Input
                            label="Confirm Password"
                            name="confirmPassword"
                            type="password"
                            placeholder="Confirm your password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />

                        <div className="flex items-center gap-2 mt-4">
                            <input type="checkbox" id="terms" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" required />
                            <label htmlFor="terms" className="text-sm text-slate-600">
                                I agree to the <a href="#" className="text-blue-600 hover:underline">Terms of Service</a> and <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
                            </label>
                        </div>

                        {error && (
                            <div className="text-sm text-red-500 bg-red-50 p-2 rounded">
                                {error}
                            </div>
                        )}

                        <Button type="submit" className="w-full mt-6" disabled={isLoading}>
                            {isLoading ? 'Creating Account...' : 'Create Account'}
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-sm">
                        <span className="text-slate-500">Already have an account? </span>
                        <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                            Log in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
