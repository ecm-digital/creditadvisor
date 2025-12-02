import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { ClientList } from '../components/dashboard/ClientList';
import { KanbanBoard } from '../components/dashboard/KanbanBoard';
import { ApplicationDetails } from '../components/dashboard/ApplicationDetails';
import { Calendar } from '../components/dashboard/Calendar';
import { SettingsPage } from '../components/dashboard/SettingsPage';

import { DashboardStats } from '../components/dashboard/DashboardStats';

export const DashboardPage: React.FC = () => {
    return (
        <DashboardLayout>
            <Routes>
                <Route path="/" element={
                    <>
                        <DashboardStats />
                        <ClientList />
                    </>
                } />
                <Route path="/applications" element={<KanbanBoard />} />
                <Route path="/applications/:id" element={<ApplicationDetails />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/settings" element={<SettingsPage />} />
            </Routes>
        </DashboardLayout>
    );
};
