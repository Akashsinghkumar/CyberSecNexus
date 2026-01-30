import React from 'react';
import { Settings as SettingsIcon, Sliders, Shield, Bell } from 'lucide-react';
import { Button } from '../components/Button';

const Settings = () => {
    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Premium Header */}
            <div className="bg-gradient-to-r from-slate-900 via-gray-900 to-slate-900 p-8 rounded-[2.5rem] shadow-2xl border border-gray-800 relative overflow-hidden">
                <div className="absolute top-0 right-0 opacity-10 -translate-y-1/2 translate-x-1/4 rotate-12 scale-150 text-white">
                    <SettingsIcon size={300} />
                </div>
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-3xl font-black text-white tracking-tighter flex items-center gap-3">
                            <div className="bg-white/10 p-2 rounded-xl backdrop-blur-md">
                                <Sliders className="text-gray-400" size={32} />
                            </div>
                            Core Configuration
                        </h1>
                        <p className="text-gray-400 mt-2 font-medium opacity-80 max-w-lg">
                            Global orchestration parameters and security policy enforcement overrides.
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 space-y-8 group transition-all hover:shadow-xl">
                    <div className="flex items-center gap-3 font-black text-gray-900 uppercase tracking-[0.2em] text-xs border-b border-gray-50 pb-6">
                        <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl shadow-inner group-hover:scale-110 transition-transform">
                            <Shield size={20} />
                        </div>
                        Security Perimeter
                    </div>
                    <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-transparent hover:border-gray-100 transition-all">
                            <div className="flex flex-col">
                                <span className="text-sm font-black text-gray-800 tracking-tight">Auto-Containment</span>
                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">Block high-severity clusters</span>
                            </div>
                            <div className="w-12 h-6 bg-orange-500 rounded-full relative shadow-lg shadow-orange-200">
                                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-transparent hover:border-gray-100 transition-all">
                            <div className="flex flex-col">
                                <span className="text-sm font-black text-gray-800 tracking-tight">Neural Analysis</span>
                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">Real-time AI event parsing</span>
                            </div>
                            <div className="w-12 h-6 bg-gray-200 rounded-full relative">
                                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 space-y-8 group transition-all hover:shadow-xl">
                    <div className="flex items-center gap-3 font-black text-gray-900 uppercase tracking-[0.2em] text-xs border-b border-gray-50 pb-6">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl shadow-inner group-hover:scale-110 transition-transform">
                            <Bell size={20} />
                        </div>
                        Signal Dispatch
                    </div>
                    <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-transparent hover:border-gray-100 transition-all">
                            <div className="flex flex-col">
                                <span className="text-sm font-black text-gray-800 tracking-tight">Critical Synapse</span>
                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">Email alerts for P1 incidents</span>
                            </div>
                            <div className="w-12 h-6 bg-orange-500 rounded-full relative shadow-lg shadow-orange-200">
                                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-transparent hover:border-gray-100 transition-all">
                            <div className="flex flex-col">
                                <span className="text-sm font-black text-gray-800 tracking-tight">Stream Notification</span>
                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">Desktop push protocols</span>
                            </div>
                            <div className="w-12 h-6 bg-orange-500 rounded-full relative shadow-lg shadow-orange-200">
                                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="pt-8 flex justify-end">
                <Button variant="orange" className="px-10 py-6 rounded-2xl shadow-2xl shadow-orange-200">
                    Commit Changes
                </Button>
            </div>
        </div>
    );
};

export default Settings;
