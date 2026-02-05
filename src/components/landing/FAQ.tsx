import React, { useState } from 'react';
import './FAQ.css';

const faqs = [
    {
        question: 'Czy doradztwo kredytowe jest płatne?',
        answer: 'Nie, moje doradztwo dla klientów indywidualnych jest całkowicie bezpłatne. Rozliczam się bezpośrednio z bankami, a Ty otrzymujesz dostęp do eksperckiej wiedzy bez żadnych kosztów.'
    },
    {
        question: 'Z iloma bankami współpracujesz?',
        answer: 'Mam w ofercie ponad 15 największych banków w Polsce. Dzięki temu mogę porównać oferty w jednym miejscu i wybrać tę, która jest dla Ciebie najkorzystniejsza.'
    },
    {
        question: 'Jakich dokumentów potrzebuję do badania zdolności?',
        answer: 'Na początek wystarczą podstawowe informacje o dochodach oraz aktualne zobowiązania (kredyty, karty). Szczegółową listę potrzebną do konkretnego banku ustalimy podczas pierwszej konsultacji.'
    },
    {
        question: 'Ile czasu trwa uzyskanie kredytu hipotecznego?',
        answer: 'Cały proces – od złożenia wniosku do wypłaty środków – trwa zazwyczaj od 4 do 8 tygodni. Wiele zależy od wybranego banku oraz poprawności przygotowanej dokumentacji.'
    }
];

export const FAQ: React.FC = () => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const toggleAccordion = (index: number) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <section className="faq" id="faq">
            <div className="container">
                <div className="faq__header">
                    <span className="faq__label">FAQ</span>
                    <h2 className="faq__title">Często zadawane pytania</h2>
                    <p className="faq__subtitle">
                        Wszystko, co warto wiedzieć przed rozpoczęciem procesu kredytowego.
                    </p>
                </div>

                <div className="faq__list">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className={`faq-item ${activeIndex === index ? 'active' : ''}`}
                            onClick={() => toggleAccordion(index)}
                        >
                            <div className="faq-item__question">
                                <h3>{faq.question}</h3>
                                <span className="faq-item__icon"></span>
                            </div>
                            <div className="faq-item__answer">
                                <p>{faq.answer}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
