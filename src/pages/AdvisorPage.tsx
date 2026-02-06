import React from 'react';
import { useAuth } from '../context/AuthContext';
import { AdvisorLoginPage } from './AdvisorLoginPage';
import { Navigate } from 'react-router-dom';

export const AdvisorPage: React.FC = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="flex items-center justify-center h-screen">Ładowanie...</div>;
    }

    if (user) {
        // Basic security: if user is not an advisor, redirect to client dashboard
        // Basic security: if user is not an advisor, redirect to client dashboard
        const isAdvisor = user.email && (user.email.endsWith('@kredyt.pl') || user.email.endsWith('@admin.pl') || user.email.endsWith('@blachlinski.pl'));

        if (!isAdvisor) {
            return <Navigate to="/dashboard" replace />;
        }
        // Redirect to the canonical advisor URL
        return <Navigate to="/dashboard?view=advisor" replace />;
    }

    return <AdvisorLoginPage />;
};
