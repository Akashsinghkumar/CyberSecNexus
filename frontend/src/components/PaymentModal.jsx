import React, { useState } from 'react';
import {
    CreditCard,
    Lock,
    ShieldCheck,
    X,
    Loader2,
    Smartphone,
    QrCode,
    ChevronRight,
    CheckCircle2
} from 'lucide-react';

const PaymentModal = ({ isOpen, onClose, onPaymentSuccess }) => {
    const [method, setMethod] = useState('card'); // 'card' or 'upi'
    const [cardNumber, setCardNumber] = useState('');
    const [upiId, setUpiId] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [error, setError] = useState(null);

    const formatCardNumber = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const parts = [];
        const match = (matches && matches[0]) || '';
        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }
        return parts.length ? parts.join(' ') : value;
    };

    const handlePayment = async (e) => {
        if (e) e.preventDefault();
        setIsProcessing(true);
        setError(null);

        try {
            const res = await fetch('/api/process-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    cardNumber: method === 'card' ? cardNumber : upiId,
                    type: method
                })
            });
            const data = await res.json();

            if (res.ok) {
                onPaymentSuccess();
                onClose();
            } else {
                setError(data.message || 'Payment failed. Please try again.');
            }
        } catch (err) {
            setError('Connection error. Could not reach payment gateway.');
        } finally {
            setIsProcessing(false);
        }
    };

    const simulateQRScan = () => {
        setIsVerifying(true);
        setTimeout(() => {
            setIsVerifying(false);
            handlePayment();
        }, 3000);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[20000] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gray-950/90 backdrop-blur-sm animate-in fade-in" onClick={onClose} />

            <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="bg-gray-900 p-8 text-white">
                    <button onClick={onClose} className="absolute top-6 right-6 text-white/30 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <ShieldCheck size={20} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400">Secure Gateway</span>
                    </div>
                    <h2 className="text-3xl font-black tracking-tight">Activate Platinum</h2>
                    <p className="text-gray-400 text-sm mt-1">Unlock AI protection & neural threat shield.</p>
                </div>

                {/* Tabs */}
                <div className="flex bg-gray-100 p-1 mx-8 -mt-6 rounded-2xl relative z-10 border border-white/10 shadow-lg">
                    <button
                        onClick={() => setMethod('card')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all ${method === 'card' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <CreditCard size={16} /> Credit / Debit Card
                    </button>
                    <button
                        onClick={() => setMethod('upi')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all ${method === 'upi' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <Smartphone size={16} /> UPI / QR Code
                    </button>
                </div>

                <div className="p-8">
                    {method === 'card' ? (
                        <form onSubmit={handlePayment} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Card Details</label>
                                <div className="relative">
                                    <input
                                        required
                                        placeholder="0000 0000 0000 0000"
                                        value={cardNumber}
                                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                                        className="w-full bg-gray-50 border border-gray-100 px-5 py-4 rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all"
                                    />
                                    <div className="absolute right-5 top-1/2 -translate-y-1/2 flex gap-2 grayscale border-l border-gray-200 pl-4">
                                        <div className="w-8 h-5 bg-blue-800 rounded-sm" />
                                        <div className="w-8 h-5 bg-orange-500 rounded-sm" />
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <input placeholder="MM/YY" className="bg-gray-50 border border-gray-100 px-5 py-4 rounded-2xl text-sm font-bold w-full" />
                                <input placeholder="CVV" type="password" className="bg-gray-50 border border-gray-100 px-5 py-4 rounded-2xl text-sm font-bold w-full" />
                            </div>
                            <button
                                type="submit"
                                disabled={isProcessing}
                                className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-blue-500/20 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                            >
                                {isProcessing ? <Loader2 className="animate-spin" size={18} /> : "Pay $199 & Activate"}
                            </button>
                        </form>
                    ) : (
                        <div className="space-y-6 text-center">
                            <div className="relative inline-block group">
                                <div className="absolute -inset-4 bg-gradient-to-tr from-blue-500 to-indigo-500 rounded-[2rem] opacity-10 group-hover:opacity-20 transition-opacity animate-pulse" />
                                <div className="relative bg-white p-6 rounded-[2rem] border-2 border-dashed border-gray-200 flex flex-col items-center">
                                    {isVerifying ? (
                                        <div className="w-48 h-48 flex flex-col items-center justify-center gap-4">
                                            <Loader2 className="animate-spin text-blue-600" size={48} />
                                            <span className="text-xs font-bold text-gray-500 animate-pulse">Waiting for Scan...</span>
                                        </div>
                                    ) : (
                                        <>
                                            <QrCode size={180} className="text-gray-900 mb-4" />
                                            <div className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-100">
                                                <CheckCircle2 size={12} /> Scan with any UPI App
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    {
                                        name: 'GPay',
                                        color: 'bg-white border-gray-200',
                                        icon: (
                                            <svg viewBox="0 0 48 48" className="w-10 h-10">
                                                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                                                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.13-.45-4.69H24v9.07h12.91c-.58 3.15-2.26 5.81-4.89 7.56l7.6 5.89c4.44-4.1 7.37-10.13 7.37-17.83z" />
                                                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24s.92 7.54 2.56 10.78l7.97-6.19z" />
                                                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.6-5.89c-2.15 1.45-4.92 2.3-8.29 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                                            </svg>
                                        )
                                    },
                                    {
                                        name: 'PhonePe',
                                        color: 'bg-purple-50 border-purple-100',
                                        icon: (
                                            <svg viewBox="0 0 512 512" className="w-10 h-10">
                                                <circle cx="256" cy="256" r="256" fill="#5f259f" />
                                                <path fill="#fff" d="M370.4 150.8c-12.8-12.8-31.2-12.8-44 0L256 221.2l-70.4-70.4c-12.8-12.8-31.2-12.8-44 0-12.8 12.8-12.8 31.2 0 44l70.4 70.4-70.4 70.4c-12.8 12.8-12.8 31.2 0 44 6.4 6.4 14.4 9.6 22 9.6s15.6-3.2 22-9.6l70.4-70.4 70.4 70.4c6.4 6.4 14.4 9.6 22 9.6s15.6-3.2 22-9.6c12.8-12.8 12.8-31.2 0-44l-70.4-70.4 70.4-70.4c12.8-12.8 12.8-31.2 0-44z" opacity="0" />
                                                <path fill="#fff" d="M256 96c-88.4 0-160 71.6-160 160s71.6 160 160 160 160-71.6 160-160S344.4 96 256 96zm32 192h-64v-96h64v96zm-32-128c13.2 0 24 10.8 24 24s-10.8 24-24 24-24-10.8-24-24 10.8-24 24-24z" />
                                            </svg>
                                        )
                                    },
                                    {
                                        name: 'Paytm',
                                        color: 'bg-blue-50 border-blue-100',
                                        icon: (
                                            <svg viewBox="0 0 100 32" className="w-12 h-6">
                                                <path fill="#00baf2" d="M11.6 4.3h-4.4v23.4h4.4v-9.5h5.1c4.8 0 8.7-3.9 8.7-8.7-.1-3-4-5.2-13.8-5.2zm0 10.3v-6.3h4.6c2.8 0 5 2.2 5 5s-2.2 5-5 5h-4.6zM32.8 4.3h-4.4v23.4h4.4v-9.5h5.1c4.8 0 8.7-3.9 8.7-8.7-.1-3-4-5.2-13.8-5.2zm0 10.3v-6.3h4.6c2.8 0 5 2.2 5 5s-2.2 5-5 5h-4.6zM62.8 4.3l-5.4 12.4-5.4-12.4h-4.8l7.8 17.5v5.9h4.4v-5.9l7.8-17.5h-4.4zM80.1 8.7h-5.2v19h4.4v-19h8.8v19h4.4v-19h2.1v-4.4h-14.5v4.4z" />
                                            </svg>
                                        )
                                    }
                                ].map((app) => (
                                    <div key={app.name} className={`py-4 px-2 rounded-2xl border flex flex-col items-center justify-center gap-3 cursor-pointer hover:scale-105 active:scale-95 transition-all shadow-sm hover:shadow-md ${app.color}`}>
                                        <div className="h-10 flex items-center justify-center">
                                            {app.icon}
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-tighter text-gray-500">{app.name}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 space-y-4">
                                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Or Pay via UPI ID</div>
                                <div className="flex gap-2">
                                    <input
                                        placeholder="example@okaxis"
                                        className="flex-1 bg-white border border-gray-100 px-5 py-3 rounded-xl text-sm font-bold focus:outline-none focus:border-blue-500"
                                        value={upiId}
                                        onChange={(e) => setUpiId(e.target.value)}
                                    />
                                    <button
                                        onClick={handlePayment}
                                        className="bg-gray-900 text-white p-3 rounded-xl hover:bg-black transition-all"
                                    >
                                        <ChevronRight size={20} />
                                    </button>
                                </div>
                                {!isVerifying && (
                                    <button
                                        onClick={simulateQRScan}
                                        className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline"
                                    >
                                        I've already scanned the QR
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="flex items-center justify-center gap-4 mt-8 pt-6 border-t border-gray-50 text-gray-300">
                        <Lock size={14} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">SSL Encrypted Checkout</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentModal;
