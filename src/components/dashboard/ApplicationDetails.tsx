import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { applicationService, type LoanApplication } from '../../services/applicationService';
import { activityService, type Activity } from '../../services/activityService';
import { FileText, FileCheck, Download, LogIn, Edit, FileUp, AlertCircle, Clock } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import './ApplicationDetails.css';

const statusLabels = {
    'draft': 'Projekt',
    'submitted': 'Wysłany',
    'in_review': 'W analizie',
    'approved': 'Zatwierdzony',
    'rejected': 'Odrzucony'
};

const purposeLabels = {
    'buy': 'Zakup nieruchomości',
    'refinance': 'Refinansowanie',
    'construction': 'Budowa domu',
    'remodel': 'Remont',
    'build': 'Budowa domu',
    'renovate': 'Remont / Wykończenie',
    'cash': 'Gotówka dowolna',
    'consolidate': 'Konsolidacja'
};

export const ApplicationDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [application, setApplication] = useState<LoanApplication | null>(null);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const { showToast } = useToast();

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            setLoading(true);
            try {
                const [appData, activityData] = await Promise.all([
                    applicationService.getByUserId(id),
                    activityService.getUserActivities(id)
                ]);
                setApplication(appData);
                setActivities(activityData);
            } catch (error) {
                console.error('Error fetching data:', error);
                showToast('Błąd podczas ładowania danych', 'error');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, showToast]);

    const handleStatusChange = async (newStatus: LoanApplication['status']) => {
        if (!id || !application) return;
        setIsUpdating(true);
        try {
            await applicationService.update(id, { status: newStatus });
            await activityService.logActivity(id, 'status_change', `Doradca zmienił status na: ${statusLabels[newStatus]}`);

            // Refresh application and activities
            const [updatedApp, updatedActivities] = await Promise.all([
                applicationService.getByUserId(id),
                activityService.getUserActivities(id)
            ]);
            setApplication(updatedApp);
            setActivities(updatedActivities);

            showToast(`Status zmieniony na: ${statusLabels[newStatus]}`, 'success');
        } catch (error) {
            console.error('Error updating status:', error);
            showToast('Błąd podczas aktualizacji statusu', 'error');
        } finally {
            setIsUpdating(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-slate-500">Ładowanie danych wniosku...</div>;

    if (!application) return (
        <div className="p-8 text-center text-red-500">
            Nie znaleziono wniosku.
            <div className="mt-4">
                <Link to="/dashboard"><Button variant="outline">Wróć</Button></Link>
            </div>
        </div>
    );

    const incomeLabel = {
        'uop': 'Umowa o pracę',
        'b2b': 'B2B',
        'uz': 'Umowa zlecenie',
        'other': 'Inne'
    }[application.incomeSource || 'other'] || application.incomeSource;

    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'login': return <LogIn size={14} className="text-blue-500" />;
            case 'application_update': return <Edit size={14} className="text-amber-500" />;
            case 'document_upload': return <FileUp size={14} className="text-green-500" />;
            case 'status_change': return <AlertCircle size={14} className="text-purple-500" />;
            default: return <FileCheck size={14} className="text-slate-500" />;
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8 advisor-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <Link to="/dashboard" className="text-sm text-slate-500 hover:text-blue-600 flex items-center gap-1 mb-2">
                        ← Wróć do listy klientów
                    </Link>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                        <FileCheck className="text-blue-600" />
                        Szczegóły Wniosku
                    </h1>
                </div>
                <div className="flex items-center gap-2">
                    <select
                        className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                        value={application.status}
                        onChange={(e) => handleStatusChange(e.target.value as any)}
                        disabled={isUpdating}
                    >
                        {Object.entries(statusLabels).map(([val, label]) => (
                            <option key={val} value={val}>{label}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Main Details Card */}
                    <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div>
                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Kwota Kredytu</p>
                                    <p className="text-3xl font-black text-slate-900">{application.amount?.toLocaleString()} PLN</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Okres</p>
                                        <p className="text-lg font-bold text-slate-900">{application.period} lat</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Rata (szac.)</p>
                                        <p className="text-lg font-bold text-blue-600">{application.selectedInstallment?.toLocaleString()} PLN</p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Cel Kredytu</p>
                                    <p className="text-lg font-bold text-slate-900">{application.purpose ? purposeLabels[application.purpose as keyof typeof purposeLabels] || application.purpose : '-'}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Źródło Dochodu</p>
                                    <p className="text-lg font-bold text-slate-900">{incomeLabel || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Dochód Miesięczny</p>
                                    <p className="text-lg font-bold text-slate-900">{application.monthlyIncome?.toLocaleString()} PLN</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Documents List Card */}
                    <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                        <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <FileText className="text-blue-600" size={20} />
                            Wgrane Dokumenty
                        </h3>
                        {application.documents && application.documents.length > 0 ? (
                            <div className="space-y-3">
                                {application.documents.map((doc) => (
                                    <div key={doc.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm">
                                                <FileText size={18} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900">{doc.displayName}</p>
                                                <p className="text-xs text-slate-400 capitalize">{doc.type}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`text-xs font-bold px-2 py-1 rounded-md ${doc.status === 'verified' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                                {doc.status === 'verified' ? 'Zweryfikowano' : 'Oczekuje'}
                                            </span>
                                            <a href={doc.downloadURL} target="_blank" rel="noopener noreferrer" className="p-2 bg-white rounded-lg text-slate-400 hover:text-blue-600 transition-colors shadow-sm">
                                                <Download size={16} />
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-400">
                                Brak wgranych dokumentów.
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-8">
                    {/* Contact Info Card */}
                    <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                        <h3 className="text-lg font-bold text-slate-900 mb-4">Informacje Kontaktowe</h3>
                        <div className="space-y-4">
                            <div>
                                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Email</p>
                                <p className="text-sm font-bold text-slate-900 break-all">{application.email}</p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Telefon</p>
                                <p className="text-sm font-bold text-slate-900">{application.phone || '-'}</p>
                            </div>
                        </div>
                        <div className="mt-8 pt-6 border-t border-slate-50 space-y-3">
                            <Button variant="primary" className="w-full">Wyślij Wiadomość</Button>
                            <Button variant="outline" className="w-full">Połącz się</Button>
                        </div>
                    </div>

                    {/* Timeline / User Activity Card */}
                    <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <Clock size={18} className="text-slate-400" />
                            Aktywność Klienta
                        </h3>
                        <div className="space-y-6 relative before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                            {activities.length > 0 ? (
                                activities.map((act) => (
                                    <div key={act.id} className="flex gap-4 relative z-10">
                                        <div className="mt-1 w-5 h-5 bg-white border-2 border-slate-100 rounded-full flex items-center justify-center shrink-0 shadow-sm">
                                            {getActivityIcon(act.type)}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-bold text-slate-800 leading-tight">{act.description}</p>
                                            <p className="text-[10px] text-slate-400 mt-1">
                                                {act.createdAt?.toDate ? act.createdAt.toDate().toLocaleString('pl-PL') : 'Prowadzone...'}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-4 text-slate-400 text-sm">Brak zarejestrowanej aktywności.</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
