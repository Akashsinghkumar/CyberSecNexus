import React, { useEffect, useState } from 'react';
import { Search, Plus, Filter, Shield, Zap, Power, Trash2, Edit2, Copy } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { cn } from '../lib/utils';
import { Button } from '../components/Button'; // or native

const Rules = () => {
    const { rules, fetchRules, toggleRule, deleteRule, createRule } = useApp();
    const [search, setSearch] = useState('');
    const [showFilterMenu, setShowFilterMenu] = useState(false);
    const [selectedSeverity, setSelectedSeverity] = useState('All');
    const [showModal, setShowModal] = useState(false);
    const [saving, setSaving] = useState(false);

    const [ruleName, setRuleName] = useState('');
    const [ruleDescription, setRuleDescription] = useState('');
    const [ruleSeverity, setRuleSeverity] = useState('Medium');

    useEffect(() => {
        fetchRules();
    }, []);

    const CategoryBadge = ({ category }) => (
        <span className="px-3 py-1 rounded-full border border-blue-500/20 bg-blue-500/5 text-[9px] font-black text-blue-400 uppercase tracking-widest">
            {category}
        </span>
    );

    const filteredRules = rules.filter(rule => {
        const matchesSearch = rule.name.toLowerCase().includes(search.toLowerCase()) ||
            rule.description.toLowerCase().includes(search.toLowerCase());
        const matchesSeverity = selectedSeverity === 'All' || rule.severity === selectedSeverity;
        return matchesSearch && matchesSeverity;
    });

    const handleCreateRule = async () => {
        if (!ruleName.trim() || !ruleDescription.trim()) return;
        setSaving(true);
        try {
            await createRule({
                name: ruleName,
                description: ruleDescription,
                severity: ruleSeverity,
                enabled: true
            });
            setShowModal(false);
            setRuleName('');
            setRuleDescription('');
        } catch (error) {
            console.error('Error creating rule:', error);
        } finally {
            setSaving(false);
        }
    };

    const stats = {
        total: rules.length,
        active: rules.filter(r => r.enabled).length,
        triggered: 2179,
    };

    const getCategoryForRule = (index) => {
        const categories = ['Network', 'Authentication', 'File System', 'Malware'];
        return categories[index % 4];
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            {/* Premium Header */}
            <div className="bg-gradient-to-r from-indigo-900 to-blue-900 p-8 rounded-[2.5rem] shadow-2xl border border-indigo-800 relative overflow-hidden">
                <div className="absolute top-0 right-0 opacity-10 -translate-y-1/2 translate-x-1/4 scale-150">
                    <Shield size={300} />
                </div>
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-3xl font-black text-white tracking-tighter flex items-center gap-3">
                            <div className="bg-white/10 p-2 rounded-xl backdrop-blur-md">
                                <Zap className="text-blue-400" size={32} />
                            </div>
                            Detection Heuristics
                        </h1>
                        <p className="text-blue-200 mt-2 font-medium opacity-80 max-w-lg">
                            Configure advanced behavioral rules to detect and intercept threat actors.
                        </p>
                    </div>

                    <div className="flex gap-3 w-full md:w-auto">
                        <Button variant="glass" onClick={fetchRules}>
                            Sync Rules
                        </Button>
                        <Button variant="orange" onClick={() => setShowModal(true)}>
                            <Plus size={16} className="mr-2" /> New Rule
                        </Button>
                    </div>
                </div>
            </div>

            {/* Summary Stats Strip */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                    { label: 'Intelligence Profile', value: stats.total, icon: Shield, color: 'blue' },
                    { label: 'Active Watchers', value: stats.active, icon: Zap, color: 'green' },
                    { label: 'Total Intercepts', value: stats.triggered.toLocaleString(), icon: Power, color: 'orange' },
                ].map((s, i) => (
                    <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className={cn(
                            "p-3 rounded-2xl",
                            s.color === 'blue' && "bg-blue-50 text-blue-600",
                            s.color === 'green' && "bg-green-50 text-green-600",
                            s.color === 'orange' && "bg-orange-50 text-orange-600",
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
            <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search detection signatures..."
                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-none rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="relative">
                    <Button variant="outline" className="h-[52px]" onClick={() => setShowFilterMenu(!showFilterMenu)}>
                        <Filter size={18} className="mr-2" /> {selectedSeverity}
                    </Button>
                    {showFilterMenu && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-2xl p-2 z-50 animate-in slide-in-from-top-2">
                            {['All', 'Critical', 'High', 'Medium', 'Low'].map(severity => (
                                <button
                                    key={severity}
                                    onClick={() => { setSelectedSeverity(severity); setShowFilterMenu(false); }}
                                    className={cn(
                                        "w-full text-left px-4 py-3 rounded-xl text-sm font-bold tracking-tight hover:bg-gray-50 transition-all uppercase",
                                        selectedSeverity === severity ? 'text-blue-600 bg-blue-50' : 'text-gray-500'
                                    )}
                                >
                                    {severity}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Rules List */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 divide-y divide-gray-50 overflow-hidden">
                {filteredRules.map((rule, i) => (
                    <div key={rule.id} className="p-8 flex items-center justify-between hover:bg-gray-50/50 transition-all group">
                        <div className="flex-1 pr-10">
                            <div className="flex items-center gap-3 mb-2">
                                <h3 className="font-black text-gray-900 text-base tracking-tight">{rule.name}</h3>
                                <span className={cn(
                                    "px-2.5 py-0.5 rounded-full text-[9px] uppercase font-black tracking-widest border",
                                    rule.severity === 'Critical' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                        rule.severity === 'High' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' :
                                            rule.severity === 'Medium' ? 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20' : 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                                )}>{rule.severity}</span>
                                <CategoryBadge category={getCategoryForRule(i)} />
                            </div>
                            <p className="text-gray-500 text-sm font-medium line-clamp-1 max-w-2xl">{rule.description}</p>
                            <div className="flex items-center gap-6 mt-4">
                                <span className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 tracking-widest">
                                    <Zap size={12} className="text-blue-500" /> {rule.trigger_count || 1400} captures
                                </span>
                                <span className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 tracking-widest">
                                    <Clock size={12} className="text-indigo-400" /> Active 5m ago
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-10">
                            <div className="flex flex-col items-center gap-2">
                                <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Enforcement</span>
                                <button
                                    onClick={() => toggleRule(rule.id, !rule.enabled)}
                                    className={cn(
                                        "w-12 h-6 rounded-full relative transition-all duration-300",
                                        rule.enabled ? 'bg-blue-600' : 'bg-gray-200 shadow-inner'
                                    )}
                                >
                                    <span className={cn(
                                        "block w-4 h-4 bg-white rounded-full shadow-lg transform transition-transform duration-300 mt-1 ml-1",
                                        rule.enabled ? 'translate-x-6' : 'translate-x-0'
                                    )} />
                                </button>
                            </div>
                            <div className="flex items-center gap-2 border-l pl-8 border-gray-100 group-hover:opacity-100 transition-opacity">
                                <Button variant="ghost" size="icon" className="hover:text-blue-600 hover:bg-blue-50"><Edit2 size={16} /></Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="hover:text-red-500 hover:bg-red-50"
                                    onClick={() => deleteRule(rule.id)}
                                ><Trash2 size={16} /></Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Create Rule Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[10000] flex items-center justify-center p-6 bg-blue-950/40 backdrop-blur-xl animate-in fade-in duration-300">
                    <div className="absolute inset-0" onClick={() => setShowModal(false)}></div>
                    <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-md relative z-10 overflow-hidden border border-white/20 animate-in zoom-in-95">
                        <div className="p-10 bg-gray-950 text-white relative">
                            <div className="absolute top-0 right-0 p-10 opacity-10">
                                <Shield size={100} />
                            </div>
                            <h2 className="text-2xl font-black tracking-tight relative z-10">Define Heuristic</h2>
                            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1 relative z-10">Signature Profile Configuration</p>
                        </div>

                        <div className="p-10 space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Signature Identity</label>
                                <input
                                    type="text"
                                    value={ruleName}
                                    onChange={(e) => setRuleName(e.target.value)}
                                    className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-bold transition-all"
                                    placeholder="e.g. LATERAL_MOVEMENT_DETECT"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Behavioral Blueprint</label>
                                <textarea
                                    value={ruleDescription}
                                    onChange={(e) => setRuleDescription(e.target.value)}
                                    className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-bold transition-all min-h-[100px]"
                                    placeholder="Describe the detection logic and threat vectors..."
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Threat Tier</label>
                                <select
                                    value={ruleSeverity}
                                    onChange={(e) => setRuleSeverity(e.target.value)}
                                    className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-bold transition-all appearance-none"
                                >
                                    <option value="Low">Low Priority</option>
                                    <option value="Medium">Standard Detection</option>
                                    <option value="High">Security Breach Risk</option>
                                    <option value="Critical">Immediate Infiltration</option>
                                </select>
                            </div>
                        </div>

                        <div className="p-8 bg-gray-50 flex gap-4">
                            <Button variant="ghost" className="flex-1" onClick={() => setShowModal(false)}>Discard</Button>
                            <Button variant="orange" className="flex-1" onClick={handleCreateRule} isLoading={saving}>Commit Signature</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
export default Rules;

