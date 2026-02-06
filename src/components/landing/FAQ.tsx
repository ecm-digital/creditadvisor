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
    },
    {
        question: 'Jak sprawdzić swoją zdolność kredytową?',
        answer: 'Podczas bezpłatnej konsultacji przeprowadzam szczegółową analizę Twoich dochodów, wydatków i zobowiązań. Następnie obliczam zdolność kredytową według aktualnych kryteriów banków. Otrzymasz jasną informację, na jaką kwotę możesz liczyć.'
    },
    {
        question: 'Czy mogę wziąć kredyt hipoteczny bez wkładu własnego?',
        answer: 'Tak, niektóre banki oferują kredyty hipoteczne do 100% wartości nieruchomości, zwłaszcza w programach rządowych (np. Bezpieczny Kredyt 2%). Pomogę Ci znaleźć najlepszą opcję dla Twojej sytuacji.'
    },
    {
        question: 'Co to jest konsolidacja kredytów i czy się opłaca?',
        answer: 'Konsolidacja to połączenie kilku kredytów w jeden, często z niższą ratą miesięczną. Opłaca się, gdy zmniejszasz całkowity koszt obsługi długu lub poprawiasz płynność finansową. Analizuję każdy przypadek indywidualnie.'
    },
    {
        question: 'Czy jako osoba samozatrudniona mogę dostać kredyt hipoteczny?',
        answer: 'Oczywiście! Współpracuję z bankami, które mają specjalne programy dla przedsiębiorców. Pomogę przygotować dokumentację (PIT, deklaracje ZUS/US) tak, aby maksymalizować Twoją zdolność kredytową.'
    },
    {
        question: 'Jakie jest obecnie oprocentowanie kredytów hipotecznych?',
        answer: 'Oprocentowanie zmienia się dynamicznie i zależy od wielu czynników (wkład własny, okres kredytowania, Twoja zdolność). Obecnie wahają się od około 7% do 9%. Podczas konsultacji przedstawię Ci aktualne oferty dopasowane do Twojej sytuacji.'
    },
    {
        question: 'Czy negatywny wpis w BIK wyklucza możliwość wzięcia kredytu?',
        answer: 'Nie zawsze. Zależy od rodzaju wpisu i Twojej aktualnej sytuacji finansowej. Mam doświadczenie w pracy z trudnymi przypadkami i znam banki, które są bardziej elastyczne w ocenie historii kredytowej.'
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
