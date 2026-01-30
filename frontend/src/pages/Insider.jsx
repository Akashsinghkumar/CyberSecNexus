import React, { useState, useEffect } from 'react';
import { Button } from '../components/Button';

const Insider = () => {
    const [logs, setLogs] = useState([]);

    const fetchData = () => {
        fetch('http://localhost:5000/api/insider/logs')
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success') setLogs(data.data);
            });
    };

    const simulateActivity = async () => {
        // Find existing users logic would be here, but we'll just simulate a user
        const actions = ["file_download", "bulk_export", "change_role", "login"];
        const users = ["admin", "analyst_01", "dev_ops"];
        const randAction = actions[Math.floor(Math.random() * actions.length)];
        const randUser = users[Math.floor(Math.random() * users.length)];

        await fetch('http://localhost:5000/api/insider/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user: randUser, action: randAction, time: new Date().getHours() })
        });

        // Give backend time to log
        setTimeout(fetchData, 500);
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="space-y-6 p-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-emerald-500">
                    Insider Threat Detection
                </h1>
                <Button onClick={simulateActivity} variant="secondary">Simulate User Activity</Button>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
                <h2 className="text-xl font-bold text-white mb-4">User Behavior Logs</h2>
                <div className="space-y-2">
                    {logs.map((log, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-white/5">
                            <div className="flex items-center gap-4">
                                <div className={`w-2 h-10 rounded-full ${log.severity === 'Critical' ? 'bg-red-500' :
                                    log.severity === 'High' ? 'bg-orange-500' :
                                        'bg-yellow-500'
                                    }`}></div>
                                <div>
                                    <p className="font-bold text-gray-200">{log.action} <span className="text-gray-500 font-normal">by {log.user}</span></p>
                                    <p className="text-sm text-gray-400">{log.details}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="block text-xs text-gray-500">{new Date(log.timestamp).toLocaleTimeString()}</span>
                                <span className="text-xs font-mono text-gray-600">{log.severity}</span>
                            </div>
                        </div>
                    ))}
                    {logs.length === 0 && <p className="text-gray-500 text-center">No anomalous behavior detected.</p>}
                </div>
            </div>
        </div>
    );
};

export default Insider;
