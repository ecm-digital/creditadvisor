import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="container">
                <div className="footer__content">
                    <div className="footer__section">
                        <h3 className="footer__title">Tomasz Blachliński</h3>
                        <p className="footer__description">
                            Ekspert kredytowy z wieloletnim doświadczeniem.
                            Pomogę Ci znaleźć najlepsze warunki finansowania.
                        </p>
                    </div>

                    <div className="footer__section">
                        <h4 className="footer__subtitle">Kontakt</h4>
                        <ul className="footer__list">
                            <li>
                                <a href="tel:+48535330323" className="footer__link">
                                    📞 +48 535 330 323
                                </a>
                            </li>
                            <li>
                                <a href="mailto:kontakt@blachlinski.pl" className="footer__link">
                                    ✉️ Email
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div className="footer__section">
                        <h4 className="footer__subtitle">Informacje</h4>
                        <ul className="footer__list">
                            <li>
                                <Link to="/privacy-policy" className="footer__link">
                                    Polityka Prywatności
                                </Link>
                            </li>
                            <li>
                                <Link to="/login" className="footer__link">
                                    Logowanie Klienta
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="footer__bottom">
                    <p className="footer__copyright">
                        © {currentYear} Tomasz Blachliński. Wszystkie prawa zastrzeżone.
                    </p>
                    <p className="footer__note">
                        Kredyty hipoteczne • Kredyty gotówkowe • Konsolidacja • Doradztwo finansowe
                    </p>
                </div>
            </div>
        </footer>
    );
};
