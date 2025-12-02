import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { LoginPage } from './pages/LoginPage';
import { ClientPortalPage } from './pages/ClientPortalPage';
import { ToastProvider } from './context/ToastContext';
import './App.css';

function App() {
  return (
    <ToastProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard/*" element={<DashboardPage />} />
          <Route path="/client-portal" element={<ClientPortalPage />} />
        </Routes>
      </Router>
    </ToastProvider>
  );
}

export default App;
