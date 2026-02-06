import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import './LoginPage.css'; // Reusing same styling for consistency

export const AdvisorLoginPage: React.FC = () => {
    // const navigate = useNavigate();
    const { signIn, resetPassword } = useAuth(); // Explicitly ONLY using email/pass methods
    const { showToast } = useToast();

    // Inputs
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Reset Password State
    const [showResetPassword, setShowResetPassword] = useState(false);
    const [resetEmail, setResetEmail] = useState('');
    const [resetLoading, setResetLoading] = useState(false);

    const handleAdminLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Allow multiple admin domains
        const allowedDomains = ['@kredyt.pl', '@admin.pl', '@blachlinski.pl'];
        const isAllowed = allowedDomains.some(domain => email.endsWith(domain));

        if (!isAllowed) {
            setError('To konto nie ma uprawnień doradcy (wymagana domena @blachlinski.pl, @kredyt.pl lub @admin.pl)');
            return;
        }

        setLoading(true);

        try {
            const { error } = await signIn(email, password);
            if (error) {
                setError('Błąd logowania. Sprawdź email i hasło.');
            } else {
                showToast('Zalogowano pomyślnie', 'success');
                // No navigation needed - state update will trigger re-render in AdvisorPage
            }
        } catch (err) {
            setError('Wystąpił nieoczekiwany błąd');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateAdmin = async () => {
        const { seedAdvisor } = await import('../utils/seedData');
        const result = await seedAdvisor();
        if (result.success) {
            showToast(result.message || 'Konto admina utworzone (admin@blachlinski.pl / 20262026)', 'success');
            setEmail('admin@blachlinski.pl');
            setPassword('20262026');
        } else {
            showToast(`Błąd: ${result.error}`, 'error');
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setResetLoading(true);
        const { error } = await resetPassword(resetEmail);
        setResetLoading(false);

        if (error) {
            showToast(typeof error === 'string' ? error : 'Błąd wysyłania linku resetującego', 'error');
        } else {
            showToast('Link do resetu hasła został wysłany na email.', 'success');
            setShowResetPassword(false);
            setResetEmail('');
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-header">
                    <h1 className="login-logo">CreditAdvisor</h1>
                    <p className="login-subtitle">Panel Administratora</p>
                </div>

                {error && <div className="login-error">{error}</div>}

                {/* ADMIN LOGIN FORM (EMAIL) */}
                {!showResetPassword && (
                    <form className="login-form" onSubmit={handleAdminLogin}>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@blachlinski.pl"
                                required
                                disabled={loading}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Hasło</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Twoje hasło"
                                required
                                disabled={loading}
                            />
                        </div>
                        <Button type="submit" fullWidth size="lg" disabled={loading}>
                            {loading ? 'Logowanie...' : 'Zaloguj jako Administrator'}
                        </Button>

                        {/* DEV ONLY: Quick Seed Button */}
                        <div style={{ marginTop: '1rem', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                fullWidth
                                onClick={handleCreateAdmin}
                                disabled={loading}
                            >
                                Utwórz konto: admin@blachlinski.pl
                            </Button>
                        </div>
                    </form>
                )}

                {/* ADMIN RESET PASSWORD */}
                {showResetPassword && (
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

                {/* FOOTER TOGGLES */}
                <div className="login-footer">
                    {!showResetPassword && (
                        <a href="#" onClick={(e) => { e.preventDefault(); setShowResetPassword(true); }} className="forgot-password block mb-4">
                            Zapomniałeś hasła?
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
};
