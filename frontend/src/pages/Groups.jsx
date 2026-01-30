import React, { useEffect, useState } from 'react';
import { Search, Plus, Folder, MoreVertical, Users, Monitor, Trash2, Edit2, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { cn } from '../lib/utils';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';

const Groups = () => {
    const { groups, fetchGroups, createGroup, deleteGroup, updateGroup } = useApp();
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [saving, setSaving] = useState(false);
    const [activeOptions, setActiveOptions] = useState(null);

    useEffect(() => {
        fetchGroups();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) return;
        setSaving(true);
        if (editMode) {
            await updateGroup(editingId, { name, description });
        } else {
            await createGroup({ name, description });
        }
        setSaving(false);
        closeModal();
    };

    const openCreateModal = () => {
        setEditMode(false);
        setName('');
        setDescription('');
        setShowModal(true);
    };

    const openEditModal = (group) => {
        setEditMode(true);
        setEditingId(group.id);
        setName(group.name);
        setDescription(group.description || '');
        setShowModal(true);
        setActiveOptions(null);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditMode(false);
        setEditingId(null);
        setName('');
        setDescription('');
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this group? Nodes in this group will be unassigned.')) {
            await deleteGroup(id);
            setActiveOptions(null);
        }
    };

    const filteredGroups = groups.filter(g =>
        g.name.toLowerCase().includes(search.toLowerCase()) ||
        g.description.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            {/* Premium Header */}
            <div className="bg-gradient-to-r from-emerald-900 via-teal-950 to-emerald-900 p-8 rounded-[2.5rem] shadow-2xl border border-emerald-800 relative overflow-hidden">
                <div className="absolute top-0 right-0 opacity-10 -translate-y-1/2 translate-x-1/4 rotate-12 scale-150">
                    <Folder size={300} />
                </div>
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-3xl font-black text-white tracking-tighter flex items-center gap-3">
                            <div className="bg-white/10 p-2 rounded-xl backdrop-blur-md">
                                <Users className="text-emerald-400" size={32} />
                            </div>
                            Asset Taxonomy
                        </h1>
                        <p className="text-emerald-200 mt-2 font-medium opacity-80 max-w-lg">
                            Organize your security infrastructure into logical clusters for efficient policy enforcement.
                        </p>
                    </div>

                    <div className="flex gap-3 w-full md:w-auto">
                        <Button variant="glass" className="border-emerald-500/30" onClick={fetchGroups}>
                            Refresh Matrix
                        </Button>
                        <Button variant="orange" onClick={openCreateModal}>
                            <Plus size={16} className="mr-2" /> Define Group
                        </Button>
                    </div>
                </div>
            </div>

            {/* Toolbar */}
            <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Scan registry for group signatures..."
                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-none rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Groups Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredGroups.map((group) => (
                    <div key={group.id} className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-xl hover:border-emerald-500/20 transition-all group relative">
                        <div className="flex justify-between items-start mb-6">
                            <div className="p-4 bg-emerald-50 rounded-2xl text-emerald-600 shadow-inner group-hover:scale-110 transition-transform">
                                <Folder size={28} />
                            </div>
                            <div className="relative">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveOptions(activeOptions === group.id ? null : group.id);
                                    }}
                                    className="text-gray-300 hover:text-gray-600"
                                >
                                    <MoreVertical size={20} />
                                </Button>
                                {activeOptions === group.id && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-[1.5rem] shadow-2xl z-50 py-2 overflow-hidden animate-in slide-in-from-top-2">
                                        <button
                                            onClick={() => openEditModal(group)}
                                            className="w-full text-left px-5 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                                        >
                                            <Edit2 size={16} className="text-blue-500" /> Modify Parameters
                                        </button>
                                        <button
                                            onClick={() => handleDelete(group.id)}
                                            className="w-full text-left px-5 py-3 text-sm font-bold text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                                        >
                                            <Trash2 size={16} /> Purge Group
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <h3 className="font-black text-gray-900 text-xl mb-2 tracking-tight">{group.name}</h3>
                        <p className="text-gray-500 text-sm font-medium mb-8 leading-relaxed line-clamp-2 min-h-[40px]">
                            {group.description || 'System cluster without behavioral tags.'}
                        </p>

                        <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                            <div className="flex items-center gap-4">
                                <div className="bg-gray-50 px-4 py-2 rounded-xl border border-gray-100 flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 tracking-widest">
                                    <Monitor size={14} className="text-emerald-500" /> {group.count || 0} Entities
                                </div>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => navigate('/nodes', { state: { groupId: group.id, groupName: group.name } })}
                                className="font-black text-[10px] uppercase tracking-widest border-emerald-500/20 text-emerald-600 hover:bg-emerald-50"
                            >
                                Deploy <ArrowRight size={14} className="ml-2" />
                            </Button>
                        </div>
                    </div>
                ))}

                {filteredGroups.length === 0 && (
                    <div className="col-span-full py-24 text-center bg-gray-50/50 rounded-[3rem] border-2 border-dashed border-gray-200">
                        <div className="bg-white w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl border border-gray-100 text-gray-200">
                            <Folder size={48} className="animate-pulse" />
                        </div>
                        <h3 className="text-gray-900 font-black text-2xl tracking-tight mb-2">No Clusters Detected</h3>
                        <p className="text-gray-500 font-medium max-w-sm mx-auto">The asset matrix is empty. Define your first cluster to begin infrastructure orchestration.</p>
                        <Button
                            variant="orange"
                            className="mt-8 px-10"
                            onClick={openCreateModal}
                        >
                            Initialize Cluster
                        </Button>
                    </div>
                )}
            </div>

            {/* Create/Edit Group Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[10000] flex items-center justify-center p-6 bg-emerald-950/40 backdrop-blur-xl animate-in fade-in duration-300">
                    <div className="absolute inset-0" onClick={closeModal}></div>
                    <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-md relative z-10 overflow-hidden border border-white/20 animate-in zoom-in-95">
                        <div className="p-10 bg-gray-950 text-white relative">
                            <div className="absolute top-0 right-0 p-10 opacity-10">
                                <Folder size={100} />
                            </div>
                            <h2 className="text-2xl font-black tracking-tight relative z-10">{editMode ? 'Modify Matrix' : 'Initialize Cluster'}</h2>
                            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1 relative z-10">Cluster Identity Configuration</p>
                        </div>

                        <form onSubmit={handleSubmit} className="p-10 space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Cluster Label</label>
                                <input
                                    autoFocus
                                    type="text"
                                    required
                                    className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 font-bold transition-all"
                                    placeholder="e.g. CORE_INFRA_Z1"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Cluster Brief</label>
                                <textarea
                                    className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 font-bold transition-all min-h-[120px]"
                                    placeholder="Define the scope and behavioral profile of this cluster..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>

                            <div className="flex gap-4 pt-4">
                                <Button
                                    variant="ghost"
                                    type="button"
                                    onClick={closeModal}
                                    className="flex-1"
                                >
                                    Abort
                                </Button>
                                <Button
                                    variant="orange"
                                    type="submit"
                                    isLoading={saving}
                                    className="flex-1"
                                >
                                    {editMode ? 'Update Matrix' : 'Commit Cluster'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Groups;


