import React, { useState } from 'react';
import { Header } from '../components/layout/Header';
import { Button } from '../components/ui/Button';
import { useToast } from '../context/ToastContext';
import './ClientPortal.css';

interface Document {
    id: string;
    name: string;
    status: 'uploaded' | 'missing' | 'review';
    date?: string;
}

export const ClientPortalPage: React.FC = () => {
    const { showToast } = useToast();
    const [documents, setDocuments] = useState<Document[]>([
        { id: '1', name: 'Dowód osobisty (skan)', status: 'uploaded', date: '2024-03-10' },
        { id: '2', name: 'Zaświadczenie o zarobkach', status: 'uploaded', date: '2024-03-11' },
        { id: '3', name: 'Wyciąg z konta (3 mies.)', status: 'missing' },
        { id: '4', name: 'Operat szacunkowy', status: 'review', date: '2024-03-12' },
    ]);

    const handleUpload = (id: string) => {
        // Simulation of file upload
        showToast('Przesyłanie dokumentu...', 'info');
        setTimeout(() => {
            setDocuments(docs => docs.map(doc => 
                doc.id === id ? { ...doc, status: 'uploaded', date: new Date().toISOString().split('T')[0] } : doc
            ));
            showToast('Dokument przesłany pomyślnie!', 'success');
        }, 1500);
    };

    return (
        <div className="client-portal">
            <Header />
            
            <div className="container">
                <div className="client-header">
                    <h1 className="client-header__title">Witaj, Janie!</h1>
                    <p className="client-header__subtitle">
                        Twój wniosek o kredyt hipoteczny (nr #KH-2024-001) jest procesowany.
                    </p>
                </div>

                <div className="client-grid">
                    <div className="client-main">
                        {/* Application Status */}
                        <div className="status-card">
                            <div className="status-card__header">
                                <h2 className="status-card__title">Status Wniosku</h2>
                                <span className="status-badge status-badge--processing">
                                    <span className="status-badge__dot"></span>
                                    Analiza analityka
                                </span>
                            </div>
                            
                            <div className="timeline">
                                <div className="timeline-item">
                                    <div className="timeline-dot"></div>
                                    <div className="timeline-date">10 marca 2024</div>
                                    <div className="timeline-title">Wniosek złożony</div>
                                    <div className="timeline-desc">Kompletny wniosek trafił do systemu.</div>
                                </div>
                                <div className="timeline-item">
                                    <div className="timeline-dot"></div>
                                    <div className="timeline-date">11 marca 2024</div>
                                    <div className="timeline-title">Wstępna weryfikacja</div>
                                    <div className="timeline-desc">Doradca potwierdził poprawność danych.</div>
                                </div>
                                <div className="timeline-item timeline-item--active">
                                    <div className="timeline-dot"></div>
                                    <div className="timeline-date">W toku</div>
                                    <div className="timeline-title">Analiza finansowa</div>
                                    <div className="timeline-desc">Analityk weryfikuje zdolność kredytową.</div>
                                </div>
                                <div className="timeline-item">
                                    <div className="timeline-dot"></div>
                                    <div className="timeline-date">Oczekujący</div>
                                    <div className="timeline-title">Decyzja kredytowa</div>
                                    <div className="timeline-desc">Ostateczna decyzja banku.</div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="status-card">
                            <div className="status-card__header">
                                <h2 className="status-card__title">Tomasz Blachlinski</h2>
                            </div>
                            <div className="doc-item">
                                <div className="doc-info">
                                    <div className="doc-icon">👨‍💼</div>
                                    <div>
                                        <div className="doc-name">Tomasz Blachlinski</div>
                                        <div className="doc-status">Starszy Ekspert Kredytowy</div>
                                    </div>
                                </div>
                                <Button variant="outline" size="sm">
                                    Napisz wiadomość
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="client-sidebar">
                        {/* Documents */}
                        <div className="status-card">
                            <div className="status-card__header">
                                <h2 className="status-card__title">Wymagane Dokumenty</h2>
                            </div>
                            <div className="docs-list">
                                {documents.map(doc => (
                                    <div key={doc.id} className="doc-item">
                                        <div className="doc-info">
                                            <div className="doc-icon">
                                                {doc.status === 'uploaded' ? '📄' : doc.status === 'review' ? '⏳' : '⚠️'}
                                            </div>
                                            <div>
                                                <div className="doc-name">{doc.name}</div>
                                                <div className={`doc-status doc-status--${doc.status}`}>
                                                    {doc.status === 'uploaded' ? `Przesłano ${doc.date}` : 
                                                     doc.status === 'review' ? 'W weryfikacji' : 'Brakuje'}
                                                </div>
                                            </div>
                                        </div>
                                        {doc.status === 'missing' && (
                                            <Button 
                                                size="sm" 
                                                variant="primary" 
                                                className="upload-btn"
                                                onClick={() => handleUpload(doc.id)}
                                            >
                                                Wgraj
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

