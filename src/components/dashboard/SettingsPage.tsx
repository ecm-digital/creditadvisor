import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import './SettingsPage.css';

export const SettingsPage: React.FC = () => {
    const { showToast } = useToast();
    const { user } = useAuth();

    // Simple role detection for debug
    const isClient = user?.email?.indexOf('@kredyt.pl') !== -1;

    const [profile, setProfile] = useState({
        name: user?.displayName || 'Jan Kowalski',
        email: user?.email || 'jan.kowalski@creditadvisor.com',
        phone: '+48 123 456 789',
    });

    const [notifications, setNotifications] = useState({
        email: true,
        sms: false,
        marketing: false,
    });

    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setNotifications(prev => ({ ...prev, [name]: checked }));
    };

    const handleSave = () => {
        // Mock save
        showToast('Ustawienia zostały zapisane.', 'success');
    };

    return (
        <div className="settings-container">
            <h2 className="settings-title">Ustawienia Konta</h2>

            {/* Debug Section */}
            <div className="bg-gray-100 p-4 mb-6 rounded border border-gray-200">
                <h3 className="text-sm font-bold text-gray-500 uppercase mb-2">Debug Info (Tylko dla administratora)</h3>
                <div className="text-sm font-mono">
                    <div>User ID: {user?.uid}</div>
                    <div>Email: {user?.email}</div>
                    <div>Is Client: {isClient ? 'TAK' : 'NIE'}</div>
                    <div className="text-xs text-gray-400 mt-1">Jeśli jesteś klientem a widzisz "NIE", skontaktuj się ze wsparciem.</div>
                </div>
            </div>

            <div className="settings-section">
                <h3 className="section-header">Profil Doradcy</h3>
                <div className="form-group">
                    <label htmlFor="name">Imię i nazwisko</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={profile.name}
                        onChange={handleProfileChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Adres email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={profile.email}
                        onChange={handleProfileChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="phone">Telefon</label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={profile.phone}
                        onChange={handleProfileChange}
                    />
                </div>
            </div>

            <div className="settings-section">
                <h3 className="section-header">Bezpieczeństwo</h3>
                <div className="form-group">
                    <label htmlFor="current-password">Obecne hasło</label>
                    <input type="password" id="current-password" placeholder="••••••••" />
                </div>
                <div className="form-group">
                    <label htmlFor="new-password">Nowe hasło</label>
                    <input type="password" id="new-password" placeholder="••••••••" />
                </div>
                <div className="form-group">
                    <label htmlFor="confirm-password">Potwierdź nowe hasło</label>
                    <input type="password" id="confirm-password" placeholder="••••••••" />
                </div>
            </div>

            <div className="settings-section">
                <h3 className="section-header">Powiadomienia</h3>
                <div className="checkbox-group">
                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            name="email"
                            checked={notifications.email}
                            onChange={handleNotificationChange}
                        />
                        Powiadomienia email o nowych wnioskach
                    </label>
                </div>
                <div className="checkbox-group">
                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            name="sms"
                            checked={notifications.sms}
                            onChange={handleNotificationChange}
                        />
                        Powiadomienia SMS o pilnych sprawach
                    </label>
                </div>
                <div className="checkbox-group">
                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            name="marketing"
                            checked={notifications.marketing}
                            onChange={handleNotificationChange}
                        />
                        Newsletter marketingowy
                    </label>
                </div>
            </div>

            <div className="settings-actions">
                <Button onClick={handleSave} size="lg">Zapisz zmiany</Button>
                <Button variant="ghost" size="lg">Anuluj</Button>
            </div>
        </div>
    );
};
