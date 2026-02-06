import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import './LoginPage.css';

interface LoginPageProps {
    initialMode?: 'client'; // Kept for compatibility but effectively ignored or strictly client
}

export const LoginPage: React.FC<LoginPageProps> = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { signInWithPhone, sendLoginCode } = useAuth();
    const { showToast } = useToast();

    // Inputs
    const [phone, setPhone] = useState('');
    const [smsCode, setSmsCode] = useState('');

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // SMS Flow State
    const [codeSent, setCodeSent] = useState(false);

    // Handle incoming state from Wizard
    useEffect(() => {
        if (location.state && location.state.phone) {
            setPhone(location.state.phone);
            if (location.state.codeSent) {
                setCodeSent(true);
            }
        }
    }, [location]);

    const handleSendCode = async () => {
        setError('');
        if (phone.length < 9) {
            setError('Podaj poprawny numer telefonu');
            return;
        }
        setLoading(true);
        const { success, error } = await sendLoginCode(phone);
        setLoading(false);

        if (success) {
            setCodeSent(true);
            showToast('Kod SMS został wysłany', 'success');
        } else {
            setError(typeof error === 'string' ? error : 'Błąd wysyłania kodu');
        }
    };

    const handleClientLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (!codeSent) {
                await handleSendCode();
                return;
            }

            const { success, error } = await signInWithPhone(phone, smsCode);
            if (success) {
                showToast('Zalogowano pomyślnie', 'success');
                navigate('/dashboard');
            } else {
                setError(typeof error === 'string' ? error : 'Błąd weryfikacji kodu');
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

                {error && <div className="login-error">{error}</div>}

                <form className="login-form" onSubmit={handleClientLogin}>
                    <div className="form-group">
                        <label htmlFor="phone">Numer telefonu</label>
                        <input
                            type="tel"
                            id="phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="np. 500 123 456"
                            required
                            disabled={codeSent || loading}
                        />
                    </div>

                    {!codeSent && (
                        <Button
                            type="button"
                            fullWidth
                            size="lg"
                            onClick={handleSendCode}
                            disabled={loading || phone.length < 9}
                            className="mb-4"
                        >
                            {loading ? 'Wysyłanie...' : 'Generuj kod SMS'}
                        </Button>
                    )}

                    {codeSent && (
                        <>
                            <div className="form-group">
                                <label htmlFor="smsCode">Kod weryfikacyjny SMS</label>
                                <input
                                    type="text"
                                    id="smsCode"
                                    value={smsCode}
                                    onChange={(e) => setSmsCode(e.target.value)}
                                    placeholder="123456"
                                    required
                                    disabled={loading}
                                    autoComplete="one-time-code"
                                />
                            </div>
                            <Button type="submit" fullWidth size="lg" disabled={loading}>
                                {loading ? 'Weryfikacja...' : 'Zaloguj się'}
                            </Button>
                            <div style={{ textAlign: 'center', marginTop: '10px' }}>
                                <button
                                    type="button"
                                    className="text-sm underline text-gray-500"
                                    onClick={() => { setCodeSent(false); setSmsCode(''); }}
                                >
                                    Zmień numer / Wyślij ponownie
                                </button>
                            </div>
                        </>
                    )}
                </form>
            </div>
        </div>
    );
};
