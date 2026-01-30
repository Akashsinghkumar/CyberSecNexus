import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    // User State
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Data State
    const [stats, setStats] = useState({
        totalEvents: 0,
        blockedThreats: 0,
        activeNodes: 0,
        activeRules: 0
    });
    const [events, setEvents] = useState([]);
    const [nodes, setNodes] = useState([]);
    const [rules, setRules] = useState([]);
    const [groups, setGroups] = useState([]);
    const [blockedIps, setBlockedIps] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [isAIChatOpen, setIsAIChatOpen] = useState(false);
    const [licenseTier, setLicenseTier] = useState('standard');

    const API_BASE = '/api';

    // ---- Helper Functions ----
    // ---- Helper Functions ----
    const [toasts, setToasts] = useState([]); // Ephemeral popups

    const addNotification = async (msg, type = 'info') => {
        try {
            // Play alarm for errors/critical alerts
            if (type === 'error' || type === 'critical') {
                const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3');
                audio.play().catch(e => console.log('Audio play failed', e));
            }

            // 1. Persist to Backend (For History/Bell Icon)
            await fetch(`${API_BASE}/notifications`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: msg, type })
            });

            // 2. Refresh local persistent list
            await fetchNotifications();

            // 3. Show Ephemeral Toast (10s timer)
            const id = Date.now();
            setToasts(prev => [...prev, { id, message: msg, type }]);
            setTimeout(() => {
                setToasts(prev => prev.filter(t => t.id !== id));
            }, 10000);

        } catch (error) {
            console.error('Failed to save notification', error);
        }
    };

    const fetchNotifications = async () => {
        try {
            const res = await fetch(`${API_BASE}/notifications`);
            if (!res.ok) throw new Error('Failed to fetch notifications');
            const data = await res.json();
            setNotifications(data.data || []);
        } catch (error) {
            console.error('Could not load persistent notifications', error);
        }
    };

    const deleteNotification = async (id) => {
        try {
            await fetch(`${API_BASE}/notifications/${id}`, { method: 'DELETE' });
            setNotifications(prev => prev.filter(n => n.id !== id));
        } catch (error) {
            handleError('Failed to delete notification', error);
        }
    };

    const handleError = (msg, error) => {
        console.error(msg, error);
        addNotification(msg, 'error');
    };

    // ---- Auth Logic ----
    const login = (email, password) => {
        // Simulate login
        setIsAuthenticated(true);
        setUser({
            name: 'Admin User',
            role: 'Security Analyst',
            email: email,
            avatar: null
        });
    };

    const logout = () => {
        setIsAuthenticated(false);
        setUser(null);
        addNotification('Logged out successfully', 'info');
    };

    // ---- Data Fetching ----
    const fetchStats = async () => {
        try {
            const res = await fetch(`${API_BASE}/stats`);
            if (!res.ok) throw new Error('Failed to fetch stats');
            const data = await res.json();

            setStats({
                totalEvents: data.data.totalEvents || 0,
                blockedThreats: data.data.blockedThreats || 0,
                activeNodes: data.data.activeNodes || 0,
                activeRules: data.data.activeRules || 0
            });
        } catch (error) {
            console.error("Failed to load stats", error);
            // Fallback to 0 if failed, NO RANDOM DATA per user request
            setStats({ totalEvents: 0, blockedThreats: 0, activeNodes: 0, activeRules: 0 });
        }
    };

    const fetchEvents = async (page = 1, search = '') => {
        try {
            const query = new URLSearchParams({ page, limit: 10 });
            if (search) query.append('search', search);

            const res = await fetch(`${API_BASE}/events?${query.toString()}`);
            if (!res.ok) throw new Error('Failed to fetch events');
            const data = await res.json();
            setEvents(data.data || []);
        } catch (error) {
            handleError('Could not load events', error);
        }
    };

    const fetchNodes = async () => {
        try {
            const res = await fetch(`${API_BASE}/nodes`);
            if (!res.ok) throw new Error('Failed to fetch nodes');
            const data = await res.json();
            setNodes(data.data || []);
        } catch (error) {
            handleError('Could not load nodes', error);
        }
    };

    const fetchRules = async () => {
        try {
            const res = await fetch(`${API_BASE}/rules`);
            if (!res.ok) throw new Error('Failed to fetch rules');
            const data = await res.json();
            setRules(data.data || []);
        } catch (error) {
            handleError('Could not load rules', error);
        }
    };

    const toggleRule = async (id, enabled) => {
        try {
            const res = await fetch(`${API_BASE}/rules/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ enabled })
            });
            if (!res.ok) throw new Error('Failed to update rule');
            setRules(prev => prev.map(r => r.id === id ? { ...r, enabled } : r));
            addNotification(`Rule ${enabled ? 'enabled' : 'disabled'} successfully`, 'success');
        } catch (error) {
            handleError('Failed to toggle rule', error);
            fetchRules();
        }
    };

    const deleteRule = async (id) => {
        try {
            const res = await fetch(`${API_BASE}/rules/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete rule');
            setRules(prev => prev.filter(r => r.id !== id));
            addNotification('Rule deleted', 'success');
        } catch (error) {
            handleError('Failed to delete rule', error);
        }
    };

    const createRule = async (ruleData) => {
        try {
            const res = await fetch(`${API_BASE}/rules`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(ruleData)
            });
            if (!res.ok) throw new Error('Failed to create rule');
            const result = await res.json();
            addNotification('Rule created successfully', 'success');
            await fetchRules(); // Refresh the rules list
            return result;
        } catch (error) {
            handleError('Failed to create rule', error);
            throw error;
        }
    };

    // ---- Groups ----
    const fetchGroups = async () => {
        try {
            const res = await fetch(`${API_BASE}/groups`);
            if (!res.ok) throw new Error('Failed to fetch groups');
            const data = await res.json();
            setGroups(data.data || []);
        } catch (error) {
            handleError('Could not load groups', error);
        }
    };

    const createGroup = async (groupData) => {
        try {
            const res = await fetch(`${API_BASE}/groups`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(groupData)
            });
            if (!res.ok) throw new Error('Failed to create group');
            addNotification('Group created successfully', 'success');
            await fetchGroups();
        } catch (error) {
            handleError('Failed to create group', error);
        }
    };

    const deleteGroup = async (id) => {
        try {
            const res = await fetch(`${API_BASE}/groups/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete group');
            addNotification('Group deleted', 'success');
            await fetchGroups();
        } catch (error) {
            handleError('Failed to delete group', error);
        }
    };

    const updateGroup = async (id, groupData) => {
        try {
            const res = await fetch(`${API_BASE}/groups/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(groupData)
            });
            if (!res.ok) throw new Error('Failed to update group');
            addNotification('Group updated successfully', 'success');
            await fetchGroups();
        } catch (error) {
            handleError('Failed to update group', error);
        }
    };

    const fetchBlockedIps = async () => {
        try {
            const res = await fetch(`${API_BASE}/blocked`);
            if (!res.ok) throw new Error('Failed to fetch blocked IPs');
            const data = await res.json();
            setBlockedIps(data || []);
        } catch (error) {
            handleError('Could not load blocked IPs', error);
        }
    };

    const blockIp = async (ip, reason = 'Manual Block') => {
        try {
            const res = await fetch(`${API_BASE}/block-ip`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ip, reason })
            });
            if (!res.ok) throw new Error('Failed to block IP');
            addNotification(`IP ${ip} has been added to the blacklist`, 'success');
            await fetchBlockedIps();
            return true;
        } catch (error) {
            handleError('Failed to block IP', error);
            return false;
        }
    };

    const unblockIp = async (ip) => {
        try {
            const res = await fetch(`${API_BASE}/blocked/${ip}`, {
                method: 'DELETE'
            });
            if (!res.ok) throw new Error('Failed to unblock IP');
            addNotification(`IP ${ip} has been unblocked`, 'success');
            await fetchBlockedIps();
            return true;
        } catch (error) {
            handleError('Failed to unblock IP', error);
            return false;
        }
    };

    // ---- License Logic ----
    const fetchLicense = async () => {
        try {
            const res = await fetch(`${API_BASE}/license`);
            const data = await res.json();
            setLicenseTier(data.tier);
        } catch (error) {
            console.error('Failed to fetch license', error);
        }
    };

    const upgradeToPlatinum = async () => {
        try {
            const res = await fetch(`${API_BASE}/upgrade-license`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tier: 'platinum' })
            });
            if (!res.ok) throw new Error('Upgrade failed');
            setLicenseTier('platinum');
            addNotification('SYSTEM UPGRADED TO PLATINUM PRO SUCCESSFUL', 'success');
        } catch (error) {
            handleError('License upgrade failed', error);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchStats();
            fetchNotifications();
            fetchLicense();
            const interval = setInterval(fetchStats, 10000);
            return () => clearInterval(interval);
        }
    }, [isAuthenticated]);

    const value = {
        user,
        isAuthenticated,
        login,
        logout,
        stats,
        events,
        nodes,
        rules,
        groups,
        notifications,
        addNotification,
        fetchEvents,
        fetchNodes,
        fetchRules,
        fetchGroups,
        toggleRule,
        deleteRule,
        createRule,
        createGroup,
        deleteGroup,
        updateGroup,
        blockIp,
        unblockIp,
        blockedIps,
        fetchBlockedIps,
        deleteNotification,
        fetchNotifications,
        licenseTier,
        upgradeToPlatinum,
        isAIChatOpen,
        setIsAIChatOpen,
        toasts
    };

    return (
        <AppContext.Provider value={value}>
            {children}
            <div className="fixed bottom-4 right-4 space-y-2 z-[10000] max-w-sm pointer-events-none">
                {toasts.map(n => (
                    <div key={n.id} className={`pointer-events-auto px-4 py-3 rounded-lg shadow-2xl text-white text-sm font-medium flex items-center justify-between gap-3 animate-in slide-in-from-right-2 fade-in duration-300 ${n.type === 'error' ? 'bg-red-600' :
                        n.type === 'success' ? 'bg-green-600' : 'bg-blue-600'
                        }`}>
                        <span className="drop-shadow-sm">{n.message}</span>
                        <button onClick={() => setToasts(prev => prev.filter(t => t.id !== n.id))} className="opacity-70 hover:opacity-100 transition-opacity">×</button>
                    </div>
                ))}
            </div>
        </AppContext.Provider>
    );
};

export const useApp = () => useContext(AppContext);
