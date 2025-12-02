import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import './LoginPage.css';

export const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Mock authentication
        if (email === 'admin@creditadvisor.com' && password === 'admin') {
            // In a real app, we would store the token here
            localStorage.setItem('isAuthenticated', 'true');
            navigate('/dashboard');
        } else {
            setError('Nieprawidłowy email lub hasło');
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-header">
                    <h1 className="login-logo">CreditAdvisor</h1>
                    <p className="login-subtitle">Zaloguj się do panelu doradcy</p>
                </div>
                <form className="login-form" onSubmit={handleLogin}>
                    {error && <div className="login-error">{error}</div>}
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@creditadvisor.com"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Hasło</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="admin"
                            required
                        />
                    </div>
                    <Button type="submit" fullWidth size="lg">Zaloguj się</Button>
                </form>
                <div className="login-footer">
                    <a href="#" className="forgot-password">Zapomniałeś hasła?</a>
                </div>
            </div>
        </div>
    );
};
