import React from 'react';
import { FileText, CheckCircle, Banknote, Users, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import '../../styles/advisor-design-system.css';
import './DashboardStats.css';

interface StatCardProps {
    title: string;
    value: string;
    change: string;
    isPositive: boolean;
    icon: React.ReactNode;
    color: 'blue' | 'green' | 'amber' | 'purple';
}

const colorMap = {
    blue: {
        bg: 'bg-blue-50',
        text: 'text-blue-600',
        border: 'border-blue-200',
        gradient: 'from-blue-500 to-blue-600'
    },
    green: {
        bg: 'bg-emerald-50',
        text: 'text-emerald-600',
        border: 'border-emerald-200',
        gradient: 'from-emerald-500 to-emerald-600'
    },
    amber: {
        bg: 'bg-amber-50',
        text: 'text-amber-600',
        border: 'border-amber-200',
        gradient: 'from-amber-500 to-amber-600'
    },
    purple: {
        bg: 'bg-purple-50',
        text: 'text-purple-600',
        border: 'border-purple-200',
        gradient: 'from-purple-500 to-purple-600'
    }
};

const StatCard: React.FC<StatCardProps> = ({ title, value, change, isPositive, icon, color }) => {
    const colors = colorMap[color];

    return (
        <div className="stat-card-modern advisor-fade-in">
            <div className="stat-card-header">
                <div className={`stat-icon-modern ${colors.bg}`}>
                    <div className={colors.text}>
                        {icon}
                    </div>
                </div>
                <div className={`stat-trend ${isPositive ? 'trend-positive' : 'trend-negative'}`}>
                    {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                    <span>{change}</span>
                </div>
            </div>

            <div className="stat-content-modern">
                <h3 className="stat-title-modern">{title}</h3>
                <div className="stat-value-modern">{value}</div>
                <p className="stat-subtitle">vs poprzedni miesiąc</p>
            </div>

            {/* Subtle gradient overlay on hover */}
            <div className="stat-card-overlay"></div>
        </div>
    );
};

export const DashboardStats: React.FC = () => {
    return (
        <div className="dashboard-stats-modern">
            <StatCard
                title="Wnioski w toku"
                value="12"
                change="+20%"
                isPositive={true}
                icon={<FileText size={24} strokeWidth={2} />}
                color="blue"
            />
            <StatCard
                title="Udzielone kredyty"
                value="8"
                change="+15%"
                isPositive={true}
                icon={<CheckCircle size={24} strokeWidth={2} />}
                color="green"
            />
            <StatCard
                title="Wartość portfela"
                value="2.4M PLN"
                change="+5%"
                isPositive={true}
                icon={<Banknote size={24} strokeWidth={2} />}
                color="amber"
            />
            <StatCard
                title="Nowi klienci"
                value="24"
                change="-2%"
                isPositive={false}
                icon={<Users size={24} strokeWidth={2} />}
                color="purple"
            />
        </div>
    );
};
