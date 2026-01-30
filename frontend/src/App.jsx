import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { AppProvider, useApp } from './context/AppContext';
import Dashboard from './pages/Dashboard';
import Events from './pages/Events';
import Nodes from './pages/Nodes';
import Rules from './pages/Rules';
import Groups from './pages/Groups';
import Login from './pages/Login';
import BlockedIPs from './pages/BlockedIPs';
import Compliance from './pages/Compliance';
import Incidents from './pages/Incidents';
import LiveTraffic from './pages/LiveTraffic';
import Settings from './pages/Settings';
import AIAnalyst from './pages/AIAnalyst';
import Threats from './pages/Threats';
import Intelligence from './pages/Intelligence';
import SupplyChain from './pages/SupplyChain';
import Insider from './pages/Insider';

const AppContent = () => {
    const { isAuthenticated } = useApp();

    return (
        <Router>
            <Routes>
                {!isAuthenticated ? (
                    <>
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Login initialIsSignUp={true} />} />
                        <Route path="*" element={<Navigate to="/login" replace />} />
                    </>
                ) : (
                    <Route
                        path="/*"
                        element={
                            <Layout>
                                <Routes>
                                    <Route path="/" element={<Dashboard />} />
                                    <Route path="/events" element={<Events />} />
                                    <Route path="/nodes" element={<Nodes />} />
                                    <Route path="/rules" element={<Rules />} />
                                    <Route path="/groups" element={<Groups />} />
                                    <Route path="/blocked-ips" element={<BlockedIPs />} />
                                    <Route path="/compliance" element={<Compliance />} />
                                    <Route path="/incidents" element={<Incidents />} />
                                    <Route path="/live-traffic" element={<LiveTraffic />} />
                                    <Route path="/settings" element={<Settings />} />
                                    <Route path="/ai-analyst" element={<AIAnalyst />} />
                                    <Route path="/threats" element={<Threats />} />
                                    <Route path="/intelligence" element={<Intelligence />} />
                                    <Route path="/supply-chain" element={<SupplyChain />} />
                                    <Route path="/insider" element={<Insider />} />
                                    <Route path="*" element={<Navigate to="/" replace />} />
                                </Routes>
                            </Layout>
                        }
                    />
                )}
            </Routes>
        </Router>
    );
};

function App() {
    return (
        <AppProvider>
            <AppContent />
        </AppProvider>
    );
}

export default App;
