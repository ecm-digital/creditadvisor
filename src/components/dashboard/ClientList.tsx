import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, Upload, UserPlus, Users, MessageSquare, Edit2, Trash2, FileText, FileCheck, Activity } from 'lucide-react';
import { Button } from '../ui/Button';
import { useToast } from '../../context/ToastContext';
import { smsService } from '../../services/smsService';
import { clientService, type Client } from '../../services/clientService';
import { applicationService, type LoanApplication } from '../../services/applicationService';
import { n8nService } from '../../services/n8nService';
import '../../styles/advisor-design-system.css';
import './ClientList.css';

const statusLabels = {
    new: 'Nowy',
    contacted: 'Skontaktowano',
    in_progress: 'W toku',
    closed: 'Zamknięty',
};

const appStatusLabels = {
    draft: 'Projekt',
    submitted: 'Wysłany',
    in_review: 'W analizie',
    approved: 'Zatwierdzony',
    rejected: 'Odrzucony'
};

export const ClientList: React.FC = () => {
    const { showToast } = useToast();
    const [clients, setClients] = useState<Client[]>([]);
    const [applications, setApplications] = useState<LoanApplication[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'leads' | 'apps'>('leads');

    // UI States
    const [smsModalOpen, setSmsModalOpen] = useState(false);
    const [addClientModalOpen, setAddClientModalOpen] = useState(false);
    const [editClientModalOpen, setEditClientModalOpen] = useState(false);
    const [editingClient, setEditingClient] = useState<Client | null>(null);
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [smsMessage, setSmsMessage] = useState('');
    const [isSending, setIsSending] = useState(false);

    // Form states
    const [newClient, setNewClient] = useState({
        name: '',
        email: '',
        phone: '',
    });

    const fileInputRef = React.useRef<HTMLInputElement>(null);

    // Load data on mount
    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        try {
            if (clientService.isConfigured()) {
                const [clientsData, appsData] = await Promise.all([
                    clientService.getAll(),
                    applicationService.getAll()
                ]);
                setClients(clientsData);
                setApplications(appsData);
            } else {
                showToast('Firebase nie jest skonfigurowane.', 'info');
                setClients([]);
                setApplications([]);
            }
        } catch (error) {
            console.error('Error loading data:', error);
            showToast('Błąd ładowania danych', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    // --- SMS Action Functions ---
    const openSmsModal = (client: Client) => {
        setSelectedClient(client);
        setSmsMessage(`Dzień dobry ${client.name}, informujemy o zmianie statusu Twojego wniosku. Pozdrawiamy, CreditAdvisor.`);
        setSmsModalOpen(true);
    };

    const closeSmsModal = () => {
        if (isSending) return;
        setSmsModalOpen(false);
        setSelectedClient(null);
        setSmsMessage('');
    };

    const handleSendSms = async () => {
        if (!selectedClient) return;
        setIsSending(true);
        try {
            const response = await smsService.sendSms(selectedClient.phone, smsMessage);
            if (response.success) {
                showToast(`SMS wysłany do ${selectedClient.name}`, 'success');
                n8nService.onSmsSent(selectedClient, smsMessage, response).catch(err => console.error(err));
                closeSmsModal();
            } else {
                showToast(`Błąd: ${response.error || 'Błąd wysyłki'}`, 'error');
            }
        } catch (error) {
            showToast('Błąd wysyłki', 'error');
        } finally {
            setIsSending(false);
        }
    };

    // --- Client Management Functions ---
    const handleAddClient = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const client = await clientService.create({
                ...newClient,
                status: 'new',
                date: new Date().toISOString().split('T')[0]
            });
            setClients([client, ...clients]);
            setAddClientModalOpen(false);
            setNewClient({ name: '', email: '', phone: '' });
            showToast('Klient dodany', 'success');
        } catch (error) {
            showToast('Błąd dodawania', 'error');
        }
    };

    const handleEditClient = (client: Client) => {
        setEditingClient(client);
        setNewClient({ name: client.name, email: client.email, phone: client.phone });
        setEditClientModalOpen(true);
    };

    const handleUpdateClient = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingClient) return;
        try {
            const updatedClient = await clientService.update(editingClient.id, { ...newClient });
            setClients(clients.map(c => c.id === editingClient.id ? updatedClient : c));
            setEditClientModalOpen(false);
            setEditingClient(null);
            setNewClient({ name: '', email: '', phone: '' });
            showToast('Dane zaktualizowane', 'success');
        } catch (error) {
            showToast('Błąd aktualizacji', 'error');
        }
    };

    const handleDeleteClient = async (clientId: string, clientName: string) => {
        if (!window.confirm(`Czy usunąć klienta ${clientName}?`)) return;
        try {
            await clientService.delete(clientId);
            setClients(clients.filter(c => c.id !== clientId));
            showToast('Klient usunięty', 'success');
        } catch (error) {
            showToast('Błąd usuwania', 'error');
        }
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async (e) => {
            const text = e.target?.result as string;
            const lines = text.split('\n');
            const created = [];
            for (let i = 1; i < lines.length; i++) {
                const [name, email, phone] = lines[i].split(',');
                if (name && email) {
                    try {
                        const c = await clientService.create({ name, email, phone, status: 'new', date: new Date().toISOString().split('T')[0] });
                        created.push(c);
                    } catch (err) { }
                }
            }
            if (created.length > 0) {
                setClients([...created, ...clients]);
                showToast(`Zaimportowano ${created.length} klientów`, 'success');
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="client-list-modern">
            <div className="list-header-modern">
                <div>
                    <h2 className="list-title-modern">Panel Doradcy</h2>
                    <p className="list-subtitle">Zarządzaj leadami i wnioskami online</p>
                </div>
                <div className="list-actions-modern">
                    <input type="file" accept=".csv" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileUpload} />
                    <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                        <Upload size={16} /> Importuj
                    </Button>
                    <Button size="sm" onClick={() => setAddClientModalOpen(true)}>
                        <UserPlus size={16} /> Dodaj klienta
                    </Button>
                </div>
            </div>

            {/* Dashboard Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="stats-card-modern">
                    <div className="stats-icon bg-blue-100 text-blue-600"><Users size={20} /></div>
                    <div className="stats-info">
                        <span className="stats-label">Suma Klientów</span>
                        <span className="stats-value">{clients.length + applications.length}</span>
                    </div>
                </div>
                <div className="stats-card-modern">
                    <div className="stats-icon bg-green-100 text-green-600"><FileCheck size={20} /></div>
                    <div className="stats-info">
                        <span className="stats-label">Wnioski Online</span>
                        <span className="stats-value">{applications.length}</span>
                    </div>
                </div>
                <div className="stats-card-modern">
                    <div className="stats-icon bg-amber-100 text-amber-600"><Activity size={20} /></div>
                    <div className="stats-info">
                        <span className="stats-label">W analizie</span>
                        <span className="stats-value">{applications.filter(a => a.status === 'in_review').length}</span>
                    </div>
                </div>
                <div className="stats-card-modern">
                    <div className="stats-icon bg-purple-100 text-purple-600"><MessageSquare size={20} /></div>
                    <div className="stats-info">
                        <span className="stats-label">Leady (Nowe)</span>
                        <span className="stats-value">{clients.filter(c => c.status === 'new').length}</span>
                    </div>
                </div>
            </div>

            {/* View Selection Tabs */}
            <div className="flex items-center gap-1 mb-6 bg-slate-100 p-1 rounded-xl w-fit">
                <button
                    onClick={() => setViewMode('leads')}
                    className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'leads' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                        }`}
                >
                    Lead Tracker
                </button>
                <button
                    onClick={() => setViewMode('apps')}
                    className={`px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${viewMode === 'apps' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                        }`}
                >
                    Wnioski Online
                    {applications.filter(a => a.status === 'submitted').length > 0 && (
                        <span className="bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                            {applications.filter(a => a.status === 'submitted').length}
                        </span>
                    )}
                </button>
            </div>

            {isLoading ? (
                <div className="loading-container-modern py-20">
                    <div className="loading-spinner"></div>
                    <p className="mt-4 text-slate-500">Ładowanie danych...</p>
                </div>
            ) : (
                <div className="client-table-modern bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                    <table className="w-full">
                        <thead>
                            {viewMode === 'leads' ? (
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Klient</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Kontakt</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Data</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Akcje</th>
                                </tr>
                            ) : (
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Wnioskodawca</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Parametry</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Ostatnia Aktywność</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Akcje</th>
                                </tr>
                            )}
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {viewMode === 'leads' ? (
                                clients.length === 0 ? (
                                    <tr><td colSpan={5} className="text-center py-20 text-slate-400">Brak leadów.</td></tr>
                                ) : (
                                    clients.map(client => (
                                        <tr key={client.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-bold">
                                                        {client.name.substring(0, 2).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-slate-900">{client.name}</div>
                                                        <div className="text-xs text-slate-500">{client.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-slate-600">
                                                    <div className="flex items-center gap-1"><Mail size={12} /> {client.email}</div>
                                                    {client.phone && <div className="flex items-center gap-1 mt-1"><Phone size={12} /> {client.phone}</div>}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`status-badge-modern status-${client.status}`}>
                                                    {statusLabels[client.status as keyof typeof statusLabels]}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-500">{client.date}</td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex gap-2">
                                                    <Button variant="ghost" size="sm" onClick={() => openSmsModal(client)}><MessageSquare size={14} /></Button>
                                                    <Button variant="ghost" size="sm" onClick={() => handleEditClient(client)}><Edit2 size={14} /></Button>
                                                    <Button variant="ghost" size="sm" onClick={() => handleDeleteClient(client.id, client.name)} className="text-red-500"><Trash2 size={14} /></Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )
                            ) : (
                                applications.length === 0 ? (
                                    <tr><td colSpan={5} className="text-center py-20 text-slate-400">Brak wniosków online.</td></tr>
                                ) : (
                                    applications.map(app => (
                                        <tr key={app.userId} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-green-50 text-green-600 rounded-full flex items-center justify-center font-bold">
                                                        <FileText size={18} />
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-slate-900">{app.email || 'Anonimowy'}</div>
                                                        <div className="text-xs text-slate-500">ID: ...{app.userId.substring(app.userId.length - 8)}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm">
                                                    <div className="font-bold text-slate-900">{app.amount?.toLocaleString()} PLN</div>
                                                    <div className="text-xs text-slate-500">{app.purpose || '-'} • {app.period} lat</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`status-badge-modern status-${app.status}`}>
                                                    {appStatusLabels[app.status as keyof typeof appStatusLabels]}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-500">
                                                {app.updatedAt?.toDate ? app.updatedAt.toDate().toLocaleString('pl-PL') : (app.submittedAt || '-')}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Link to={`/dashboard/applications/${app.userId}`}>
                                                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                                                        Szczegóły <FileText size={14} />
                                                    </Button>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                )
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modals */}
            {addClientModalOpen && (
                <div className="modal-overlay">
                    <div className="sms-modal">
                        <div className="sms-modal-header">
                            <h3 className="sms-modal-title">Dodaj klienta</h3>
                            <button className="sms-modal-close" onClick={() => setAddClientModalOpen(false)}>&times;</button>
                        </div>
                        <form onSubmit={handleAddClient} className="p-6 space-y-4">
                            <input className="advisor-input" placeholder="Imię i nazwisko" value={newClient.name} onChange={e => setNewClient({ ...newClient, name: e.target.value })} required />
                            <input className="advisor-input" placeholder="Email" type="email" value={newClient.email} onChange={e => setNewClient({ ...newClient, email: e.target.value })} required />
                            <input className="advisor-input" placeholder="Telefon" value={newClient.phone} onChange={e => setNewClient({ ...newClient, phone: e.target.value })} required />
                            <div className="flex justify-end gap-2 pt-4">
                                <Button type="button" variant="ghost" onClick={() => setAddClientModalOpen(false)}>Anuluj</Button>
                                <Button type="submit" variant="primary">Dodaj</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {editClientModalOpen && (
                <div className="modal-overlay">
                    <div className="sms-modal">
                        <div className="sms-modal-header">
                            <h3 className="sms-modal-title">Edytuj klienta</h3>
                            <button className="sms-modal-close" onClick={() => setEditClientModalOpen(false)}>&times;</button>
                        </div>
                        <form onSubmit={handleUpdateClient} className="p-6 space-y-4">
                            <input className="advisor-input" placeholder="Imię i nazwisko" value={newClient.name} onChange={e => setNewClient({ ...newClient, name: e.target.value })} required />
                            <input className="advisor-input" placeholder="Email" type="email" value={newClient.email} onChange={e => setNewClient({ ...newClient, email: e.target.value })} required />
                            <input className="advisor-input" placeholder="Telefon" value={newClient.phone} onChange={e => setNewClient({ ...newClient, phone: e.target.value })} required />
                            <div className="flex justify-end gap-2 pt-4">
                                <Button type="button" variant="ghost" onClick={() => setEditClientModalOpen(false)}>Anuluj</Button>
                                <Button type="submit" variant="primary">Zapisz</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {smsModalOpen && selectedClient && (
                <div className="modal-overlay">
                    <div className="sms-modal">
                        <div className="sms-modal-header">
                            <h3 className="sms-modal-title">Wyślij SMS</h3>
                            <button className="sms-modal-close" onClick={closeSmsModal}>&times;</button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="text-sm text-slate-600">Do: <strong>{selectedClient.name}</strong> ({selectedClient.phone})</div>
                            <textarea className="sms-textarea w-full h-32 p-3 border rounded-xl" value={smsMessage} onChange={e => setSmsMessage(e.target.value)} />
                            <div className="flex justify-end gap-2">
                                <Button variant="ghost" onClick={closeSmsModal} disabled={isSending}>Anuluj</Button>
                                <Button variant="primary" onClick={handleSendSms} disabled={isSending}>Wyślij</Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
