import React, { useState, useEffect } from 'react';
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
import { TenantDashboard } from './components/TenantDashboard';
import { HousesScreen } from './components/HousesScreen';
import { HousesForSaleScreen } from './components/HousesForSaleScreen';
import { ApartmentsScreen } from './components/ApartmentsScreen';
import { LandScreen } from './components/LandScreen';
import { InvestmentsScreen } from './components/InvestmentsScreen';
import { ListPropertyModal } from './components/ListPropertyModal';
import { FloatingAuthModal } from './components/FloatingAuthModal';
import { PropertyDetailModal } from './components/PropertyDetailModal';
import { ConsultationModal } from './components/ConsultationModal';

const pathToScreen = (path: string): ActiveScreen => {
  const cleanPath = path.toLowerCase().replace(/\/+$/, '') || '/';
  if (cleanPath === '/portal' || cleanPath === '/tenant-dashboard' || cleanPath === '/dashboard') {
    return 'tenant-dashboard';
  }
  if (cleanPath === '/houses-for-sale' || cleanPath === '/sale') {
    return 'houses-for-sale';
  }
  if (cleanPath === '/houses' || cleanPath === '/rentals') {
    return 'houses';
  }
  if (cleanPath === '/apartments') {
    return 'apartments';
  }
  if (cleanPath === '/land') {
    return 'land';
  }
  if (cleanPath === '/investments') {
    return 'investments';
  }
  if (cleanPath === '/properties') {
    return 'properties';
  }
  if (cleanPath === '/invest') {
    return 'invest';
  }
  if (cleanPath === '/about') {
    return 'about';
  }
  if (cleanPath === '/contact') {
    return 'contact';
  }
  return 'home';
};

const getInitialScreen = (): ActiveScreen => {
  if (typeof window === 'undefined') return 'home';
  const urlParams = new URLSearchParams(window.location.search);
  const screenParam = urlParams.get('screen');
  if (screenParam === 'portal' || screenParam === 'tenant-dashboard') return 'tenant-dashboard';
  if (
    screenParam &&
    ['houses', 'houses-for-sale', 'apartments', 'land', 'investments', 'properties', 'invest', 'about', 'contact'].includes(
      screenParam
    )
  ) {
    return screenParam as ActiveScreen;
  }
  return pathToScreen(window.location.pathname);
};

const screenToPath = (screen: ActiveScreen): string => {
  switch (screen) {
    case 'tenant-dashboard':
      return '/portal';
    case 'houses':
      return '/houses';
    case 'houses-for-sale':
      return '/houses-for-sale';
    case 'apartments':
      return '/apartments';
    case 'land':
      return '/land';
    case 'investments':
      return '/investments';
    case 'properties':
      return '/properties';
    case 'invest':
      return '/invest';
    case 'about':
      return '/about';
    case 'contact':
      return '/contact';
    case 'home':
    default:
      return '/';
  }
};

