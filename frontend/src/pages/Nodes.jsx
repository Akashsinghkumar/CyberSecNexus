import React, { useEffect, useState } from 'react';
import { Search, Plus, Wifi, AlertTriangle, Monitor, RotateCw, Settings, FileText, WifiOff, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { cn } from '../lib/utils';
import { useLocation } from 'react-router-dom';

import { Button } from '../components/Button';

const Nodes = () => {
    const { nodes, fetchNodes, groups, fetchGroups } = useApp();
    const location = useLocation();

    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [nodeName, setNodeName] = useState('');
    const [nodeIP, setNodeIP] = useState('');
    const [selectedGroupId, setSelectedGroupId] = useState('');
    const [saving, setSaving] = useState(false);

    // Filtering by group from navigation
    const [filterGroupId, setFilterGroupId] = useState(location.state?.groupId || null);
    const [filterGroupName, setFilterGroupName] = useState(location.state?.groupName || '');

    useEffect(() => {
        fetchNodes();
        fetchGroups();
    }, []);

    const handleAddNode = async () => {
        if (!nodeName.trim() || !nodeIP.trim()) return;
        setSaving(true);
        try {
            const res = await fetch('/api/nodes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: nodeName,
                    ip: nodeIP,
                    group_id: selectedGroupId || null
                })
            });
            if (!res.ok) throw new Error('Failed to create node');
            setShowModal(false);
            setNodeName('');
            setNodeIP('');
            setSelectedGroupId('');
            fetchNodes();
        } catch (error) {
            console.error('Error creating node:', error);
        } finally {
            setSaving(false);
        }
    };

    const clearGroupFilter = () => {
        setFilterGroupId(null);
        setFilterGroupName('');
    };

    // Filter nodes logic
    const filteredNodes = nodes.filter(node => {
        const matchesSearch = node.name.toLowerCase().includes(search.toLowerCase()) ||
            node.ip_address.includes(search);
        const matchesGroup = filterGroupId === null || node.group_id === filterGroupId;
        return matchesSearch && matchesGroup;
    });

    // Summary Stats
    const stats = {
        total: filteredNodes.length,
        active: filteredNodes.filter(n => n.status === 'active').length,
        warning: filteredNodes.filter(n => n.status === 'warning').length,
        inactive: filteredNodes.filter(n => n.status === 'inactive').length,
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            {/* Premium Header */}
            <div className="bg-gradient-to-r from-blue-900 to-indigo-950 p-8 rounded-[2.5rem] shadow-2xl border border-blue-800 relative overflow-hidden">
                <div className="absolute top-0 right-0 opacity-10 -translate-y-1/2 translate-x-1/4 scale-150">
                    <Monitor size={300} />
                </div>
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-3xl font-black text-white tracking-tighter">Infrastructure Nodes</h1>
                            {filterGroupId && (
                                <div className="bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full border border-orange-500/30 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                                    Group: {filterGroupName}
                                    <button onClick={clearGroupFilter} className="hover:text-white transition-colors">
                                        <X size={12} />
                                    </button>
                                </div>
                            )}
                        </div>
                        <p className="text-blue-200 font-medium opacity-80 max-w-xl">
                            Deploy and manage security agents across your entire endpoint fleet.
                        </p>
                    </div>

                    <div className="flex gap-3 w-full md:w-auto">
                        <Button variant="glass" onClick={fetchNodes}>
                            <RotateCw size={16} className="mr-2" /> Sync State
                        </Button>
                        <Button variant="orange" onClick={() => setShowModal(true)}>
                            <Plus size={16} className="mr-2" /> Register Node
                        </Button>
                    </div>
                </div>
            </div>

            {/* Status Summary Strip */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total Fleet', value: stats.total, icon: Monitor, color: 'blue' },
                    { label: 'Active Shield', value: stats.active, icon: Wifi, color: 'green' },
                    { label: 'Alerting', value: stats.warning, icon: AlertTriangle, color: 'orange' },
                    { label: 'Offline', value: stats.inactive, icon: WifiOff, color: 'gray' },
                ].map((s, i) => (
                    <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4 transition-all hover:shadow-md">
                        <div className={cn(
                            "p-3 rounded-2xl",
                            s.color === 'blue' && "bg-blue-50 text-blue-600",
                            s.color === 'green' && "bg-green-50 text-green-600",
                            s.color === 'orange' && "bg-orange-50 text-orange-600",
                            s.color === 'gray' && "bg-gray-50 text-gray-400"
                        )}>
                            <s.icon size={24} />
                        </div>
                        <div>
                            <div className="text-2xl font-black text-gray-900">{s.value}</div>
                            <div className="text-[10px] text-gray-400 uppercase font-black tracking-widest">{s.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Toolbar */}
            <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100">
                <div className="relative w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Heuristic search by Node Name or CIDR..."
                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-none rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Nodes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredNodes.map((node) => {
                    const group = groups.find(g => g.id === node.group_id);
                    return (
                        <div key={node.id} className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden flex flex-col group hover:border-blue-500/30 hover:shadow-xl transition-all duration-500">
                            <div className="p-8 pb-4 flex-1">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-gray-900 p-3 rounded-2xl shadow-lg transform group-hover:rotate-6 transition-transform">
                                            <Monitor className="text-blue-400" size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-black text-gray-900 text-lg tracking-tight leading-none mb-1.5">{node.name}</h3>
                                            <p className="text-xs text-gray-400 font-mono font-bold tracking-wider">{node.ip_address}</p>
                                        </div>
                                    </div>
                                    <div className={cn(
                                        "w-3 h-3 rounded-full animate-pulse shadow-[0_0_10px_rgba(0,0,0,0.1)]",
                                        node.status === 'active' ? "bg-green-500 shadow-green-500/50" :
                                            node.status === 'warning' ? "bg-orange-500 shadow-orange-500/50" : "bg-gray-300"
                                    )} />
                                </div>

                                <div className="flex items-center gap-4 mb-6">
                                    <span className={cn(
                                        "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border",
                                        node.status === 'active' && "bg-green-50 text-green-700 border-green-200",
                                        node.status === 'warning' && "bg-orange-50 text-orange-700 border-orange-200",
                                        node.status === 'inactive' && "bg-gray-50 text-gray-500 border-gray-200"
                                    )}>
                                        State: {node.status}
                                    </span>
                                    {group && (
                                        <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border border-blue-200">
                                            {group.name}
                                        </span>
                                    )}
                                </div>

                                <div className="space-y-4 pt-4 border-t border-gray-50">
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-gray-400 font-bold uppercase tracking-widest">Health State</span>
                                        <span className={cn(
                                            "font-black uppercase tracking-wider",
                                            node.status === 'active' ? 'text-green-600' :
                                                node.status === 'warning' ? 'text-orange-500' : 'text-gray-400'
                                        )}>
                                            {node.last_heartbeat ? 'Synchronized' : 'Standalone'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-gray-400 font-bold uppercase tracking-widest">Nexus-UID</span>
                                        <span className="font-mono text-gray-950 font-black bg-gray-50 px-2 py-0.5 rounded-lg border border-gray-100">NX-{1000 + node.id}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="px-6 py-6 bg-gray-50/50 flex gap-4">
                                <Button variant="outline" size="sm" className="flex-1 opacity-80 group-hover:opacity-100">
                                    <Settings size={14} className="mr-2" /> Config
                                </Button>
                                <Button variant="outline" size="sm" className="flex-1 opacity-80 group-hover:opacity-100">
                                    <FileText size={14} className="mr-2" /> Intel
                                </Button>
                            </div>
                        </div>
                    );
                })}

                {filteredNodes.length === 0 && (
                    <div className="col-span-full py-24 text-center bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
                        <Monitor className="mx-auto text-gray-200 mb-6" size={80} />
                        <h3 className="text-gray-900 text-xl font-black tracking-tight">No match found in current fleet</h3>
                        <p className="text-gray-400 text-sm mt-2 max-w-sm mx-auto font-medium">Clear filters or try a heuristic search to locate the specific node.</p>
                        <Button variant="outline" className="mt-8" onClick={() => { setSearch(''); clearGroupFilter(); }}>Clear All Parameters</Button>
                    </div>
                )}
            </div>

            {/* Add Node Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[10000] flex items-center justify-center p-6 bg-blue-950/40 backdrop-blur-xl animate-in fade-in duration-300">
                    <div className="absolute inset-0" onClick={() => setShowModal(false)}></div>
                    <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-md relative z-10 overflow-hidden border border-white/20 animate-in zoom-in-95">
                        <div className="p-10 bg-gray-950 text-white relative">
                            <div className="absolute top-0 right-0 p-10 opacity-10">
                                <Monitor size={100} />
                            </div>
                            <h2 className="text-2xl font-black tracking-tight relative z-10">Register Endpoint</h2>
                            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1 relative z-10">System Identity Enrollment</p>
                        </div>

                        <div className="p-10 space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Node Identity Name</label>
                                <input
                                    type="text"
                                    value={nodeName}
                                    onChange={(e) => setNodeName(e.target.value)}
                                    placeholder="e.g. SOC-STATION-01"
                                    className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-bold transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Network Host / IP</label>
                                <input
                                    type="text"
                                    value={nodeIP}
                                    onChange={(e) => setNodeIP(e.target.value)}
                                    placeholder="e.g. 10.0.0.45"
                                    className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-bold transition-all text-blue-600"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Fleet Group Assignment</label>
                                <select
                                    value={selectedGroupId}
                                    onChange={(e) => setSelectedGroupId(e.target.value)}
                                    className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-bold transition-all appearance-none"
                                >
                                    <option value="">Unassigned Profile</option>
                                    {groups.map(group => (
                                        <option key={group.id} value={group.id}>{group.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="p-8 bg-gray-50 flex gap-4">
                            <Button variant="ghost" className="flex-1" onClick={() => setShowModal(false)}>Discard</Button>
                            <Button variant="orange" className="flex-1" onClick={handleAddNode} isLoading={saving}>Initialize Enrollment</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Nodes;

