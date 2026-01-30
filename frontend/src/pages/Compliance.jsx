import React from 'react';
import { ClipboardCheck, ShieldCheck } from 'lucide-react';
import { cn } from '../lib/utils';
import { Button } from '../components/Button';

const Compliance = () => {
    const standards = [
        { name: 'NIST CSF', score: 98, status: 'Full Compliance', color: 'blue' },
        { name: 'GDPR / Privacy', score: 85, status: 'Minor Deviations', color: 'emerald' },
        { name: 'ISO 27001', score: 92, status: 'Full Compliance', color: 'indigo' },
        { name: 'SOC 2 Type II', score: 100, status: 'Audited', color: 'purple' },
    ];

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* Premium Header */}
            <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-blue-900 p-12 rounded-[3.5rem] shadow-2xl border border-blue-800 relative overflow-hidden text-center md:text-left">
                <div className="absolute top-0 right-0 opacity-10 -translate-y-1/2 translate-x-1/4 rotate-12 scale-150">
                    <ClipboardCheck size={400} />
                </div>
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
                    <div className="max-w-2xl">
                        <h1 className="text-4xl font-black text-white tracking-tighter flex items-center justify-center md:justify-start gap-3">
                            <div className="bg-white/10 p-2 rounded-2xl backdrop-blur-md">
                                <ShieldCheck className="text-blue-400" size={40} />
                            </div>
                            Regulatory Integrity
                        </h1>
                        <p className="text-blue-200 mt-4 text-lg font-medium opacity-80 leading-relaxed">
                            Continuous monitoring of global security standards and automated mapping of system telemetry to regulatory controls.
                        </p>
                    </div>

                    <div className="bg-white/5 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/10 shadow-2xl min-w-[300px]">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[10px] font-black text-blue-300 uppercase tracking-widest">Aggregate Posture</span>
                            <span className="text-emerald-400 font-black text-xs bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">94% COMPLIANT</span>
                        </div>
                        <div className="text-5xl font-black text-white tracking-tighter mb-4">A+ <span className="text-lg text-blue-400 font-bold ml-2">Rating</span></div>
                        <div className="w-full bg-blue-950 h-3 rounded-full overflow-hidden shadow-inner">
                            <div className="bg-gradient-to-r from-blue-500 to-emerald-400 h-full w-[94%] rounded-full shadow-[0_0_20px_rgba(59,130,246,0.5)]"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Standards Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {standards.map((std, i) => (
                    <div key={i} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 hover:shadow-2xl transition-all group">
                        <div className={cn(
                            "w-14 h-14 rounded-2xl mb-6 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform",
                            std.color === 'blue' && "bg-blue-50 text-blue-600",
                            std.color === 'emerald' && "bg-emerald-50 text-emerald-600",
                            std.color === 'indigo' && "bg-indigo-50 text-indigo-600",
                            std.color === 'purple' && "bg-purple-50 text-purple-600",
                        )}>
                            <ClipboardCheck size={28} />
                        </div>
                        <h3 className="font-black text-gray-900 text-lg mb-1 tracking-tight">{std.name}</h3>
                        <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-6">{std.status}</p>

                        <div className="flex items-end justify-between">
                            <div className="text-3xl font-black text-gray-900 tracking-tighter">{std.score}%</div>
                            <Button variant="ghost" size="sm" className="font-black text-[9px] uppercase tracking-[0.2em] text-blue-600 group-hover:bg-blue-50">Details</Button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Detailed Controls Section Placeholder */}
            <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-[0.03]">
                    <ShieldCheck size={200} />
                </div>
                <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="text-center md:text-left">
                        <h2 className="text-2xl font-black text-gray-900 tracking-tight">Audit Terminal</h2>
                        <p className="text-gray-500 font-medium mt-1">Generate verifiable reports for external auditors and internal review.</p>
                    </div>
                    <div className="flex gap-4">
                        <Button variant="outline" className="px-8 rounded-2xl">Export CSV</Button>
                        <Button variant="orange" className="px-8 shadow-lg shadow-orange-200 rounded-2xl">Generate PDF Dossier</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Compliance;
