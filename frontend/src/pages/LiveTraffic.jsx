import React, { useEffect, useRef, useState } from 'react';
import { Activity, Radio, Cpu, Network } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { cn } from '../lib/utils';
import { Button } from '../components/Button';

const LiveTraffic = () => {
    const { events, fetchEvents } = useApp();
    const scrollRef = useRef(null);
    const [isPaused, setIsPaused] = useState(false);

    // Auto-scroll to bottom when new events arrive
    useEffect(() => {
        if (scrollRef.current && !isPaused) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [events, isPaused]);

    // Poll for new events every 3 seconds to keep it "Live"
    useEffect(() => {
        if (isPaused) return;
        const interval = setInterval(() => {
            fetchEvents(1);
        }, 3000);
        return () => clearInterval(interval);
    }, [isPaused]);

    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            {/* Premium Header */}
            <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-blue-950 p-8 rounded-[2.5rem] shadow-2xl border border-blue-900/50 relative overflow-hidden">
                <div className="absolute top-0 right-0 opacity-10 -translate-y-1/2 translate-x-1/4 rotate-45 scale-150">
                    <Radio size={300} />
                </div>
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-3xl font-black text-white tracking-tighter flex items-center gap-3">
                            <div className="bg-blue-500/20 p-2 rounded-xl backdrop-blur-md">
                                <Activity className="text-blue-400 animate-pulse" size={32} />
                            </div>
                            Telemetry Stream
                        </h1>
                        <p className="text-blue-200 mt-2 font-medium opacity-80 max-w-lg">
                            DPI (Deep Packet Inspection) engine broadcasting real-time ingress/egress heuristics.
                        </p>
                    </div>

                    <div className="flex gap-3 w-full md:w-auto">
                        <Button
                            variant={isPaused ? "orange" : "glass"}
                            className={cn("min-w-[140px] font-black uppercase tracking-widest", isPaused && "bg-blue-600 border-blue-500")}
                            onClick={() => setIsPaused(!isPaused)}
                        >
                            {isPaused ? 'Resume Stream' : 'Pause Capture'}
                        </Button>
                        <div className="px-6 py-2.5 bg-green-500/10 backdrop-blur-md rounded-2xl border border-green-500/20 text-green-400 text-[10px] font-black uppercase tracking-[0.2em] shadow-lg flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
                            Active Monitoring
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Stats Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl shadow-inner"><Cpu size={24} /></div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Engine Payload</span>
                        </div>
                        <div className="text-4xl font-black text-gray-900 tracking-tighter">12.4%</div>
                        <div className="w-full bg-gray-50 h-2.5 rounded-full mt-4 overflow-hidden shadow-inner border border-gray-100">
                            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full w-[12%] rounded-full shadow-lg transition-all duration-1000" />
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl shadow-inner"><Network size={24} /></div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Flow Intensity</span>
                        </div>
                        <div className="text-4xl font-black text-gray-900 tracking-tighter">42 <span className="text-sm text-gray-400 font-bold ml-1">p/s</span></div>
                        <div className="w-full bg-gray-50 h-2.5 rounded-full mt-4 overflow-hidden shadow-inner border border-gray-100">
                            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 h-full w-[42%] rounded-full shadow-lg transition-all duration-1000" />
                        </div>
                    </div>
                </div>

                {/* Terminal Window */}
                <div className="lg:col-span-3 bg-gray-950 rounded-[2.5rem] border border-gray-800 shadow-2xl overflow-hidden flex flex-col h-[650px] relative">
                    <div className="absolute inset-0 bg-blue-500/5 pointer-events-none" />
                    <div className="bg-gray-900/80 backdrop-blur-md px-8 py-5 border-b border-gray-800 flex items-center justify-between relative z-10">
                        <div className="flex gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500/80 border border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.3)]" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/80 border border-yellow-500/20 shadow-[0_0_10px_rgba(234,179,8,0.3)]" />
                            <div className="w-3 h-3 rounded-full bg-green-500/80 border border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.3)]" />
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-mono text-blue-500/80 uppercase font-black tracking-[0.3em]">nexus_packet_engine_v1.2.alpha</span>
                        </div>
                    </div>

                    <div
                        ref={scrollRef}
                        className="flex-1 p-10 font-mono text-[11px] overflow-y-auto scroll-smooth space-y-2.5 custom-scrollbar relative z-10"
                    >
                        {events.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-gray-800 space-y-6">
                                <Activity className="animate-pulse opacity-20" size={80} />
                                <div className="text-center">
                                    <p className="font-black text-gray-700 uppercase tracking-widest text-sm">Synchronizing Stream</p>
                                    <p className="text-[10px] mt-1 font-bold text-gray-800 uppercase tracking-widest">Waiting for ingress heuristics...</p>
                                </div>
                            </div>
                        ) : (
                            [...events].reverse().map((event, i) => (
                                <div key={event.id || i} className="flex gap-6 group hover:bg-white/5 p-2.5 rounded-xl transition-all border border-transparent hover:border-gray-800 shadow-inner">
                                    <span className="text-gray-700 font-bold whitespace-nowrap opacity-60">[{new Date(event.timestamp).toLocaleTimeString()}]</span>
                                    <span className={cn(
                                        "font-black tracking-widest uppercase text-[9px] px-2 py-0.5 rounded border shadow-lg",
                                        event.action_taken === 'BLOCKED' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                    )}>
                                        {event.action_taken === 'BLOCKED' ? 'DROP_RULE' : 'ALLOW_TRAF'}
                                    </span>
                                    <span className="text-blue-400 font-black whitespace-nowrap tracking-tight">{event.ip_address}:{event.port}</span>
                                    <span className="text-gray-500 truncate font-bold text-[10px] uppercase tracking-wide">
                                        {event.action_taken === 'BLOCKED' ? '!! HEURISTIC_VIOLATION: AI_ANOMALY_THREAT !!' : '>> TCP_SESSION_ACK: FLOW_PROFILE_VALIDATED >>'}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="bg-gray-900/90 backdrop-blur-md px-8 py-5 border-t border-gray-800 flex items-center gap-10 relative z-10">
                        <div className="flex items-center gap-3 text-[10px] font-mono text-blue-500 font-black uppercase tracking-[0.2em] whitespace-nowrap">
                            <span className="w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                            Internal Buffer: Nominal
                        </div>
                        <div className="flex-1">
                            <div className="h-1.5 bg-gray-800/50 rounded-full w-full overflow-hidden">
                                <div className="h-1.5 bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full w-1/3 animate-[loading_2s_ease-in-out_infinite]" />
                            </div>
                        </div>
                        <div className="text-[10px] font-mono text-gray-500 font-black tracking-widest uppercase">
                            Load: 0.2ms
                        </div>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes loading {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(300%); }
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #1f2937;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #374151;
                }
            `}} />
        </div>
    );
};

export default LiveTraffic;
