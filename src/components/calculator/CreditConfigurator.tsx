import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
    Home,
    Hammer,
    PaintRoller,
    ArrowLeftRight,
    Wallet,
    Merge,
    Banknote,
    ChevronRight,
    User,
    Bot,
    Undo2,
    Play
} from 'lucide-react';
import './CreditConfigurator.css';

type ConfigStep = 'purpose' | 'amount' | 'details' | 'contact';

interface CreditConfiguratorProps {
    onComplete?: () => void;
}

export const CreditConfigurator: React.FC<CreditConfiguratorProps> = ({ onComplete }) => {
    const { signUp, sendLoginCode } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();

    // Config State
    const [step, setStep] = useState<ConfigStep>('purpose');
    const [purpose, setPurpose] = useState<string>('');
    const [amount, setAmount] = useState<number>(300000);
    const [period, setPeriod] = useState<number>(25);
    const [age, setAge] = useState<number>(30);
    const [incomeType, setIncomeType] = useState<string>('');

    // Form State
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [consent, setConsent] = useState(false);
    const [loading, setLoading] = useState(false);

    const purposes = [
        { id: 'buy', label: 'Kupić', icon: <Home strokeWidth={1.5} size={32} /> },
        { id: 'build', label: 'Wybudować dom', icon: <Hammer strokeWidth={1.5} size={32} /> },
        { id: 'renovate', label: 'Wyremontować', icon: <PaintRoller strokeWidth={1.5} size={32} /> },
        { id: 'refinance', label: 'Refinansować kredyt', icon: <ArrowLeftRight strokeWidth={1.5} size={32} /> },
        { id: 'recover', label: 'Odzyskać środki', icon: <Wallet strokeWidth={1.5} size={32} /> },
        { id: 'consolidate', label: 'Skonsolidować', icon: <Merge strokeWidth={1.5} size={32} /> },
        { id: 'cash', label: 'Środki na dowolny cel', icon: <Banknote strokeWidth={1.5} size={32} /> },
    ];

    const incomeTypes = [
        { value: 'uop', label: 'Umowa o pracę' },
        { value: 'b2b', label: 'Działalność gospodarcza (B2B)' },
        { value: 'uz', label: 'Umowa zlecenie/o dzieło' },
        { value: 'other', label: 'Inne' }
    ];

    const handlePurposeSelect = (id: string) => {
        setPurpose(id);
        setTimeout(() => setStep('amount'), 300);
    };

    const formatMoney = (val: number) => val.toLocaleString('pl-PL') + ' zł';

    const getPurposeLabel = () => purposes.find(p => p.id === purpose)?.label || 'nowy dom';

    // Calculate estimated installments for the lead magnet text
    const calculateInstallmentRange = () => {
        const rMin = 0.065 / 12; // 6.5% min
        const rMax = 0.085 / 12; // 8.5% max
        const n = period * 12;

        const pmtMin = amount * rMin * (Math.pow(1 + rMin, n)) / (Math.pow(1 + rMin, n) - 1);
        const pmtMax = amount * rMax * (Math.pow(1 + rMax, n)) / (Math.pow(1 + rMax, n) - 1);

        return {
            min: pmtMin.toLocaleString('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            max: pmtMax.toLocaleString('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        };
    };



    const handleLeadSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 1. Prepare Data
            const cleanPhone = phone.replace(/\D/g, '');
            // We use a dummy email for the initial record creation, but the user logs in via SMS code + phone
            // OR if we want to be clean, we just create the record and then rely on phone auth.
            // The current auth context 'signUp' uses createUserWithEmailAndPassword.
            // For SMS auth, we don't strictly NEED a firebase auth user created via email/password here,
            // BUT our architecture likely expects it for the 'clients' collection 'user_id' field.
            // HOWEVER, the SMS login flow creates a Custom Token based on UID found in 'clients' collection.
            // So we DO need to make sure a client record exists.

            // Wait, requestSmsCode checks if user exists in 'clients' to send code?
            // "115: // 1. Check if user exists in 'clients' collection"
            // "120: if (snapshot.empty) ... "
            // So we MUST create the client record first.

            // Since we are moving to Phone Auth, we might still generate a dummy email/password for the 'signUp' function
            // just to populate the Firestore record, or we should update 'signUp' to not require auth creation if irrelevant.
            // But let's stick to the current working 'signUp' which creates a generic user + firestore doc.

            const dummyPassword = Math.floor(100000 + Math.random() * 900000).toString(); // Still needed for createUserWithEmailAndPassword internal call
            // Fix: Use unique email to avoid "email-already-in-use" if Auth user exists but Firestore doc was deleted.
            // This ensures we always create a fresh Auth user and fresh Firestore record.
            const dummyEmail = `${cleanPhone}_${Date.now()}@kredyt.pl`;

            // 2. Create User Record (so requestSmsCode finds it)
            // Note: If user already exists, signUp handles it fairly gracefully (we treat as success).
            // We pass the rich data here.
            // 2. Create User Record
            const signUpResult = await signUp(dummyEmail, dummyPassword, name, cleanPhone, {
                purpose,
                amount,
                period,
                age,
                incomeType
            });

            if (signUpResult.error) {
                // If it's not "email-already-in-use", it's a real error
                const errCode = signUpResult.error.code || '';
                if (errCode !== 'auth/email-already-in-use') {
                    showToast(`Błąd tworzenia konta: ${signUpResult.error.message}`, 'error');
                    setLoading(false);
                    return;
                }
                // If exists, we proceed to try logging in via SMS
            }

            // 3. Send SMS Code
            // Try clean phone first
            let smsResult = await sendLoginCode(cleanPhone);

            // If failed, and we suspect user exists with raw phone, try raw phone?
            if (!smsResult.success) {
                console.warn("SMS failed for cleanPhone, trying raw phone", smsResult.error);
                if (cleanPhone !== phone.trim()) {
                    const retryResult = await sendLoginCode(phone.trim());
                    if (retryResult.success) {
                        smsResult = retryResult;
                    }
                }
            }

            if (smsResult.success) {
                // 4. Show Notification
                showToast('Wniosek przyjęty! Kod SMS został wysłany.', 'success');

                // 5. Redirect to Login
                setTimeout(() => {
                    if (onComplete) onComplete();
                    navigate('/login', { state: { phone: cleanPhone, codeSent: true } });
                }, 1000);
            } else {
                console.error("SMS Error", smsResult.error);
                const errorMsg = typeof smsResult.error === 'object' ? JSON.stringify(smsResult.error) : String(smsResult.error);
                showToast(`Nie udało się wysłać SMS. Błąd: ${errorMsg}`, 'error');
            }

        } catch (err) {
            console.error(err);
            showToast('Wystąpił nieoczekiwany błąd.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const { min: minInst, max: maxInst } = calculateInstallmentRange();

    return (
        <div className="configurator-container">
            {/* Conversation History / Summaries */}
            <div className="chat-flow">
                {step !== 'purpose' && (
                    <div className="chat-bubble user fade-in">
                        <div className="bubble-avatar user">
                            <User size={20} />
                        </div>
                        <div className="bubble-content">
                            <p>Chcę <strong>{getPurposeLabel().toLowerCase()}</strong>. <span className="link-action" onClick={() => setStep('purpose')}>Zmień cel...</span></p>
                        </div>
                    </div>
                )}

                {(step === 'details' || step === 'contact') && (
                    <div className="chat-bubble user fade-in delay-1">
                        <div className="bubble-avatar user">
                            <User size={20} />
                        </div>
                        <div className="bubble-content">
                            <p>
                                Na inwestycję o wartości <strong>800 000 zł</strong> potrzebuję kredyt w wysokości <strong>{formatMoney(amount)}</strong> na <strong>{period} lat</strong>.
                                <span className="link-action" onClick={() => setStep('amount')}> Zmień...</span>
                            </p>
                        </div>
                    </div>
                )}

                {step === 'contact' && (
                    <div className="chat-bubble user fade-in delay-2">
                        <div className="bubble-avatar user">
                            <User size={20} />
                        </div>
                        <div className="bubble-content">
                            <p>Mam <strong>{age} lat</strong> i moim źródłem dochodu jest <strong>{incomeTypes.find(t => t.value === incomeType)?.label.toLowerCase() || 'inne'}</strong>. <span className="link-action" onClick={() => setStep('details')}>Edytuj...</span></p>
                        </div>
                    </div>
                )}
            </div>

            {/* Active Step Content */}
            <div className="step-content">
                {step === 'purpose' && (
                    <div className="fade-in">
                        <h2 className="configurator-title">Jaki jest Twój cel?</h2>
                        <p className="configurator-subtitle">Wybierz na co chcesz przeznaczyć środki</p>
                        <div className="purpose-grid">
                            {purposes.map((p) => (
                                <button
                                    key={p.id}
                                    className={`purpose-card ${purpose === p.id ? 'active' : ''}`}
                                    onClick={() => handlePurposeSelect(p.id)}
                                >
                                    <div className="purpose-icon-wrapper">
                                        {p.icon}
                                    </div>
                                    <span className="purpose-label">{p.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {step === 'amount' && (
                    <div className="configurator-form fade-in">
                        <h2 className="configurator-title">Ile potrzebujesz?</h2>
                        <p className="configurator-subtitle">Określ parametry finansowania</p>

                        <div className="slider-group">
                            <label>Kwota kredytu: <strong>{formatMoney(amount)}</strong></label>
                            <input
                                type="range"
                                min="10000"
                                max="2000000"
                                step="10000"
                                value={amount}
                                onChange={(e) => setAmount(Number(e.target.value))}
                                className="styled-slider"
                            />
                        </div>

                        <div className="slider-group">
                            <label>Okres kredytowania: <strong>{period} lat</strong></label>
                            <input
                                type="range"
                                min="5"
                                max="35"
                                step="1"
                                value={period}
                                onChange={(e) => setPeriod(Number(e.target.value))}
                                className="styled-slider"
                            />
                        </div>

                        <div className="step-actions right">
                            <Button variant="primary" onClick={() => setStep('details')}>
                                <Play size={16} fill="currentColor" /> Chcę podać dane kredytobiorców
                            </Button>
                        </div>
                    </div>
                )}

                {step === 'details' && (
                    <div className="configurator-form fade-in">
                        <div className="details-form">
                            <div className="chat-bubble agent fade-in mb-6">
                                <div className="bubble-avatar agent">
                                    <Bot size={20} />
                                </div>
                                <div className="bubble-content">
                                    <p>Podaj swój wiek. Jeżeli chcesz przystąpić do kredytu z innymi osobami, podaj wiek najstarszego kredytobiorcy. Wybierz także źródło dochodu.</p>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Wiek najstarszego kredytobiorcy</label>
                                <input
                                    type="number"
                                    value={age}
                                    onChange={(e) => setAge(Number(e.target.value))}
                                    className="config-input"
                                />
                            </div>

                            <div className="form-group">
                                <label>Wybierz rodzaj dochodu</label>
                                <select
                                    value={incomeType}
                                    onChange={(e) => setIncomeType(e.target.value)}
                                    className="config-input"
                                >
                                    <option value="" disabled>Wybierz...</option>
                                    {incomeTypes.map(t => (
                                        <option key={t.value} value={t.value}>{t.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="step-actions">
                                <Button variant="ghost" onClick={() => setStep('amount')} className="btn-back">
                                    <Undo2 size={16} /> Cofnij
                                </Button>
                                <Button
                                    variant="primary"
                                    className="btn-orange"
                                    onClick={() => setStep('contact')}
                                    disabled={!incomeType}
                                >
                                    Kwota ma pasować do zdolności <ChevronRight size={16} />
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {step === 'contact' && (
                    <div className="configurator-form fade-in">
                        <div className="lead-capture-card">
                            <h3 className="lead-card-title">Uzyskaj dostęp do ofert</h3>
                            <div className="lead-card-divider"></div>

                            <form className="lead-form-inner" onSubmit={handleLeadSubmit}>
                                <div className="input-row">
                                    <input
                                        type="text"
                                        placeholder="imię i nazwisko"
                                        className="config-input centered-placeholder"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                        disabled={loading}
                                    />
                                </div>

                                <p className="lead-context-text">
                                    Pobierz na swój telefon <strong>darmowy kod dostępu</strong> do <strong>21 ofert</strong> z ratą od <strong>{minInst} PLN</strong> do <strong>{maxInst} PLN</strong>.
                                </p>

                                <div className="input-row has-icon">
                                    <div className="input-icon">
                                        {/* Restored Phone Icon inline since import was removed */}
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
                                            <line x1="12" y1="18" x2="12.01" y2="18"></line>
                                        </svg>
                                    </div>
                                    <input
                                        type="tel"
                                        placeholder="numer telefonu"
                                        className="config-input with-icon huge-text"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        required
                                        disabled={loading}
                                    />
                                </div>

                                <div className="consent-row">
                                    <label className="checkbox-container">
                                        <input
                                            type="checkbox"
                                            checked={consent}
                                            onChange={(e) => setConsent(e.target.checked)}
                                            required
                                            disabled={loading}
                                        />
                                        <span className="checkmark"></span>
                                    </label>
                                    <span className="consent-text">
                                        Wyrażam zgodę na <a href="#">przetwarzanie danych osobowych</a> i akceptuję <a href="#">Regulamin</a> portalu.
                                    </span>
                                </div>

                                <Button
                                    variant="primary"
                                    size="lg"
                                    fullWidth
                                    className="btn-orange btn-lead-submit"
                                    disabled={!consent || !phone || !name || loading}
                                >
                                    {loading ? 'Wysyłanie...' : 'Zaloguj się do swojego konta'}
                                </Button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
