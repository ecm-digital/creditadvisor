import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import './ClientList.css';

interface Client {
    id: string;
    name: string;
    email: string;
    phone: string;
    status: 'new' | 'contacted' | 'in_progress' | 'closed';
    date: string;
}

const mockClients: Client[] = [
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
    return (
        <div className="client-list-container">
            <div className="list-header">
                <h2 className="list-title">Lista Klientów</h2>
                <Button size="sm">Dodaj klienta</Button>
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
                        {mockClients.map((client) => (
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
                                    <Link to={`/dashboard/applications/${client.id}`}>
                                        <Button variant="ghost" size="sm">Szczegóły</Button>
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
