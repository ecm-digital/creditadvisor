import React from 'react';
import { Header } from '../components/layout/Header';
import { Hero } from '../components/landing/Hero';
import { Features } from '../components/landing/Features';
import { Process } from '../components/landing/Process';
import { Testimonials } from '../components/landing/Testimonials';
import { LeadMagnet } from '../components/landing/LeadMagnet';
import { CreditConfigurator } from '../components/calculator/CreditConfigurator';
import { FAQ } from '../components/landing/FAQ';
import { LeadForm } from '../components/landing/LeadForm';
import { Footer } from '../components/layout/Footer';

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

                <section id="calculator" style={{ padding: '4rem 1rem', background: '#f8fafc' }}>
                    <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#1a202c' }}>
                                Stwórz ranking kredytów
                            </h2>
                            <p style={{ fontSize: '1.2rem', color: '#718096' }}>
                                Wybierz cel i dowiedz się, na co Cię stać
                            </p>
                        </div>
                        <CreditConfigurator />
                    </div>
                </section>

                <FAQ />
                <LeadForm />
            </main>
            <Footer />
        </div>
    );
};
