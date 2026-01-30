import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Bot, User, Minimize2, Sparkles, ShieldAlert } from 'lucide-react';
import { cn } from '../lib/utils';
import { useApp } from '../context/AppContext';
import { generateAIReport } from '../lib/ai';

const AIChatbot = () => {
    const { events, stats, nodes, blockIp, isAIChatOpen: isOpen, setIsAIChatOpen: setIsOpen } = useApp();
    const [messages, setMessages] = useState([
        { id: 1, text: "Hello! I am your AI Security Analyst. I can analyze recent threats, generate reports, or block suspicious IPs. Type 'Status', 'Analyze', or 'Block'.", sender: 'bot' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = { id: Date.now(), text: input, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        const responseText = await processCommand(userMsg.text);

        setIsTyping(false);
        setMessages(prev => [...prev, { id: Date.now() + 1, text: responseText, sender: 'bot' }]);
    };

    const processCommand = async (text) => {
        const lower = text.toLowerCase();

        // 1. REPORT
        if (lower.includes('report') || lower.includes('status')) {
            const criticalCount = events.filter(e => e.severity === 'Critical' || e.severity === 'High').length;
            const recentAttacker = events[0]?.source_ip || 'None';

            return `📢 **SYSTEM INTELLIGENCE REPORT**\n
• **Threat Level**: ${criticalCount > 0 ? 'CRITICAL' : 'MODERATE'}
• **Active Events**: ${events.length} monitored.
• **Critical Threats**: ${criticalCount} detected.
• **Nodes Online**: ${nodes.filter(n => n.status === 'active').length} / ${nodes.length}
• **Most Recent Activity**: ${events[0]?.event_type || 'None'} from ${recentAttacker}.`;
        }

        // 2. ANALYZE
        if (lower.includes('analyze') || lower.includes('threat')) {
            const latestThreat = events.find(e => ['Critical', 'High'].includes(e.severity)) || events[0];
            if (!latestThreat) return "No significant threats detected in the log buffer.";

            const detailedAnalysis = generateAIReport(latestThreat);
            // Return only summary
            const snippet = detailedAnalysis.split('THREAT SUMMARY:')[1].split('RISK LEVEL:')[0].trim();

            return `🔍 **THREAT ANALYSIS:**\n${snippet}\n\n**Source IP**: ${latestThreat.source_ip}\n**Recommended**: BLOCK this IP.`;
        }

        // 3. BLOCK
        if (lower.includes('block')) {
            const latestThreat = events.find(e => ['Critical', 'High'].includes(e.severity)) || events[0];
            if (!latestThreat) return "No active threat target identified to block.";

            // ACTUAL BLOCK CALL
            const success = await blockIp(latestThreat.source_ip);

            if (success) {
                return `🛡️ **ACTION EXECUTED**\n\n**Target**: ${latestThreat.source_ip}\n**Status**: BLOCKED (Real-time). \n\nTraffic from this IP is now being dropped by the Simulator.`;
            } else {
                return `⚠️ **ACTION FAILED**\n\nCould not update firewall rules. Check backend connection.`;
            }
        }

        return "I am ready. Ask for 'Status', 'Analyze', or 'Block'.";
    };

    return (
        <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end pointer-events-none">
            {/* Chat Window */}
            {isOpen && (
                <div className="mb-4 w-96 bg-gray-900 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden pointer-events-auto animate-in slide-in-from-bottom-5 fade-in duration-300 flex flex-col max-h-[600px]">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-gray-900 to-black p-4 flex justify-between items-center text-white border-b border-gray-800">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg animate-pulse">
                                    <Bot className="w-6 h-6 text-white" />
                                </div>
                                <div className="absolute -bottom-1 -right-1 bg-gray-900 p-0.5 rounded-full">
                                    <ShieldAlert size={14} className="text-green-400" />
                                </div>
                            </div>
                            <div>
                                <h3 className="font-bold text-sm text-gray-100">CyberSec AI</h3>
                                <div className="flex items-center gap-1.5 opacity-80">
                                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                                    <span className="text-[10px] uppercase tracking-wider font-medium text-cyan-400">Active Monitoring</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2 text-gray-400">
                            <button onClick={() => setIsOpen(false)} className="hover:text-white transition-colors">
                                <Minimize2 size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 bg-gray-950 p-4 overflow-y-auto h-96 space-y-4 scrollbar-thin scrollbar-thumb-gray-800">
                        {messages.map((msg) => (
                            <div key={msg.id} className={cn(
                                "flex gap-3 max-w-[90%]",
                                msg.sender === 'user' ? "ml-auto flex-row-reverse" : ""
                            )}>
                                {/* Avatar */}
                                <div className={cn(
                                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white text-xs border border-gray-700",
                                    msg.sender === 'user' ? "bg-gray-800" : "bg-blue-900/50"
                                )}>
                                    {msg.sender === 'user' ? <User size={14} /> : <Sparkles size={14} className="text-cyan-400" />}
                                </div>

                                {/* Bubble */}
                                <div className={cn(
                                    "p-3 rounded-2xl text-sm shadow-sm",
                                    msg.sender === 'user'
                                        ? "bg-blue-600 text-white rounded-tr-none"
                                        : "bg-gray-800 text-gray-200 border border-gray-700 rounded-tl-none"
                                )}>
                                    <p className="whitespace-pre-wrap leading-relaxed font-sans">{msg.text}</p>
                                </div>
                            </div>
                        ))}

                        {isTyping && (
                            <div className="flex gap-3 max-w-[85%]">
                                <div className="w-8 h-8 rounded-full bg-blue-900/50 flex items-center justify-center shrink-0 text-white border border-gray-700">
                                    <Sparkles size={14} className="text-cyan-400" />
                                </div>
                                <div className="bg-gray-800 px-4 py-3 rounded-2xl rounded-tl-none border border-gray-700 shadow-sm flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                    <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                    <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce"></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSend} className="p-3 bg-black border-t border-gray-800">
                        <div className="relative flex items-center">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Analyze threat..."
                                className="w-full bg-gray-900 text-white placeholder:text-gray-600 rounded-lg pl-3 pr-12 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all border border-gray-800"
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || isTyping}
                                className="absolute right-2 p-1.5 bg-cyan-600 text-white rounded-md hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md active:scale-90"
                            >
                                <Send size={16} />
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Toggle Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="pointer-events-auto h-14 w-14 bg-black border border-gray-800 text-white rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 group relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-blue-600/20 group-hover:bg-blue-600/40 transition-colors"></div>
                    <Bot className="w-7 h-7 relative z-10 text-cyan-400" />
                    <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
                    <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
            )}
        </div>
    );
};

export default AIChatbot;
