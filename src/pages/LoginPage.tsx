import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import './LoginPage.css';

export const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { signIn, resetPassword } = useAuth();
    const { showToast } = useToast();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showResetPassword, setShowResetPassword] = useState(false);
    const [resetEmail, setResetEmail] = useState('');
    const [resetLoading, setResetLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Check if input is an email (for admin) or phone (for client)
            let loginId = email;
            // Phone login
            if (!email.includes('@')) {
                // Assume phone number -> convert to dummy email
                const cleanPhone = email.replace(/\D/g, '');
                loginId = `${cleanPhone}@kredyt.pl`;
            }

            const { error } = await signIn(loginId, password);

            if (error) {
                if (error.message.includes('Invalid login credentials')) {
                    setError('Nieprawidłowy numer/email lub hasło');
                } else if (error.message.includes('Email not confirmed')) {
                    setError('Konto nieaktywne');
                } else {
                    setError('Błąd logowania. Sprawdź kod.');
                }
            } else {
                showToast('Zalogowano pomyślnie', 'success');
                navigate('/dashboard');
            }
        } catch (err) {
            setError('Wystąpił nieoczekiwany błąd');
            console.error('Login error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setResetLoading(true);

        try {
            const { error } = await resetPassword(resetEmail);
            if (error) {
                setError(error.message || 'Błąd podczas resetowania hasła');
            } else {
                showToast('Link do resetowania hasła został wysłany na email', 'success');
                setShowResetPassword(false);
                setResetEmail('');
            }
        } catch (err) {
            setError('Wystąpił nieoczekiwany błąd');
        } finally {
            setResetLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-header">
                    <h1 className="login-logo">CreditAdvisor</h1>
                    <p className="login-subtitle">Panel Klienta</p>
                </div>

                <form className="login-form" onSubmit={handleLogin}>
                    {error && <div className="login-error">{error}</div>}
                    <div className="form-group">
                        <label htmlFor="loginId">Numer telefonu</label>
                        <input
                            type="tel"
                            id="loginId"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="np. 500123456"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Kod dostępu (z SMS)</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Wpisz kod z SMS"
                            required
                        />
                    </div>
                    <Button type="submit" fullWidth size="lg" disabled={loading}>
                        {loading ? 'Logowanie...' : 'Zaloguj się'}
                    </Button>
                </form>
                <div className="login-footer">
                    {!showResetPassword ? (
                        <>
                            <a href="#" onClick={(e) => { e.preventDefault(); setShowResetPassword(true); }} className="forgot-password">
                                Zapomniałeś hasła?
                            </a>
                            <p style={{ marginTop: '16px' }}>
                                Nie masz konta? <Link to="/register">Zarejestruj się</Link>
                            </p>
                        </>
                    ) : (
                        <form onSubmit={handleResetPassword} style={{ marginTop: '16px' }}>
                            <div className="form-group">
                                <label htmlFor="resetEmail">Email</label>
                                <input
                                    type="email"
                                    id="resetEmail"
                                    value={resetEmail}
                                    onChange={(e) => setResetEmail(e.target.value)}
                                    placeholder="jan@example.com"
                                    required
                                    disabled={resetLoading}
                                />
                            </div>
                            <Button type="submit" fullWidth size="sm" disabled={resetLoading} style={{ marginBottom: '8px' }}>
                                {resetLoading ? 'Wysyłanie...' : 'Wyślij link resetujący'}
                            </Button>
                            <Button
                                type="button"
                                variant="ghost"
                                fullWidth
                                size="sm"
                                onClick={() => { setShowResetPassword(false); setResetEmail(''); }}
                            >
                                Anuluj
                            </Button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};
