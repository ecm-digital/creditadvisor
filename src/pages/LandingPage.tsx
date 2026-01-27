import React from 'react';
import { Header } from '../components/layout/Header';
import { Hero } from '../components/landing/Hero';
import { Features } from '../components/landing/Features';
import { Testimonials } from '../components/landing/Testimonials';
import { LeadMagnet } from '../components/landing/LeadMagnet';
import { LeadForm } from '../components/landing/LeadForm';
import { CreditCalculator } from '../components/calculator/CreditCalculator';

export const LandingPage: React.FC = () => {
    return (
        <div className="landing-page">
            <Header />
            <main>
                <Hero />
                <Features />
                <Testimonials />
                <LeadMagnet />
                <CreditCalculator />
                <LeadForm />
            </main>
        </div>
    );
};