function AppContent() {
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>(getInitialScreen);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [consultationPreselectedProperty, setConsultationPreselectedProperty] = useState<Property | null>(null);
  const [isListPropertyOpen, setIsListPropertyOpen] = useState(false);

  // Floating Auth Modal State (Full-length floating modal over the website)
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

  // Synchronize browser history and title
  useEffect(() => {
    const handlePopState = () => {
      setActiveScreen(getInitialScreen());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    if (activeScreen === 'tenant-dashboard') {
      document.title = 'Tenant & Buyer Portal | Emma & Dany Luxury Realty Kigali';
    } else if (activeScreen === 'apartments') {
      document.title = 'Luxury Apartments in Kigali | Emma & Dany';
    } else if (activeScreen === 'houses-for-sale') {
      document.title = 'Houses for Sale in Kigali | Emma & Dany';
    } else if (activeScreen === 'houses') {
      document.title = 'Rental Houses & Estates | Emma & Dany';
    } else if (activeScreen === 'land') {
      document.title = 'Prime Land & Strategic Plots | Emma & Dany';
    } else if (activeScreen === 'investments') {
      document.title = 'Investments Marketplace | Emma & Dany';
    } else {
      document.title = 'Emma & Dany | Architectural Real Estate in Kigali, Rwanda';
    }
  }, [activeScreen]);

  const handleSearchFromHero = (filters: {
    location: string;
    priceRange: string;
    propertyType: string;
  }) => {
    setSearchFilters(filters);
    handleNavigate('properties');
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

  const handleNavigate = (screen: ActiveScreen, updateHistory = true) => {
    if (screen === 'signin') {
      handleOpenAuth('signin');
      return;
    }
    if (screen === 'signup') {
      handleOpenAuth('signup');
      return;
    }
    setActiveScreen(screen);
    if (updateHistory && typeof window !== 'undefined') {
      const newPath = screenToPath(screen);
      if (window.location.pathname !== newPath) {
        window.history.pushState({ screen }, '', newPath);
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isAuthScreen = activeScreen === 'signin' || activeScreen === 'signup';
  const isPortalScreen = activeScreen === 'tenant-dashboard';

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-['Inter'] text-[#191c1d] flex flex-col selection:bg-[#00236f] selection:text-white">
      {/* Top Fixed Navigation Bar */}
      {!isAuthScreen && !isPortalScreen && (
        <Navbar
          activeScreen={activeScreen}
          onNavigate={handleNavigate}
          onOpenConsultation={handleOpenGeneralConsultation}
          onOpenAuth={handleOpenAuth}
          onOpenListProperty={() => setIsListPropertyOpen(true)}
        />
      )}

      {/* Main Content Area (pt-20 for fixed 80px navbar) */}
      <main className={`flex-grow ${!isAuthScreen && !isPortalScreen ? 'pt-20' : 'pt-0'}`}>
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

        {/* Houses Screen (Exclusive Rental Estates in Kigali) */}
        {activeScreen === 'houses' && (
          <HousesScreen
            onSelectProperty={handleSelectProperty}
            onBookTour={handleBookTourFromProperty}
            onNavigate={handleNavigate}
            onOpenConsultation={handleOpenGeneralConsultation}
          />
        )}

        {/* Houses for Sale Screen (Exclusive Freehold Estates in Kigali) */}
        {activeScreen === 'houses-for-sale' && (
          <HousesForSaleScreen
            onSelectProperty={handleSelectProperty}
            onBookTour={handleBookTourFromProperty}
            onNavigate={handleNavigate}
            onOpenConsultation={handleOpenGeneralConsultation}
          />
        )}

        {/* Apartments Screen (Modern Living in Kigali | Premium Rentals) */}
        {activeScreen === 'apartments' && (
          <ApartmentsScreen
            onSelectProperty={handleSelectProperty}
            onBookTour={handleBookTourFromProperty}
            onNavigate={handleNavigate}
            onOpenConsultation={handleOpenGeneralConsultation}
            onOpenListProperty={() => setIsListPropertyOpen(true)}
          />
        )}

        {/* Land Screen (Strategic Plots | Premium Land & Investment Plots) */}
        {activeScreen === 'land' && (
          <LandScreen
            onNavigate={handleNavigate}
            onOpenConsultation={handleOpenGeneralConsultation}
          />
        )}

        {/* Investments Screen (Elite Rwandan Estates | Luxury Marketplace) */}
        {activeScreen === 'investments' && (
          <InvestmentsScreen
            onSelectProperty={handleSelectProperty}
            onBookTour={handleBookTourFromProperty}
            onNavigate={handleNavigate}
            onOpenConsultation={handleOpenGeneralConsultation}
            onOpenListProperty={() => setIsListPropertyOpen(true)}
          />
        )}

        {activeScreen === 'properties' && (
          <PropertiesScreen
            properties={PROPERTIES}
            onSelectProperty={handleSelectProperty}
            onBookTour={handleBookTourFromProperty}
            initialFilters={searchFilters}
            onNavigate={handleNavigate}
            onOpenConsultation={handleOpenGeneralConsultation}
          />
        )}

        {/* Tenant & Buyer Portal Dashboard (Attached Page) */}
        {activeScreen === 'tenant-dashboard' && (
          <TenantDashboard
            properties={PROPERTIES}
            onSelectProperty={handleSelectProperty}
            onBookTour={handleBookTourFromProperty}
            onOpenConsultation={handleOpenGeneralConsultation}
            onNavigate={handleNavigate}
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
            onNavigateToDashboard={() => handleNavigate('tenant-dashboard')}
          />
        )}

        {activeScreen === 'signup' && (
          <SignUpScreen
            onNavigateToSignIn={() => handleNavigate('signin')}
            onNavigateToHome={() => handleNavigate('home')}
            onNavigateToDashboard={() => handleNavigate('tenant-dashboard')}
          />
        )}
      </main>

      {/* Footer */}
      {!isAuthScreen && !isPortalScreen && (
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
        onSuccess={() => {
          // If a tenant or buyer logs in or signs in, route them straight to their portal dashboard!
          setActiveScreen('tenant-dashboard');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
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
