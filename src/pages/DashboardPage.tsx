import React, { useState, useEffect } from 'react';
import { Routes, Route, useSearchParams, Navigate } from 'react-router-dom';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { ClientList } from '../components/dashboard/ClientList';
import { KanbanBoard } from '../components/dashboard/KanbanBoard';
import { ApplicationDetails } from '../components/dashboard/ApplicationDetails';
import { Calendar } from '../components/dashboard/Calendar';
import { SettingsPage } from '../components/dashboard/SettingsPage';
import { DashboardStats } from '../components/dashboard/DashboardStats';
import { useAuth } from '../context/AuthContext';
import { ClientOffers } from '../components/dashboard/ClientOffers';
import { ClientPurpose } from '../components/dashboard/ClientPurpose';
import { ClientParameters } from '../components/dashboard/ClientParameters';
import { ClientIncome } from '../components/dashboard/ClientIncome';
import { ClientDocuments } from '../components/dashboard/ClientDocuments';
import { ClientApplication } from '../components/dashboard/ClientApplication';
import { AdminOffersManager } from '../components/dashboard/AdminOffersManager';

interface DashboardPageProps {
    isAdvisorRoute?: boolean;
}

export const DashboardPage: React.FC<DashboardPageProps> = (props) => {
    const { user, loading } = useAuth();
    const [searchParams] = useSearchParams();
    // Allow forcing advisor view via URL query param (e.g. from "Dla Doradców" button) OR prop
    const forceAdvisorView = searchParams.get('view') === 'advisor' || props.isAdvisorRoute;

    // Robust role detection
    const [isClient, setIsClient] = useState<boolean | null>(null);

    const [hasLoggedAccess, setHasLoggedAccess] = useState(false);

    useEffect(() => {
        const checkRole = async () => {
            if (loading) return;

            if (!user) {
                setIsClient(false);
                return;
            }

            // Logic: Advisor domains = Advisor (isClient = false)
            // All other emails = Client (isClient = true)
            // We use the same centralized check as DashboardLayout
            const { isAdvisorEmail } = await import('../utils/authUtils');
            const forceClientView = searchParams.get('view') === 'client';

            const clientStatus = !(isAdvisorEmail(user.email) && !forceClientView);
            setIsClient(clientStatus);

            // Log access
            if (clientStatus && !hasLoggedAccess) {
                const { activityService } = await import('../services/activityService');
                activityService.logActivity(user.uid, 'login', 'Zalogowano do panelu klienta');
                setHasLoggedAccess(true);
            }
        };

        checkRole();
    }, [user, loading, hasLoggedAccess]);

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Ładowanie...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (isClient === null) {
        return <div className="p-8 text-center text-gray-500">Weryfikacja uprawnień...</div>;
    }

    // Client View Logic
    const clientStep = searchParams.get('step') || 'offers';

    return (
        <DashboardLayout>
            <Routes>
                <Route path="/" element={
                    isClient && !forceAdvisorView ? (
                        <>
                            {clientStep === 'purpose' ? (
                                <ClientPurpose />
                            ) : clientStep === 'parameters' ? (
                                <ClientParameters />
                            ) : clientStep === 'income' ? (
                                <ClientIncome />
                            ) : clientStep === 'offers' ? (
                                <ClientOffers />
                            ) : clientStep === 'documents' ? (
                                <ClientDocuments />
                            ) : clientStep === 'application' ? (
                                <ClientApplication />
                            ) : (
                                <ClientOffers />
                            )}
                        </>
                    ) : (
                        <>
                            <DashboardStats />
                            <ClientList />
                        </>
                    )
                } />
                <Route path="/applications" element={<KanbanBoard />} />
                <Route path="/applications/:id" element={<ApplicationDetails />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/offers-manager" element={<AdminOffersManager />} />
                <Route path="/settings" element={<SettingsPage />} />
            </Routes>
        </DashboardLayout>
    );
};
