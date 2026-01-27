import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import './DashboardLayout.css';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
    const { user, signOut } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signOut();
            showToast('Wylogowano pomyślnie', 'success');
            navigate('/login');
        } catch (error) {
            console.error('Logout error:', error);
            showToast('Błąd podczas wylogowywania', 'error');
        }
    };

    const getUserInitials = () => {
        if (!user) return 'D';
        const name = user.user_metadata?.name || user.email || 'Doradca';
        const parts = name.split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return name[0].toUpperCase();
    };

    const getUserName = () => {
        if (!user) return 'Doradca';
        return user.user_metadata?.name || user.email || 'Doradca';
    };

    return (
        <div className="dashboard-layout">
            <aside className="dashboard-sidebar">
                <div className="sidebar-header">
                    <div className="sidebar-logo">CreditAdvisor</div>
                </div>
                <nav className="sidebar-nav">
                    <Link to="/dashboard" className="sidebar-link">Klienci</Link>
                    <Link to="/dashboard/applications" className="sidebar-link">Wnioski</Link>
                    <Link to="/dashboard/calendar" className="sidebar-link">Kalendarz</Link>
                    <Link to="/dashboard/settings" className="sidebar-link">Ustawienia</Link>
                </nav>
                <div className="sidebar-footer">
                    <Link to="/" className="sidebar-link">Wróć na stronę internetową</Link>
                    <button onClick={handleLogout} className="sidebar-link logout" style={{ background: 'none', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left' }}>
                        Wyloguj
                    </button>
                </div>
            </aside>
            <main className="dashboard-main">
                <header className="dashboard-header">
                    <h1 className="page-title">Panel Doradcy</h1>
                    <div className="user-profile">
                        <span className="user-name">{getUserName()}</span>
                        <div className="user-avatar">{getUserInitials()}</div>
                    </div>
                </header>
                <div className="dashboard-content">
                    {children}
                </div>
            </main>
        </div>
    );
};
