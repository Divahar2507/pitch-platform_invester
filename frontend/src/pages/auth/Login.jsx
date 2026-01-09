import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Rocket, Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const userData = await login(email, password);
            if (userData?.role === 'investor') {
                navigate('/browse-pitches');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            setError('Invalid email or password');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex w-full">
            {/* Left Side - Form */}
            <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24 bg-white">
                <div className="mx-auto w-full max-w-sm lg:w-96">
                    <div className="flex items-center gap-2 mb-8">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                            <Rocket size={20} className="fill-current" />
                        </div>
                        <span className="text-xl font-bold text-slate-900">StartUpPitch</span>
                    </div>

                    <div className="mb-8">
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">
                            Welcome back
                        </h1>
                        <p className="text-slate-500">
                            Access your pitch decks and investor network.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input
                            label="Email Address"
                            type="email"
                            placeholder="founder@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            icon={Mail}
                            required
                        />

                        <div className="relative">
                            <Input
                                label="Password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                icon={Lock}
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

                        <div className="flex items-center justify-end">
                            <div className="text-sm">
                                <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                                    Forgot Password?
                                </a>
                            </div>
                        </div>

                        {error && (
                            <div className="text-sm text-red-500 bg-red-50 p-2 rounded">
                                {error}
                            </div>
                        )}

                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? 'Logging in...' : 'Log In'}
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-sm">
                        <span className="text-slate-500">New user? </span>
                        <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
                            Create an account
                        </Link>
                    </div>
                </div>
            </div>

            {/* Right Side - Visual */}
            <div className="hidden lg:flex flex-1 relative bg-slate-900">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-slate-900 opacity-90" />
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center mix-blend-overlay" />

                <div className="relative z-10 flex flex-col justify-center items-center h-full text-center px-12">
                    <div className="w-16 h-16 bg-white/10 backdrop-blur-lg rounded-2xl flex items-center justify-center mb-8 border border-white/20">
                        <Rocket size={32} className="text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Connect with over 500+ Angel Investors
                    </h2>
                    <p className="text-blue-100 text-lg max-w-md">
                        Join the fastest-growing network for startups and secure your next round of funding with ease.
                    </p>

                    <div className="mt-12 flex -space-x-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <img
                                key={i}
                                className="w-10 h-10 rounded-full border-2 border-slate-900"
                                src={`https://i.pravatar.cc/100?img=${i + 10}`}
                                alt="User"
                            />
                        ))}
                        <div className="w-10 h-10 rounded-full border-2 border-slate-900 bg-white flex items-center justify-center text-xs font-bold text-slate-900">
                            +2k
                        </div>
                    </div>
                    <p className="mt-4 text-sm text-blue-200">Joined by 2,000+ founders this month</p>
                </div>
            </div>
        </div>
    );
}
