import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import './ApplicationDetails.css';

export const ApplicationDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();

    // Mock data - in a real app, fetch based on ID
    const application = {
        id,
        clientName: 'Anna Nowak',
        email: 'anna.nowak@example.com',
        phone: '500 123 456',
        status: 'Weryfikacja',
        amount: 450000,
        purpose: 'Kredyt hipoteczny',
        income: 8500,
        expenses: 3200,
        documents: [
            { name: 'Zaświadczenie o zarobkach', status: 'approved' },
            { name: 'Wyciąg z konta (3 msc)', status: 'pending' },
            { name: 'Operat szacunkowy', status: 'missing' },
        ]
    };

    return (
        <div className="app-details-container">
            <div className="details-header">
                <div className="header-left">
                    <Link to="/dashboard" className="back-link">← Wróć do listy</Link>
                    <h2 className="details-title">Wniosek #{id} - {application.clientName}</h2>
                    <span className="status-tag">{application.status}</span>
                </div>
                <div className="header-actions">
                    <Button variant="outline">Edytuj</Button>
                    <Button variant="primary">Zmień status</Button>
                </div>
            </div>

            <div className="details-grid">
                <div className="details-card">
                    <h3 className="card-title">Dane Klienta</h3>
                    <div className="info-row">
                        <span className="label">Imię i nazwisko:</span>
                        <span className="value">{application.clientName}</span>
                    </div>
                    <div className="info-row">
                        <span className="label">Email:</span>
                        <span className="value">{application.email}</span>
                    </div>
                    <div className="info-row">
                        <span className="label">Telefon:</span>
                        <span className="value">{application.phone}</span>
                    </div>
                </div>

                <div className="details-card">
                    <h3 className="card-title">Szczegóły Kredytu</h3>
                    <div className="info-row">
                        <span className="label">Kwota:</span>
                        <span className="value">{application.amount.toLocaleString()} PLN</span>
                    </div>
                    <div className="info-row">
                        <span className="label">Cel:</span>
                        <span className="value">{application.purpose}</span>
                    </div>
                    <div className="info-row">
                        <span className="label">Dochód netto:</span>
                        <span className="value">{application.income.toLocaleString()} PLN</span>
                    </div>
                </div>

                <div className="details-card full-width">
                    <h3 className="card-title">Dokumenty</h3>
                    <div className="documents-list">
                        {application.documents.map((doc, index) => (
                            <div key={index} className="document-item">
                                <span className="doc-name">{doc.name}</span>
                                <span className={`doc-status status-${doc.status}`}>
                                    {doc.status === 'approved' && 'Zatwierdzony'}
                                    {doc.status === 'pending' && 'W trakcie'}
                                    {doc.status === 'missing' && 'Brak'}
                                </span>
                                <Button size="sm" variant="ghost">Podgląd</Button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
