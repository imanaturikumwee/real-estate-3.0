import React, { useState } from 'react';
import { ActiveScreen, Property } from './types';
import { PROPERTIES } from './data/properties';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { FeaturedEstates } from './components/FeaturedEstates';
import { AiRecommendations } from './components/AiRecommendations';
import { CtaSection } from './components/CtaSection';
import { Footer } from './components/Footer';
import { PropertiesScreen } from './components/PropertiesScreen';
import { InvestScreen } from './components/InvestScreen';
import { AboutScreen } from './components/AboutScreen';
import { ContactScreen } from './components/ContactScreen';
import { PropertyDetailModal } from './components/PropertyDetailModal';
import { ConsultationModal } from './components/ConsultationModal';
import { FloatingAuthModal } from './components/FloatingAuthModal';

function AppContent() {
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('home');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [consultationPreselectedProperty, setConsultationPreselectedProperty] = useState<Property | null>(null);

  // Floating Auth Modal State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');

  const [searchFilters, setSearchFilters] = useState<{
    location: string;
    priceRange: string;
    propertyType: string;
  }>({
    location: 'Kigali, Rwanda',
    priceRange: '$200k - $500k',
    propertyType: 'Villa',
  });

  const handleOpenAuth = (mode: 'signin' | 'signup' = 'signin') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleSearchFromHero = (filters: {
    location: string;
    priceRange: string;
    propertyType: string;
  }) => {
    setSearchFilters(filters);
    setActiveScreen('properties');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProperty = (property: Property) => {
    setSelectedProperty(property);
  };

  const handleBookTourFromProperty = (property: Property) => {
    setConsultationPreselectedProperty(property);
    setIsConsultationOpen(true);
  };

  const handleOpenGeneralConsultation = () => {
    setConsultationPreselectedProperty(null);
    setIsConsultationOpen(true);
  };

  const handleNavigate = (screen: ActiveScreen) => {
    if (screen === 'signin') {
      handleOpenAuth('signin');
      return;
    }
    if (screen === 'signup') {
      handleOpenAuth('signup');
      return;
    }
    setActiveScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-['Inter'] text-[#191c1d] flex flex-col selection:bg-[#00236f] selection:text-white">
      {/* Top Navigation Bar with unified Sign In / Sign Up icon button */}
      <Navbar
        activeScreen={activeScreen}
        onNavigate={handleNavigate}
        onOpenConsultation={handleOpenGeneralConsultation}
        onOpenAuth={handleOpenAuth}
      />

      {/* Main Content Area */}
      <main className="pt-20 flex-grow">
        {activeScreen === 'home' && (
          <>
            {/* Hero Section */}
            <HeroSection
              onSearch={handleSearchFromHero}
              onExploreCatalog={() => handleNavigate('properties')}
            />

            {/* Featured Estates Horizontal Snap Section */}
            <FeaturedEstates
              properties={PROPERTIES}
              onSelectProperty={handleSelectProperty}
              onViewAll={() => handleNavigate('properties')}
            />

            {/* AI Recommendations Section */}
            <AiRecommendations
              properties={PROPERTIES}
              onSelectProperty={handleSelectProperty}
            />

            {/* Direct Contact CTA Section */}
            <CtaSection
              onBookConsultation={handleOpenGeneralConsultation}
              onSearchAll={() => handleNavigate('properties')}
              onDirectContact={() => handleNavigate('contact')}
            />
          </>
        )}

        {activeScreen === 'properties' && (
          <PropertiesScreen
            properties={PROPERTIES}
            onSelectProperty={handleSelectProperty}
            onBookTour={handleBookTourFromProperty}
            initialFilters={searchFilters}
          />
        )}

        {activeScreen === 'invest' && (
          <InvestScreen
            onOpenConsultation={handleOpenGeneralConsultation}
            onExploreProperties={() => handleNavigate('properties')}
          />
        )}

        {activeScreen === 'about' && (
          <AboutScreen
            onOpenConsultation={handleOpenGeneralConsultation}
            onExploreProperties={() => handleNavigate('properties')}
          />
        )}

        {activeScreen === 'contact' && <ContactScreen />}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenConsultation={handleOpenGeneralConsultation}
      />

      {/* Floating Sign In / Sign Up Modal matching the user's attachment */}
      <FloatingAuthModal
        key={`${isAuthModalOpen ? 'open' : 'closed'}-${authModalMode}`}
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
      />

      {/* Property Details Modal */}
      <PropertyDetailModal
        property={selectedProperty}
        onClose={() => setSelectedProperty(null)}
        onBookTour={handleBookTourFromProperty}
      />

      {/* Booking / Consultation Modal */}
      <ConsultationModal
        isOpen={isConsultationOpen}
        onClose={() => setIsConsultationOpen(false)}
        selectedProperty={consultationPreselectedProperty}
        properties={PROPERTIES}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
