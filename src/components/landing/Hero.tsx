import React, { useState } from 'react';
import tomaszPhoto from '../../assets/zdjecietomasza.jpg';
import { Button } from '../ui/Button';
import { ConsultationModal } from './ConsultationModal';
import './Hero.css';

export const Hero: React.FC = () => {
    const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);

    const scrollToCalculator = () => {
        const calculatorSection = document.getElementById('calculator');
        if (calculatorSection) {
            calculatorSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const scrollToEbook = () => {
        const ebookSection = document.getElementById('ebook');
        if (ebookSection) {
            ebookSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <section className="hero">
            <ConsultationModal
                isOpen={isConsultationModalOpen}
                onClose={() => setIsConsultationModalOpen(false)}
            />
            <div className="hero__bg">
                <div className="hero__gradient"></div>
                <div className="hero__pattern"></div>
            </div>

            <div className="container">
                <div className="hero__content">
                    <div className="hero__text">
                        <div className="hero__badge">
                            <span className="hero__badge-dot"></span>
                            Zaufało mi ponad 500 klientów
                        </div>

                        <h1 className="hero__title">
                            Tomasz Blachliński
                            <span className="gradient-text"> - ekspert od kredytów hipotecznych</span>
                        </h1>

                        <p className="hero__description">
                            Profesjonalne doradztwo kredytowe. Pomagam uzyskać najlepsze warunki
                            finansowania na rynku. Bezpłatna analiza zdolności kredytowej.
                        </p>

                        <div className="hero__buttons">
                            <Button variant="primary" size="lg" onClick={scrollToEbook}>
                                Odbierz darmowy poradnik
                            </Button>
                            <Button variant="outline" size="lg" onClick={scrollToCalculator}>
                                Stwórz ranking kredytów
                            </Button>
                        </div>

                        <div className="hero__stats">
                            <div className="hero__stat">
                                <div className="hero__stat-value">500+</div>
                                <div className="hero__stat-label">Zadowolonych klientów</div>
                            </div>
                            <div className="hero__stat">
                                <div className="hero__stat-value">98%</div>
                                <div className="hero__stat-label">Skuteczność</div>
                            </div>
                            <div className="hero__stat">
                                <div className="hero__stat-value">24h</div>
                                <div className="hero__stat-label">Czas odpowiedzi</div>
                            </div>
                        </div>
                    </div>

                    <div className="hero__visual">
                        <div className="hero__image-container">
                            <img
                                src={tomaszPhoto}
                                alt="Tomasz Blachliński - Ekspert Finansowy i Kredytowy z wieloletnim doświadczeniem"
                                className="hero__image"
                                loading="eager"
                                width="600"
                                height="600"
                            />
                        </div>

                        <div className="hero__float hero__float--1">
                            <div className="hero__float-icon">✓</div>
                            <div className="hero__float-text">
                                <strong>Decyzja w 24h</strong>
                                <span>Szybka weryfikacja</span>
                            </div>
                        </div>

                        <div className="hero__float hero__float--2">
                            <div className="hero__float-icon">🏦</div>
                            <div className="hero__float-text">
                                <strong>15 banków</strong>
                                <span>Do wyboru</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
