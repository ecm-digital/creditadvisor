import React from 'react';
import { Target, Settings, Wallet, Scale, FileText, FileSignature, CheckCircle2 } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import './ClientProcessSidebar.css';

interface Step {
    id: string;
    label: string;
    icon: React.ElementType;
    color: string;
}

export const ClientProcessSidebar: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const currentStepId = searchParams.get('step') || 'offers';

    const steps: Step[] = [
        { id: 'purpose', label: 'Cel kredytu', icon: Target, color: '#f97316' },
        { id: 'parameters', label: 'Parametry kredytu', icon: Settings, color: '#ec4899' },
        { id: 'income', label: 'Dochody', icon: Wallet, color: '#a855f7' },
        { id: 'offers', label: 'Oferty', icon: Scale, color: '#3b82f6' },
        { id: 'documents', label: 'Dokumenty', icon: FileText, color: '#84cc16' },
        { id: 'application', label: 'Wniosek', icon: FileSignature, color: '#14b8a6' }
    ];

    const currentStepIndex = steps.findIndex(s => s.id === currentStepId);

    const handleStepClick = (id: string) => {
        setSearchParams({ step: id });
    };

    return (
        <div className="process-sidebar-v2">
            <h3 className="section-title">Twój proces</h3>

            <div className="steps-container">
                {steps.map((step, index) => {
                    const isCompleted = index < 3 || index < currentStepIndex;
                    const isActive = step.id === currentStepId;
                    const Icon = step.icon;

                    return (
                        <div
                            key={step.id}
                            className={`step-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                            onClick={() => handleStepClick(step.id)}
                        >
                            <div className="step-point-wrapper">
                                <div className="step-circle" style={{ '--step-color': step.color } as React.CSSProperties}>
                                    {isCompleted ? <CheckCircle2 size={16} /> : <Icon size={18} />}
                                </div>
                                {index < steps.length - 1 && <div className="step-line" />}
                            </div>

                            <div className="step-info">
                                <span className="step-label">{step.label}</span>
                                {isActive && <span className="step-status">W toku</span>}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
