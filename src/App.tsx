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
import { SignInScreen } from './components/SignInScreen';
import { SignUpScreen } from './components/SignUpScreen';
import { FloatingAuthModal } from './components/FloatingAuthModal';
import { PropertyDetailModal } from './components/PropertyDetailModal';
import { ConsultationModal } from './components/ConsultationModal';

function AppContent() {
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('home');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [consultationPreselectedProperty, setConsultationPreselectedProperty] = useState<Property | null>(null);

  // Floating Auth Modal State (Full-length floating modal over the website)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');

  // Search Screen Header Nav Bar Visibility Toggle
  const [isHeaderNavHidden, setIsHeaderNavHidden] = useState(false);

  const [searchFilters, setSearchFilters] = useState<{
    location: string;
    priceRange: string;
    propertyType: string;
  }>({
    location: 'Kigali, Rwanda',
    priceRange: '$200k - $500k',
    propertyType: 'Villa',
  });

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

  const handleOpenAuth = (mode: 'signin' | 'signup' = 'signin') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
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

  const isAuthScreen = activeScreen === 'signin' || activeScreen === 'signup';
  const shouldHideNavbar = !isAuthScreen && (activeScreen === 'properties' && isHeaderNavHidden);

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-['Inter'] text-[#191c1d] flex flex-col selection:bg-[#00236f] selection:text-white">
      {/* Top Navigation Bar */}
      {!isAuthScreen && !shouldHideNavbar && (
        <Navbar
          activeScreen={activeScreen}
          onNavigate={handleNavigate}
          onOpenConsultation={handleOpenGeneralConsultation}
          onOpenAuth={handleOpenAuth}
          isHeaderNavHidden={isHeaderNavHidden}
          onToggleHeaderNav={() => setIsHeaderNavHidden((prev) => !prev)}
        />
      )}

      {/* Floating Restore Nav Button (Visible when header nav is hidden on the search page) */}
      {shouldHideNavbar && (
        <button
          onClick={() => setIsHeaderNavHidden(false)}
          className="fixed top-3 right-6 z-50 bg-white/95 backdrop-blur-md text-[#00236f] hover:bg-[#00236f] hover:text-white px-4 py-2 rounded-full text-xs font-bold shadow-xl border border-[#00236f]/20 flex items-center gap-1.5 cursor-pointer transition-all hover:scale-105 active:scale-95 animate-in fade-in duration-200"
          title="Restore top navigation bar"
        >
          <span className="material-symbols-outlined text-base">expand_more</span>
          <span>Show Navigation Bar</span>
        </button>
      )}

      {/* Main Content Area */}
      <main className={`flex-grow ${!isAuthScreen && !shouldHideNavbar ? 'pt-20' : 'pt-0'}`}>
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
            onNavigate={handleNavigate}
            onOpenConsultation={handleOpenGeneralConsultation}
            isHeaderNavHidden={isHeaderNavHidden}
            onToggleHeaderNav={() => setIsHeaderNavHidden((prev) => !prev)}
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

        {/* Fallback Full-Length view if directly accessed */}
        {activeScreen === 'signin' && (
          <SignInScreen
            onNavigateToSignUp={() => handleNavigate('signup')}
            onNavigateToHome={() => handleNavigate('home')}
          />
        )}

        {activeScreen === 'signup' && (
          <SignUpScreen
            onNavigateToSignIn={() => handleNavigate('signin')}
            onNavigateToHome={() => handleNavigate('home')}
          />
        )}
      </main>

      {/* Footer */}
      {!isAuthScreen && (
        <Footer
          onNavigate={handleNavigate}
          onOpenConsultation={handleOpenGeneralConsultation}
        />
      )}

      {/* FLOATING BUT FULL-LENGTH SIGN IN & SIGN UP MODAL */}
      <FloatingAuthModal
        key={authModalMode}
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
