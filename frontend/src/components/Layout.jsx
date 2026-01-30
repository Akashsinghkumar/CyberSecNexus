import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Server,
    ShieldAlert,
    FileText,
    Settings,
    Bell,
    User,
    LogOut,
    Ban,
    Bot,
    ClipboardCheck,
    Activity,
    Shield,
    X,
    Bug,
    BrainCircuit,
    Truck,
    VenetianMask,
    ArrowRight,
    Menu
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '../lib/utils';
import { useApp } from '../context/AppContext';
import AIChatbot from './AIChatbot';

const Sidebar = ({ isCollapsed, setIsCollapsed, isMobile, showMobileSidebar, setShowMobileSidebar }) => {
    const { logout } = useApp();
    const location = useLocation();

    // Close mobile sidebar on route change
    useEffect(() => {
        if (isMobile) {
            setShowMobileSidebar(false);
        }
    }, [location.pathname, isMobile, setShowMobileSidebar]);

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', to: '/' },
        { icon: Bot, label: 'AI Bot Analysr', to: '/ai-analyst', highlight: true },
        { icon: ShieldAlert, label: 'Events', to: '/events' },
        { icon: Server, label: 'Nodes', to: '/nodes' },
        { icon: FileText, label: 'Rules', to: '/rules' },
        { icon: Settings, label: 'Groups', to: '/groups' },
        { icon: Ban, label: 'BlockIPs', to: '/blocked-ips' },
        { icon: ClipboardCheck, label: 'Compliance', to: '/compliance' },
        { icon: ShieldAlert, label: 'Incidents', to: '/incidents' },
        { icon: Bug, label: 'Threats', to: '/threats' },
        { icon: BrainCircuit, label: 'Intel AI', to: '/intelligence' },
        { icon: Truck, label: 'Supply Chain', to: '/supply-chain' },
        { icon: VenetianMask, label: 'Insider Risk', to: '/insider' },
        { icon: Activity, label: 'Live Traffic', to: '/live-traffic' },
        { icon: Settings, label: 'Settings', to: '/settings' },
    ];

    const sidebarWidth = isCollapsed ? 80 : 256;
    const mobileClasses = isMobile
        ? `fixed inset-y-0 left-0 z-[100] transform transition-transform duration-300 ease-in-out ${showMobileSidebar ? 'translate-x-0' : '-translate-x-full'} w-64 shadow-2xl`
        : `fixed left-0 top-0 z-[50] h-screen transition-all duration-300 ease-in-out`;

    const widthStyle = isMobile ? {} : { width: sidebarWidth };

    return (
        <>
            {/* Mobile Overlay */}
            {isMobile && showMobileSidebar && (
                <div
                    className="fixed inset-0 bg-black/50 z-[90] backdrop-blur-sm transition-opacity"
                    onClick={() => setShowMobileSidebar(false)}
                />
            )}

            <aside
                className={cn("bg-gray-900 text-white flex flex-col border-r border-gray-800 overflow-hidden", mobileClasses)}
                style={widthStyle}
            >
                <div className="h-20 flex items-center px-6 border-b border-gray-800 justify-between shrink-0">
                    <div className="flex items-center">
                        <div className="bg-blue-600 p-1.5 rounded-lg mr-3 shadow-lg shadow-blue-500/20 min-w-fit">
                            <Shield className="text-white" size={18} />
                        </div>
                        {(!isCollapsed || isMobile) && (
                            <span className="font-black text-sm uppercase tracking-[0.2em] text-white whitespace-nowrap animate-in fade-in duration-300">
                                Nexus Suite
                            </span>
                        )}
                    </div>

                    {/* Desktop Collapse Toggle */}
                    {!isMobile && (
                        <button onClick={() => setIsCollapsed(!isCollapsed)} className="text-gray-500 hover:text-white transition-colors">
                            {isCollapsed ? <ArrowRight size={16} /> : <div className="w-1 h-4 bg-gray-700 rounded-full hover:bg-gray-500" />}
                        </button>
                    )}

                    {/* Mobile Close Button */}
                    {isMobile && (
                        <button onClick={() => setShowMobileSidebar(false)} className="text-gray-400 hover:text-white">
                            <X size={20} />
                        </button>
                    )}
                </div>

                <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto custom-sidebar-scroll scrollbar-none">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) => cn(
                                "flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative",
                                isActive
                                    ? (item.highlight ? "bg-cyan-600 text-white shadow-lg shadow-cyan-900/50" : "bg-blue-600 text-white shadow-lg shadow-blue-900/50")
                                    : "text-gray-400 hover:bg-gray-800 hover:text-white",
                                item.highlight && !isActive && "text-cyan-400/80 border border-cyan-500/10 mt-4 mb-2 bg-cyan-500/5"
                            )}
                        >
                            {({ isActive }) => (
                                <>
                                    <item.icon className={cn("w-5 h-5 min-w-[20px]", (!isCollapsed || isMobile) && "mr-3", item.highlight && !isActive && "text-cyan-400")} />
                                    {(!isCollapsed || isMobile) && (
                                        <span className="animate-in fade-in duration-200">
                                            {item.label}
                                        </span>
                                    )}
                                    {isCollapsed && !isMobile && (
                                        <div className="absolute left-full ml-4 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 shadow-xl border border-gray-700">
                                            {item.label}
                                        </div>
                                    )}
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-800 shrink-0">
                    <div className={cn("flex items-center gap-3 text-sm text-gray-400", isCollapsed && !isMobile && "justify-center")}>
                        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center min-w-[32px]">
                            <User className="w-4 h-4" />
                        </div>
                        {(!isCollapsed || isMobile) && (
                            <div className="flex-1 overflow-hidden animate-in fade-in duration-200">
                                <div className="font-medium text-white truncate">Admin User</div>
                                <div className="text-xs truncate">Security Analyst</div>
                            </div>
                        )}
                        {(!isCollapsed || isMobile) && (
                            <button onClick={logout} className="hover:text-white transition-colors p-1" title="Sign Out">
                                <LogOut className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>
            </aside>
        </>
    );
};

const Topbar = ({ isMobile, toggleMobileSidebar, sidebarWidth }) => {
    const { notifications = [], deleteNotification } = useApp();
    const [isOpen, setIsOpen] = useState(false);
    const panelRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (panelRef.current && !panelRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const style = {
        paddingLeft: isMobile ? '1rem' : `calc(${sidebarWidth}px + 2rem)`,
    };

    return (
        <header
            className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-4 sm:px-8 fixed w-full z-40 transition-all duration-300"
            style={style}
        >
            <div className="flex items-center gap-4">
                {isMobile && (
                    <button
                        onClick={toggleMobileSidebar}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <Menu size={24} />
                    </button>
                )}
                <h1 className="text-lg sm:text-xl font-black text-gray-900 tracking-tight uppercase flex items-center gap-2">
                    <span className="text-blue-600">SOC</span> Terminal
                </h1>
            </div>

            <div className="flex items-center gap-4 relative" ref={panelRef}>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-all active:scale-95"
                >
                    <Bell className="w-5 h-5" />
                    {notifications.length > 0 && (
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white animate-pulse"></span>
                    )}
                </button>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute top-12 right-0 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 z-50 origin-top-right"
                        >
                            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50 mb-1">
                                <span className="font-bold text-xs text-gray-900 uppercase tracking-widest">Live Alerts</span>
                                <span className="bg-red-50 text-red-600 text-[10px] px-2 py-0.5 rounded-full font-black">{notifications.length}</span>
                            </div>
                            <div className="max-h-64 overflow-y-auto space-y-1 p-1">
                                {notifications.length === 0 ? (
                                    <div className="px-4 py-12 text-center text-xs text-gray-400 italic">
                                        System secure. No active alerts.
                                    </div>
                                ) : (
                                    notifications.map(n => (
                                        <div key={n.id} className="p-3 hover:bg-gray-50 rounded-xl text-xs group relative border border-transparent hover:border-gray-100 transition-all">
                                            <p className="text-gray-800 pr-6 break-words leading-relaxed font-semibold">
                                                {n.message}
                                            </p>
                                            <div className="flex items-center justify-between mt-2">
                                                <span className={cn(
                                                    "text-[9px] font-black uppercase px-2 py-0.5 rounded-full",
                                                    n.type === 'error' ? 'bg-red-50 text-red-600' :
                                                        n.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'
                                                )}>
                                                    {n.type}
                                                </span>
                                                <button
                                                    onClick={() => deleteNotification(n.id)}
                                                    className="text-gray-300 hover:text-red-600 p-1 transition-colors"
                                                >
                                                    <X size={12} />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </header>
    );
};

export const Layout = ({ children }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [showMobileSidebar, setShowMobileSidebar] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 1024; // lg breakpoint
            setIsMobile(mobile);
            if (!mobile) {
                setShowMobileSidebar(false);
            }
        };

        handleResize(); // Init
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const sidebarWidth = isMobile ? 0 : (isCollapsed ? 80 : 256);

    const mainStyle = {
        paddingLeft: isMobile ? '0' : `${sidebarWidth}px`,
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans relative flex flex-col">
            <Sidebar
                isCollapsed={isCollapsed}
                setIsCollapsed={setIsCollapsed}
                isMobile={isMobile}
                showMobileSidebar={showMobileSidebar}
                setShowMobileSidebar={setShowMobileSidebar}
            />

            <Topbar
                isMobile={isMobile}
                toggleMobileSidebar={() => setShowMobileSidebar(!showMobileSidebar)}
                sidebarWidth={sidebarWidth}
            />

            <main
                className="flex-1 pt-16 min-h-screen transition-all duration-300 ease-in-out"
                style={mainStyle}
            >
                <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto w-full">
                    {children}
                </div>
            </main>

            <AIChatbot />

            <style dangerouslySetInnerHTML={{
                __html: `
                .custom-sidebar-scroll::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-sidebar-scroll::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-sidebar-scroll::-webkit-scrollbar-thumb {
                    background: rgba(255,255,255,0.05);
                    border-radius: 10px;
                }
                .custom-sidebar-scroll::-webkit-scrollbar-thumb:hover {
                    background: rgba(255,255,255,0.1);
                }
            `}} />
        </div>
    );
};

export default Layout;
