
import React, { useState, useEffect } from 'react';
import { offerService } from '../../services/offerService';
import type { BankOffer } from '../../services/offerService';
import { ChevronRight, Percent, PiggyBank, ArrowRight, Wallet, BadgeCheck } from 'lucide-react';
import { applicationService } from '../../services/applicationService';
import { useAuth } from '../../context/AuthContext';
import { useSearchParams } from 'react-router-dom';

export const ClientOffers: React.FC = () => {
    // Default simulation values
    const [loanAmount, setLoanAmount] = useState(450000);
    const [period, setPeriod] = useState(30);
    const [offers, setOffers] = useState<BankOffer[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOfferId, setSelectedOfferId] = useState<string | null>(null);
    const { user } = useAuth();
    const [, setSearchParams] = useSearchParams();

    const formatMoney = (val: number) => val.toLocaleString('pl-PL', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + ' zł';

    // Load saved data and offers
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Load offers
                const offerData = await offerService.getActiveOffers();
                setOffers(offerData);

                // Load saved application data
                if (user?.uid) {
                    const app = await applicationService.getOrCreate(user.uid, user.email || undefined, user.phoneNumber || undefined);
                    if (app.amount) setLoanAmount(app.amount);
                    if (app.period) setPeriod(app.period);
                    if (app.selectedOfferId) setSelectedOfferId(app.selectedOfferId);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user]);

    const calculateInstallment = (offer: BankOffer) => {
        const r = offer.interestRate / 100 / 12;
        const n = period * 12;
        const pmt = loanAmount * r * (Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        return pmt;
    };

    const handleSelectOffer = async (offer: BankOffer) => {
        if (!offer.id) return;

        const installment = calculateInstallment(offer);

        if (user?.uid) {
            const { activityService } = await import('../../services/activityService');
            await activityService.logActivity(user.uid, 'application_update', `Wybrano ofertę: ${offer.bankName} (rata ok. ${Math.round(installment)} PLN)`);

            await applicationService.update(user.uid, {
                selectedOfferId: offer.id,
                selectedBankName: offer.bankName,
                selectedInstallment: Math.round(installment),
            });
            setSelectedOfferId(offer.id);
        }

        // Navigate to documents step
        setSearchParams({ step: 'documents' });
    };

    return (
        <div className="max-w-6xl mx-auto px-4">
            {/* Header / Simulation Section */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 mb-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 opacity-60"></div>

                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">Twoje Oferty Kredytowe</h2>
                        <p className="text-slate-500 text-lg leading-relaxed">
                            Analizujemy dziesiątki ofert, aby znaleźć tę najlepiej dopasowaną do Twoich potrzeb. Poniżej znajdziesz wstępne symulacje.
                        </p>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                        <div className="flex flex-col gap-6">
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Kwota Kredytu</label>
                                    <span className="text-xl font-bold text-blue-600">{formatMoney(loanAmount)}</span>
                                </div>
                                <input
                                    type="range"
                                    min="100000"
                                    max="2000000"
                                    step="10000"
                                    value={loanAmount}
                                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                />
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Okres Kredytowania</label>
                                    <span className="text-xl font-bold text-blue-600">{period} lat</span>
                                </div>
                                <input
                                    type="range"
                                    min="10"
                                    max="35"
                                    step="1"
                                    value={period}
                                    onChange={(e) => setPeriod(Number(e.target.value))}
                                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Offers Grid */}
            <div className="space-y-6">
                {loading && (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                        <p>Analizujemy oferty banków...</p>
                    </div>
                )}

                {!loading && offers.length === 0 && (
                    <div className="p-12 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-300 text-slate-500">
                        Brak aktywnych ofert w bazie. Spróbuj odświeżyć stronę.
                    </div>
                )}

                {!loading && offers.map((offer, index) => {
                    const installment = calculateInstallment(offer);
                    const isBest = index === 0;

                    return (
                        <div
                            key={offer.id || index}
                            className={`group relative bg-white rounded-2xl border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden
                                ${isBest ? 'border-blue-500 ring-2 ring-blue-100 shadow-lg' : 'border-slate-200 shadow-sm'}
                            `}
                        >
                            {/* Best Offer Badge */}
                            {isBest && (
                                <div className="absolute top-0 right-0 z-20">
                                    <div className="bg-blue-600 text-white text-[10px] font-bold px-4 py-1.5 rounded-bl-xl shadow-sm flex items-center gap-1.5">
                                        <BadgeCheck size={14} />
                                        <span>NAJNIŻSZA RATA</span>
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-1 xl:grid-cols-12 min-h-[140px]">
                                {/* 1. Bank Identity */}
                                <div className="p-5 xl:col-span-3 flex flex-row xl:flex-col items-center xl:items-start xl:justify-center gap-4 border-b xl:border-b-0 xl:border-r border-slate-100 bg-slate-50/40">
                                    <div className="w-14 h-14 shrink-0 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center justify-center text-blue-700 font-black text-xl tracking-tighter">
                                        {offer.bankName.substring(0, 2)}
                                    </div>
                                    <div className="text-left">
                                        <h3 className="text-lg font-bold text-slate-900 leading-tight">{offer.bankName}</h3>
                                        <p className="text-xs text-slate-500 font-medium mt-0.5">Oferta Standardowa</p>
                                    </div>
                                </div>

                                {/* 2. Key Metrics */}
                                <div className="p-5 xl:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-6 items-center content-center relative">
                                    <div className="space-y-1">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block truncate">Miesięczna rata</span>
                                        <p className="text-2xl font-black text-slate-900 tracking-tight">{formatMoney(installment)}</p>
                                    </div>

                                    <div className="space-y-1">
                                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">
                                            <Percent size={12} className="text-blue-500 shrink-0" /> Oprocentowanie
                                        </div>
                                        <p className="text-lg font-bold text-slate-700">{offer.interestRate}%</p>
                                    </div>

                                    <div className="space-y-1">
                                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">
                                            <PiggyBank size={12} className="text-blue-500 shrink-0" /> Prowizja
                                        </div>
                                        <p className="text-lg font-bold text-slate-700">{offer.commission}%</p>
                                    </div>

                                    <div className="space-y-1">
                                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">
                                            <Wallet size={12} className="text-blue-500 shrink-0" /> RRSO
                                        </div>
                                        <p className="text-lg font-bold text-slate-700">{offer.rrso}%</p>
                                    </div>
                                </div>

                                {/* 3. Action */}
                                <div className="p-5 xl:col-span-2 flex flex-col justify-center items-center gap-3 border-t xl:border-t-0 xl:border-l border-slate-100 bg-slate-50/10">
                                    <button
                                        onClick={() => handleSelectOffer(offer)}
                                        className={`w-full xl:w-auto min-w-[120px] h-11 rounded-xl font-bold text-sm transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 ${selectedOfferId === offer.id
                                            ? 'bg-green-600 text-white hover:bg-green-700 shadow-green-500/20'
                                            : 'bg-slate-900 text-white hover:bg-blue-600 hover:shadow-blue-500/20'
                                            }`}
                                    >
                                        {selectedOfferId === offer.id ? (
                                            <>
                                                <BadgeCheck size={16} />
                                                Wybrano
                                            </>
                                        ) : (
                                            <>
                                                Wybierz
                                                <ArrowRight size={16} />
                                            </>
                                        )}
                                    </button>
                                    <div className="text-[10px] text-slate-400 font-medium text-center">
                                        <span className="block mb-0.5">Min. wkład: <strong>{offer.minDownPayment}%</strong></span>
                                        <span className="hover:text-blue-600 cursor-pointer flex items-center justify-center gap-0.5 transition-colors">
                                            Szczegóły <ChevronRight size={10} />
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-12 text-center">
                <p className="text-slate-400 text-sm">
                    Symulacja ma charakter orientacyjny i nie stanowi oferty w rozumieniu Kodeksu Cywilnego.
                    <br />Ostateczne warunki zależą od oceny zdolności kredytowej.
                </p>
            </div>
        </div>
    );
};
