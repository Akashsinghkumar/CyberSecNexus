import React, { useState, useEffect } from 'react';
import {
    Bot,
    Sparkles,
    Zap,
    ShieldAlert,
    BrainCircuit,
    Terminal as TerminalIcon,
    Loader2,
    Search,
    ChevronRight,
    Activity,
    Cpu
} from 'lucide-react';
import {
    ResponsiveContainer,
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip
} from 'recharts';
import { useApp } from '../context/AppContext';
import { Button } from '../components/Button';

const AIAnalyst = () => {
    const { notifications, stats, licenseTier } = useApp();
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisLog, setAnalysisLog] = useState([]);
    const isPlatinum = licenseTier === 'platinum';

    const radarData = [
        { subject: 'Heuristics', A: isPlatinum ? 95 : 60, fullMark: 100 },
        { subject: 'Real-time', A: 85, fullMark: 100 },
        { subject: 'Encryption', A: 90, fullMark: 100 },
        { subject: 'DDoS Prev', A: isPlatinum ? 98 : 70, fullMark: 100 },
        { subject: 'Malware', A: 80, fullMark: 100 },
        { subject: 'Privacy', A: 88, fullMark: 100 },
    ];

    const runNeuralAnalysis = () => {
        setIsAnalyzing(true);
        setAnalysisLog([]);
        const steps = [
            "Initializing Neural Core v4.0...",
            "Synchronizing with global threat telemetry...",
            "Performing deep heuristic scan of system kernels...",
            "Analyzing behavioral anomalies in unassigned clusters...",
            "Evaluating zero-day signature matrices...",
            "Neutralizing suspected heuristic violations...",
            "Analysis Complete: Network Integrity at 100%."
        ];

        steps.forEach((step, i) => {
            setTimeout(() => {
                setAnalysisLog(prev => [...prev, { id: i, msg: step, time: new Date().toLocaleTimeString() }]);
                if (i === steps.length - 1) setIsAnalyzing(false);
            }, i * 800);
        });
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Premium Header */}
            <div className="bg-gradient-to-r from-cyan-950 via-slate-900 to-cyan-950 p-10 rounded-[3rem] shadow-2xl border border-cyan-900/50 relative overflow-hidden">
                <div className="absolute top-0 right-0 opacity-10 -translate-y-1/2 translate-x-1/4 rotate-12 scale-150">
                    <BrainCircuit size={400} />
                </div>
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-cyan-500/20 p-2 rounded-xl backdrop-blur-md">
                                <Sparkles className="text-cyan-400 animate-pulse" size={32} />
                            </div>
                            <span className="text-cyan-400 font-black text-[10px] uppercase tracking-[0.3em]">Cognitive Protection Layer</span>
                        </div>
                        <h1 className="text-4xl font-black text-white tracking-tight">Neural <span className="text-cyan-400">Guardian</span></h1>
                        <p className="text-blue-100/60 mt-4 max-w-xl font-medium text-lg leading-relaxed">
                            A decentralized AI engine leveraging heuristic behavioral models to intercept zero-day threats before they reach the kernel perimeter.
                        </p>
                    </div>

                    <Button
                        onClick={runNeuralAnalysis}
                        isLoading={isAnalyzing}
                        variant="orange"
                        className="bg-cyan-600 hover:bg-cyan-500 border-cyan-500 shadow-lg shadow-cyan-900/40 px-10 py-7 text-sm font-black tracking-widest uppercase rounded-2xl transition-all active:scale-95"
                    >
                        {isAnalyzing ? "Processing Neural Matrix..." : "Execute Global Analysis"}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Panel: Stats & Radar */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 relative overflow-hidden group">
                            <div className="absolute bottom-0 right-0 p-10 translate-y-10 group-hover:translate-y-0 transition-transform opacity-10">
                                <Activity size={120} className="text-cyan-600" />
                            </div>
                            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] mb-10">Neural Response Index</h3>
                            <div className="flex items-end gap-3">
                                <span className="text-6xl font-black text-gray-900 tracking-tighter">{isPlatinum ? '99.8%' : '84.2%'}</span>
                                <span className="text-cyan-600 font-black text-[10px] uppercase tracking-widest pb-3 flex items-center gap-1.5">
                                    <ShieldAlert size={14} /> AI Verified
                                </span>
                            </div>
                            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mt-6 leading-relaxed">
                                Current confidence score based on multi-vector behavioral telemetry.
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100 flex flex-col items-center">
                            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] mb-4 w-full text-left ml-4">Neural Profile</h3>
                            <div className="h-[220px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                                        <PolarGrid stroke="#f3f4f6" />
                                        <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9, fontWeight: 900, fill: '#9ca3af', textTransform: 'uppercase' }} />
                                        <Radar name="AI Core" dataKey="A" stroke="#0891b2" fill="#06b6d4" fillOpacity={0.6} />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* AI Terminal */}
                    <div className="bg-gray-950 rounded-[3rem] border border-white/5 p-10 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                            <TerminalIcon size={120} className="text-cyan-500" />
                        </div>
                        <div className="flex items-center gap-3 mb-10">
                            <TerminalIcon size={18} className="text-cyan-500" />
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Neural Output Terminal</span>
                        </div>
                        <div className="h-72 overflow-y-auto font-mono text-xs space-y-4 custom-scrollbar pr-4">
                            {analysisLog.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-gray-800 space-y-4">
                                    <TerminalIcon size={48} className="opacity-20 translate-y-2 animate-pulse" />
                                    <p className="font-black uppercase tracking-widest text-[9px]">Awaiting system command...</p>
                                </div>
                            ) : (
                                analysisLog.map(log => (
                                    <div key={log.id} className="flex gap-6 border-l-2 border-cyan-500/20 pl-6 py-2 animate-in slide-in-from-left-4">
                                        <span className="text-cyan-900 font-bold">[{log.time}]</span>
                                        <span className="text-cyan-100 font-medium tracking-tight">{log.msg}</span>
                                    </div>
                                ))
                            )}
                        </div>
                        <div className="mt-10 flex items-center gap-2">
                            <div className="w-2 h-2 bg-cyan-500 rounded-full animate-ping" />
                            <span className="text-[9px] text-cyan-500 font-black uppercase tracking-[0.25em]">Live Intelligence Sync</span>
                        </div>
                    </div>
                </div>

                {/* Right Panel: AI Contextual Alerts */}
                <div className="space-y-8">
                    <div className="bg-gradient-to-br from-cyan-50 to-blue-50 p-10 rounded-[3rem] border border-cyan-100/50 shadow-inner relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                            <Sparkles size={60} className="text-cyan-600" />
                        </div>
                        <div className="flex items-start justify-between mb-8">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/10">
                                <Cpu size={24} className="text-cyan-600" />
                            </div>
                            <span className="bg-cyan-500 text-white text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-cyan-200">Neural Insight</span>
                        </div>
                        <h3 className="text-xl font-black text-gray-900 tracking-tight">Active Advisory</h3>
                        <p className="text-sm text-cyan-900/70 mt-4 leading-relaxed font-bold">
                            "Baseline traffic patterns successfully mapped. System heuristics indicate a 14% improvement in kernel response time after last block."
                        </p>
                    </div>

                    <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100">
                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] mb-10">Cognitive History</h3>
                        <div className="space-y-8">
                            {[
                                { title: 'DDoS Cluster Neutralized', desc: 'Identified non-human request frequency', time: '2m ago' },
                                { title: 'Kernel Signature Validated', desc: 'No malicious anomalies detected', time: '1h ago' },
                                { title: 'Neural Baseline Optimized', desc: 'Behavioral models updated', time: '5h ago' }
                            ].map((job, i) => (
                                <div key={i} className="flex items-start gap-5 group cursor-pointer hover:bg-gray-50/50 p-3 rounded-2xl transition-all">
                                    <div className="bg-cyan-50 p-3 rounded-xl text-cyan-600 shadow-inner group-hover:scale-110 transition-transform">
                                        <ChevronRight size={18} />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-xs font-black text-gray-900 uppercase tracking-tight">{job.title}</div>
                                        <div className="text-[10px] text-gray-500 font-medium leading-relaxed">{job.desc}</div>
                                        <div className="text-[9px] text-cyan-600 font-black mt-2 uppercase tracking-widest">{job.time}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #06b6d420;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #06b6d440;
                }
            `}} />
        </div>
    );
};

export default AIAnalyst;
