import React from 'react';
import './Features.css';

const features = [
    {
        icon: '🎯',
        title: 'Indywidualne podejście',
        description: 'Analizuję Twoją sytuację finansową i dobieram ofertę idealnie dopasowaną do Twoich potrzeb.',
    },
    {
        icon: '💰',
        title: 'Najlepsze warunki',
        description: 'Negocjuję z bankami w Twoim imieniu, aby uzyskać najniższe oprocentowanie i prowizje.',
    },
    {
        icon: '⚡',
        title: 'Szybka decyzja',
        description: 'Dzięki moim relacjom z bankami, decyzję kredytową otrzymasz nawet w 24 godziny.',
    },
    {
        icon: '📋',
        title: 'Minimum formalności',
        description: 'Zajmuję się całą dokumentacją. Ty dostarczasz tylko niezbędne dokumenty.',
    },
    {
        icon: '🤝',
        title: 'Wsparcie na każdym etapie',
        description: 'Od pierwszej konsultacji po podpisanie umowy - jestem z Tobą przez cały proces.',
    },
    {
        icon: '🔒',
        title: 'Bezpieczeństwo',
        description: 'Twoje dane są u mnie bezpieczne. Działam zgodnie z RODO i najwyższymi standardami.',
    },
];

export const Features: React.FC = () => {
    return (
        <section id="features" className="features">
            <div className="container">
                <div className="features__header">
                    <span className="features__label">Dlaczego ja?</span>
                    <h2 className="features__title">
                        Profesjonalne doradztwo kredytowe
                    </h2>
                    <p className="features__subtitle">
                        Pomagam klientom uzyskać najlepsze warunki finansowania od ponad 10 lat
                    </p>
                </div>

                <div className="features__grid">
                    {features.map((feature, index) => (
                        <div key={index} className="feature-card">
                            <div className="feature-card__icon">{feature.icon}</div>
                            <h3 className="feature-card__title">{feature.title}</h3>
                            <p className="feature-card__description">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
