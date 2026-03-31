import React from 'react';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import StatsSection from '../components/StatsSection';
import CategoriesChips from '../components/CategoriesChips';
import FeaturesSection from '../components/FeaturesSection';
import Footer from '../components/Footer';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white font-sans antialiased overflow-x-hidden selection:bg-brand-pink/30 selection:text-brand-navy">
      <Header />
      <main>
        <HeroSection />
        <StatsSection />
        <CategoriesChips />
        <FeaturesSection />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
