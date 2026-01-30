import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../components/Button';

const Threats = () => {
    const [vulnerabilities, setVulnerabilities] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch('http://localhost:5000/api/vulnerabilities');
            const data = await res.json();
            if (data.status === 'success') {
                setVulnerabilities(data.data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const runScan = async () => {
        try {
            await fetch('http://localhost:5000/api/vulnerabilities/scan', { method: 'POST' });
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="space-y-6 p-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-orange-500">
                    Active & Dormant Threats
                </h1>
                <Button onClick={runScan} variant="primary">Run Deep Scan</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Summary Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl"
                >
                    <h3 className="text-gray-400 text-sm mb-2">Active Threats</h3>
                    <p className="text-3xl font-bold text-red-500">0</p>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl"
                >
                    <h3 className="text-gray-400 text-sm mb-2">Dormant Vulnerabilities</h3>
                    <p className="text-3xl font-bold text-orange-500">{vulnerabilities.length}</p>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl"
                >
                    <h3 className="text-gray-400 text-sm mb-2">System Status</h3>
                    <p className="text-3xl font-bold text-green-500">Monitoring</p>
                </motion.div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
                <h2 className="text-xl font-bold text-white mb-4">Vulnerability Scan Results</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-gray-400 border-b border-white/10">
                                <th className="p-3">CVE ID</th>
                                <th className="p-3">Severity</th>
                                <th className="p-3">Component</th>
                                <th className="p-3">Description</th>
                                <th className="p-3">Status</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-300">
                            {vulnerabilities.map((vuln, i) => (
                                <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="p-3 font-mono text-blue-400">{vuln.cve_id}</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-1 rounded-full text-xs ${vuln.severity === 'Critical' ? 'bg-red-500/20 text-red-400' :
                                            vuln.severity === 'High' ? 'bg-orange-500/20 text-orange-400' :
                                                'bg-blue-500/20 text-blue-400'
                                            }`}>
                                            {vuln.severity}
                                        </span>
                                    </td>
                                    <td className="p-3">{vuln.affected_component}</td>
                                    <td className="p-3">{vuln.description}</td>
                                    <td className="p-3 text-green-400">{vuln.status}</td>
                                </tr>
                            ))}
                            {vulnerabilities.length === 0 && !loading && (
                                <tr>
                                    <td colSpan="5" className="p-6 text-center text-gray-500">
                                        No vulnerabilities detected. System is secure.
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

export default Threats;
