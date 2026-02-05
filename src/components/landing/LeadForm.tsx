import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { useToast } from '../../context/ToastContext';
import './LeadForm.css';

export const LeadForm: React.FC = () => {
    const { showToast } = useToast();
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        amount: '',
        purpose: 'mortgage',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        showToast('Dziękujemy! Skontaktuję się z Tobą wkrótce.', 'success');
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <section id="contact" className="lead-form">
            <div className="container">
                <div className="lead-form__wrapper">
                    <div className="lead-form__info">
                        <span className="lead-form__label">Kontakt</span>
                        <h2 className="lead-form__title">
                            Umów bezpłatną konsultację
                        </h2>
                        <p className="lead-form__description">
                            Wypełnij formularz, a skontaktuję się z Tobą
                            w ciągu 24 godzin roboczych.
                        </p>

                        <ul className="lead-form__benefits">
                            <li>✓ Bezpłatna analiza zdolności kredytowej</li>
                            <li>✓ Porównanie ofert z 15 banków</li>
                            <li>✓ Pomoc w przygotowaniu dokumentów</li>
                            <li>✓ Negocjacje warunków z bankiem</li>
                        </ul>

                        <div className="lead-form__contact">
                            <div className="lead-form__contact-item">
                                <span className="lead-form__contact-icon">📞</span>
                                <div>
                                    <div className="lead-form__contact-label">Telefon</div>
                                    <div className="lead-form__contact-value">+48 123 456 789</div>
                                </div>
                            </div>
                            <div className="lead-form__contact-item">
                                <span className="lead-form__contact-icon">✉️</span>
                                <div>
                                    <div className="lead-form__contact-label">Email</div>
                                    <div className="lead-form__contact-value">kontakt@blachlinski.pl</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <form className="lead-form__form" onSubmit={handleSubmit}>
                        <div className="lead-form__row">
                            <div className="lead-form__field">
                                <label>Imię i nazwisko</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Jan Kowalski"
                                    required
                                />
                            </div>
                            <div className="lead-form__field">
                                <label>Telefon</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="+48 123 456 789"
                                    required
                                />
                            </div>
                        </div>

                        <div className="lead-form__field">
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="jan@example.com"
                                required
                            />
                        </div>

                        <div className="lead-form__row">
                            <div className="lead-form__field">
                                <label>Kwota kredytu</label>
                                <input
                                    type="text"
                                    name="amount"
                                    value={formData.amount}
                                    onChange={handleChange}
                                    placeholder="np. 300 000 zł"
                                />
                            </div>
                            <div className="lead-form__field">
                                <label>Rodzaj kredytu</label>
                                <select name="purpose" value={formData.purpose} onChange={handleChange}>
                                    <option value="mortgage">Kredyt hipoteczny</option>
                                    <option value="cash">Kredyt gotówkowy</option>
                                    <option value="consolidation">Konsolidacja</option>
                                    <option value="business">Dla firmy</option>
                                </select>
                            </div>
                        </div>

                        <Button type="submit" variant="primary" size="lg" fullWidth>
                            Wyślij zapytanie
                        </Button>

                        <p className="lead-form__disclaimer">
                            Wysyłając formularz, wyrażasz zgodę na przetwarzanie danych osobowych
                            w celu kontaktu. <a href="#">Polityka prywatności</a>
                        </p>
                    </form>
                </div>
            </div>
        </section>
    );
};
