import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Save, X, RefreshCw } from 'lucide-react';
import { offerService } from '../../services/offerService';
import type { BankOffer } from '../../services/offerService';
import { Button } from '../ui/Button';
import { useToast } from '../../context/ToastContext';
import './AdminOffersManager.css';

export const AdminOffersManager: React.FC = () => {
    const [offers, setOffers] = useState<BankOffer[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<Partial<BankOffer>>({});
    const { showToast } = useToast();

    const fetchOffers = async () => {
        try {
            setLoading(true);
            const data = await offerService.getAllOffers();
            setOffers(data);
        } catch (error) {
            console.error(error);
            showToast('Błąd pobierania ofert', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOffers();
    }, []);

    const handleEdit = (offer: BankOffer) => {
        setEditingId(offer.id!);
        setEditForm(offer);
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditForm({});
    };

    const handleSave = async () => {
        try {
            if (!editForm.bankName || !editForm.interestRate) {
                showToast('Uzupełnij wymagane pola', 'error');
                return;
            }

            if (editingId === 'new') {
                await offerService.addOffer(editForm as any);
                showToast('Oferta dodana', 'success');
            } else {
                await offerService.updateOffer(editingId!, editForm);
                showToast('Oferta zaktualizowana', 'success');
            }

            setEditingId(null);
            setEditForm({});
            fetchOffers();
        } catch (error) {
            console.error(error);
            showToast('Błąd zapisu', 'error');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Czy na pewno chcesz usunąć tę ofertę?')) return;
        try {
            await offerService.deleteOffer(id);
            showToast('Oferta usunięta', 'success');
            fetchOffers();
        } catch (error) {
            console.error(error);
            showToast('Błąd usuwania', 'error');
        }
    };

    const handleAddNew = () => {
        setEditingId('new');
        setEditForm({
            bankName: '',
            interestRate: 0,
            commission: 0,
            rrso: 0,
            minDownPayment: 10,
            isActive: true
        });
    };

    const handleSeed = async () => {
        await offerService.seedInitialOffers(); // Should only run once really
        fetchOffers();
    };

    return (
        <div className="admin-offers-container">
            <div className="admin-offers-header">
                <div className="admin-offers-title">
                    <h2>Baza Ofert Bankowych</h2>
                    <p>Zarządzaj aktualnymi warunkami kredytów</p>
                </div>
                <div className="admin-offers-actions">
                    {offers.length === 0 && (
                        <Button variant="outline" onClick={handleSeed} size="sm">
                            <RefreshCw size={16} className="mr-2" /> Załaduj domyślne
                        </Button>
                    )}
                    <Button variant="primary" onClick={handleAddNew}>
                        <Plus size={18} className="mr-2" /> Dodaj Ofertę
                    </Button>
                </div>
            </div>

            <div className="offers-table-wrapper">
                <table className="offers-table">
                    <thead>
                        <tr>
                            <th>Bank</th>
                            <th>Oprocentowanie</th>
                            <th>Prowizja</th>
                            <th>RRSO</th>
                            <th>Min. Wkład</th>
                            <th className="text-right">Akcje</th>
                        </tr>
                    </thead>
                    <tbody>
                        {editingId === 'new' && (
                            <tr className="row-editing">
                                <td>
                                    <input
                                        className="offer-input"
                                        placeholder="Nazwa Banku"
                                        value={editForm.bankName || ''}
                                        onChange={e => setEditForm({ ...editForm, bankName: e.target.value })}
                                    />
                                </td>
                                <td>
                                    <div className="offer-input-group">
                                        <input
                                            type="number" step="0.01"
                                            className="offer-input offer-input-sm"
                                            value={editForm.interestRate || 0}
                                            onChange={e => setEditForm({ ...editForm, interestRate: Number(e.target.value) })}
                                        /> %
                                    </div>
                                </td>
                                <td>
                                    <div className="offer-input-group">
                                        <input
                                            type="number" step="0.01"
                                            className="offer-input offer-input-sm"
                                            value={editForm.commission || 0}
                                            onChange={e => setEditForm({ ...editForm, commission: Number(e.target.value) })}
                                        /> %
                                    </div>
                                </td>
                                <td>
                                    <div className="offer-input-group">
                                        <input
                                            type="number" step="0.01"
                                            className="offer-input offer-input-sm"
                                            value={editForm.rrso || 0}
                                            onChange={e => setEditForm({ ...editForm, rrso: Number(e.target.value) })}
                                        /> %
                                    </div>
                                </td>
                                <td>
                                    <div className="offer-input-group">
                                        <input
                                            type="number" step="1"
                                            className="offer-input offer-input-sm"
                                            value={editForm.minDownPayment || 0}
                                            onChange={e => setEditForm({ ...editForm, minDownPayment: Number(e.target.value) })}
                                        /> %
                                    </div>
                                </td>
                                <td>
                                    <div className="action-buttons">
                                        <button onClick={handleSave} className="btn-icon save" title="Zapisz">
                                            <Save size={18} />
                                        </button>
                                        <button onClick={handleCancelEdit} className="btn-icon" title="Anuluj">
                                            <X size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )}

                        {offers.map(offer => {
                            const isEditing = editingId === offer.id;
                            return (
                                <tr key={offer.id} className={isEditing ? 'row-editing' : ''}>
                                    {isEditing ? (
                                        <>
                                            <td>
                                                <input
                                                    className="offer-input"
                                                    value={editForm.bankName || ''}
                                                    onChange={e => setEditForm({ ...editForm, bankName: e.target.value })}
                                                />
                                            </td>
                                            <td>
                                                <div className="offer-input-group">
                                                    <input
                                                        type="number" step="0.01"
                                                        className="offer-input offer-input-sm"
                                                        value={editForm.interestRate}
                                                        onChange={e => setEditForm({ ...editForm, interestRate: Number(e.target.value) })}
                                                    /> %
                                                </div>
                                            </td>
                                            <td>
                                                <div className="offer-input-group">
                                                    <input
                                                        type="number" step="0.01"
                                                        className="offer-input offer-input-sm"
                                                        value={editForm.commission}
                                                        onChange={e => setEditForm({ ...editForm, commission: Number(e.target.value) })}
                                                    /> %
                                                </div>
                                            </td>
                                            <td>
                                                <div className="offer-input-group">
                                                    <input
                                                        type="number" step="0.01"
                                                        className="offer-input offer-input-sm"
                                                        value={editForm.rrso}
                                                        onChange={e => setEditForm({ ...editForm, rrso: Number(e.target.value) })}
                                                    /> %
                                                </div>
                                            </td>
                                            <td>
                                                <div className="offer-input-group">
                                                    <input
                                                        type="number" step="1"
                                                        className="offer-input offer-input-sm"
                                                        value={editForm.minDownPayment}
                                                        onChange={e => setEditForm({ ...editForm, minDownPayment: Number(e.target.value) })}
                                                    /> %
                                                </div>
                                            </td>
                                            <td>
                                                <div className="action-buttons">
                                                    <button onClick={handleSave} className="btn-icon save" title="Zapisz">
                                                        <Save size={18} />
                                                    </button>
                                                    <button onClick={handleCancelEdit} className="btn-icon" title="Anuluj">
                                                        <X size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td className="font-bold">{offer.bankName}</td>
                                            <td>{offer.interestRate}%</td>
                                            <td>{offer.commission}%</td>
                                            <td>{offer.rrso}%</td>
                                            <td>{offer.minDownPayment}%</td>
                                            <td>
                                                <div className="action-buttons">
                                                    <button onClick={() => handleEdit(offer)} className="btn-icon edit" title="Edytuj">
                                                        <Edit2 size={18} />
                                                    </button>
                                                    <button onClick={() => handleDelete(offer.id!)} className="btn-icon delete" title="Usuń">
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            );
                        })}
                        {offers.length === 0 && !loading && editingId !== 'new' && (
                            <tr>
                                <td colSpan={6} className="empty-state">
                                    Brak ofert. Dodaj pierwszą ofertę lub załaduj domyślne.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
