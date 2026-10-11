import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole, SocialProvider } from '../types';
import { SocialAuthModal } from './SocialAuthModal';

interface SignInScreenProps {
  onNavigateToSignUp: () => void;
  onNavigateToHome: () => void;
}

export const SignInScreen: React.FC<SignInScreenProps> = ({
  onNavigateToSignUp,
  onNavigateToHome,
}) => {
  const { login, isLoading, error, forgotPassword, clearError } = useAuth();
  const [role, setRole] = useState<UserRole>('buyer');
  const [email, setEmail] = useState('imanaturikumwee@gmail.com');
  const [password, setPassword] = useState('estate2024');
  const [showPassword, setShowPassword] = useState(false);
  const [activeSocialModal, setActiveSocialModal] = useState<SocialProvider | null>(null);
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setResetMessage(null);
    const success = await login(email, password);
    if (success) {
      onNavigateToHome();
    }
  };

  const handleForgotPassword = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!email) {
      setResetMessage('Please enter your email address first.');
      return;
    }
    const msg = await forgotPassword(email);
    setResetMessage(msg);
  };

  const handleAutofillDemo = () => {
    setEmail('imanaturikumwee@gmail.com');
    setPassword('estate2024');
    clearError();
    setResetMessage(`Loaded VIP Patron demo credentials (${role.toUpperCase()}).`);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#191c1d] flex flex-col font-['Inter'] selection:bg-[#00236f] selection:text-white">
      {/* TopAppBar Navigation Shell */}
      <header className="sticky top-0 w-full z-40 bg-[#f8f9fa]/90 backdrop-blur-md border-b border-[#c5c5d3]/20 shadow-xs">
        <div className="flex justify-between items-center px-4 sm:px-6 md:px-8 py-3.5 sm:py-4 max-w-7xl mx-auto w-full">
          <button
            onClick={onNavigateToHome}
            className="group flex items-center gap-2 text-left cursor-pointer focus:outline-none"
            aria-label="Return to home page"
          >
            <span className="material-symbols-outlined text-lg text-[#00236f] group-hover:-translate-x-0.5 transition-transform">
              arrow_back
            </span>
            <div>
              <span className="text-lg sm:text-xl font-extrabold text-[#00236f] tracking-tight font-['Manrope'] block leading-none">
                The Digital Estate
              </span>
              <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.25em] text-[#757682] font-semibold block mt-0.5">
                Emma &amp; Dany · Rwanda
              </span>
            </div>
          </button>

          <div className="flex items-center gap-3 sm:gap-6">
            <button
              onClick={onNavigateToSignUp}
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-[#432200] hover:text-[#00236f] transition-colors cursor-pointer uppercase tracking-wider"
            >
              <span>Don't have an account?</span>
              <span className="underline decoration-[#f9ba82] underline-offset-4">Sign Up</span>
            </button>
            <button
              onClick={onNavigateToHome}
              className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-md bg-white border border-[#c5c5d3]/40 hover:bg-[#f3f4f5] text-xs font-semibold text-[#191c1d] transition-all cursor-pointer shadow-xs"
            >
              Browse Estates
            </button>
          </div>
        </div>
      </header>

      {/* Main Full-Length Split Layout: Responsive across Desktop, Laptop, Tablet, and Phone */}
      <main className="flex-grow flex flex-col md:flex-row w-full">
        {/* Left Side: Asymmetric Editorial Architectural Image */}
        <section className="hidden md:flex md:w-5/12 lg:w-1/2 xl:w-5/12 relative min-h-[calc(100vh-65px)] bg-[#00236f] overflow-hidden flex-col justify-between shrink-0">
          <img
            className="absolute inset-0 w-full h-full object-cover"
            alt="Modern architectural masterpiece in Rwanda at sunset, golden light reflecting off floor-to-ceiling glass windows with lush tropical gardens"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDG3wsWCjYzRqV9n_92QPWgwlDryPB8g2LxpY4nKo1Bsv5IlI0DqVPhCLK4srtniEMSo4Gb97eyDXeiXmqi_ILV9PKYGCLQvfUIj8vNOLvRAKoPvwFN4GIgg1TKNythud-Qc2WTYqlkGdMni270F7xUVYendVaHxgsER_ZiQwT6dKLpKsVMTEpvbNzvoKc4FIKvzP6-TFhZb56mEf89fhbxu30kHMqx6rop42gp6s2NcDRgb97VMIeaUnx5-sw1lDke1tdGSKCmTHds"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#00236f]/95 via-[#00236f]/40 to-transparent" />

          {/* Top Brand Tag inside Editorial Image */}
          <div className="relative z-10 p-8 lg:p-12 text-white">
            <span className="font-['Manrope'] font-black text-2xl lg:text-3xl tracking-tighter text-white block">
              EMMA &amp; DANY
            </span>
            <span className="block text-[11px] uppercase tracking-[0.25em] text-[#dce1ff] font-semibold mt-1">
              The Digital Estate · Rwanda
            </span>
          </div>

          {/* Bottom Editorial Content */}
          <div className="relative z-10 p-8 lg:p-14 text-white max-w-xl">
            <div className="mb-4 h-[3px] w-20 bg-[#ffdcc1]" />
            <h1 className="font-['Manrope'] text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-4 drop-shadow-sm tracking-tight">
              Welcome Home to <br />Emma &amp; Dany.
            </h1>
            <p className="text-white/90 text-sm sm:text-base lg:text-lg leading-relaxed font-light mb-6">
              Access the most exclusive architectural gems in the heart of Rwanda. Your digital sanctuary awaits.
            </p>
            <blockquote className="border-l-2 border-[#ffdcc1]/70 pl-3.5 py-1 italic text-xs lg:text-sm text-white/90">
              "Architecture is the learned game, correct and magnificent, of forms assembled in the light."
              <cite className="block text-[10px] uppercase tracking-widest text-[#ffdcc1] font-bold not-italic mt-1.5">
                Curated by Emma Umutoni &amp; Dany Mugisha
              </cite>
            </blockquote>
          </div>
        </section>

        {/* Right Side: Full Length Login Form */}
        <section className="flex-1 flex flex-col justify-center px-4 sm:px-8 md:px-10 lg:px-16 xl:px-20 py-8 sm:py-12 md:py-16 bg-[#f8f9fa] z-10 w-full">
          <div className="max-w-xl w-full mx-auto">
            {/* Mobile Editorial Preview Banner (Only visible on Phone / small screens) */}
            <div className="md:hidden mb-6 relative rounded-2xl overflow-hidden shadow-md h-36 bg-[#00236f]">
              <img
                className="absolute inset-0 w-full h-full object-cover opacity-75"
                alt="Modern villa in Kigali"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDG3wsWCjYzRqV9n_92QPWgwlDryPB8g2LxpY4nKo1Bsv5IlI0DqVPhCLK4srtniEMSo4Gb97eyDXeiXmqi_ILV9PKYGCLQvfUIj8vNOLvRAKoPvwFN4GIgg1TKNythud-Qc2WTYqlkGdMni270F7xUVYendVaHxgsER_ZiQwT6dKLpKsVMTEpvbNzvoKc4FIKvzP6-TFhZb56mEf89fhbxu30kHMqx6rop42gp6s2NcDRgb97VMIeaUnx5-sw1lDke1tdGSKCmTHds"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#00236f]/90 via-[#00236f]/40 to-transparent" />
              <div className="absolute bottom-3 left-4 right-4 text-white z-10">
                <span className="text-[10px] uppercase tracking-widest font-bold text-[#ffdcc1] block">
                  Emma &amp; Dany Luxury Realty
                </span>
                <h3 className="font-['Manrope'] font-extrabold text-base leading-tight text-white">
                  Welcome to Your Rwandan Sanctuary
                </h3>
              </div>
            </div>

            {/* Header */}
            <header className="mb-6 sm:mb-8">
              <h2 className="font-['Manrope'] text-2xl sm:text-3xl font-extrabold text-[#191c1d] mb-1.5 tracking-tight">
                Sign In
              </h2>
              <p className="text-[#444651] text-xs sm:text-sm">
                Enter your credentials to access your estate portfolio.
              </p>
            </header>

            {/* Error or Alert banner */}
            {error && (
              <div className="mb-5 p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2.5 animate-in fade-in">
                <span className="material-symbols-outlined text-lg shrink-0">error</span>
                <span>{error}</span>
              </div>
            )}

            {resetMessage && (
              <div className="mb-5 p-3.5 rounded-lg bg-blue-50 border border-blue-200 text-[#00236f] text-xs flex items-center gap-2.5 animate-in fade-in">
                <span className="material-symbols-outlined text-lg shrink-0">info</span>
                <span>{resetMessage}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
              {/* Choose Your Role: Bento Style Grid matching Sign Up page */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="font-['Manrope'] font-bold text-[11px] sm:text-xs uppercase tracking-widest text-[#444651] block">
                    Choose Your Role
                  </label>
                  <span className="text-[10px] text-[#757682] uppercase tracking-wider font-semibold">
                    Portal: <strong className="text-[#00236f] capitalize">{role}</strong>
                  </span>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-2.5">
                  {(
                    [
                      { id: 'buyer', label: 'Buyer', icon: 'payments', desc: 'Acquire' },
                      { id: 'tenant', label: 'Tenant', icon: 'key', desc: 'Lease' },
                      { id: 'owner', label: 'Owner', icon: 'domain', desc: 'Hold' },
                      { id: 'agent', label: 'Agent', icon: 'real_estate_agent', desc: 'Represent' },
                      { id: 'staff', label: 'Staff/Admin', icon: 'admin_panel_settings', desc: 'Manage' },
                    ] as const
                  ).map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setRole(r.id)}
                      className={`p-2.5 sm:p-3 rounded-xl border-2 flex flex-col items-center justify-center transition-all cursor-pointer ${
                        role === r.id
                          ? 'border-[#00236f] bg-white shadow-md text-[#00236f] scale-[1.02]'
                          : 'border-transparent bg-[#f3f4f5] hover:bg-[#e7e8e9] text-[#444651]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-xl sm:text-2xl mb-1 text-[#00236f]">
                        {r.icon}
                      </span>
                      <span className="font-['Inter'] text-xs font-bold text-[#191c1d]">
                        {r.label}
                      </span>
                      <span className="text-[9px] text-[#757682] hidden sm:block">
                        {r.desc}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-1.5">
                <label
                  className="block text-[11px] sm:text-xs font-['Inter'] uppercase tracking-widest text-[#444651] font-bold"
                  htmlFor="signin-email"
                >
                  Email Address
                </label>
                <input
                  id="signin-email"
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-4 py-3 bg-[#f3f4f5] border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00236f] focus:bg-white text-base sm:text-sm text-[#191c1d] transition-all"
                />
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label
                    className="block text-[11px] sm:text-xs font-['Inter'] uppercase tracking-widest text-[#444651] font-bold"
                    htmlFor="signin-password"
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-[11px] sm:text-xs font-medium text-[#432200] hover:text-[#00236f] transition-colors underline decoration-[#f9ba82]/50 decoration-2 underline-offset-4 cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    id="signin-password"
                    required
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 pr-11 bg-[#f3f4f5] border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00236f] focus:bg-white text-base sm:text-sm text-[#191c1d] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#757682] hover:text-[#00236f] p-1 cursor-pointer"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    <span className="material-symbols-outlined text-lg">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Quick Demo Helper Pill */}
              <div className="flex items-center justify-between text-[11px] text-[#757682] pt-1">
                <span>Demo Account Available:</span>
                <button
                  type="button"
                  onClick={handleAutofillDemo}
                  className="text-[#00236f] font-semibold hover:underline cursor-pointer flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-xs">key</span>
                  Autofill VIP Credentials
                </button>
              </div>

              {/* Primary Action Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 sm:py-4 bg-[#432200] hover:bg-[#2e1500] text-white font-['Manrope'] font-bold rounded-lg active:scale-[0.98] transition-all shadow-md shadow-[#432200]/15 text-xs sm:text-sm tracking-widest uppercase cursor-pointer flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Verifying Portfolio Access...</span>
                  </>
                ) : (
                  <span>Sign In as {role.toUpperCase()}</span>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6 sm:my-7 text-center">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-[#c5c5d3]/40" />
              </div>
              <span className="relative px-3.5 bg-[#f8f9fa] text-[10px] font-['Inter'] uppercase tracking-widest text-[#757682] font-semibold">
                Or continue with
              </span>
            </div>

            {/* All 4 Social Auth Providers: Google, Apple, Git, Facebook */}
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
              {/* Google Auth */}
              <button
                type="button"
                onClick={() => setActiveSocialModal('google')}
                className="flex items-center justify-center gap-2 py-2.5 sm:py-3 px-3 bg-white rounded-lg text-xs font-semibold border border-[#c5c5d3]/40 hover:bg-[#f3f4f5] hover:border-[#00236f] transition-all cursor-pointer shadow-xs active:scale-95"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
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

              {/* Apple Auth */}
              <button
                type="button"
                onClick={() => setActiveSocialModal('apple')}
                className="flex items-center justify-center gap-1.5 py-2.5 sm:py-3 px-3 bg-white rounded-lg text-xs font-semibold border border-[#c5c5d3]/40 hover:bg-[#f3f4f5] hover:border-[#00236f] transition-all cursor-pointer shadow-xs active:scale-95"
              >
                <span className="material-symbols-outlined text-base">ios</span>
                <span>Apple ID</span>
              </button>

              {/* Git Auth */}
              <button
                type="button"
                onClick={() => setActiveSocialModal('github')}
                className="flex items-center justify-center gap-1.5 py-2.5 sm:py-3 px-3 bg-white rounded-lg text-xs font-semibold border border-[#c5c5d3]/40 hover:bg-[#f3f4f5] hover:border-[#00236f] transition-all cursor-pointer shadow-xs active:scale-95"
              >
                <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                <span>Git Auth</span>
              </button>

              {/* Facebook Auth */}
              <button
                type="button"
                onClick={() => setActiveSocialModal('facebook')}
                className="flex items-center justify-center gap-1.5 py-2.5 sm:py-3 px-3 bg-white rounded-lg text-xs font-semibold border border-[#c5c5d3]/40 hover:bg-[#f3f4f5] hover:border-[#00236f] transition-all cursor-pointer shadow-xs text-[#1877F2] active:scale-95"
              >
                <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span className="text-[#191c1d]">Facebook</span>
              </button>
            </div>

            {/* Switch to Sign Up */}
            <footer className="mt-8 text-center">
              <p className="text-xs sm:text-sm text-[#444651]">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={onNavigateToSignUp}
                  className="text-[#00236f] font-bold hover:underline underline-offset-4 cursor-pointer ml-1"
                >
                  Create an account
                </button>
              </p>
            </footer>
          </div>
        </section>
      </main>

      {/* Full-Length Screen Footer Shell */}
      <footer className="w-full py-6 sm:py-8 border-t border-[#c5c5d3]/20 bg-[#f8f9fa] mt-auto">
        <div className="flex flex-col md:flex-row justify-between items-center px-4 sm:px-6 md:px-8 max-w-7xl mx-auto gap-3 sm:gap-4 text-xs text-[#757682]">
          <div className="font-['Manrope'] font-bold text-[#00236f] text-sm">
            Emma &amp; Dany · The Digital Estate
          </div>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            <span className="hover:text-[#00236f] cursor-pointer">Privacy Policy</span>
            <span className="hover:text-[#00236f] cursor-pointer">Terms of Service</span>
            <span className="hover:text-[#00236f] cursor-pointer">Cookie Policy</span>
            <span className="hover:text-[#00236f] cursor-pointer">Rwanda RDB Realty Registry</span>
          </div>
          <div className="opacity-80">
            © {new Date().getFullYear()} Emma &amp; Dany. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Social Auth Modal with Role pass-through */}
      <SocialAuthModal
        provider={activeSocialModal}
        selectedRole={role}
        onClose={() => setActiveSocialModal(null)}
        onSuccess={onNavigateToHome}
      />
    </div>
  );
};
