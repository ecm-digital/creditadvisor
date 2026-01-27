import React from 'react';
import { Header } from '../components/layout/Header';
import { Hero } from '../components/landing/Hero';
import { Features } from '../components/landing/Features';
import { Process } from '../components/landing/Process';
import { Testimonials } from '../components/landing/Testimonials';
import { LeadMagnet } from '../components/landing/LeadMagnet';
import { CreditCalculator } from '../components/calculator/CreditCalculator';
import { FAQ } from '../components/landing/FAQ';
import { LeadForm } from '../components/landing/LeadForm';

export const LandingPage: React.FC = () => {
    return (
        <div className="landing-page">
            <Header />
            <main>
                <Hero />
                <Features />
                <Process />
                <Testimonials />
                <LeadMagnet />
                <CreditCalculator />
                <FAQ />
                <LeadForm />
            </main>
        </div>
    );
};
