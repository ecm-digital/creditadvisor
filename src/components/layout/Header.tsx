import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import { ConsultationModal } from '../landing/ConsultationModal';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import './Header.css';

export const Header: React.FC = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
    const location = useLocation();
    const { user, signOut } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signOut();
            showToast('Wylogowano pomyślnie', 'success');
            navigate('/');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Pokaż modal tylko na stronie głównej
    const showModalOnThisPage = location.pathname === '/';

    return (
        <header className={`header ${isScrolled ? 'header--scrolled' : ''}`}>
            {showModalOnThisPage && (
                <ConsultationModal
                    isOpen={isConsultationModalOpen}
                    onClose={() => setIsConsultationModalOpen(false)}
                />
            )}
            <div className="container">
                <div className="header__inner">
                    <Link to="/" className="header__logo">
                        <div className="header__logo-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor" />
                                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <span>CreditAdvisor</span>
                    </Link>

                    <nav className="header__nav">
                    </nav>

                    <div className="header__actions">
                        <Link to="/dashboard" className="header__link header__link--accent">
                            Panel Doradcy
                        </Link>
                        {user ? (
                            <>
                                <span className="header__user-name">
                                    {user.user_metadata?.name || user.email}
                                </span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleLogout}
                                >
                                    Wyloguj
                                </Button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="header__link">
                                    Zaloguj się
                                </Link>
                                <Link to="/register">
                                    <Button variant="outline" size="sm">
                                        Zarejestruj się
                                    </Button>
                                </Link>
                                <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={() => {
                                        if (showModalOnThisPage) {
                                            setIsConsultationModalOpen(true);
                                        } else {
                                            window.location.href = '/#contact';
                                        }
                                    }}
                                >
                                    Bezpłatna konsultacja
                                </Button>
                            </>
                        )}
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
                </nav>
                <div className="header__mobile-actions">
                    <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>
                        <Button variant="outline" size="lg" fullWidth>Panel Doradcy</Button>
                    </Link>
                    {user ? (
                        <>
                            <Button
                                variant="ghost"
                                size="lg"
                                fullWidth
                                onClick={() => {
                                    setIsMenuOpen(false);
                                    handleLogout();
                                }}
                            >
                                Wyloguj
                            </Button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                                <Button variant="outline" size="lg" fullWidth>Zaloguj się</Button>
                            </Link>
                            <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                                <Button variant="primary" size="lg" fullWidth>Zarejestruj się</Button>
                            </Link>
                            <Button
                                variant="primary"
                                size="lg"
                                fullWidth
                                onClick={() => {
                                    setIsMenuOpen(false);
                                    if (showModalOnThisPage) {
                                        setIsConsultationModalOpen(true);
                                    } else {
                                        window.location.href = '/#contact';
                                    }
                                }}
                            >
                                Bezpłatna konsultacja
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};
