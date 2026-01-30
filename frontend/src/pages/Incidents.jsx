import React, { useEffect } from 'react';
import { Bell, AlertTriangle, Trash2, RefreshCw, Ban, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { cn } from '../lib/utils';
import { Button } from '../components/Button';

const Incidents = () => {
    const { notifications, fetchNotifications, deleteNotification } = useApp();

    useEffect(() => {
        fetchNotifications();
    }, []);

    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            {/* Premium Header */}
            <div className="bg-gradient-to-r from-red-900 via-rose-950 to-red-900 p-8 rounded-[2.5rem] shadow-2xl border border-red-800 relative overflow-hidden">
                <div className="absolute top-0 right-0 opacity-10 -translate-y-1/2 translate-x-1/4 rotate-45 scale-150">
                    <Bell size={300} />
                </div>
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-3xl font-black text-white tracking-tighter flex items-center gap-3">
                            <div className="bg-white/10 p-2 rounded-xl backdrop-blur-md">
                                <AlertTriangle className="text-red-400" size={32} />
                            </div>
                            Incident Terminal
                        </h1>
                        <p className="text-red-200 mt-2 font-medium opacity-80 max-w-lg">
                            Log of all intrusion attempts, system anomalies, and defensive maneuvers.
                        </p>
                    </div>

                    <div className="flex gap-3 w-full md:w-auto">
                        <Button variant="glass" className="border-red-500/30" onClick={fetchNotifications}>
                            Refresh Logs
                        </Button>
                        <div className="px-6 py-2.5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-white text-sm font-black uppercase tracking-widest shadow-lg">
                            Active Alerts: {notifications.length}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Table Container */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-50">
                                <th className="px-8 py-5">Status</th>
                                <th className="px-6 py-5">Incident Description</th>
                                <th className="px-6 py-5">Detection Timestamp</th>
                                <th className="px-8 py-5 text-right">Sanitize</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {notifications.length > 0 ? (
                                notifications.map((notif) => (
                                    <tr key={notif.id} className="group hover:bg-gray-50/50 transition-all">
                                        <td className="px-8 py-5">
                                            <div className={cn(
                                                "p-2 rounded-xl w-fit shadow-sm",
                                                notif.type === 'error' ? 'bg-red-500/10 text-red-600 border border-red-500/20' :
                                                    notif.type === 'success' ? 'bg-green-500/10 text-green-600 border border-green-500/20' :
                                                        'bg-blue-500/10 text-blue-600 border border-blue-500/20'
                                            )}>
                                                {notif.type === 'success' ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col">
                                                <span className="font-black text-gray-900 text-sm tracking-tight">{notif.message}</span>
                                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">{notif.type} Module Triggered</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2 text-gray-400 font-mono text-[11px] font-bold">
                                                <Clock size={12} className="text-gray-300" />
                                                {new Date(notif.timestamp).toLocaleString().replace(',', ' |')}
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => deleteNotification(notif.id)}
                                                className="text-gray-300 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all rounded-xl"
                                            >
                                                <Trash2 size={16} />
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="px-8 py-24 text-center">
                                        <div className="flex flex-col items-center gap-4 text-gray-300">
                                            <div className="bg-gray-50 p-6 rounded-full">
                                                <Bell size={60} className="opacity-20 translate-y-2 animate-bounce" />
                                            </div>
                                            <div className="space-y-1">
                                                <h3 className="font-black text-gray-900 tracking-tight text-lg">Defensive Perimeter Quiet</h3>
                                                <p className="text-sm font-medium">No system incidents have been logged during this cycle.</p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Incidents;
