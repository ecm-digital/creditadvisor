import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import './LoginPage.css';

export const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { signIn, signInWithPhone, sendLoginCode, resetPassword } = useAuth();
    const { showToast } = useToast();
    const [loginIdentifier, setLoginIdentifier] = useState(''); // Email (admin) or Phone (client)
    const [password, setPassword] = useState(''); // Password (admin) or SMS Code (client)
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // SMS Login State
    const [isPhoneLogin, setIsPhoneLogin] = useState(false); // True if pure digits detected
    const [codeSent, setCodeSent] = useState(false);

    const [showResetPassword, setShowResetPassword] = useState(false); // Only for email/admin
    const [resetEmail, setResetEmail] = useState('');
    const [resetLoading, setResetLoading] = useState(false);

    // Detect if input is phone number
    const handleIdentifierChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setLoginIdentifier(val);
        // If it looks like a phone number (only digits, spaces, plus), treat as phone login
        const isPhone = /^[\d\s+]*$/.test(val) && val.length > 3;
        setIsPhoneLogin(isPhone);
    };

    const handleSendCode = async () => {
        setError('');
        setLoading(true);
        const { success, error } = await sendLoginCode(loginIdentifier);
        setLoading(false);

        if (success) {
            setCodeSent(true);
            showToast('Kod SMS został wysłany', 'success');
        } else {
            setError(typeof error === 'string' ? error : 'Błąd wysyłania kodu');
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isPhoneLogin) {
                // SMS LOGIN FLOW
                if (!codeSent) {
                    // Should trigger send code, but button is separate usually.
                    // But if they hit enter? Let's just warn or trigger send.
                    await handleSendCode();
                    return;
                }

                const { success, error } = await signInWithPhone(loginIdentifier, password);
                if (success) {
                    showToast('Zalogowano pomyślnie', 'success');
                    navigate('/dashboard');
                } else {
                    setError(typeof error === 'string' ? error : 'Błąd weryfikacji kodu');
                }

            } else {
                // EMAIL/PASSWORD LOGIN FLOW (Admin)
                const { error } = await signIn(loginIdentifier, password);
                if (error) {
                    setError('Błąd logowania. Sprawdź email i hasło.');
                } else {
                    showToast('Zalogowano pomyślnie', 'success');
                    navigate('/dashboard');
                }
            }
        } catch (err) {
            setError('Wystąpił nieoczekiwany błąd');
            console.error('Login error:', err);
        } finally {
            setLoading(false);
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
                        <label htmlFor="loginId">Email (Admin) lub Telefon (Klient)</label>
                        <input
                            type="text"
                            id="loginId"
                            value={loginIdentifier}
                            onChange={handleIdentifierChange}
                            placeholder="np. 500123456 lub admin@kredyt.pl"
                            required
                            disabled={codeSent && isPhoneLogin}
                        />
                    </div>

                    {isPhoneLogin && !codeSent && (
                        <Button
                            type="button"
                            fullWidth
                            size="lg"
                            onClick={handleSendCode}
                            disabled={loading || loginIdentifier.length < 9}
                            className="mb-4"
                        >
                            {loading ? 'Wysyłanie...' : 'Wyślij kod SMS'}
                        </Button>
                    )}

                    {(!isPhoneLogin || (isPhoneLogin && codeSent)) && (
                        <div className="form-group">
                            <label htmlFor="password">
                                {isPhoneLogin ? 'Kod weryfikacyjny (SMS)' : 'Hasło'}
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder={isPhoneLogin ? "123456" : "Twoje hasło"}
                                required
                            />
                        </div>
                    )}

                    {(!isPhoneLogin || (isPhoneLogin && codeSent)) && (
                        <Button type="submit" fullWidth size="lg" disabled={loading}>
                            {loading ? 'Logowanie...' : 'Zaloguj się'}
                        </Button>
                    )}

                    {isPhoneLogin && codeSent && (
                        <div style={{ textAlign: 'center', marginTop: '10px' }}>
                            <button
                                type="button"
                                className="text-sm underline text-gray-500"
                                onClick={() => { setCodeSent(false); setPassword(''); }}
                            >
                                Zmień numer / Wyślij ponownie
                            </button>
                        </div>
                    )}

                </form>
                <div className="login-footer">
                    {!showResetPassword ? (
                        <>
                            {!isPhoneLogin && (
                                <a href="#" onClick={(e) => { e.preventDefault(); setShowResetPassword(true); }} className="forgot-password">
                                    Zapomniałeś hasła?
                                </a>
                            )}
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
