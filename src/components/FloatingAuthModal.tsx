import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole, SocialProvider } from '../types';
import { SocialAuthModal } from './SocialAuthModal';

interface FloatingAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup';
}

export const FloatingAuthModal: React.FC<FloatingAuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'signin',
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

  // Social Auth Modal
  const [activeSocialProvider, setActiveSocialProvider] = useState<SocialProvider | null>(null);

  // Ensure mode matches initialMode whenever modal opens or initialMode changes
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/65 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl lg:max-w-6xl h-[95vh] md:h-[92vh] min-h-[620px] max-h-[98vh] rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl border border-white/20 bg-white my-auto flex flex-col md:flex-row animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-[#191c1d] flex items-center justify-center shadow-lg transition-all cursor-pointer border border-[#c5c5d3]/40 hover:scale-105"
          aria-label="Close modal"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>

        {/* =========================================================================
            LEFT COLUMN: Editorial Image Section (matching original Sign In / Sign Up)
           ========================================================================= */}
        {mode === 'signin' ? (
          /* Sign In Left Image Section */
          <div className="hidden md:flex md:w-5/12 lg:w-1/2 h-full relative bg-[#f3f4f5] overflow-hidden flex-col justify-between shrink-0">
            <img
              className="absolute inset-0 w-full h-full object-cover"
              alt="Modern architectural masterpiece in Rwanda at sunset"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDG3wsWCjYzRqV9n_92QPWgwlDryPB8g2LxpY4nKo1Bsv5IlI0DqVPhCLK4srtniEMSo4Gb97eyDXeiXmqi_ILV9PKYGCLQvfUIj8vNOLvRAKoPvwFN4GIgg1TKNythud-Qc2WTYqlkGdMni270F7xUVYendVaHxgsER_ZiQwT6dKLpKsVMTEpvbNzvoKc4FIKvzP6-TFhZb56mEf89fhbxu30kHMqx6rop42gp6s2NcDRgb97VMIeaUnx5-sw1lDke1tdGSKCmTHds"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-[#00236f]/70 via-[#00236f]/25 to-transparent" />

            <div className="relative z-10 p-8 lg:p-10 text-white">
              <span className="font-['Manrope'] font-bold text-xl tracking-tight block">
                The Digital Estate
              </span>
              <span className="block text-[11px] uppercase tracking-[0.25em] text-[#dce1ff] font-semibold mt-1">
                Emma &amp; Dany · Rwanda
              </span>
            </div>

            <div className="relative z-10 p-8 lg:p-12 text-white mt-auto">
              <h3 className="font-['Manrope'] text-3xl lg:text-4xl font-extrabold text-white leading-tight mb-4 tracking-tight drop-shadow-sm">
                Welcome Home to <br />Emma &amp; Dany.
              </h3>
              <p className="text-white/95 text-sm lg:text-base leading-relaxed font-light max-w-md">
                Access the most exclusive architectural gems in the heart of Rwanda. Your digital sanctuary awaits.
              </p>
            </div>
          </div>
        ) : (
          /* Sign Up Left Image Section */
          <div className="hidden md:flex md:w-5/12 lg:w-1/2 h-full relative bg-[#00236f] overflow-hidden flex-col justify-between shrink-0">
            <img
              alt="Contemporary luxury villa in Rwanda at golden hour"
              className="absolute inset-0 w-full h-full object-cover opacity-85 mix-blend-multiply"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC38-4Puf1GZr8evJACUGqtPRL2uCyB_NRbK0d4r6-4bQUSWHOWOdHQGAv5Ln0A59o38-40sW4ummOU2jit_dEtXg0CaD2fKAA-bwmcyEyk0hwDAn31U-yigi7B29iNQn87Kh4vRsD856qfTI5nE9vP9heWd4XiG1yGct8EByFOoou3eGPxF5JVfwn3vQvn9aXjYvrL8SYDr78DIbjER5mZYFaT_fOmmjg6N4HweUdmPDRudZCIePSh77KQAQgH471baCwKCZWO7Ljn"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#00236f]/95 via-[#00236f]/40 to-transparent" />

            <div className="relative z-10 p-8 lg:p-10 text-white">
              <span className="font-['Manrope'] font-black text-2xl tracking-tighter text-white block">
                EMMA &amp; DANY
              </span>
              <span className="block text-[11px] uppercase tracking-[0.25em] text-[#dce1ff] font-semibold mt-1">
                The Digital Estate · Rwanda
              </span>
            </div>

            <div className="relative z-10 p-8 lg:p-12 text-white mt-auto">
              <div className="mb-4 h-[3px] w-20 bg-[#ffdcc1]" />
              <h3 className="font-['Manrope'] font-extrabold text-2xl lg:text-3xl tracking-tight mb-3 leading-tight">
                Horizon Kinshasa &amp; Kigali.<br />Architectural Integrity.
              </h3>
              <p className="font-['Inter'] text-xs lg:text-sm text-[#dce1ff] leading-relaxed mb-5 max-w-md">
                Join a curated ecosystem of premier properties and discerning stakeholders in the Rwandan landscape.
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
            RIGHT COLUMN: Form Section (Full Length with generous spacing)
           ========================================================================= */}
        <div className="flex-1 h-full p-6 sm:p-8 md:p-10 lg:p-12 overflow-y-auto bg-[#f8f9fa] flex flex-col justify-between">
          <div>
            {/* Header row */}
            <header className="mb-6 pr-8">
              <h2 className="font-['Manrope'] text-2xl sm:text-3xl font-extrabold text-[#191c1d] tracking-tight">
                {mode === 'signin' ? 'Sign In' : 'Join the Digital Estate'}
              </h2>
              <p className="text-[#444651] text-xs sm:text-sm mt-1">
                {mode === 'signin'
                  ? 'Enter your credentials to access your estate portfolio.'
                  : 'Create your account to start your journey with Emma & Dany.'}
              </p>
            </header>

            {/* Error or Alert banner */}
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <span className="material-symbols-outlined text-base">error</span>
                <span>{error}</span>
              </div>
            )}

            {resetMessage && (
              <div className="mb-4 p-3 rounded-lg bg-blue-50 border border-blue-200 text-[#00236f] text-xs flex items-center gap-2">
                <span className="material-symbols-outlined text-base">info</span>
                <span>{resetMessage}</span>
              </div>
            )}

            {/* =======================================
                SIGN IN FORM
               ======================================= */}
            {mode === 'signin' ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-[11px] font-['Inter'] uppercase tracking-widest text-[#444651] font-bold">
                    Email Address
                  </label>
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-3.5 py-2.5 bg-[#f3f4f5] border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-[#00236f] focus:bg-white text-xs text-[#191c1d] transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="block text-[11px] font-['Inter'] uppercase tracking-widest text-[#444651] font-bold">
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
                  <input
                    required
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 bg-[#f3f4f5] border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-[#00236f] focus:bg-white text-xs text-[#191c1d] transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 bg-[#432200] hover:bg-[#2e1500] text-white font-['Manrope'] font-bold rounded-md active:scale-[0.98] transition-all shadow-md mt-2 text-xs tracking-widest uppercase cursor-pointer"
                >
                  {isLoading ? 'Verifying Portfolio Access...' : 'Sign In to Estate'}
                </button>
              </form>
            ) : (
              /* =======================================
                  SIGN UP FORM
                 ======================================= */
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Bento Style Grid Role Selector */}
                <div className="space-y-1.5">
                  <label className="font-['Manrope'] font-bold text-[11px] uppercase tracking-widest text-[#444651] block">
                    Choose Your Role
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                    {(
                      [
                        { id: 'buyer', label: 'Buyer', icon: 'payments' },
                        { id: 'tenant', label: 'Tenant', icon: 'key' },
                        { id: 'owner', label: 'Owner', icon: 'domain' },
                        { id: 'agent', label: 'Agent', icon: 'real_estate_agent' },
                        { id: 'staff', label: 'Staff', icon: 'admin_panel_settings' },
                      ] as const
                    ).map((r) => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => setRole(r.id)}
                        className={`p-2 rounded-lg border flex flex-col items-center justify-center transition-all cursor-pointer ${
                          role === r.id
                            ? 'border-[#00236f] bg-white shadow-xs text-[#00236f]'
                            : 'border-transparent bg-[#f3f4f5] hover:bg-[#e7e8e9] text-[#444651]'
                        }`}
                      >
                        <span className="material-symbols-outlined text-lg mb-0.5">{r.icon}</span>
                        <span className="text-[10px] font-bold">{r.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Form fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-[#757682] mb-1">
                      Full Name *
                    </label>
                    <input
                      required
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full bg-[#f3f4f5] border-b-2 border-[#c5c5d3]/60 focus:border-[#00236f] focus:bg-white focus:outline-none py-2 px-3 text-xs text-[#191c1d] rounded-t transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-[#757682] mb-1">
                      Email Address *
                    </label>
                    <input
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@horizon.com"
                      className="w-full bg-[#f3f4f5] border-b-2 border-[#c5c5d3]/60 focus:border-[#00236f] focus:bg-white focus:outline-none py-2 px-3 text-xs text-[#191c1d] rounded-t transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-[#757682] mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+250 000 000 000"
                      className="w-full bg-[#f3f4f5] border-b-2 border-[#c5c5d3]/60 focus:border-[#00236f] focus:bg-white focus:outline-none py-2 px-3 text-xs text-[#191c1d] rounded-t transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-[#757682] mb-1">
                      Secure Password *
                    </label>
                    <div className="relative">
                      <input
                        required
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-[#f3f4f5] border-b-2 border-[#c5c5d3]/60 focus:border-[#00236f] focus:bg-white focus:outline-none py-2 px-3 pr-8 text-xs text-[#191c1d] rounded-t transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-[#757682] hover:text-[#00236f]"
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
                  className="w-full bg-[#432200] hover:bg-[#2e1500] text-white font-['Manrope'] font-bold py-3.5 rounded-md active:scale-[0.98] transition-all shadow-md tracking-widest uppercase text-xs cursor-pointer"
                >
                  {isLoading ? 'Creating Your Account...' : 'Create Account'}
                </button>
              </form>
            )}

            {/* Divider */}
            <div className="relative my-4 text-center">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-[#c5c5d3]/40" />
              </div>
              <span className="relative px-3 bg-[#f8f9fa] text-[10px] font-['Inter'] uppercase tracking-widest text-[#757682] font-semibold">
                {mode === 'signin' ? 'Or continue with' : 'or authenticate with'}
              </span>
            </div>

            {/* Social Logins: Google, Apple, Git Auth, Facebook */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setActiveSocialProvider('google')}
                className="flex items-center justify-center gap-2 py-2.5 px-3 bg-white rounded-md text-xs font-semibold border border-[#c5c5d3]/40 hover:bg-[#f3f4f5] transition-all cursor-pointer shadow-xs"
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
                <span>Google</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveSocialProvider('apple')}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-white rounded-md text-xs font-semibold border border-[#c5c5d3]/40 hover:bg-[#f3f4f5] transition-all cursor-pointer shadow-xs"
              >
                <span className="material-symbols-outlined text-base">ios</span>
                <span>Apple ID</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveSocialProvider('github')}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-white rounded-md text-xs font-semibold border border-[#c5c5d3]/40 hover:bg-[#f3f4f5] transition-all cursor-pointer shadow-xs"
              >
                <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                <span>Git Auth</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveSocialProvider('facebook')}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-white rounded-md text-xs font-semibold border border-[#c5c5d3]/40 hover:bg-[#f3f4f5] transition-all cursor-pointer shadow-xs text-[#1877F2]"
              >
                <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span className="text-[#191c1d]">Facebook</span>
              </button>
            </div>
          </div>

          {/* Footer toggle switcher */}
          <footer className="mt-6 pt-3 border-t border-[#c5c5d3]/20 text-center text-xs text-[#444651]">
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
          </footer>
        </div>
      </div>

      {/* Success Notification Toast */}
      {showSuccessToast && (
        <div className="fixed bottom-8 right-8 bg-white p-4 rounded-xl shadow-2xl border-l-4 border-[#432200] flex items-center gap-3 z-[100] animate-in slide-in-from-bottom-2">
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
