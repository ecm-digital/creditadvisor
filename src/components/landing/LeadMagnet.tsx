import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { useToast } from '../../context/ToastContext';
import { clientService } from '../../services/clientService';
import './LeadMagnet.css';

export const LeadMagnet: React.FC = () => {
    const { showToast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await clientService.create({
                name: formData.name,
                email: formData.email,
                phone: 'Downloaded E-book', // Placeholder for phone
                status: 'new',
                date: new Date().toISOString().split('T')[0]
            });

            showToast('E-book został wysłany na Twój adres email!', 'success');
            setFormData({ name: '', email: '' });
        } catch (error) {
            console.error('Error submitting lead magnet:', error);
            showToast('Wystąpił błąd. Spróbuj ponownie później.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="lead-magnet" id="ebook">
            <div className="container">
                <div className="lead-magnet__inner">
                    <div className="lead-magnet__image">
                        <img
                            src="/Users/tomaszgt/.gemini/antigravity/brain/48d41abb-17ff-429e-a30d-684bc257b94d/credit_guide_ebook_mockup_1769521750406.png"
                            alt="E-book: Sekrety Zdolności Kredytowej"
                            className="lead-magnet__mockup"
                        />
                        <div className="lead-magnet__badge">POBIERZ ZA DARMO</div>
                    </div>

                    <div className="lead-magnet__content">
                        <h2 className="lead-magnet__title">
                            Odbierz darmowy poradnik: <br />
                            <span className="gradient-text">Sekrety Zdolności Kredytowej</span>
                        </h2>
                        <p className="lead-magnet__description">
                            Dowiedz się, jak banki oceniają Twój wniosek i co możesz zrobić już dziś,
                            aby zwiększyć swoje szanse na kredyt hipoteczny o nawet 30%.
                        </p>

                        <ul className="lead-magnet__features">
                            <li><span>✓</span> 5 prostych sposobów na poprawę historii w BIK</li>
                            <li><span>✓</span> Jakie błędy najczęściej popełniają kredytobiorcy</li>
                            <li><span>✓</span> Lista dokumentów, których wymaga każdy bank</li>
                        </ul>

                        <form className="lead-magnet__form" onSubmit={handleSubmit}>
                            <div className="lead-magnet__form-group">
                                <input
                                    type="text"
                                    placeholder="Twoje imię"
                                    className="lead-magnet__input"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="lead-magnet__form-group">
                                <input
                                    type="email"
                                    placeholder="Twój adres email"
                                    className="lead-magnet__input"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <Button
                                variant="primary"
                                size="lg"
                                fullWidth
                                type="submit"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Wysyłanie...' : 'Odbierz darmowy poradnik'}
                            </Button>
                            <p className="lead-magnet__footer-text">
                                * Nie spamujemy. Twój adres jest u nas bezpieczny.
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};
