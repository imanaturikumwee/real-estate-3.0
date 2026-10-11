import React, { useState } from 'react';
import { ActiveScreen } from '../types';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  activeScreen: ActiveScreen;
  onNavigate: (screen: ActiveScreen) => void;
  onOpenConsultation: () => void;
  onOpenAuth: (mode?: 'signin' | 'signup') => void;
  isHeaderNavHidden?: boolean;
  onToggleHeaderNav?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeScreen,
  onNavigate,
  onOpenConsultation,
  onOpenAuth,
  isHeaderNavHidden,
  onToggleHeaderNav,
}) => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleNavClick = (screen: ActiveScreen) => {
    onNavigate(screen);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = async () => {
    await logout();
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 w-full z-40 bg-[#f8f9fa]/85 backdrop-blur-md border-b border-[#c5c5d3]/15 transition-all">
      <div className="flex justify-between items-center max-w-7xl mx-auto px-6 md:px-8 h-20">
        {/* Brand Logo */}
        <button
          onClick={() => handleNavClick('home')}
          className="text-left group cursor-pointer focus:outline-none"
        >
          <span className="text-2xl font-extrabold tracking-tighter text-[#191c1d] group-hover:text-[#00236f] transition-colors">
            Emma &amp; Dany
          </span>
          <span className="hidden sm:block text-[9px] uppercase tracking-[0.25em] text-[#757682] -mt-1 font-semibold">
            Architectural Excellence · Rwanda
          </span>
        </button>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex gap-8 items-center">
          <button
            onClick={() => handleNavClick('properties')}
            className={`font-['Manrope'] text-xs uppercase tracking-[0.2em] transition-all duration-200 cursor-pointer ${
              activeScreen === 'properties'
                ? 'text-[#00236f] font-bold border-b-2 border-[#00236f] pb-1'
                : 'text-[#444651] opacity-80 hover:opacity-100 hover:text-[#00236f]'
            }`}
          >
            Properties
          </button>
          <button
            onClick={() => handleNavClick('invest')}
            className={`font-['Manrope'] text-xs uppercase tracking-[0.2em] transition-all duration-200 cursor-pointer ${
              activeScreen === 'invest'
                ? 'text-[#00236f] font-bold border-b-2 border-[#00236f] pb-1'
                : 'text-[#444651] opacity-80 hover:opacity-100 hover:text-[#00236f]'
            }`}
          >
            Invest
          </button>
          <button
            onClick={() => handleNavClick('about')}
            className={`font-['Manrope'] text-xs uppercase tracking-[0.2em] transition-all duration-200 cursor-pointer ${
              activeScreen === 'about'
                ? 'text-[#00236f] font-bold border-b-2 border-[#00236f] pb-1'
                : 'text-[#444651] opacity-80 hover:opacity-100 hover:text-[#00236f]'
            }`}
          >
            About
          </button>
          <button
            onClick={() => handleNavClick('contact')}
            className={`font-['Manrope'] text-xs uppercase tracking-[0.2em] transition-all duration-200 cursor-pointer ${
              activeScreen === 'contact'
                ? 'text-[#00236f] font-bold border-b-2 border-[#00236f] pb-1'
                : 'text-[#444651] opacity-80 hover:opacity-100 hover:text-[#00236f]'
            }`}
          >
            Contact
          </button>
        </div>

        {/* Right Action & Auth Navigation */}
        <div className="flex items-center gap-3">
          {/* User Profile or Single Unified Sign In / Sign Up Button with Icon */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 pl-3 rounded-full bg-white border border-[#c5c5d3]/30 hover:border-[#00236f] transition-all cursor-pointer shadow-xs"
              >
                <div className="flex flex-col text-right">
                  <span className="text-xs font-bold text-[#191c1d] max-w-[120px] truncate leading-tight">
                    {user.fullName}
                  </span>
                  <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#00236f]">
                    {user.role}
                  </span>
                </div>
                <div className="w-8 h-8 rounded-full overflow-hidden bg-[#00236f] text-white flex items-center justify-center text-xs font-bold shrink-0">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.fullName} className="w-full h-full object-cover" />
                  ) : (
                    user.fullName.substring(0, 2).toUpperCase()
                  )}
                </div>
              </button>

              {/* User Dropdown */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-[#c5c5d3]/20 py-2 z-50 text-xs animate-in fade-in slide-in-from-top-1">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="font-bold text-[#191c1d] truncate">{user.fullName}</p>
                    <p className="text-[#757682] text-[11px] truncate">{user.email}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-[#00236f]/10 text-[#00236f]">
                      {user.role} Account
                    </span>
                  </div>

                  <button
                    onClick={() => handleNavClick('properties')}
                    className="w-full text-left px-4 py-2 hover:bg-[#f8f9fa] flex items-center gap-2 text-[#444651]"
                  >
                    <span className="material-symbols-outlined text-sm">bookmark</span>
                    Saved Estates
                  </button>
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      onOpenConsultation();
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-[#f8f9fa] flex items-center gap-2 text-[#444651]"
                  >
                    <span className="material-symbols-outlined text-sm">calendar_month</span>
                    My Appointments
                  </button>
                  <div className="border-t border-gray-100 my-1" />
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-sm">logout</span>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={() => onOpenAuth('signin')}
                className="font-['Manrope'] text-xs font-bold tracking-wider uppercase px-3 py-2 rounded text-[#444651] hover:text-[#00236f] transition-colors cursor-pointer"
              >
                Sign In
              </button>
              <button
                onClick={() => onOpenAuth('signup')}
                className="font-['Manrope'] text-xs font-bold tracking-wider uppercase px-3 py-2 rounded bg-[#00236f]/5 text-[#00236f] hover:bg-[#00236f] hover:text-white transition-all cursor-pointer"
              >
                Sign Up
              </button>
            </div>
          )}

          {/* Search Page Header Nav Toggle Button */}
          {activeScreen === 'properties' && onToggleHeaderNav && (
            <button
              onClick={onToggleHeaderNav}
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#f3f4f5] hover:bg-[#00236f] hover:text-white text-[#444651] text-xs font-bold transition-all cursor-pointer border border-[#c5c5d3]/30"
              title="Hide navigation bar for full-height search & map"
            >
              <span className="material-symbols-outlined text-sm">visibility_off</span>
              <span className="uppercase tracking-wider text-[10px]">Hide Header</span>
            </button>
          )}

          {/* Enquire Now CTA Button */}
          <button
            onClick={onOpenConsultation}
            className="bg-gradient-to-br from-[#00236f] to-[#1e3a8a] text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-md font-['Manrope'] text-xs font-bold tracking-[0.15em] uppercase hover:shadow-lg hover:shadow-[#00236f]/20 active:scale-95 duration-200 transition-all cursor-pointer"
          >
            Enquire Now
          </button>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#191c1d] rounded-md hover:bg-[#e7e8e9] transition-colors focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            <span className="material-symbols-outlined text-2xl">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#ffffff] border-b border-[#c5c5d3]/30 px-6 py-5 shadow-xl space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* User profile summary or single Sign In / Sign Up button */}
          {user ? (
            <div className="p-3 bg-[#f8f9fa] rounded-lg mb-2 flex items-center justify-between">
              <div>
                <p className="font-bold text-xs text-[#191c1d]">{user.fullName}</p>
                <p className="text-[10px] text-[#757682] uppercase">{user.role} · {user.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="text-xs text-red-600 font-bold uppercase tracking-wider"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 pb-2 border-b border-[#c5c5d3]/20">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth('signin');
                }}
                className="py-2.5 bg-[#f3f4f5] rounded text-center text-xs font-bold text-[#00236f] uppercase tracking-wider cursor-pointer active:scale-95 transition-all"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth('signup');
                }}
                className="py-2.5 bg-[#432200] text-white rounded text-center text-xs font-bold uppercase tracking-wider cursor-pointer active:scale-95 transition-all"
              >
                Sign Up
              </button>
            </div>
          )}

          <button
            onClick={() => handleNavClick('home')}
            className={`block w-full text-left py-2 font-['Manrope'] text-sm uppercase tracking-widest ${
              activeScreen === 'home' ? 'text-[#00236f] font-bold' : 'text-[#444651]'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => handleNavClick('properties')}
            className={`block w-full text-left py-2 font-['Manrope'] text-sm uppercase tracking-widest ${
              activeScreen === 'properties' ? 'text-[#00236f] font-bold' : 'text-[#444651]'
            }`}
          >
            Properties
          </button>
          <button
            onClick={() => handleNavClick('invest')}
            className={`block w-full text-left py-2 font-['Manrope'] text-sm uppercase tracking-widest ${
              activeScreen === 'invest' ? 'text-[#00236f] font-bold' : 'text-[#444651]'
            }`}
          >
            Invest in Rwanda
          </button>
          <button
            onClick={() => handleNavClick('about')}
            className={`block w-full text-left py-2 font-['Manrope'] text-sm uppercase tracking-widest ${
              activeScreen === 'about' ? 'text-[#00236f] font-bold' : 'text-[#444651]'
            }`}
          >
            About Emma &amp; Dany
          </button>
          <button
            onClick={() => handleNavClick('contact')}
            className={`block w-full text-left py-2 font-['Manrope'] text-sm uppercase tracking-widest ${
              activeScreen === 'contact' ? 'text-[#00236f] font-bold' : 'text-[#444651]'
            }`}
          >
            Contact &amp; Advisory
          </button>
          <div className="pt-2 border-t border-[#c5c5d3]/20 flex items-center justify-between text-xs text-[#757682]">
            <span>Nyarutarama Business Center</span>
            <span className="font-semibold text-[#00236f]">+250 788 123 456</span>
          </div>
        </div>
      )}
    </nav>
  );
};
