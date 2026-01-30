import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Shield,
    Zap,
    Activity,
    Globe,
    AlertCircle,
    CheckCircle2,
    Search,
    ShieldAlert,
    ShieldCheck,
    ArrowRight,
    Cpu,
    Lock,
    Loader2,
    HardDrive,
    FileSearch,
    Usb,
    Radio
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar
} from 'recharts';
import PaymentModal from '../components/PaymentModal';

const Dashboard = () => {
    const { stats, fetchEvents, events, licenseTier, upgradeToPlatinum } = useApp();
    const [scanData, setScanData] = useState(null);
    const [isScanning, setIsScanning] = useState(false);
    const [isUpgrading, setIsUpgrading] = useState(false);
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);
    const [layers, setLayers] = useState({});

    const isPlatinum = licenseTier === 'platinum';

    const fetchLayers = async () => {
        try {
            const res = await fetch('/api/protection-layers');
            const data = await res.json();
            setLayers(data.layers);
        } catch (error) { }
    };

    useEffect(() => {
        fetchLayers();
        const interval = setInterval(fetchLayers, 15000);
        return () => clearInterval(interval);
    }, []);

    const handleUpgradeClick = () => {
        setIsPaymentOpen(true);
    };

    const handlePaymentComplete = async () => {
        setIsUpgrading(true);
        await upgradeToPlatinum();
        setIsUpgrading(false);
        setIsPaymentOpen(false);
    };

    const runSystemScan = async () => {
        setIsScanning(true);
        try {
            const res = await fetch('/api/system-scan');
            const data = await res.json();
            setScanData(data.data);
        } catch (error) {
            console.error('Scan failed', error);
        }
        setTimeout(() => setIsScanning(false), 2000); // UI delay for feel
    };

    return (
        <div className="space-y-6">
            {/* Top Bar / Brand */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-blue-900 to-indigo-900 p-8 rounded-3xl shadow-xl border border-blue-800 relative overflow-hidden">
                <div className="absolute top-0 right-0 opacity-10 -translate-y-1/2 translate-x-1/4">
                    <Shield size={300} />
                </div>
                <div className="relative z-10">
                    <h1 className="text-xl md:text-3xl font-black text-white tracking-tight flex items-center gap-3 flex-wrap">
                        <div className="bg-white/10 p-2 rounded-xl backdrop-blur-md">
                            <ShieldCheck className={isPlatinum ? "text-yellow-400" : "text-blue-400"} size={32} />
                        </div>
                        Nexus Security Suite
                        <span className={`text-[10px] px-2 py-1 rounded-full font-black uppercase tracking-widest border ${isPlatinum
                            ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30 shadow-[0_0_15px_rgba(234,179,8,0.3)] animate-pulse"
                            : "bg-blue-500/20 text-blue-300 border-blue-500/30"
                            }`}>
                            {isPlatinum ? "Platinum PRO" : "Standard"}
                        </span>
                    </h1>
                    <p className="text-blue-200 mt-2 font-medium opacity-80">Advanced Kernel-Level Protection & Real-time Threat Intelligence</p>
                </div>

                <div className="flex gap-3 relative z-10 w-full md:w-auto">
                    <button
                        onClick={runSystemScan}
                        disabled={isScanning}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-2xl backdrop-blur-md border border-white/10 transition-all active:scale-95 disabled:opacity-50"
                    >
                        {isScanning ? <Loader2 className="animate-spin" size={18} /> : <Search size={18} />}
                        {isScanning ? "Scanning..." : "System Scan"}
                    </button>
                    {!isPlatinum && (
                        <button
                            onClick={handleUpgradeClick}
                            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-blue-950 px-6 py-3 rounded-2xl font-black transition-all active:scale-95 shadow-lg shadow-yellow-500/20 uppercase text-xs"
                        >
                            <Zap size={18} /> Upgrade
                        </button>
                    )}
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total Events', value: stats.totalEvents, icon: Activity, color: 'blue' },
                    { label: 'Blocked Attacks', value: stats.blockedThreats, icon: ShieldAlert, color: 'red' },
                    { label: 'Active Nodes', value: stats.activeNodes, icon: Cpu, color: 'blue' },
                    { label: 'Uptime', value: '99.9%', icon: ShieldCheck, color: 'green' },
                ].map((s, i) => (
                    <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-all group overflow-hidden relative">
                        <div className={`absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform text-${s.color}-600`}>
                            <s.icon size={64} />
                        </div>
                        <p className="text-gray-500 text-[10px] md:text-xs font-black uppercase tracking-widest mb-1">{s.label}</p>
                        <h3 className="text-2xl md:text-3xl font-black text-gray-900">{s.value}</h3>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Scan Area / Visualizer */}
                <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 min-h-[400px] flex flex-col relative overflow-hidden">
                    <div className="flex items-center justify-between mb-8 relative z-10">
                        <div>
                            <h3 className="text-xl font-black text-gray-900 tracking-tight">System Integrity View</h3>
                            <p className="text-sm text-gray-400">Heuristic Analysis of Network Flow</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Live Engine</span>
                        </div>
                    </div>

                    {isScanning ? (
                        <div className="flex-1 flex flex-col items-center justify-center space-y-6 animate-in fade-in zoom-in duration-500">
                            <div className="relative">
                                <div className="w-32 h-32 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                                <Search className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-500" size={40} />
                            </div>
                            <div className="text-center">
                                <p className="text-lg font-bold text-gray-900">Neural Scanner Active</p>
                                <p className="text-sm text-gray-400">Checking kernel modules and registry keys...</p>
                            </div>
                        </div>
                    ) : scanData ? (
                        <div className="flex-1 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Files Scanned</p>
                                    <p className="text-2xl font-black text-gray-900">{scanData.filesScanned}</p>
                                </div>
                                <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Threats Found</p>
                                    <p className="text-2xl font-black text-blue-600">{scanData.threatsFound}</p>
                                </div>
                            </div>
                            <div className="h-[200px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={scanData.history}>
                                        <defs>
                                            <linearGradient id="colorThreat" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="name" hide />
                                        <YAxis hide />
                                        <Tooltip
                                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                        />
                                        <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorThreat)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center opacity-40">
                            <Activity size={80} className="text-gray-200 mb-4" />
                            <p className="font-bold text-gray-400">Ready for heuristic system scan</p>
                        </div>
                    )}
                </div>

                {/* Side Status Panel */}
                <div className="bg-gray-950 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-20">
                        <Activity size={100} className="text-blue-500" />
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-xl font-bold text-white mb-2">Live Protection</h3>
                        <p className="text-gray-400 text-sm mb-6">Nexus Engine is actively monitoring your Windows kernel for anomalies.</p>

                        <div className="space-y-4">
                            {[
                                { name: 'Firewall Shield', state: 'Active', color: 'green' },
                                { name: 'AI Heuristics', state: isPlatinum ? 'Enhanced' : 'Learning', color: isPlatinum ? 'yellow' : 'blue' },
                                { name: 'Neural Engine', state: isPlatinum ? 'Online' : 'Locked', color: isPlatinum ? 'green' : 'gray' },
                                { name: 'Web Guard', state: 'Active', color: 'blue' },
                            ].map((s, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                                    <span className="text-sm text-gray-300 font-medium">{s.name}</span>
                                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-${s.color}-500/10 text-${s.color}-400 border border-${s.color}-500/20`}>
                                        {s.state}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {!isPlatinum ? (
                            <button
                                onClick={handleUpgradeClick}
                                className="w-full mt-8 bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 group"
                            >
                                Get Platinum PRO <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        ) : (
                            <div className="mt-8 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl flex items-center gap-3">
                                <div className="bg-yellow-500 p-2 rounded-lg">
                                    <Zap size={16} className="text-blue-950" />
                                </div>
                                <div>
                                    <p className="text-xs font-black text-yellow-500 uppercase tracking-widest">Neural Mode Active</p>
                                    <p className="text-[10px] text-yellow-500/60 font-medium">99.8% Prediction Accuracy</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom Section - Recent Activity */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-black text-gray-900 tracking-tight">Recent Threat Vectors</h3>
                    <Link to="/events" className="text-xs font-black text-blue-600 uppercase tracking-widest hover:underline">View All</Link>
                </div>
                <div className="space-y-4">
                    {events.slice(0, 5).map((e, i) => (
                        <div key={i} className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-2xl transition-all border border-transparent hover:border-gray-100 group">
                            <div className={`p-3 rounded-xl ${e.severity === 'Critical' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'} group-hover:scale-110 transition-transform`}>
                                <ShieldAlert size={20} />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <p className="font-bold text-gray-900">{e.event_type}</p>
                                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${e.severity === 'Critical' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                                        {e.severity}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-400 mt-0.5">Origin: {e.source_ip} | Captured by Nexus Core</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs font-black text-gray-900">{e.timestamp.split('T')[1].split('.')[0]}</p>
                                <p className="text-[10px] text-gray-400 font-medium">Verified by AI</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <PaymentModal
                isOpen={isPaymentOpen}
                onClose={() => setIsPaymentOpen(false)}
                onPaymentSuccess={handlePaymentComplete}
            />

            {isUpgrading && (
                <div className="fixed inset-0 bg-blue-950/90 backdrop-blur-xl z-[10000] flex flex-col items-center justify-center animate-in fade-in duration-500">
                    <div className="w-24 h-24 border-8 border-white/20 border-t-yellow-400 rounded-full animate-spin mb-8" />
                    <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Deploying Platinum Kernel</h2>
                    <p className="text-blue-300 font-medium mt-2">Unlocking neural analysis engines...</p>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
