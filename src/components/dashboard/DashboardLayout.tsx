import React from 'react';
import { Link } from 'react-router-dom';
import './DashboardLayout.css';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
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
                    <Link to="/" className="sidebar-link logout">Wyloguj</Link>
                </div>
            </aside>
            <main className="dashboard-main">
                <header className="dashboard-header">
                    <h1 className="page-title">Panel Doradcy</h1>
                    <div className="user-profile">
                        <span className="user-name">Tomasz Blachliński</span>
                        <div className="user-avatar">TB</div>
                    </div>
                </header>
                <div className="dashboard-content">
                    {children}
                </div>
            </main>
        </div>
    );
};
