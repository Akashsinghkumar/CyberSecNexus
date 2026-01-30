import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, Zap, Shield, ShieldAlert, AlertTriangle, Activity, X, Sparkles, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { cn } from '../lib/utils';
import { Button } from '../components/Button';

const SeverityBadge = ({ severity }) => {
    const s = severity.toLowerCase();
    const colors = {
        critical: "bg-red-500/10 text-red-500 border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]",
        high: "bg-orange-500/10 text-orange-500 border-orange-500/20",
        medium: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
        low: "bg-green-500/10 text-green-500 border-green-500/20",
        info: "bg-blue-500/10 text-blue-500 border-blue-500/20"
    };

    return (
        <span className={cn(
            "px-3 py-1 rounded-full text-[10px] uppercase font-black tracking-widest border animate-in fade-in zoom-in-95",
            colors[s] || colors.info
        )}>
            {severity}
        </span>
    );
};

const Events = () => {
    const { events, fetchEvents } = useApp();
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [aiReport, setAiReport] = useState('');
    const [analyzing, setAnalyzing] = useState(false);
    const [severityFilter, setSeverityFilter] = useState('All');
    const [showFilterMenu, setShowFilterMenu] = useState(false);

    useEffect(() => {
        fetchEvents(page, search);
    }, [page]);

    const handleAnalyze = (event) => {
        setSelectedEvent(event);
        setAnalyzing(true);
        setAiReport('');
        setTimeout(() => {
            const report = generateAIReport(event);
            setAiReport(report);
            setAnalyzing(false);
        }, 1500);
    };

    const handleExport = () => {
        const filteredEvents = severityFilter === 'All' ? events : events.filter(e => e.severity === severityFilter);
        const headers = ['Timestamp', 'Severity', 'Type', 'Source IP', 'Description'];
        const csvContent = [
            headers.join(','),
            ...filteredEvents.map(e => [
                format(new Date(e.timestamp), 'yyyy-MM-dd HH:mm:ss'),
                e.severity,
                e.event_type || 'Unknown',
                e.source_ip || e.ip_address,
                `"${(e.description || '').replace(/"/g, '""')}"`
            ].join(','))
        ].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `soc-events-${Date.now()}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const filteredEvents = severityFilter === 'All' ? events : events.filter(e => e.severity === severityFilter);

    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            {/* Premium Header */}
            <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-900 p-8 rounded-[2.5rem] shadow-2xl border border-blue-800 relative overflow-hidden">
                <div className="absolute top-0 right-0 opacity-10 -translate-y-1/2 translate-x-1/4 rotate-12">
                    <Shield size={250} />
                </div>
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
                            <div className="bg-white/10 p-2 rounded-xl backdrop-blur-md">
                                <ShieldAlert className="text-blue-400" size={32} />
                            </div>
                            SOC Events Terminal
                        </h1>
                        <p className="text-blue-200 mt-2 font-medium opacity-80 max-w-lg">
                            Real-time monitoring of all security vectors across your network nodes.
                        </p>
                    </div>
                    <div className="flex gap-3 w-full md:w-auto">
                        <Button variant="glass" onClick={() => fetchEvents(page, search)}>
                            <RefreshCw size={16} className="mr-2" /> Refresh
                        </Button>
                        <Button variant="orange" onClick={handleExport}>
                            <Download size={16} className="mr-2" /> Export Logs
                        </Button>
                    </div>
                </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Heuristic search (IP, pattern, module)..."
                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-none rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && fetchEvents(1, search)}
                    />
                </div>

                <div className="flex gap-2">
                    <div className="relative">
                        <Button variant="outline" className="rounded-2xl h-[52px]" onClick={() => setShowFilterMenu(!showFilterMenu)}>
                            <Filter size={18} className="mr-2" /> {severityFilter}
                        </Button>
                        {showFilterMenu && (
                            <div className="absolute top-full mt-2 right-0 bg-white border border-gray-100 rounded-2xl shadow-2xl p-2 z-50 w-48 animate-in slide-in-from-top-2">
                                {['All', 'Critical', 'High', 'Medium', 'Low'].map(sev => (
                                    <button
                                        key={sev}
                                        onClick={() => { setSeverityFilter(sev); setShowFilterMenu(false); }}
                                        className={cn(
                                            "w-full text-left px-4 py-3 rounded-xl text-sm font-bold tracking-tight hover:bg-gray-50 transition-all uppercase",
                                            severityFilter === sev ? "text-blue-600 bg-blue-50" : "text-gray-500"
                                        )}
                                    >
                                        {sev}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Events Container */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-50">
                                <th className="px-8 py-5">Severity</th>
                                <th className="px-6 py-5">Intel Source</th>
                                <th className="px-6 py-5">Vector Type</th>
                                <th className="px-6 py-5">Timestamp</th>
                                <th className="px-6 py-5 text-right">Protection</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredEvents.map((event) => (
                                <tr key={event.id} className="group hover:bg-gray-50/50 transition-all">
                                    <td className="px-8 py-5">
                                        <SeverityBadge severity={event.severity} />
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col">
                                            <span className="font-black text-gray-900 text-sm tracking-tight">{event.source_ip || event.ip_address}</span>
                                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Origin Node</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                                            <span className="font-bold text-gray-700">{event.event_type || 'General Traffic'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-gray-400 font-mono text-[11px] font-medium">
                                        {format(new Date(event.timestamp), 'yyyy.MM.dd | HH:mm:ss')}
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="opacity-0 group-hover:opacity-100 transition-all scale-95 group-hover:scale-100"
                                            onClick={() => handleAnalyze(event)}
                                        >
                                            <Brain size={14} className="mr-2" /> Analyze
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Footer Controls */}
                <div className="p-8 border-t border-gray-50 flex items-center justify-between">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                        Terminal Buffer: {filteredEvents.length} Vectors Captured
                    </p>
                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={page === 1}
                            onClick={() => setPage(p => p - 1)}
                        >
                            <ChevronLeft size={16} />
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage(p => p + 1)}
                        >
                            <ChevronRight size={16} />
                        </Button>
                    </div>
                </div>
            </div>

            {/* AI Modal Overlay */}
            {selectedEvent && (
                <div className="fixed inset-0 z-[10000] flex items-center justify-center p-6 bg-blue-950/40 backdrop-blur-xl animate-in fade-in duration-300">
                    <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-3xl relative overflow-hidden border border-white/20 animate-in zoom-in-95">
                        <div className="bg-gray-950 p-10 text-white relative">
                            <div className="absolute top-0 right-0 p-10 opacity-10">
                                <Brain size={150} />
                            </div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 text-cyan-400 mb-2">
                                    <Sparkles className="w-6 h-6 animate-pulse" />
                                    <span className="text-xs font-black uppercase tracking-[0.3em]">AI Intelligence Report</span>
                                </div>
                                <h2 className="text-3xl font-black tracking-tighter">Threat Decomposition</h2>
                                <p className="text-gray-400 text-sm mt-2 font-medium">Vector: {selectedEvent.event_type} | Source: {selectedEvent.source_ip}</p>
                            </div>
                            <button
                                onClick={() => setSelectedEvent(null)}
                                className="absolute top-8 right-8 text-gray-500 hover:text-white transition-colors p-2 bg-white/5 rounded-full"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-10 max-h-[450px] overflow-y-auto bg-gray-50/50">
                            {analyzing ? (
                                <div className="py-20 flex flex-col items-center justify-center space-y-6">
                                    <div className="relative">
                                        <div className="w-20 h-20 border-4 border-blue-500/20 border-t-cyan-500 rounded-full animate-spin" />
                                        <Brain className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-cyan-500" size={24} />
                                    </div>
                                    <p className="font-black text-gray-900 uppercase tracking-widest text-xs animate-pulse text-center">
                                        Synthesizing Threat Intel...<br />
                                        <span className="text-gray-400 font-medium">Cross-referencing global blacklists</span>
                                    </p>
                                </div>
                            ) : (
                                <div className="prose prose-sm max-w-none">
                                    <div className="whitespace-pre-wrap font-sans text-gray-700 leading-relaxed text-base bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                                        {aiReport}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-8 bg-white border-t border-gray-100 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Model: Nexus-Llama-4-Core</span>
                            </div>
                            <Button variant="orange" onClick={() => setSelectedEvent(null)}>Acknowledged</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Events;
