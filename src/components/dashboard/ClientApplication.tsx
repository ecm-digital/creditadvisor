import React, { useState, useEffect } from 'react';
import { FileSignature, Send, AlertCircle, Landmark, Check, ShieldCheck } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { applicationService } from '../../services/applicationService';
import { useAuth } from '../../context/AuthContext';

export const ClientApplication: React.FC = () => {
    const { showToast } = useToast();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [agreements, setAgreements] = useState({
        marketing: false,
        bik: false,
        tos: false
    });

    // Load saved agreements
    useEffect(() => {
        const loadData = async () => {
            if (user?.uid) {
                const app = await applicationService.getOrCreate(user.uid, user.email || undefined, user.phoneNumber || undefined);
                if (app.agreements) {
                    setAgreements(app.agreements);
                }
            }
        };
        loadData();
    }, [user]);

    // Auto-save agreements
    const handleAgreementChange = async (key: keyof typeof agreements) => {
        const newAgreements = { ...agreements, [key]: !agreements[key] };
        setAgreements(newAgreements);
        if (user?.uid) {
            await applicationService.update(user.uid, { agreements: newAgreements });
        }
    };

    const handleSend = async () => {
        if (!user?.uid) {
            showToast('Musisz być zalogowany, aby wysłać wniosek', 'error');
            return;
        }

        setLoading(true);
        try {
            const { activityService } = await import('../../services/activityService');
            await activityService.logActivity(user.uid, 'application_update', 'Wysłano kompletny wniosek do analizy');
            await applicationService.submit(user.uid);
            showToast('Wniosek został wysłany pomyślnie!', 'success');
        } catch (error) {
            console.error('Error submitting application:', error);
            showToast('Błąd podczas wysyłania wniosku', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">Finalizacja Wniosku</h2>
                <p className="text-slate-500 text-lg">Sprawdź podsumowanie i prześlij wniosek do weryfikacji.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2 space-y-8">
                    {/* Summary Card */}
                    <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-full -mr-8 -mt-8"></div>

                        <div className="relative z-10">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Wybrana Oferta</h3>
                            <div className="flex items-center gap-6 mb-8">
                                <div className="w-16 h-16 bg-blue-50 rounded-2xl border border-blue-100 flex items-center justify-center p-2 shadow-sm text-blue-600">
                                    <Landmark size={32} />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-xl font-black text-slate-900 leading-none">Kredyt Hipoteczny</h4>
                                    <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">Santander Bank Polska</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-y-6 gap-x-8 border-t border-slate-50 pt-8">
                                <div className="space-y-1">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Kwota finansowania</span>
                                    <p className="text-2xl font-black text-slate-900">300 000 PLN</p>
                                </div>
                                <div className="space-y-1 text-right">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Miesięczna rata</span>
                                    <p className="text-2xl font-black text-blue-600">~ 2 830 PLN</p>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Okres spłaty</span>
                                    <p className="text-lg font-bold text-slate-700">30 lat</p>
                                </div>
                                <div className="space-y-1 text-right">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Oprocentowanie</span>
                                    <p className="text-lg font-bold text-slate-700">8.32%</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Agreements */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest pl-2">Zgody i Oświadczenia</h3>

                        <label className={`group flex items-start gap-4 p-5 rounded-2xl border-2 transition-all cursor-pointer ${agreements.tos ? 'border-blue-600 bg-blue-50/30' : 'border-slate-100 bg-white hover:border-blue-300'}`}>
                            <div className={`mt-0.5 shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${agreements.tos ? 'bg-blue-600 border-blue-600' : 'border-slate-300 bg-white'}`}>
                                {agreements.tos && <Check size={14} className="text-white" strokeWidth={4} />}
                                <input type="checkbox" className="hidden" checked={agreements.tos} onChange={() => handleAgreementChange('tos')} />
                            </div>
                            <span className={`text-sm leading-relaxed ${agreements.tos ? 'text-slate-900 font-semibold' : 'text-slate-500 font-medium group-hover:text-slate-700'}`}>
                                Oświadczam, że dane zawarte w formularzu są prawdziwe i zapoznałem się z <a href="#" className="text-blue-600 underline decoration-2 underline-offset-2">Regulaminem Serwisu</a>.
                            </span>
                        </label>

                        <label className={`group flex items-start gap-4 p-5 rounded-2xl border-2 transition-all cursor-pointer ${agreements.bik ? 'border-blue-600 bg-blue-50/30' : 'border-slate-100 bg-white hover:border-blue-300'}`}>
                            <div className={`mt-0.5 shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${agreements.bik ? 'bg-blue-600 border-blue-600' : 'border-slate-300 bg-white'}`}>
                                {agreements.bik && <Check size={14} className="text-white" strokeWidth={4} />}
                                <input type="checkbox" className="hidden" checked={agreements.bik} onChange={() => handleAgreementChange('bik')} />
                            </div>
                            <span className={`text-sm leading-relaxed ${agreements.bik ? 'text-slate-900 font-semibold' : 'text-slate-500 font-medium group-hover:text-slate-700'}`}>
                                Wyrażam zgodę na weryfikację w BIK (Biuro Informacji Kredytowej) w celu przygotowania oferty ostatecznej.
                            </span>
                        </label>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-slate-900 p-8 rounded-[32px] text-white space-y-8 relative overflow-hidden shadow-2xl shadow-slate-300">
                        {/* Decoration */}
                        <div className="absolute bottom-[-20%] left-[-20%] w-40 h-40 bg-blue-500/20 rounded-full blur-3xl"></div>
                        <div className="absolute top-[-10%] right-[-10%] w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl"></div>

                        <div className="relative z-10 text-center pt-4">
                            <div className="w-16 h-16 bg-white/10 rounded-3xl flex items-center justify-center mx-auto mb-6 backdrop-blur-md border border-white/10 shadow-inner">
                                <FileSignature size={32} className="text-blue-300" />
                            </div>
                            <h4 className="text-xl font-bold mb-2 leading-tight">Gotowy do wysłania?</h4>
                            <p className="text-slate-300 text-sm font-medium leading-relaxed px-4">
                                Po kliknięciu "Wyślij", wniosek trafi do Twojego doradcy. Otrzymasz potwierdzenie SMS.
                            </p>
                        </div>

                        <div className="pt-2 relative z-10">
                            <button
                                onClick={handleSend}
                                disabled={!(agreements.tos && agreements.bik) || loading}
                                className={`w-full h-16 rounded-2xl text-md font-bold shadow-xl transition-all flex items-center justify-center gap-3 ${(agreements.tos && agreements.bik)
                                    ? 'bg-blue-600 text-white hover:bg-blue-500 hover:scale-[1.02] active:scale-[0.98]'
                                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                    }`}
                            >
                                {loading ? (
                                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        WYŚLIJ WNIOSEK <Send size={20} />
                                    </>
                                )}
                            </button>
                            <p className="text-[10px] text-center mt-4 text-slate-500 font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                                <ShieldCheck size={12} /> Przesyłanie szyfrowane SSL
                            </p>
                        </div>
                    </div>

                    {!agreements.bik && (
                        <div className="bg-amber-50 border border-amber-100 p-5 rounded-3xl flex items-start gap-4">
                            <AlertCircle className="text-amber-500 shrink-0 mt-0.5" size={20} />
                            <p className="text-xs text-amber-900 font-medium leading-relaxed">
                                <span className="font-bold block mb-1">WYMAGANA ZGODA</span>
                                Nie możesz wysłać wniosku bez akceptacji zgody na weryfikację BIK, która jest niezbędna dla banku.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
