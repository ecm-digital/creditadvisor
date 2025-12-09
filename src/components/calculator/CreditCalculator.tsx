import React, { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { ConsultationModal } from '../landing/ConsultationModal';
import './CreditCalculator.css';

export const CreditCalculator: React.FC = () => {
    const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
    const [income, setIncome] = useState(8000);
    const [expenses, setExpenses] = useState(2500);
    const [period, setPeriod] = useState(25);
    const [capacity, setCapacity] = useState(0);
    const [monthlyPayment, setMonthlyPayment] = useState(0);

    useEffect(() => {
        const netIncome = income - expenses;
        const maxInstallment = netIncome * 0.5;
        const interestRate = 0.075;
        const monthlyRate = interestRate / 12;
        const months = period * 12;

        const maxLoan = maxInstallment * (1 - Math.pow(1 + monthlyRate, -months)) / monthlyRate;
        
        setCapacity(Math.max(0, Math.round(maxLoan)));
        setMonthlyPayment(Math.max(0, Math.round(maxInstallment)));
    }, [income, expenses, period]);

    const formatMoney = (num: number) => {
        return num.toLocaleString('pl-PL') + ' zł';
    };

    return (
        <section id="calculator" className="calculator">
            <ConsultationModal 
                isOpen={isConsultationModalOpen} 
                onClose={() => setIsConsultationModalOpen(false)} 
            />
            <div className="container">
                <div className="calculator__header">
                    <span className="calculator__label">Kalkulator</span>
                    <h2 className="calculator__title">
                        Sprawdź swoją zdolność kredytową
                    </h2>
                    <p className="calculator__subtitle">
                        Oblicz szacunkową kwotę kredytu, jaką możesz uzyskać
                    </p>
                </div>
                
                <div className="calculator__content">
                    <div className="calculator__form">
                        <div className="calculator__field">
                            <label className="calculator__field-label">
                                Dochód netto (miesięcznie)
                            </label>
                            <div className="calculator__slider">
                                <input
                                    type="range"
                                    min="2000"
                                    max="50000"
                                    step="500"
                                    value={income}
                                    onChange={(e) => setIncome(Number(e.target.value))}
                                />
                                <span className="calculator__slider-value">{formatMoney(income)}</span>
                            </div>
                        </div>
                        
                        <div className="calculator__field">
                            <label className="calculator__field-label">
                                Stałe wydatki (miesięcznie)
                            </label>
                            <div className="calculator__slider">
                                <input
                                    type="range"
                                    min="500"
                                    max="20000"
                                    step="100"
                                    value={expenses}
                                    onChange={(e) => setExpenses(Number(e.target.value))}
                                />
                                <span className="calculator__slider-value">{formatMoney(expenses)}</span>
                            </div>
                        </div>
                        
                        <div className="calculator__field">
                            <label className="calculator__field-label">
                                Okres kredytowania (lata)
                            </label>
                            <div className="calculator__slider">
                                <input
                                    type="range"
                                    min="5"
                                    max="35"
                                    step="1"
                                    value={period}
                                    onChange={(e) => setPeriod(Number(e.target.value))}
                                />
                                <span className="calculator__slider-value">{period} lat</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="calculator__result">
                        <div className="calculator__result-label">Twoja zdolność kredytowa</div>
                        <div className="calculator__result-value">{formatMoney(capacity)}</div>
                        <div className="calculator__result-monthly">
                            Szacowana rata: <strong>{formatMoney(monthlyPayment)}</strong>/mies.
                        </div>
                        <p className="calculator__result-note">
                            * Kalkulacja ma charakter poglądowy. Ostateczna kwota zależy od indywidualnej oceny banku.
                        </p>
                        <Button 
                            variant="primary" 
                            size="lg" 
                            fullWidth
                            onClick={() => setIsConsultationModalOpen(true)}
                        >
                            Uzyskaj dokładną wycenę
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
};
