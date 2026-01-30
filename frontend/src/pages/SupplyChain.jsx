import React, { useState, useEffect } from 'react';
import { Button } from '../components/Button';

const SupplyChain = () => {
    const [vendors, setVendors] = useState([]);

    const fetchData = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/third-party');
            const data = await res.json();
            if (data.status === 'success') setVendors(data.data);
        } catch (err) { }
    };

    const runScan = async () => {
        await fetch('http://localhost:5000/api/third-party/scan', { method: 'POST' });
        fetchData();
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="space-y-6 p-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-500">
                    Third-Party & Supply Chain Risk
                </h1>
                <Button onClick={runScan} variant="primary">Audit Vendors</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {vendors.map((vendor, i) => {
                    const details = JSON.parse(vendor.details_json || '{}');
                    return (
                        <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl hover:bg-white/10 transition-colors">
                            <div className="flex justify-between items-start mb-4">
                                <h2 className="text-xl font-bold text-white">{vendor.vendor_name}</h2>
                                <div className={`px-3 py-1 rounded-lg text-sm font-bold ${vendor.risk_score > 80 ? 'bg-green-500/20 text-green-400' :
                                    vendor.risk_score > 50 ? 'bg-yellow-500/20 text-yellow-400' :
                                        'bg-red-500/20 text-red-400'
                                    }`}>
                                    Score: {vendor.risk_score}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm text-gray-400">
                                <div>
                                    <span className="block text-gray-500 text-xs">API Latency</span>
                                    <span className="text-gray-200">{details.api_latency || 'N/A'}</span>
                                </div>
                                <div>
                                    <span className="block text-gray-500 text-xs">Encryption</span>
                                    <span className="text-gray-200">{details.data_encryption || 'Unknown'}</span>
                                </div>
                                <div>
                                    <span className="block text-gray-500 text-xs">Compliance</span>
                                    <span className="text-gray-200">{Array.isArray(details.compliance) ? details.compliance.join(', ') : 'None'}</span>
                                </div>
                                <div>
                                    <span className="block text-gray-500 text-xs">Last Audit</span>
                                    <span className="text-gray-200">{new Date(vendor.last_audit).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            {vendors.length === 0 && (
                <div className="text-center text-gray-500 py-20 bg-white/5 rounded-2xl border border-white/5">
                    No vendor data available. Run an audit to start monitoring.
                </div>
            )}
        </div>
    );
};

export default SupplyChain;
