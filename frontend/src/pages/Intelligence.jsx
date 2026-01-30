import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Intelligence = () => {
    const [intel, setIntel] = useState([]);
    const [selectedThreat, setSelectedThreat] = useState(null);
    const [explanation, setExplanation] = useState("");
    const [remediation, setRemediation] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/api/threat-intel')
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success') setIntel(data.data);
            });
    }, []);

    const handleExplain = async (threat) => {
        setSelectedThreat(threat);
        const res = await fetch('http://localhost:5000/api/threat-intel/explain', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: threat.threat_type, details: threat.description })
        });
        const data = await res.json();
        if (data.status === 'success') {
            setExplanation(data.explanation);
            setRemediation(data.remediation);
        }
    };

    return (
        <div className="space-y-6 p-6">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
                Threat Intelligence & AI Insights
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left: Feed */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl h-[600px] overflow-y-auto">
                    <h2 className="text-xl font-bold text-white mb-4">Live Threat Feed</h2>
                    <div className="space-y-3">
                        {intel.map((item, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ scale: 1.01 }}
                                onClick={() => handleExplain(item)}
                                className={`p-4 rounded-xl border border-white/5 cursor-pointer transition-all ${selectedThreat === item ? 'bg-purple-500/10 border-purple-500/50' : 'bg-black/20 hover:bg-white/5'
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <span className="font-bold text-gray-200">{item.threat_type}</span>
                                    <span className="text-xs text-gray-500">{new Date(item.timestamp).toLocaleTimeString()}</span>
                                </div>
                                <p className="text-sm text-gray-400 mb-2">{item.description}</p>
                                <div className="flex gap-2">
                                    <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-400">Sev: {item.severity}</span>
                                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400">Conf: {item.confidence_score}%</span>
                                </div>
                            </motion.div>
                        ))}
                        {intel.length === 0 && <p className="text-gray-500 text-center mt-10">No intelligence data collected yet.</p>}
                    </div>
                </div>

                {/* Right: Analysis */}
                <div className="space-y-6">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl min-h-[300px]">
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <span className="text-2xl">🧠</span> AI Explanation
                        </h2>
                        {selectedThreat ? (
                            <div className="space-y-4">
                                <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
                                    <p className="text-purple-200 leading-relaxed font-light">
                                        {explanation || "Analyzing..."}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center mt-20">Select a threat to view AI analysis.</p>
                        )}
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl min-h-[250px]">
                        <h2 className="text-xl font-bold text-white mb-4">Remediation Steps</h2>
                        {selectedThreat && remediation.length > 0 ? (
                            <ul className="space-y-2">
                                {remediation.map((step, i) => (
                                    <li key={i} className="flex items-center gap-3 text-gray-300">
                                        <span className="w-6 h-6 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-xs border border-green-500/30">
                                            {i + 1}
                                        </span>
                                        {step}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500">No remediation data.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Intelligence;
