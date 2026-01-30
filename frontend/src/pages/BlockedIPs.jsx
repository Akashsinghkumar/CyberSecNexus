import React, { useEffect, useState } from 'react';
import { Ban, ShieldAlert, Plus, Search, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { cn } from '../lib/utils';
import { Button } from '../components/Button';

const BlockedIPs = () => {
    const { blockedIps, fetchBlockedIps, blockIp, unblockIp } = useApp();
    const [search, setSearch] = useState('');
    const [newIp, setNewIp] = useState('');
    const [reason, setReason] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        fetchBlockedIps();
    }, []);

    const handleAddBlock = async (e) => {
        e.preventDefault();
        if (!newIp) return;
        setIsProcessing(true);
        const success = await blockIp(newIp, reason || 'Manual Admin Block');
        if (success) {
            setNewIp('');
            setReason('');
            setIsAdding(false);
        }
        setIsProcessing(false);
    };

    const handleUnblock = async (ip) => {
        if (window.confirm(`Are you sure you want to unblock ${ip}? This will remove the firewall rule.`)) {
            await unblockIp(ip);
        }
    };

    const filteredIps = (blockedIps || []).filter(item =>
        item.ip_address.toLowerCase().includes(search.toLowerCase()) ||
        item.reason.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            {/* Premium Header */}
            <div className="bg-gradient-to-r from-red-950 via-gray-950 to-red-950 p-8 rounded-[2.5rem] shadow-2xl border border-red-900/50 relative overflow-hidden">
                <div className="absolute top-0 right-0 opacity-10 -translate-y-1/2 translate-x-1/4 rotate-45 scale-150">
                    <Ban size={300} />
                </div>
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-3xl font-black text-white tracking-tighter flex items-center gap-3">
                            <div className="bg-white/10 p-2 rounded-xl backdrop-blur-md text-red-500">
                                <ShieldAlert size={32} />
                            </div>
                            Blacklist Perimeter
                        </h1>
                        <p className="text-red-200 mt-2 font-medium opacity-80 max-w-lg">
                            Real-time synchronization with active firewall clusters and intrusion prevention engines.
                        </p>
                    </div>

                    <div className="flex gap-3 w-full md:w-auto">
                        <Button variant="glass" className="border-red-500/30 font-black" onClick={fetchBlockedIps}>
                            Sync Firewall
                        </Button>
                        <Button variant="orange" className="bg-red-600 hover:bg-red-500 border-red-500" onClick={() => setIsAdding(true)}>
                            <Plus size={16} className="mr-2" /> Block Entity
                        </Button>
                    </div>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-6">
                    <div className="p-4 bg-red-50 text-red-600 rounded-2xl shadow-inner"><Ban size={32} /></div>
                    <div>
                        <div className="text-4xl font-black text-gray-900 font-mono tracking-tighter">{(blockedIps || []).length}</div>
                        <div className="text-[10px] text-gray-400 uppercase font-black tracking-[0.2em]">Active Containments</div>
                    </div>
                </div>
                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-6">
                    <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl shadow-inner"><ShieldCheck size={32} /></div>
                    <div>
                        <div className="text-xl font-black text-emerald-600 tracking-tight uppercase leading-none">Hardened Protection</div>
                        <div className="text-[10px] text-gray-400 uppercase font-black tracking-[0.2em] mt-1">Defensive State: Nominal</div>
                    </div>
                </div>
            </div>

            {/* List and Search */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-50 bg-gray-50/30">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Identify network signature in blacklist..."
                            className="w-full pl-12 pr-6 py-4 bg-white border-none rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500/10 transition-all shadow-inner"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 text-gray-400 font-black uppercase tracking-[0.2em] text-[10px] border-b border-gray-50">
                                <th className="px-8 py-6">Identity Parameter (IP)</th>
                                <th className="px-8 py-6">Containment Context</th>
                                <th className="px-8 py-6">Execution Epoch</th>
                                <th className="px-8 py-6 text-right">Liberate</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredIps.map((item) => (
                                <tr key={item.ip_address} className="group hover:bg-gray-50/50 transition-all">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                                            <span className="font-mono font-black text-base text-gray-900 tracking-tight">{item.ip_address}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={cn(
                                                    "px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border",
                                                    item.reason.includes('AI') ? "bg-purple-500/10 text-purple-600 border-purple-500/20" : "bg-red-500/10 text-red-600 border-red-500/20"
                                                )}>
                                                    {item.reason.includes('AI') ? 'Neural Threat' : 'Heuristic Match'}
                                                </span>
                                            </div>
                                            <span className="text-gray-500 text-sm font-medium line-clamp-1">{item.reason}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="text-[11px] font-mono text-gray-400 font-bold bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100 w-fit">
                                            {new Date(item.timestamp).toLocaleString().replace(',', ' |')}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleUnblock(item.ip_address)}
                                            className="text-gray-300 hover:text-emerald-600 hover:bg-emerald-50 opacity-0 group-hover:opacity-100 transition-all"
                                            title="Unblock and remove rule"
                                        >
                                            <ShieldCheck size={20} />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            {filteredIps.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="px-8 py-32 text-center">
                                        <div className="flex flex-col items-center gap-4 text-gray-300">
                                            <div className="bg-gray-50 p-8 rounded-full">
                                                <ShieldCheck size={64} className="opacity-20 translate-y-2 animate-bounce" />
                                            </div>
                                            <div className="space-y-1">
                                                <h3 className="font-black text-gray-900 tracking-tight text-xl">Perimeter Clean</h3>
                                                <p className="text-sm font-medium">No active containment protocols in place.</p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Block Modal */}
            {isAdding && (
                <div className="fixed inset-0 z-[10000] flex items-center justify-center p-6 bg-red-950/40 backdrop-blur-xl animate-in fade-in duration-300">
                    <div className="absolute inset-0" onClick={() => setIsAdding(false)}></div>
                    <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-md relative z-10 overflow-hidden border border-white/20 animate-in zoom-in-95">
                        <div className="p-10 bg-red-950 text-white relative">
                            <div className="absolute top-0 right-0 p-10 opacity-10">
                                <Ban size={100} />
                            </div>
                            <h2 className="text-2xl font-black tracking-tight relative z-10 flex items-center gap-3">
                                <Ban size={28} className="text-red-500" />
                                Initiate Blacklist
                            </h2>
                            <p className="text-red-400 text-xs font-bold uppercase tracking-widest mt-1 relative z-10">Network Sanitization Protocol</p>
                        </div>

                        <form onSubmit={handleAddBlock} className="p-10 space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Target Signature (IP)</label>
                                <input
                                    autoFocus
                                    type="text"
                                    className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-500/20 font-mono font-bold transition-all text-gray-900"
                                    placeholder="e.g. 192.168.1.104"
                                    value={newIp}
                                    onChange={(e) => setNewIp(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Heuristic Context</label>
                                <textarea
                                    className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-500/20 font-bold transition-all text-gray-900 min-h-[120px]"
                                    placeholder="Define the behavioral anomaly or threat vector..."
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                />
                            </div>

                            <div className="flex gap-4 pt-4">
                                <Button
                                    variant="ghost"
                                    type="button"
                                    onClick={() => setIsAdding(false)}
                                    className="flex-1"
                                >
                                    Abort
                                </Button>
                                <Button
                                    variant="orange"
                                    type="submit"
                                    disabled={isProcessing}
                                    className="flex-1 bg-red-600 hover:bg-red-700 border-red-600 shadow-lg shadow-red-200"
                                >
                                    {isProcessing ? 'Deploying...' : 'Contain Target'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BlockedIPs;
