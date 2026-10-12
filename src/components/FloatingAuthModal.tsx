import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole, SocialProvider } from '../types';
import { SocialAuthModal } from './SocialAuthModal';

interface FloatingAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup';
  onSuccess?: (role?: UserRole) => void;
}

export const FloatingAuthModal: React.FC<FloatingAuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'signin',
  onSuccess,
}) => {
  const { login, register, isLoading, error, forgotPassword, clearError } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [role, setRole] = useState<UserRole>('buyer');

  // Input states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('+250 788 ');
  const [showPassword, setShowPassword] = useState(false);
  const [resetMessage, setResetMessage] = useState<string | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Social Auth Modal state
  const [activeSocialProvider, setActiveSocialProvider] = useState<SocialProvider | null>(null);

  // Synchronize initialMode whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      clearError();
      setResetMessage(null);
      if (initialMode === 'signin') {
        if (!email) setEmail('imanaturikumwee@gmail.com');
        if (!password) setPassword('estate2024');
      }
    }
  }, [isOpen, initialMode]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSwitchMode = (newMode: 'signin' | 'signup') => {
    setMode(newMode);
    clearError();
    setResetMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetMessage(null);

    if (mode === 'signin') {
      const success = await login(email, password);
      if (success) {
        onClose();
        if (onSuccess) onSuccess(role);
      }
    } else {
      const success = await register({
        fullName: fullName || email.split('@')[0],
        email,
        phone,
        password,
        role,
      });
      if (success) {
        setShowSuccessToast(true);
        setTimeout(() => {
          setShowSuccessToast(false);
          onClose();
          if (onSuccess) onSuccess(role);
        }, 1200);
      }
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setResetMessage('Please enter your email address first.');
      return;
    }
    const msg = await forgotPassword(email);
    setResetMessage(msg);
  };

  const fillDemoCredentials = () => {
    setEmail('imanaturikumwee@gmail.com');
    setPassword('estate2024');
    setRole('buyer');
    clearError();
    setResetMessage('VIP Patron demo credentials filled.');
  };

  const rolesList: { id: UserRole; label: string; icon: string; desc: string }[] = [
    { id: 'buyer', label: 'Buyer', icon: 'payments', desc: 'Acquire' },
    { id: 'tenant', label: 'Tenant', icon: 'key', desc: 'Lease' },
    { id: 'owner', label: 'Owner', icon: 'domain', desc: 'Portfolio' },
    { id: 'agent', label: 'Agent', icon: 'real_estate_agent', desc: 'Partner' },
    { id: 'staff', label: 'Staff', icon: 'admin_panel_settings', desc: 'Internal' },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 lg:p-7 bg-black/65 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      {/* Floating Full-Length Modal Container */}
      <div
        className="relative w-full max-w-6xl xl:max-w-7xl h-[95vh] min-h-[640px] max-h-[96vh] rounded-2xl md:rounded-3xl shadow-2xl border border-white/20 bg-white my-auto flex flex-col md:flex-row overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 z-40 w-10 h-10 rounded-full bg-white/95 hover:bg-white text-[#191c1d] flex items-center justify-center shadow-lg transition-all cursor-pointer border border-[#c5c5d3]/40 hover:scale-105 active:scale-95"
          aria-label="Close modal"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>

        {/* =========================================================================
            LEFT COLUMN: Full-Length Editorial Image Section (Visible on md+)
           ========================================================================= */}
        {mode === 'signin' ? (
          /* Sign In Left Image Section */
          <div className="hidden md:flex md:w-5/12 lg:w-1/2 h-full relative bg-[#00236f] overflow-hidden flex-col justify-between shrink-0 select-none">
            <img
              className="absolute inset-0 w-full h-full object-cover"
              alt="Modern architectural estate in Rwanda at sunset"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDG3wsWCjYzRqV9n_92QPWgwlDryPB8g2LxpY4nKo1Bsv5IlI0DqVPhCLK4srtniEMSo4Gb97eyDXeiXmqi_ILV9PKYGCLQvfUIj8vNOLvRAKoPvwFN4GIgg1TKNythud-Qc2WTYqlkGdMni270F7xUVYendVaHxgsER_ZiQwT6dKLpKsVMTEpvbNzvoKc4FIKvzP6-TFhZb56mEf89fhbxu30kHMqx6rop42gp6s2NcDRgb97VMIeaUnx5-sw1lDke1tdGSKCmTHds"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#00236f]/95 via-[#00236f]/40 to-transparent" />

            <div className="relative z-10 p-8 lg:p-12 text-white">
              <span className="font-['Manrope'] font-bold text-2xl tracking-tight block">
                The Digital Estate
              </span>
              <span className="block text-[11px] uppercase tracking-[0.25em] text-[#dce1ff] font-semibold mt-1">
                Emma &amp; Dany · Rwanda
              </span>
            </div>

            <div className="relative z-10 p-8 lg:p-12 text-white mt-auto">
              <span className="inline-block px-3 py-1 rounded bg-white/20 backdrop-blur-xs text-[10px] uppercase font-bold tracking-widest text-[#ffdcc1] mb-3">
                Member Sanctuary
              </span>
              <h3 className="font-['Manrope'] text-2xl lg:text-4xl font-extrabold text-white leading-tight mb-3 tracking-tight drop-shadow-sm">
                Welcome Home to <br />Emma &amp; Dany.
              </h3>
              <p className="text-white/90 text-xs lg:text-base leading-relaxed font-light max-w-md mb-4">
                Access your exclusive portfolio, private estate acquisitions, and direct concierge advisory in Rwanda.
              </p>
              <blockquote className="border-l-2 border-[#ffdcc1]/70 pl-3.5 py-1 italic text-xs lg:text-sm text-white/90">
                "Architecture is the learned game, correct and magnificent, of forms assembled in the light."
                <cite className="block text-[10px] uppercase tracking-widest text-[#ffdcc1] font-bold not-italic mt-1.5">
                  Curated by Emma Umutoni &amp; Dany Mugisha
                </cite>
              </blockquote>
            </div>
          </div>
        ) : (
          /* Sign Up Left Image Section */
          <div className="hidden md:flex md:w-5/12 lg:w-1/2 h-full relative bg-[#00236f] overflow-hidden flex-col justify-between shrink-0 select-none">
            <img
              alt="Contemporary luxury villa in Rwanda at golden hour"
              className="absolute inset-0 w-full h-full object-cover opacity-85 mix-blend-multiply"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC38-4Puf1GZr8evJACUGqtPRL2uCyB_NRbK0d4r6-4bQUSWHOWOdHQGAv5Ln0A59o38-40sW4ummOU2jit_dEtXg0CaD2fKAA-bwmcyEyk0hwDAn31U-yigi7B29iNQn87Kh4vRsD856qfTI5nE9vP9heWd4XiG1yGct8EByFOoou3eGPxF5JVfwn3vQvn9aXjYvrL8SYDr78DIbjER5mZYFaT_fOmmjg6N4HweUdmPDRudZCIePSh77KQAQgH471baCwKCZWO7Ljn"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#00236f]/95 via-[#00236f]/40 to-transparent" />

            <div className="relative z-10 p-8 lg:p-12 text-white">
              <span className="font-['Manrope'] font-black text-2xl lg:text-3xl tracking-tighter text-white block">
                EMMA &amp; DANY
              </span>
              <span className="block text-[11px] uppercase tracking-[0.25em] text-[#dce1ff] font-semibold mt-1">
                The Digital Estate · Rwanda
              </span>
            </div>

            <div className="relative z-10 p-8 lg:p-12 text-white mt-auto">
              <div className="mb-3 h-[3px] w-20 bg-[#ffdcc1]" />
              <h3 className="font-['Manrope'] font-extrabold text-2xl lg:text-3xl tracking-tight mb-2 leading-tight">
                Horizon Kinshasa &amp; Kigali.<br />Architectural Integrity.
              </h3>
              <p className="font-['Inter'] text-xs lg:text-sm text-[#dce1ff] leading-relaxed mb-4 max-w-md">
                Join a curated ecosystem of premier properties and discerning stakeholders across East Africa.
              </p>
              <blockquote className="border-l-2 border-[#ffdcc1]/70 pl-3.5 py-1 italic text-xs lg:text-sm text-white/90">
                "Luxury is defined by the space you don’t fill."
                <cite className="block text-[10px] uppercase tracking-widest text-[#ffdcc1] font-bold not-italic mt-1.5">
                  Emma &amp; Dany Design Philosophy
                </cite>
              </blockquote>
            </div>
          </div>
        )}

        {/* =========================================================================
            RIGHT COLUMN: Full-Length Form Section (Scrollable, full length padding)
           ========================================================================= */}
        <div className="flex-1 h-full p-5 sm:p-7 md:p-9 lg:p-11 overflow-y-auto bg-[#f8f9fa] flex flex-col justify-between">
          <div>
            {/* Mobile Editorial Preview Banner (Only visible on small screens < md) */}
            <div className="md:hidden mb-4 relative rounded-xl overflow-hidden shadow-xs h-28 bg-[#00236f]">
              <img
                className="absolute inset-0 w-full h-full object-cover opacity-75"
                alt="Modern villa in Kigali"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDG3wsWCjYzRqV9n_92QPWgwlDryPB8g2LxpY4nKo1Bsv5IlI0DqVPhCLK4srtniEMSo4Gb97eyDXeiXmqi_ILV9PKYGCLQvfUIj8vNOLvRAKoPvwFN4GIgg1TKNythud-Qc2WTYqlkGdMni270F7xUVYendVaHxgsER_ZiQwT6dKLpKsVMTEpvbNzvoKc4FIKvzP6-TFhZb56mEf89fhbxu30kHMqx6rop42gp6s2NcDRgb97VMIeaUnx5-sw1lDke1tdGSKCmTHds"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#00236f]/90 via-[#00236f]/40 to-transparent" />
              <div className="absolute bottom-2.5 left-3.5 right-3.5 text-white z-10">
                <span className="text-[9px] uppercase tracking-widest font-bold text-[#ffdcc1] block">
                  Emma &amp; Dany Luxury Realty
                </span>
                <h4 className="font-['Manrope'] font-extrabold text-sm leading-tight text-white">
                  The Digital Estate · Rwanda
                </h4>
              </div>
            </div>

            {/* Header row */}
            <header className="mb-4 sm:mb-6 pr-8">
              <div className="flex items-center justify-between">
                <h2 className="font-['Manrope'] text-2xl sm:text-3xl font-extrabold text-[#191c1d] tracking-tight">
                  {mode === 'signin' ? 'Sign In' : 'Join the Digital Estate'}
                </h2>
                {mode === 'signin' && (
                  <button
                    type="button"
                    onClick={fillDemoCredentials}
                    className="text-[10px] font-bold text-[#00236f] bg-[#00236f]/10 hover:bg-[#00236f]/20 px-2.5 py-1 rounded-md transition-colors cursor-pointer"
                  >
                    Quick Demo
                  </button>
                )}
              </div>
              <p className="text-[#444651] text-xs sm:text-sm mt-1">
                {mode === 'signin'
                  ? 'Enter your credentials to access your estate portfolio.'
                  : 'Create your account to start your journey with Emma & Dany.'}
              </p>
            </header>

            {/* Error or Alert banner */}
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <span className="material-symbols-outlined text-base shrink-0">error</span>
                <span>{error}</span>
              </div>
            )}

            {resetMessage && (
              <div className="mb-4 p-3 rounded-lg bg-blue-50 border border-blue-200 text-[#00236f] text-xs flex items-center gap-2">
                <span className="material-symbols-outlined text-base shrink-0">info</span>
                <span>{resetMessage}</span>
              </div>
            )}

            {/* =======================================
                CHOOSE YOUR ROLE (Both Sign In & Sign Up)
               ======================================= */}
            <div className="mb-5 space-y-2">
              <div className="flex justify-between items-center">
                <label className="font-['Manrope'] font-bold text-[11px] sm:text-xs uppercase tracking-wider text-[#444651] block">
                  Choose Your Role
                </label>
                <span className="text-[10px] text-[#757682] uppercase tracking-wider font-semibold">
                  Portal: <strong className="text-[#00236f] capitalize">{role}</strong>
                </span>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5 sm:gap-2">
                {rolesList.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRole(r.id)}
                    className={`p-2 sm:p-2.5 rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer ${
                      role === r.id
                        ? 'border-[#00236f] bg-white shadow-xs text-[#00236f] ring-2 ring-[#00236f]/20 font-bold'
                        : 'border-transparent bg-[#f3f4f5] hover:bg-[#e7e8e9] text-[#444651]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-lg sm:text-xl mb-0.5">{r.icon}</span>
                    <span className="text-[10px] sm:text-[11px]">{r.label}</span>
                    <span className="text-[8px] sm:text-[9px] text-[#757682] hidden sm:block">{r.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* =======================================
                SIGN IN FORM
               ======================================= */}
            {mode === 'signin' ? (
              <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
                <div className="space-y-1">
                  <label className="block text-[11px] font-['Inter'] uppercase tracking-wider text-[#444651] font-bold">
                    Email Address
                  </label>
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-4 py-2.5 sm:py-3 bg-[#f3f4f5] border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00236f] focus:bg-white text-base sm:text-sm text-[#191c1d] transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="block text-[11px] font-['Inter'] uppercase tracking-wider text-[#444651] font-bold">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-[11px] font-medium text-[#432200] hover:text-[#00236f] transition-colors underline decoration-[#f9ba82]/50 decoration-2 underline-offset-4 cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      required
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-2.5 sm:py-3 pr-10 bg-[#f3f4f5] border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00236f] focus:bg-white text-base sm:text-sm text-[#191c1d] transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#757682] hover:text-[#00236f] cursor-pointer"
                      aria-label="Toggle password visibility"
                    >
                      <span className="material-symbols-outlined text-base">
                        {showPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 sm:py-3.5 bg-[#432200] hover:bg-[#2e1500] text-white font-['Manrope'] font-bold rounded-lg active:scale-[0.98] transition-all shadow-md mt-1 text-xs tracking-wider uppercase cursor-pointer"
                >
                  {isLoading ? 'Verifying Access...' : `Sign In as ${role.toUpperCase()}`}
                </button>
              </form>
            ) : (
              /* =======================================
                  SIGN UP FORM
                 ======================================= */
              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#757682] mb-1">
                      Full Name *
                    </label>
                    <input
                      required
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter full name"
                      className="w-full bg-[#f3f4f5] border-b-2 border-[#c5c5d3]/60 focus:border-[#00236f] focus:bg-white focus:outline-none py-2.5 px-3 text-base sm:text-sm text-[#191c1d] rounded-t transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#757682] mb-1">
                      Email Address *
                    </label>
                    <input
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full bg-[#f3f4f5] border-b-2 border-[#c5c5d3]/60 focus:border-[#00236f] focus:bg-white focus:outline-none py-2.5 px-3 text-base sm:text-sm text-[#191c1d] rounded-t transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#757682] mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+250 788 000 000"
                      className="w-full bg-[#f3f4f5] border-b-2 border-[#c5c5d3]/60 focus:border-[#00236f] focus:bg-white focus:outline-none py-2.5 px-3 text-base sm:text-sm text-[#191c1d] rounded-t transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#757682] mb-1">
                      Secure Password *
                    </label>
                    <div className="relative">
                      <input
                        required
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-[#f3f4f5] border-b-2 border-[#c5c5d3]/60 focus:border-[#00236f] focus:bg-white focus:outline-none py-2.5 px-3 pr-8 text-base sm:text-sm text-[#191c1d] rounded-t transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-[#757682] hover:text-[#00236f] cursor-pointer"
                        aria-label="Toggle password visibility"
                      >
                        <span className="material-symbols-outlined text-base">
                          {showPassword ? 'visibility_off' : 'visibility'}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>

                <p className="text-[11px] text-[#444651]">
                  By creating an account, you agree to our{' '}
                  <span className="text-[#432200] font-semibold underline decoration-[#f9ba82]/60 cursor-pointer">
                    Terms
                  </span>{' '}
                  and{' '}
                  <span className="text-[#432200] font-semibold underline decoration-[#f9ba82]/60 cursor-pointer">
                    Privacy Policy
                  </span>
                  .
                </p>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#432200] hover:bg-[#2e1500] text-white font-['Manrope'] font-bold py-3 sm:py-3.5 rounded-lg active:scale-[0.98] transition-all shadow-md tracking-wider uppercase text-xs cursor-pointer"
                >
                  {isLoading ? 'Creating Account...' : `Register as ${role.toUpperCase()}`}
                </button>
              </form>
            )}

            {/* Divider */}
            <div className="relative my-4 text-center">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-[#c5c5d3]/40" />
              </div>
              <span className="relative px-3 bg-[#f8f9fa] text-[10px] font-['Inter'] uppercase tracking-wider text-[#757682] font-semibold">
                {mode === 'signin' ? 'Or continue with' : 'Or authenticate with'}
              </span>
            </div>

            {/* Social Logins: Google, Apple ID, Git Auth, Facebook */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setActiveSocialProvider('google')}
                className="flex items-center justify-center gap-1.5 py-2.5 px-2 bg-white rounded-lg text-xs font-semibold border border-[#c5c5d3]/40 hover:bg-[#f3f4f5] transition-all cursor-pointer shadow-xs active:scale-95"
              >
                <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                <span className="truncate">Google</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveSocialProvider('apple')}
                className="flex items-center justify-center gap-1.5 py-2.5 px-2 bg-white rounded-lg text-xs font-semibold border border-[#c5c5d3]/40 hover:bg-[#f3f4f5] transition-all cursor-pointer shadow-xs active:scale-95"
              >
                <span className="material-symbols-outlined text-base shrink-0">ios</span>
                <span className="truncate">Apple ID</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveSocialProvider('github')}
                className="flex items-center justify-center gap-1.5 py-2.5 px-2 bg-white rounded-lg text-xs font-semibold border border-[#c5c5d3]/40 hover:bg-[#f3f4f5] transition-all cursor-pointer shadow-xs active:scale-95"
              >
                <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                <span className="truncate">Git Auth</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveSocialProvider('facebook')}
                className="flex items-center justify-center gap-1.5 py-2.5 px-2 bg-white rounded-lg text-xs font-semibold border border-[#c5c5d3]/40 hover:bg-[#f3f4f5] transition-all cursor-pointer shadow-xs active:scale-95 text-[#1877F2]"
              >
                <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span className="text-[#191c1d] truncate">Facebook</span>
              </button>
            </div>
          </div>

          {/* Full-Length Footer Section */}
          <footer className="mt-5 pt-4 border-t border-[#c5c5d3]/20 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#444651]">
            <div>
              {mode === 'signin' ? (
                <p>
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => handleSwitchMode('signup')}
                    className="text-[#00236f] font-bold hover:underline cursor-pointer ml-1"
                  >
                    Create an account
                  </button>
                </p>
              ) : (
                <p>
                  Already part of the estate?{' '}
                  <button
                    type="button"
                    onClick={() => handleSwitchMode('signin')}
                    className="text-[#00236f] font-bold hover:underline cursor-pointer ml-1"
                  >
                    Log In
                  </button>
                </p>
              )}
            </div>
            <div className="text-[10px] text-[#757682]">
              Emma &amp; Dany · Rwanda RDB Realty Registry
            </div>
          </footer>
        </div>
      </div>

      {/* Success Notification Toast */}
      {showSuccessToast && (
        <div className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 bg-white p-4 rounded-xl shadow-2xl border-l-4 border-[#432200] flex items-center gap-3 z-[100] animate-in slide-in-from-bottom-2">
          <div className="bg-[#ffdcc1] p-2 rounded-full text-[#603609]">
            <span className="material-symbols-outlined text-lg">check_circle</span>
          </div>
          <div>
            <h5 className="font-bold text-xs text-[#191c1d]">Welcome to the Estate</h5>
            <p className="text-[11px] text-[#444651]">Account created successfully.</p>
          </div>
        </div>
      )}

      {/* Social Auth Modal */}
      <SocialAuthModal
        provider={activeSocialProvider}
        selectedRole={role}
        onClose={() => setActiveSocialProvider(null)}
        onSuccess={() => {
          setActiveSocialProvider(null);
          onClose();
        }}
      />
    </div>
  );
};
