import React from 'react';
import './Process.css';

const steps = [
    {
        number: '01',
        title: 'Bezpłatna Konsultacja',
        description: 'Analizujemy Twoją sytuację finansową, badamy zdolność i sprawdzamy historię w BIK. Odpowiadamy na wszystkie pytania.',
        icon: '💬'
    },
    {
        number: '02',
        title: 'Wybór Oferty i Formalności',
        description: 'Porównujemy oferty z 15 banków i wybieramy tę najkorzystniejszą. Pomagamy skompletować wszystkie dokumenty.',
        icon: '📄'
    },
    {
        number: '03',
        title: 'Decyzja i Finansowanie',
        description: 'Składamy wnioski, negocjujemy warunki i nadzorujemy proces aż do podpisania umowy i wypłaty środków.',
        icon: '🏦'
    }
];

export const Process: React.FC = () => {
    return (
        <section className="process" id="how-it-works">
            <div className="container">
                <div className="process__header">
                    <span className="process__label">Nasza Metoda</span>
                    <h2 className="process__title">Jak wygląda proces?</h2>
                    <p className="process__subtitle">
                        Przejdziemy z Tobą przez cały proces kredytowy krok po kroku, dbając o każdy szczegół.
                    </p>
                </div>

                <div className="process__grid">
                    {steps.map((step, index) => (
                        <div key={index} className="process-step">
                            <div className="process-step__header">
                                <span className="process-step__number">{step.number}</span>
                                <div className="process-step__icon">{step.icon}</div>
                            </div>
                            <h3 className="process-step__title">{step.title}</h3>
                            <p className="process-step__description">{step.description}</p>
                            {index < steps.length - 1 && (
                                <div className="process-step__arrow">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M5 12h14M12 5l7 7-7 7" />
                                    </svg>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
