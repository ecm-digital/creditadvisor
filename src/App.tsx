import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { LoginPage } from './pages/LoginPage';
import { AdvisorPage } from './pages/AdvisorPage';
import { RegisterPage } from './pages/RegisterPage';
import { ClientPortalPage } from './pages/ClientPortalPage';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { offerService } from './services/offerService';
import './App.css';

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/doradca/*" element={<AdvisorPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/dashboard/*" element={<DashboardPage />} />
            <Route path="/client-portal" element={<ClientPortalPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        </Routes>
    );
}

function App() {
    useEffect(() => {
        // Automatically seed initial offers if the database is empty
        // This ensures new deployments have sample data for calculations immediately
        offerService.seedInitialOffers().catch(console.error);
    }, []);

    return (
        <AuthProvider>
            <ToastProvider>
                <Router>
                    <AppRoutes />
                </Router>
            </ToastProvider>
        </AuthProvider>
    );
}

export default App;
