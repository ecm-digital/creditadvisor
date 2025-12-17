import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { useToast } from '../../context/ToastContext';
import { smsService } from '../../services/smsService';
import { clientService, type Client } from '../../services/clientService';
import './ClientList.css';

const statusLabels = {
    new: 'Nowy',
    contacted: 'Skontaktowano',
    in_progress: 'W toku',
    closed: 'Zamknięty',
};

export const ClientList: React.FC = () => {
    const { showToast } = useToast();
    const [clients, setClients] = useState<Client[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [smsModalOpen, setSmsModalOpen] = useState(false);
    const [addClientModalOpen, setAddClientModalOpen] = useState(false);
    const [editClientModalOpen, setEditClientModalOpen] = useState(false);
    const [editingClient, setEditingClient] = useState<Client | null>(null);
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [smsMessage, setSmsMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [smsStatus, setSmsStatus] = useState<{ configured: boolean; mode: 'mock' | 'production' } | null>(null);
    const [supabaseStatus, setSupabaseStatus] = useState<boolean>(false);

    // Load clients from Supabase on mount
    useEffect(() => {
        loadClients();
        setSmsStatus(smsService.getStatus());
        setSupabaseStatus(clientService.isConfigured());
    }, []);

    const loadClients = async () => {
        setIsLoading(true);
        try {
            if (clientService.isConfigured()) {
                const data = await clientService.getAll();
                setClients(data);
            } else {
                showToast('Supabase nie jest skonfigurowane. Używasz trybu offline.', 'warning');
                setClients([]);
            }
        } catch (error) {
            console.error('Error loading clients:', error);
            showToast('Błąd podczas ładowania klientów', 'error');
        } finally {
            setIsLoading(false);
        }
    };

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
                const errorMsg = response.error || 'Błąd podczas wysyłania SMS';
                showToast(`Błąd: ${errorMsg}`, 'error');
                console.error('SMS Error:', response);
            }
        } catch (error) {
            const errorMsg = error instanceof Error ? error.message : 'Wystąpił nieoczekiwany błąd';
            showToast(`Błąd: ${errorMsg}`, 'error');
            console.error('SMS Exception:', error);
        } finally {
            setIsSending(false);
        }
    };

    const handleAddClient = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(newClient.email)) {
            showToast('Nieprawidłowy format adresu email', 'error');
            return;
        }

        // Check if client with this email already exists
        const emailExists = clients.some(c => c.email.toLowerCase() === newClient.email.toLowerCase());
        if (emailExists) {
            showToast('Klient z tym adresem email już istnieje', 'error');
            return;
        }

        if (!clientService.isConfigured()) {
            showToast('Supabase nie jest skonfigurowane. Nie można dodać klienta.', 'error');
            return;
        }

        try {
            const client = await clientService.create({
                name: newClient.name.trim(),
                email: newClient.email.trim().toLowerCase(),
                phone: newClient.phone.trim(),
                status: 'new',
                date: new Date().toISOString().split('T')[0]
            });

            setClients([client, ...clients]);
            setAddClientModalOpen(false);
            setNewClient({ name: '', email: '', phone: '' });
            showToast('Klient został dodany', 'success');
        } catch (error) {
            console.error('Error adding client:', error);
            showToast('Błąd podczas dodawania klienta', 'error');
        }
    };

    const handleEditClient = (client: Client) => {
        setEditingClient(client);
        setNewClient({
            name: client.name,
            email: client.email,
            phone: client.phone
        });
        setEditClientModalOpen(true);
    };

    const handleUpdateClient = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingClient) return;

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(newClient.email)) {
            showToast('Nieprawidłowy format adresu email', 'error');
            return;
        }

        // Check if email is taken by another client
        const emailExists = clients.some(c => 
            c.id !== editingClient.id && 
            c.email.toLowerCase() === newClient.email.toLowerCase()
        );
        if (emailExists) {
            showToast('Klient z tym adresem email już istnieje', 'error');
            return;
        }

        if (!clientService.isConfigured()) {
            showToast('Supabase nie jest skonfigurowane. Nie można zaktualizować klienta.', 'error');
            return;
        }

        try {
            const updatedClient = await clientService.update(editingClient.id, {
                name: newClient.name.trim(),
                email: newClient.email.trim().toLowerCase(),
                phone: newClient.phone.trim(),
            });

            setClients(clients.map(c => c.id === editingClient.id ? updatedClient : c));
            setEditClientModalOpen(false);
            setEditingClient(null);
            setNewClient({ name: '', email: '', phone: '' });
            showToast('Dane klienta zostały zaktualizowane', 'success');
        } catch (error) {
            console.error('Error updating client:', error);
            showToast('Błąd podczas aktualizacji klienta', 'error');
        }
    };

    const handleDeleteClient = async (clientId: string, clientName: string) => {
        if (!window.confirm(`Czy na pewno chcesz usunąć klienta "${clientName}"?`)) {
            return;
        }

        if (!clientService.isConfigured()) {
            showToast('Supabase nie jest skonfigurowane. Nie można usunąć klienta.', 'error');
            return;
        }

        try {
            await clientService.delete(clientId);
            setClients(clients.filter(c => c.id !== clientId));
            showToast('Klient został usunięty', 'success');
        } catch (error) {
            console.error('Error deleting client:', error);
            showToast('Błąd podczas usuwania klienta', 'error');
        }
    };

    const closeEditModal = () => {
        setEditClientModalOpen(false);
        setEditingClient(null);
        setNewClient({ name: '', email: '', phone: '' });
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!clientService.isConfigured()) {
            showToast('Supabase nie jest skonfigurowane. Nie można importować klientów.', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = async (e) => {
            const text = e.target?.result as string;
            const lines = text.split('\n');
            const clientsToImport: Omit<Client, 'id' | 'created_at' | 'updated_at'>[] = [];
            
            // Simple CSV parsing
            // Expected format: name,email,phone,status(optional),date(optional)
            lines.forEach((line, index) => {
                if (index === 0 && line.toLowerCase().includes('email')) return; // Skip header
                
                const [name, email, phone, status, date] = line.split(',').map(s => s.trim());
                
                if (name && email) {
                    clientsToImport.push({
                        name,
                        email: email.toLowerCase(),
                        phone: phone || '',
                        status: (status as any) || 'new',
                        date: date || new Date().toISOString().split('T')[0]
                    });
                }
            });

            if (clientsToImport.length > 0) {
                try {
                    const createdClients: Client[] = [];
                    for (const clientData of clientsToImport) {
                        try {
                            const client = await clientService.create(clientData);
                            createdClients.push(client);
                        } catch (error) {
                            console.error('Error importing client:', clientData, error);
                        }
                    }
                    
                    if (createdClients.length > 0) {
                        setClients([...createdClients, ...clients]);
                        showToast(`Zaimportowano ${createdClients.length} z ${clientsToImport.length} klientów`, 'success');
                    } else {
                        showToast('Nie udało się zaimportować żadnych klientów', 'error');
                    }
                } catch (error) {
                    console.error('Error importing clients:', error);
                    showToast('Błąd podczas importowania klientów', 'error');
                }
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

            {!supabaseStatus && (
                <div style={{ 
                    marginBottom: '16px', 
                    padding: '12px', 
                    backgroundColor: '#fff3e0',
                    borderRadius: '4px',
                    fontSize: '14px',
                    color: '#e65100'
                }}>
                    ⚠ Supabase nie jest skonfigurowane. Ustaw VITE_SUPABASE_URL i VITE_SUPABASE_ANON_KEY w pliku .env
                </div>
            )}

            {isLoading ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                    <p>Ładowanie klientów...</p>
                </div>
            ) : (
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
                            {clients.length === 0 ? (
                                <tr>
                                    <td colSpan={5} style={{ textAlign: 'center', padding: '40px' }}>
                                        {supabaseStatus ? 'Brak klientów. Dodaj pierwszego klienta!' : 'Skonfiguruj Supabase, aby rozpocząć.'}
                                    </td>
                                </tr>
                            ) : (
                                clients.map((client) => (
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
                                    <div className="actions-cell" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                        <Button 
                                            variant="outline" 
                                            size="sm"
                                            onClick={() => openSmsModal(client)}
                                            title="Wyślij SMS"
                                        >
                                            💬 SMS
                                        </Button>
                                        <Button 
                                            variant="outline" 
                                            size="sm"
                                            onClick={() => handleEditClient(client)}
                                            title="Edytuj klienta"
                                        >
                                            ✏️ Edytuj
                                        </Button>
                                        <Button 
                                            variant="ghost" 
                                            size="sm"
                                            onClick={() => handleDeleteClient(client.id, client.name)}
                                            title="Usuń klienta"
                                            style={{ color: '#d32f2f' }}
                                        >
                                            🗑️ Usuń
                                        </Button>
                                        <Link to={`/dashboard/applications/${client.id}`}>
                                            <Button variant="ghost" size="sm">Szczegóły</Button>
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                            ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}

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

            {/* Edit Client Modal */}
            {editClientModalOpen && editingClient && (
                <div className="modal-overlay">
                    <div className="sms-modal">
                        <div className="sms-modal-header">
                            <h3 className="sms-modal-title">Edytuj klienta</h3>
                            <button className="sms-modal-close" onClick={closeEditModal}>&times;</button>
                        </div>
                        <form onSubmit={handleUpdateClient}>
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
                                <Button type="button" variant="ghost" onClick={closeEditModal}>Anuluj</Button>
                                <Button type="submit" variant="primary">Zapisz zmiany</Button>
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
                            {smsStatus && (
                                <div style={{ 
                                    marginTop: '12px', 
                                    padding: '8px 12px', 
                                    backgroundColor: smsStatus.configured ? '#e8f5e9' : '#fff3e0',
                                    borderRadius: '4px',
                                    fontSize: '12px',
                                    color: smsStatus.configured ? '#2e7d32' : '#e65100'
                                }}>
                                    {smsStatus.configured ? (
                                        <>✓ SMSAPI.pl skonfigurowane - wiadomości będą wysyłane</>
                                    ) : (
                                        <>⚠ Tryb testowy (mock) - SMS-y nie są wysyłane. Skonfiguruj VITE_SMSAPI_TOKEN w pliku .env</>
                                    )}
                                </div>
                            )}
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
