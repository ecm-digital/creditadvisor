import React from 'react';
import './DashboardStats.css';

interface StatCardProps {
    title: string;
    value: string;
    change: string;
    isPositive: boolean;
    icon: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, isPositive, icon }) => (
    <div className="stat-card">
        <div className="stat-icon">{icon}</div>
        <div className="stat-content">
            <h3 className="stat-title">{title}</h3>
            <div className="stat-value">{value}</div>
            <div className={`stat-change ${isPositive ? 'positive' : 'negative'}`}>
                {isPositive ? '↑' : '↓'} {change} <span className="stat-period">vs ubiegły msc.</span>
            </div>
        </div>
    </div>
);

export const DashboardStats: React.FC = () => {
    return (
        <div className="dashboard-stats">
            <StatCard
                title="Wnioski w toku"
                value="12"
                change="20%"
                isPositive={true}
                icon="📄"
            />
            <StatCard
                title="Udzielone kredyty"
                value="8"
                change="15%"
                isPositive={true}
                icon="✅"
            />
            <StatCard
                title="Wartość kredytów"
                value="2.4M PLN"
                change="5%"
                isPositive={true}
                icon="💰"
            />
            <StatCard
                title="Nowi klienci"
                value="24"
                change="2"
                isPositive={false}
                icon="👥"
            />
        </div>
    );
};
