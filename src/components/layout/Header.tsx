import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import './Header.css';

export const Header: React.FC = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={`header ${isScrolled ? 'header--scrolled' : ''}`}>
            <div className="container">
                <div className="header__inner">
                    <Link to="/" className="header__logo">
                        <div className="header__logo-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor"/>
                                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <span>CreditAdvisor</span>
                    </Link>

                    <nav className="header__nav">
                        <a href="#features" className="header__link">Usługi</a>
                        <a href="#calculator" className="header__link">Kalkulator</a>
                        <a href="#testimonials" className="header__link">Opinie</a>
                        <a href="#contact" className="header__link">Kontakt</a>
                    </nav>

                    <div className="header__actions">
                        <Link to="/login" className="header__link">Zaloguj się</Link>
                        <Button variant="primary" size="sm">
                            Bezpłatna konsultacja
                        </Button>
                    </div>

                    <button 
                        className={`header__mobile-btn ${isMenuOpen ? 'active' : ''}`}
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Menu"
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            <div className={`header__mobile-menu ${isMenuOpen ? 'active' : ''}`}>
                <nav className="header__mobile-nav">
                    <a href="#features" onClick={() => setIsMenuOpen(false)}>Usługi</a>
                    <a href="#calculator" onClick={() => setIsMenuOpen(false)}>Kalkulator</a>
                    <a href="#testimonials" onClick={() => setIsMenuOpen(false)}>Opinie</a>
                    <a href="#contact" onClick={() => setIsMenuOpen(false)}>Kontakt</a>
                </nav>
                <div className="header__mobile-actions">
                    <Button variant="outline" size="lg" fullWidth>Zaloguj się</Button>
                    <Button variant="primary" size="lg" fullWidth>Bezpłatna konsultacja</Button>
                </div>
            </div>
        </header>
    );
};
