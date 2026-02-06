import React, { useState, useEffect } from 'react';
import { Home, Hammer, PaintRoller, ArrowLeftRight, Merge, Banknote, CheckCircle2, ArrowRight } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { applicationService } from '../../services/applicationService';
import { useAuth } from '../../context/AuthContext';

const purposes = [
    { id: 'buy', label: 'Zakup nieruchomości', icon: Home, description: 'Mieszkanie, dom lub działka' },
    { id: 'build', label: 'Budowa domu', icon: Hammer, description: 'Budowa systemem gospodarczym' },
    { id: 'renovate', label: 'Remont / Wykończenie', icon: PaintRoller, description: 'Prace wykończeniowe' },
    { id: 'refinance', label: 'Refinansowanie', icon: ArrowLeftRight, description: 'Przeniesienie kredytu' },
    { id: 'cash', label: 'Gotówka dowolna', icon: Banknote, description: 'Na dowolny cel konsumpcyjny' },
    { id: 'consolidate', label: 'Konsolidacja', icon: Merge, description: 'Połączenie kilku rat w jedną' },
];

export const ClientPurpose: React.FC = () => {
    const [selectedId, setSelectedId] = useState<string>('buy');
    const [, setSearchParams] = useSearchParams();
    const { user } = useAuth();

    // Load saved purpose on mount
    useEffect(() => {
        const loadPurpose = async () => {
            if (user?.uid) {
                const app = await applicationService.getOrCreate(user.uid, user.email || undefined, user.phoneNumber || undefined);
                if (app.purpose) {
                    setSelectedId(app.purpose);
                }
            }
        };
        loadPurpose();
    }, [user]);

    // Auto-save on selection change
    const handleSelect = async (purposeId: string) => {
        setSelectedId(purposeId);
        if (user?.uid) {
            const purposeLabel = purposes.find(p => p.id === purposeId)?.label || purposeId;
            const { activityService } = await import('../../services/activityService');
            await activityService.logActivity(user.uid, 'application_update', `Zmieniono cel kredytu na: ${purposeLabel}`);
            await applicationService.update(user.uid, { purpose: purposeId });
        }
    };

    const handleNext = () => {
        setSearchParams({ step: 'parameters' });
    };

    return (
        <div className="max-w-5xl mx-auto px-4">
            {/* Header */}
            <div className="text-center mb-12">
                <h2 className="text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">Jaki jest Twój cel?</h2>
                <p className="text-slate-500 text-lg max-w-xl mx-auto">Pomożemy Ci znaleźć finansowanie dopasowane do Twoich planów.</p>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
                {purposes.map((p) => {
                    const Icon = p.icon;
                    const isActive = p.id === selectedId;

                    return (
                        <div
                            key={p.id}
                            onClick={() => handleSelect(p.id)}
                            className={`group cursor-pointer p-6 rounded-2xl border-2 transition-all duration-200 flex flex-col min-h-[180px]
                                ${isActive
                                    ? 'border-blue-600 bg-gradient-to-br from-blue-600 to-blue-700 shadow-xl shadow-blue-500/20'
                                    : 'border-slate-200 bg-white hover:border-blue-400 hover:shadow-lg'
                                }`}
                        >
                            {/* Icon Row */}
                            <div className="flex items-start justify-between mb-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all
                                    ${isActive
                                        ? 'bg-white/20 text-white'
                                        : 'bg-slate-100 text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600'
                                    }`}>
                                    <Icon size={24} strokeWidth={2} />
                                </div>
                                {isActive && (
                                    <div className="text-white">
                                        <CheckCircle2 size={22} />
                                    </div>
                                )}
                            </div>

                            {/* Text Content */}
                            <div className="mt-auto">
                                <h3 className={`font-bold text-lg mb-1 leading-tight ${isActive ? 'text-white' : 'text-slate-900'}`}>
                                    {p.label}
                                </h3>
                                <p className={`text-sm font-medium ${isActive ? 'text-blue-100' : 'text-slate-500'}`}>
                                    {p.description}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* CTA Button - Clearly separated */}
            <div className="flex justify-center pt-4">
                <button
                    onClick={handleNext}
                    className="flex items-center gap-3 bg-slate-900 text-white px-10 py-4 rounded-2xl font-bold text-lg transition-all hover:bg-blue-600 hover:scale-[1.02] shadow-xl shadow-slate-300/50 active:scale-[0.98]"
                >
                    Przejdź Dalej <ArrowRight size={20} />
                </button>
            </div>
        </div>
    );
};
