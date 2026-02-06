import React, { useState, useEffect } from 'react';
import { Wallet, Briefcase, TrendingUp, ShieldCheck, Check, ArrowRight } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { applicationService } from '../../services/applicationService';
import { useAuth } from '../../context/AuthContext';

const incomeSources = [
    { id: 'uop', label: 'Umowa o pracę', icon: Briefcase, description: 'Stałe zatrudnienie' },
    { id: 'b2b', label: 'Działalność B2B', icon: TrendingUp, description: 'Faktura VAT / Ryczałt' },
    { id: 'uz', label: 'Umowa zlecenie/o dzieło', icon: ShieldCheck, description: 'Zatrudnienie cywilnoprawne' },
];

export const ClientIncome: React.FC = () => {
    const [selectedIncome, setSelectedIncome] = useState('uop');
    const [monthlyIncome, setMonthlyIncome] = useState(8500);
    const [, setSearchParams] = useSearchParams();
    const { user } = useAuth();

    // Load saved data
    useEffect(() => {
        const loadData = async () => {
            if (user?.uid) {
                const app = await applicationService.getOrCreate(user.uid, user.email || undefined, user.phoneNumber || undefined);
                if (app.incomeSource) setSelectedIncome(app.incomeSource);
                if (app.monthlyIncome) setMonthlyIncome(app.monthlyIncome);
            }
        };
        loadData();
    }, [user]);

    // Auto-save income source
    const handleSourceChange = async (source: string) => {
        setSelectedIncome(source);
        if (user?.uid) {
            await applicationService.update(user.uid, { incomeSource: source });
        }
    };

    // Auto-save income amount
    const handleIncomeChange = async (income: number) => {
        setMonthlyIncome(income);
        if (user?.uid) {
            await applicationService.update(user.uid, { monthlyIncome: income });
        }
    };

    const handleNext = async () => {
        if (user?.uid) {
            const { activityService } = await import('../../services/activityService');
            const sourceLabel = incomeSources.find(s => s.id === selectedIncome)?.label || selectedIncome;
            await activityService.logActivity(user.uid, 'application_update', `Zatwierdzono dochody: ${monthlyIncome.toLocaleString()} PLN (${sourceLabel})`);
        }
        setSearchParams({ step: 'offers' });
    };

    return (
        <div className="max-w-5xl mx-auto px-4">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">Twoje Dochody</h2>
                <p className="text-slate-500 text-lg">Zadeklaruj miesięczny dochód netto gospodarstwa domowego.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
                {/* Left: Source Selection */}
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600">
                            <Briefcase size={20} />
                        </div>
                        <h3 className="font-bold text-slate-900 text-lg">Główne źródło dochodu</h3>
                    </div>

                    <div className="space-y-3">
                        {incomeSources.map((source) => {
                            const Icon = source.icon;
                            const isActive = selectedIncome === source.id;
                            return (
                                <div
                                    key={source.id}
                                    onClick={() => handleSourceChange(source.id)}
                                    className={`group flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all duration-200
                                        ${isActive
                                            ? 'border-blue-600 bg-blue-50/50 shadow-sm'
                                            : 'border-slate-100 bg-white hover:border-blue-200'
                                        }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors
                                            ${isActive ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-400 group-hover:text-blue-600 group-hover:bg-blue-50'}`}>
                                            <Icon size={22} />
                                        </div>
                                        <div>
                                            <span className={`block font-bold ${isActive ? 'text-blue-900' : 'text-slate-700'}`}>
                                                {source.label}
                                            </span>
                                            <span className="text-xs text-slate-400 font-medium">{source.description}</span>
                                        </div>
                                    </div>
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center
                                        ${isActive ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-200'}`}>
                                        {isActive && <Check size={14} strokeWidth={4} />}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Right: Income Amount */}
                <div className="space-y-6">
                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm transition-all hover:shadow-md">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600">
                                <Wallet size={20} />
                            </div>
                            <h3 className="font-bold text-slate-900 text-lg">Średni dochód netto (3 m-ce)</h3>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <span className="text-slate-400 font-bold text-xl">PLN</span>
                            </div>
                            <input
                                type="number"
                                value={monthlyIncome}
                                onChange={(e) => handleIncomeChange(Number(e.target.value))}
                                className="pl-16 pr-4 py-4 w-full bg-slate-50 border-2 border-slate-200 rounded-xl text-3xl font-bold text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                            />
                        </div>
                        <p className="text-sm text-slate-500 mt-4 leading-relaxed">
                            Podaj sumę wpływów na konto. System automatycznie obliczy Twoją zdolność kredytową na podstawie tych danych.
                        </p>
                    </div>

                    <button
                        onClick={handleNext}
                        className="w-full bg-slate-900 text-white h-16 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all hover:bg-blue-600 hover:scale-[1.02] shadow-xl shadow-slate-200"
                    >
                        Zatwierdź i Sprawdź Oferty
                        <ArrowRight size={20} />
                    </button>

                    <p className="text-center text-xs text-slate-400 font-medium">
                        Twoje dane są bezpieczne i szyfrowane (SSL 256-bit).
                    </p>
                </div>
            </div>
        </div>
    );
};
