import React from 'react';
import { Button } from '../ui/Button';
import './Hero.css';

export const Hero: React.FC = () => {
    return (
        <section className="hero">
            <div className="hero__bg">
                <div className="hero__gradient"></div>
                <div className="hero__pattern"></div>
            </div>
            
            <div className="container">
                <div className="hero__content">
                    <div className="hero__text">
                        <div className="hero__badge">
                            <span className="hero__badge-dot"></span>
                            Zaufało nam ponad 500 klientów
                        </div>
                        
                        <h1 className="hero__title">
                            Znajdziemy dla Ciebie
                            <span className="gradient-text"> najlepszy kredyt</span>
                        </h1>
                        
                        <p className="hero__description">
                            Profesjonalne doradztwo kredytowe. Pomagamy uzyskać najlepsze warunki 
                            finansowania na rynku. Bezpłatna analiza zdolności kredytowej.
                        </p>
                        
                        <div className="hero__buttons">
                            <Button variant="primary" size="lg">
                                Sprawdź zdolność kredytową
                            </Button>
                            <Button variant="outline" size="lg">
                                Umów rozmowę
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
                        <div className="hero__card">
                            <div className="hero__card-header">
                                <div className="hero__card-icon">🏠</div>
                                <span>Kredyt hipoteczny</span>
                            </div>
                            <div className="hero__card-amount">450 000 zł</div>
                            <div className="hero__card-details">
                                <div className="hero__card-row">
                                    <span>Oprocentowanie</span>
                                    <strong>7.2%</strong>
                                </div>
                                <div className="hero__card-row">
                                    <span>Rata miesięczna</span>
                                    <strong>3 240 zł</strong>
                                </div>
                                <div className="hero__card-row">
                                    <span>Okres</span>
                                    <strong>25 lat</strong>
                                </div>
                            </div>
                            <div className="hero__card-status">
                                <span className="hero__card-status-dot"></span>
                                Wstępna akceptacja
                            </div>
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
