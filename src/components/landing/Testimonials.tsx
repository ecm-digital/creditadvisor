import React from 'react';
import './Testimonials.css';

const testimonials = [
    {
        content: 'Dzięki CreditAdvisor udało mi się uzyskać kredyt hipoteczny na świetnych warunkach. Profesjonalna obsługa i pełne wsparcie na każdym etapie.',
        author: 'Katarzyna Nowak',
        role: 'Kredyt hipoteczny, 450 000 zł',
        avatar: 'KN',
    },
    {
        content: 'Szybko i sprawnie. Doradca przeprowadził nas przez cały proces, a decyzję kredytową dostaliśmy w 2 dni. Polecam każdemu!',
        author: 'Michał Kowalski',
        role: 'Kredyt gotówkowy, 80 000 zł',
        avatar: 'MK',
    },
    {
        content: 'Miałem trudną historię kredytową, ale eksperci z CreditAdvisor znaleźli rozwiązanie. Teraz mam skonsolidowane zobowiązania i niższą ratę.',
        author: 'Robert Wiśniewski',
        role: 'Konsolidacja, 120 000 zł',
        avatar: 'RW',
    },
];

export const Testimonials: React.FC = () => {
    return (
        <section id="testimonials" className="testimonials">
            <div className="container">
                <div className="testimonials__header">
                    <span className="testimonials__label">Opinie klientów</span>
                    <h2 className="testimonials__title">
                        Zaufali nam setki klientów
                    </h2>
                    <p className="testimonials__subtitle">
                        Zobacz, co mówią o nas osoby, którym pomogliśmy uzyskać finansowanie
                    </p>
                </div>
                
                <div className="testimonials__grid">
                    {testimonials.map((item, index) => (
                        <div key={index} className="testimonial-card">
                            <div className="testimonial-card__stars">
                                {'★★★★★'}
                            </div>
                            <p className="testimonial-card__content">
                                "{item.content}"
                            </p>
                            <div className="testimonial-card__author">
                                <div className="testimonial-card__avatar">
                                    {item.avatar}
                                </div>
                                <div className="testimonial-card__info">
                                    <div className="testimonial-card__name">{item.author}</div>
                                    <div className="testimonial-card__role">{item.role}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                
                <div className="testimonials__trust">
                    <div className="trust-item">
                        <span className="trust-item__icon">🏆</span>
                        <span className="trust-item__text">Top 10 Doradców 2024</span>
                    </div>
                    <div className="trust-item">
                        <span className="trust-item__icon">✓</span>
                        <span className="trust-item__text">Certyfikowani eksperci</span>
                    </div>
                    <div className="trust-item">
                        <span className="trust-item__icon">🔒</span>
                        <span className="trust-item__text">Bezpieczne dane</span>
                    </div>
                    <div className="trust-item">
                        <span className="trust-item__icon">⭐</span>
                        <span className="trust-item__text">4.9/5 Google</span>
                    </div>
                </div>
            </div>
        </section>
    );
};
