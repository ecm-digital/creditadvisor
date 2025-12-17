import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { useToast } from '../../context/ToastContext';
import './ConsultationModal.css';

interface ConsultationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ConsultationModal: React.FC<ConsultationModalProps> = ({ isOpen, onClose }) => {
    const { showToast } = useToast();
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        amount: '',
        purpose: 'mortgage',
        preferredDate: '',
        preferredTime: '',
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Symulacja wysłania formularza
        await new Promise(resolve => setTimeout(resolve, 1000));

        showToast('Dziękujemy! Skontaktujemy się z Tobą wkrótce.', 'success');
        setFormData({
            name: '',
            phone: '',
            email: '',
            amount: '',
            purpose: 'mortgage',
            preferredDate: '',
            preferredTime: '',
            message: '',
        });
        setIsSubmitting(false);
        onClose();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    if (!isOpen) return null;

    return (
        <div className="consultation-modal-overlay" onClick={onClose}>
            <div className="consultation-modal" onClick={(e) => e.stopPropagation()}>
                <div className="consultation-modal-header">
                    <h3 className="consultation-modal-title">Umów bezpłatną konsultację</h3>
                    <button className="consultation-modal-close" onClick={onClose} disabled={isSubmitting}>
                        &times;
                    </button>
                </div>
                <form className="consultation-modal-body" onSubmit={handleSubmit}>
                    <div className="consultation-form-row">
                        <div className="consultation-form-field">
                            <label>Imię i nazwisko *</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Jan Kowalski"
                                required
                                disabled={isSubmitting}
                            />
                        </div>
                        <div className="consultation-form-field">
                            <label>Telefon *</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="+48 123 456 789"
                                required
                                disabled={isSubmitting}
                            />
                        </div>
                    </div>

                    <div className="consultation-form-field">
                        <label>Email *</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="jan@example.com"
                            required
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="consultation-form-row">
                        <div className="consultation-form-field">
                            <label>Kwota kredytu</label>
                            <input
                                type="text"
                                name="amount"
                                value={formData.amount}
                                onChange={handleChange}
                                placeholder="np. 300 000 zł"
                                disabled={isSubmitting}
                            />
                        </div>
                        <div className="consultation-form-field">
                            <label>Rodzaj kredytu</label>
                            <select
                                name="purpose"
                                value={formData.purpose}
                                onChange={handleChange}
                                disabled={isSubmitting}
                            >
                                <option value="mortgage">Kredyt hipoteczny</option>
                                <option value="cash">Kredyt gotówkowy</option>
                                <option value="consolidation">Konsolidacja</option>
                                <option value="business">Dla firmy</option>
                            </select>
                        </div>
                    </div>

                    <div className="consultation-form-row">
                        <div className="consultation-form-field">
                            <label>Preferowana data</label>
                            <input
                                type="date"
                                name="preferredDate"
                                value={formData.preferredDate}
                                onChange={handleChange}
                                disabled={isSubmitting}
                            />
                        </div>
                        <div className="consultation-form-field">
                            <label>Preferowana godzina</label>
                            <select
                                name="preferredTime"
                                value={formData.preferredTime}
                                onChange={handleChange}
                                disabled={isSubmitting}
                            >
                                <option value="">Wybierz godzinę</option>
                                <option value="09:00">09:00</option>
                                <option value="10:00">10:00</option>
                                <option value="11:00">11:00</option>
                                <option value="12:00">12:00</option>
                                <option value="13:00">13:00</option>
                                <option value="14:00">14:00</option>
                                <option value="15:00">15:00</option>
                                <option value="16:00">16:00</option>
                                <option value="17:00">17:00</option>
                            </select>
                        </div>
                    </div>

                    <div className="consultation-form-field">
                        <label>Wiadomość (opcjonalnie)</label>
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            placeholder="Opisz swoje potrzeby..."
                            rows={4}
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="consultation-modal-footer">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={onClose}
                            disabled={isSubmitting}
                        >
                            Anuluj
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Wysyłanie...' : 'Umów konsultację'}
                        </Button>
                    </div>

                    <p className="consultation-disclaimer">
                        Wysyłając formularz, wyrażasz zgodę na przetwarzanie danych osobowych w celu kontaktu.
                    </p>
                </form>
            </div>
        </div>
    );
};








