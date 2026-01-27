import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import './LoginPage.css';

export const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const { signUp } = useAuth();
    const { showToast } = useToast();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setError('');
    };

    const validateForm = () => {
        if (!formData.name.trim()) {
            setError('Imię i nazwisko jest wymagane');
            return false;
        }
        if (!formData.email.trim()) {
            setError('Email jest wymagany');
            return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            setError('Nieprawidłowy format adresu email');
            return false;
        }
        if (!formData.phone.trim()) {
            setError('Numer telefonu jest wymagany');
            return false;
        }
        if (formData.password.length < 6) {
            setError('Hasło musi mieć co najmniej 6 znaków');
            return false;
        }
        if (formData.password !== formData.confirmPassword) {
            setError('Hasła nie są identyczne');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const { error } = await signUp(
                formData.email,
                formData.password,
                formData.name,
                formData.phone
            );

            if (error) {
                if (error.message.includes('already registered')) {
                    setError('Ten adres email jest już zarejestrowany');
                } else {
                    setError(error.message || 'Błąd podczas rejestracji');
                }
            } else {
                showToast('Rejestracja zakończona pomyślnie! Sprawdź email w celu potwierdzenia konta.', 'success');
                navigate('/login');
            }
        } catch (err) {
            setError('Wystąpił nieoczekiwany błąd');
            console.error('Registration error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-header">
                    <h1 className="login-logo">CreditAdvisor</h1>
                    <p className="login-subtitle">Utwórz nowe konto</p>
                </div>
                <form className="login-form" onSubmit={handleSubmit}>
                    {error && <div className="login-error">{error}</div>}
                    <div className="form-group">
                        <label htmlFor="name">Imię i nazwisko</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Jan Kowalski"
                            required
                            disabled={loading}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="jan@example.com"
                            required
                            disabled={loading}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="phone">Numer telefonu</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="500 123 456"
                            required
                            disabled={loading}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Hasło</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Minimum 6 znaków"
                            required
                            disabled={loading}
                            minLength={6}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirmPassword">Potwierdź hasło</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Powtórz hasło"
                            required
                            disabled={loading}
                            minLength={6}
                        />
                    </div>
                    <Button type="submit" fullWidth size="lg" disabled={loading}>
                        {loading ? 'Rejestrowanie...' : 'Zarejestruj się'}
                    </Button>
                </form>
                <div className="login-footer">
                    <p>
                        Masz już konto? <Link to="/login">Zaloguj się</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

