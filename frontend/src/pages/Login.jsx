import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Shield, Lock, User, ArrowRight, Loader2, Sparkles, Zap } from 'lucide-react';
import { cn } from '../lib/utils';
import { Button } from '../components/Button';

const Login = ({ initialIsSignUp = false }) => {
    const { login } = useApp();
    const [isLoading, setIsLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(initialIsSignUp);
    const [email, setEmail] = useState('admin@cybersecnexus.com');
    const [password, setPassword] = useState('password');
    const [name, setName] = useState('');

    const handleAuth = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => {
            if (isSignUp) {
                console.log("Registering user:", { name, email, password });
                login(email, password);
            } else {
                login(email, password);
            }
            setIsLoading(false);
        }, 1500);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 relative overflow-hidden">
            {/* Animated Grid Background */}
            <div className="absolute inset-0 z-0 opacity-10"
                style={{
                    backgroundImage: 'linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)',
                    backgroundSize: '50px 50px'
                }}
            />

            {/* Animated Gradient Orbs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[40%] -left-[20%] w-[80%] h-[80%] rounded-full bg-gradient-to-br from-orange-500/20 to-red-600/20 blur-[150px] animate-pulse" />
                <div className="absolute -bottom-[40%] -right-[20%] w-[80%] h-[80%] rounded-full bg-gradient-to-tl from-blue-500/20 to-cyan-500/20 blur-[150px] animate-pulse [animation-delay:1s]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 blur-[120px] animate-pulse [animation-delay:2s]" />
            </div>

            <div className="w-full max-w-md bg-white/5 backdrop-blur-2xl border border-white/10 p-10 rounded-[3rem] shadow-[0_0_80px_rgba(0,0,0,0.6)] relative z-10 mx-4 animate-in fade-in zoom-in-95 duration-700">
                {/* Logo & Header */}
                <div className="text-center mb-10">
                    <div className="relative inline-block mb-6">
                        <div className="absolute inset-0 bg-gradient-to-tr from-orange-500 to-red-600 rounded-[1.5rem] blur-xl opacity-50 animate-pulse" />
                        <div className="relative w-24 h-24 bg-gradient-to-tr from-orange-500 via-red-600 to-orange-500 rounded-[1.5rem] flex items-center justify-center shadow-2xl shadow-orange-500/30 transform hover:rotate-6 hover:scale-110 transition-all duration-300">
                            <Shield className="w-12 h-12 text-white drop-shadow-lg" strokeWidth={2.5} />
                        </div>
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tighter mb-3 bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
                        CyberSecNexus
                    </h1>
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <Sparkles className="w-4 h-4 text-orange-500 animate-pulse" />
                        <p className="text-gray-400 text-sm font-bold uppercase tracking-[0.2em]">
                            {isSignUp ? "Operator Registration" : "SOC Terminal Access"}
                        </p>
                        <Sparkles className="w-4 h-4 text-orange-500 animate-pulse" />
                    </div>
                    <p className="text-gray-500 text-xs font-medium">
                        {isSignUp ? "Initialize your security operator credentials" : "Authenticate to access the security operations center"}
                    </p>
                </div>

                <form onSubmit={handleAuth} className="space-y-6">
                    {isSignUp && (
                        <div className="space-y-2 animate-in fade-in slide-in-from-top-4 duration-500">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] ml-1">Operator Identity</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-orange-500 transition-all w-5 h-5 group-focus-within:scale-110" />
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-gray-950/50 border border-gray-800 text-white rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500/60 transition-all placeholder:text-gray-700 text-sm font-medium shadow-inner"
                                    placeholder="Full Name"
                                />
                            </div>
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] ml-1">Authentication ID</label>
                        <div className="relative group">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-orange-500 transition-all w-5 h-5 group-focus-within:scale-110" />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-gray-950/50 border border-gray-800 text-white rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500/60 transition-all placeholder:text-gray-700 text-sm font-medium shadow-inner"
                                placeholder="operator@nexus.soc"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] ml-1">Secure Passphrase</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-orange-500 transition-all w-5 h-5 group-focus-within:scale-110" />
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-gray-950/50 border border-gray-800 text-white rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500/60 transition-all placeholder:text-gray-700 text-sm font-medium shadow-inner"
                                placeholder="••••••••••••"
                            />
                        </div>
                    </div>

                    {!isSignUp && (
                        <div className="flex items-center justify-between text-xs px-1">
                            <label className="flex items-center gap-2 text-gray-500 cursor-pointer hover:text-gray-300 transition-colors group">
                                <input type="checkbox" className="w-4 h-4 rounded bg-gray-900 border-gray-700 text-orange-500 focus:ring-orange-500/30 transition-all cursor-pointer" />
                                <span className="font-bold tracking-tight">Persist Session</span>
                            </label>
                            <a href="#" className="text-orange-500 hover:text-orange-400 font-black tracking-tight uppercase text-[10px] hover:underline">
                                Recovery Protocol
                            </a>
                        </div>
                    )}

                    <Button
                        type="submit"
                        isLoading={isLoading}
                        variant="orange"
                        className="w-full py-5 text-sm font-black tracking-[0.2em] uppercase shadow-2xl shadow-orange-500/30 hover:shadow-orange-500/50 transition-all mt-4"
                    >
                        {isLoading ? (
                            "Authenticating..."
                        ) : (
                            <div className="flex items-center justify-center gap-2">
                                <Zap className="w-4 h-4" />
                                {isSignUp ? "Deploy Operator" : "Initialize Access"}
                                <ArrowRight className="w-4 h-4" />
                            </div>
                        )}
                    </Button>
                </form>

                {/* Toggle Sign In / Sign Up */}
                <div className="mt-8 text-center">
                    <button
                        onClick={() => setIsSignUp(!isSignUp)}
                        className="text-gray-500 hover:text-white text-xs font-bold transition-colors group"
                    >
                        {isSignUp ? (
                            <>Existing operator? <span className="text-orange-500 group-hover:text-orange-400 font-black uppercase tracking-wider">Authenticate →</span></>
                        ) : (
                            <>New to the SOC? <span className="text-orange-500 group-hover:text-orange-400 font-black uppercase tracking-wider">Register →</span></>
                        )}
                    </button>
                </div>

                {/* Footer */}
                <div className="mt-12 pt-8 border-t border-white/5 text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-lg shadow-emerald-500/50" />
                        <p className="text-[9px] text-gray-600 font-black uppercase tracking-[0.3em]">
                            System Online
                        </p>
                    </div>
                    <p className="text-[10px] text-gray-700 font-black uppercase tracking-[0.25em]">
                        © 2025 CyberSecNexus // Neural Core v4.2.1
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
