import React, { useState, useEffect } from 'react';
import { ShieldCheck, ArrowRight, Info, Calendar, Banknote } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { applicationService } from '../../services/applicationService';
import { useAuth } from '../../context/AuthContext';

export const ClientParameters: React.FC = () => {
    const [amount, setAmount] = useState(450000);
    const [period, setPeriod] = useState(30);
    const [, setSearchParams] = useSearchParams();
    const { user } = useAuth();

    // Load saved parameters
    useEffect(() => {
        const loadData = async () => {
            if (user?.uid) {
                const app = await applicationService.getOrCreate(user.uid, user.email || undefined, user.phoneNumber || undefined);
                if (app.amount) setAmount(app.amount);
                if (app.period) setPeriod(app.period);
            }
        };
        loadData();
    }, [user]);

    // Auto-save amount
    const handleAmountChange = async (newAmount: number) => {
        setAmount(newAmount);
        if (user?.uid) {
            await applicationService.update(user.uid, { amount: newAmount });
        }
    };

    // Auto-save period
    const handlePeriodChange = async (newPeriod: number) => {
        setPeriod(newPeriod);
        if (user?.uid) {
            await applicationService.update(user.uid, { period: newPeriod });
        }
    };

    // Dynamic calculations
    const monthlyRate = 0.0832 / 12;
    const months = period * 12;
    const installment = Math.round(
        (amount * monthlyRate * Math.pow(1 + monthlyRate, months)) /
        (Math.pow(1 + monthlyRate, months) - 1)
    );

    const handleNext = async () => {
        if (user?.uid) {
            const { activityService } = await import('../../services/activityService');
            await activityService.logActivity(user.uid, 'application_update', `Zatwierdzono parametry: ${amount.toLocaleString()} PLN na ${period} lat`);
        }
        setSearchParams({ step: 'income' });
    };

    return (
        <div className="max-w-5xl mx-auto px-4">
            {/* Header Section */}
            <div className="mb-10 text-center lg:text-left">
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Konfiguracja wniosku</h1>
                <p className="text-lg text-slate-500">Dostosuj kwotę i czas spłaty, aby zobaczyć wstępne wyliczenia.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left: Configuration Panel */}
                <div className="lg:col-span-7 space-y-8">
                    <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-10">
                        {/* Amount Section */}
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                                        <Banknote size={20} />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Kwota kredytu</h3>
                                        <p className="text-xs text-slate-500 font-medium">Suma, o którą wnioskujesz</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-3xl font-black text-slate-900">{amount.toLocaleString()}</span>
                                    <span className="ml-2 text-sm font-bold text-slate-400">PLN</span>
                                </div>
                            </div>

                            <div className="pt-2">
                                <input
                                    type="range"
                                    min="100000"
                                    max="1500000"
                                    step="10000"
                                    value={amount}
                                    onChange={(e) => handleAmountChange(Number(e.target.value))}
                                    className="w-full h-3 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600 hover:accent-blue-700 transition-all"
                                />
                                <div className="flex justify-between mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">
                                    <span>100 000</span>
                                    <span>{Math.round(1500000 / 2).toLocaleString()}</span>
                                    <span>1 500 000</span>
                                </div>
                            </div>
                        </div>

                        {/* Period Section */}
                        <div className="space-y-6 pt-6 border-t border-slate-50">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                                        <Calendar size={20} />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Okres spłaty</h3>
                                        <p className="text-xs text-slate-500 font-medium">Długość trwania umowy</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-3xl font-black text-slate-900">{period}</span>
                                    <span className="ml-2 text-sm font-bold text-slate-400">LAT</span>
                                </div>
                            </div>

                            <div className="pt-2">
                                <input
                                    type="range"
                                    min="5"
                                    max="35"
                                    step="1"
                                    value={period}
                                    onChange={(e) => handlePeriodChange(Number(e.target.value))}
                                    className="w-full h-3 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600 hover:accent-blue-700 transition-all"
                                />
                                <div className="flex justify-between mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">
                                    <span>5 lat</span>
                                    <span>20 lat</span>
                                    <span>35 lat</span>
                                </div>
                            </div>
                        </div>

                        {/* Info Footer */}
                        <div className="flex gap-4 p-4 bg-blue-50/50 rounded-2xl border border-blue-100 items-start">
                            <Info size={18} className="text-blue-600 shrink-0 mt-0.5" />
                            <p className="text-[11px] text-blue-700 leading-relaxed font-medium">
                                Podane wartości są szacunkowe. Twój doradca przygotuje dla Ciebie precyzyjne symulacje z uwzględnieniem aktualnych promocji w ponad 20 bankach.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right: Visual Summary Card */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="relative">
                        {/* Background Shadow/Glow */}
                        <div className="absolute -inset-2 bg-blue-600/20 blur-2xl rounded-[40px] opacity-50"></div>

                        <div className="relative bg-slate-900 rounded-[32px] overflow-hidden shadow-2xl text-white p-8 h-[440px] flex flex-col justify-between">
                            {/* Decorative Background Pattern */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-[80px] -mr-32 -mt-32"></div>
                            <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-[60px] -ml-24 -mb-24"></div>

                            {/* Top Part: Title & Icon */}
                            <div className="relative z-10 flex justify-between items-start">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/40">Prognozowana Rata</p>
                                    <div className="flex items-baseline gap-2">
                                        <h2 className="text-5xl font-black tracking-tight">{installment.toLocaleString()}</h2>
                                        <span className="text-xl font-medium text-white/40">PLN</span>
                                    </div>
                                </div>
                                <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
                                    <ShieldCheck size={28} className="text-green-400" />
                                </div>
                            </div>

                            {/* Middle Part: Stats Grid */}
                            <div className="relative z-10 grid grid-cols-2 gap-y-10 border-t border-white/10 pt-10">
                                <div className="space-y-1">
                                    <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest">Szacowane RRSO</span>
                                    <p className="text-lg font-bold">~ 8.32%</p>
                                </div>
                                <div className="space-y-1 text-right">
                                    <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest">Całkowita Kwota</span>
                                    <p className="text-lg font-bold">{(amount).toLocaleString()} zł</p>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest">Zdolność</span>
                                    <p className="text-lg font-bold text-green-400">Wysoka</p>
                                </div>
                                <div className="space-y-1 text-right">
                                    <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest">Okres spłaty</span>
                                    <p className="text-lg font-bold">{period} lat</p>
                                </div>
                            </div>

                            {/* Bottom Part: Action Button */}
                            <div className="relative z-10">
                                <button
                                    onClick={handleNext}
                                    className="group w-full h-16 bg-white text-slate-900 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all hover:bg-blue-50 hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    ZATWIERDŹ PARAMETRY
                                    <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                                </button>
                                <p className="text-center text-[9px] text-white/20 font-bold uppercase tracking-widest mt-4">
                                    Symulacja nie stanowi oferty handlowej
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
