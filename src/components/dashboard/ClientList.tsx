import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { useToast } from '../../context/ToastContext';
import { smsService } from '../../services/smsService';
import './ClientList.css';

interface Client {
    id: string;
    name: string;
    email: string;
    phone: string;
    status: 'new' | 'contacted' | 'in_progress' | 'closed';
    date: string;
}

const initialClients: Client[] = [
    { id: '1', name: 'Anna Nowak', email: 'anna.nowak@example.com', phone: '500 123 456', status: 'new', date: '2023-10-25' },
    { id: '2', name: 'Piotr Kowalski', email: 'piotr.kowalski@example.com', phone: '600 987 654', status: 'contacted', date: '2023-10-24' },
    { id: '3', name: 'Maria Wiśniewska', email: 'maria.wis@example.com', phone: '700 555 333', status: 'in_progress', date: '2023-10-23' },
    { id: '4', name: 'Tomasz Zieliński', email: 'tomasz.ziel@example.com', phone: '800 222 111', status: 'closed', date: '2023-10-20' },
];

const statusLabels = {
    new: 'Nowy',
    contacted: 'Skontaktowano',
    in_progress: 'W toku',
    closed: 'Zamknięty',
};

export const ClientList: React.FC = () => {
    const { showToast } = useToast();
    const [clients, setClients] = useState<Client[]>(initialClients);
    const [smsModalOpen, setSmsModalOpen] = useState(false);
    const [addClientModalOpen, setAddClientModalOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [smsMessage, setSmsMessage] = useState('');
    const [isSending, setIsSending] = useState(false);

    // New Client Form State
    const [newClient, setNewClient] = useState({
        name: '',
        email: '',
        phone: '',
    });

    const fileInputRef = React.useRef<HTMLInputElement>(null);

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
                closeSmsModal();
            } else {
                showToast('Błąd podczas wysyłania SMS', 'error');
            }
        } catch (error) {
            showToast('Wystąpił nieoczekiwany błąd', 'error');
        } finally {
            setIsSending(false);
        }
    };

    const handleAddClient = (e: React.FormEvent) => {
        e.preventDefault();
        const client: Client = {
            id: Date.now().toString(),
            name: newClient.name,
            email: newClient.email,
            phone: newClient.phone,
            status: 'new',
            date: new Date().toISOString().split('T')[0]
        };

        setClients([client, ...clients]);
        setAddClientModalOpen(false);
        setNewClient({ name: '', email: '', phone: '' });
        showToast('Klient został dodany', 'success');
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result as string;
            const lines = text.split('\n');
            const parsedClients: Client[] = [];
            
            // Simple CSV parsing
            // Expected format: name,email,phone,status(optional),date(optional)
            lines.forEach((line, index) => {
                if (index === 0 && line.toLowerCase().includes('email')) return; // Skip header
                
                const [name, email, phone, status, date] = line.split(',').map(s => s.trim());
                
                if (name && email) {
                    parsedClients.push({
                        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                        name,
                        email,
                        phone: phone || '',
                        status: (status as any) || 'new',
                        date: date || new Date().toISOString().split('T')[0]
                    });
                }
            });

            if (parsedClients.length > 0) {
                setClients(prev => [...parsedClients, ...prev]);
                showToast(`Zaimportowano ${parsedClients.length} klientów`, 'success');
            } else {
                showToast('Nie znaleziono poprawnych danych w pliku', 'error');
            }
            
            // Reset input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="client-list-container">
            <div className="list-header">
                <h2 className="list-title">Lista Klientów</h2>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <input
                        type="file"
                        accept=".csv"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={handleFileUpload}
                    />
                    <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                        Importuj CSV
                    </Button>
                    <Button size="sm" onClick={() => setAddClientModalOpen(true)}>
                        Dodaj klienta
                    </Button>
                </div>
            </div>

            <div className="table-container">
                <table className="client-table">
                    <thead>
                        <tr>
                            <th>Klient</th>
                            <th>Kontakt</th>
                            <th>Status</th>
                            <th>Data zgłoszenia</th>
                            <th>Akcje</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clients.map((client) => (
                            <tr key={client.id}>
                                <td>
                                    <div className="client-name">{client.name}</div>
                                </td>
                                <td>
                                    <div className="client-email">{client.email}</div>
                                    <div className="client-phone">{client.phone}</div>
                                </td>
                                <td>
                                    <span className={`status-badge status-${client.status}`}>
                                        {statusLabels[client.status]}
                                    </span>
                                </td>
                                <td>{client.date}</td>
                                <td>
                                    <div className="actions-cell">
                                        <Button 
                                            variant="outline" 
                                            size="sm"
                                            onClick={() => openSmsModal(client)}
                                            title="Wyślij SMS"
                                        >
                                            💬 SMS
                                        </Button>
                                        <Link to={`/dashboard/applications/${client.id}`}>
                                            <Button variant="ghost" size="sm">Szczegóły</Button>
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add Client Modal */}
            {addClientModalOpen && (
                <div className="modal-overlay">
                    <div className="sms-modal">
                        <div className="sms-modal-header">
                            <h3 className="sms-modal-title">Dodaj nowego klienta</h3>
                            <button className="sms-modal-close" onClick={() => setAddClientModalOpen(false)}>&times;</button>
                        </div>
                        <form onSubmit={handleAddClient}>
                            <div className="sms-modal-body">
                                <div style={{ marginBottom: '16px' }}>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>Imię i nazwisko</label>
                                    <input
                                        type="text"
                                        className="sms-textarea"
                                        style={{ height: '40px' }}
                                        value={newClient.name}
                                        onChange={e => setNewClient({...newClient, name: e.target.value})}
                                        required
                                        placeholder="np. Jan Kowalski"
                                    />
                                </div>
                                <div style={{ marginBottom: '16px' }}>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>Email</label>
                                    <input
                                        type="email"
                                        className="sms-textarea"
                                        style={{ height: '40px' }}
                                        value={newClient.email}
                                        onChange={e => setNewClient({...newClient, email: e.target.value})}
                                        required
                                        placeholder="np. jan@example.com"
                                    />
                                </div>
                                <div style={{ marginBottom: '16px' }}>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>Telefon</label>
                                    <input
                                        type="tel"
                                        className="sms-textarea"
                                        style={{ height: '40px' }}
                                        value={newClient.phone}
                                        onChange={e => setNewClient({...newClient, phone: e.target.value})}
                                        required
                                        placeholder="np. 500 123 456"
                                    />
                                </div>
                            </div>
                            <div className="sms-modal-footer">
                                <Button type="button" variant="ghost" onClick={() => setAddClientModalOpen(false)}>Anuluj</Button>
                                <Button type="submit" variant="primary">Dodaj klienta</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* SMS Modal */}
            {smsModalOpen && selectedClient && (
                <div className="modal-overlay">
                    <div className="sms-modal">
                        <div className="sms-modal-header">
                            <h3 className="sms-modal-title">Wyślij SMS</h3>
                            <button className="sms-modal-close" onClick={closeSmsModal} disabled={isSending}>&times;</button>
                        </div>
                        <div className="sms-modal-body">
                            <div className="sms-recipient">
                                Do: <strong>{selectedClient.name}</strong> ({selectedClient.phone})
                            </div>
                            <textarea 
                                className="sms-textarea"
                                value={smsMessage}
                                onChange={(e) => setSmsMessage(e.target.value)}
                                placeholder="Wpisz treść wiadomości..."
                                disabled={isSending}
                            />
                            <div className="sms-info">
                                <span>Liczba znaków: {smsMessage.length}</span>
                                <span>Koszt: 0.16 zł</span>
                            </div>
                        </div>
                        <div className="sms-modal-footer">
                            <Button variant="ghost" onClick={closeSmsModal} disabled={isSending}>Anuluj</Button>
                            <Button variant="primary" onClick={handleSendSms} disabled={isSending}>
                                {isSending ? 'Wysyłanie...' : 'Wyślij wiadomość'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
