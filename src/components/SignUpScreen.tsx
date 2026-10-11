import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole, SocialProvider } from '../types';
import { SocialAuthModal } from './SocialAuthModal';

interface SignUpScreenProps {
  onNavigateToSignIn: () => void;
  onNavigateToHome: () => void;
}

export const SignUpScreen: React.FC<SignUpScreenProps> = ({
  onNavigateToSignIn,
  onNavigateToHome,
}) => {
  const { register, isLoading, error } = useAuth();
  const [role, setRole] = useState<UserRole>('buyer');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+250 788 ');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [activeSocialModal, setActiveSocialModal] = useState<SocialProvider | null>(null);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await register({
      fullName,
      email,
      phone,
      password,
      role,
    });

    if (success) {
      setShowSuccessNotification(true);
      setTimeout(() => {
        onNavigateToHome();
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#191c1d] flex flex-col font-['Inter']">
      <main className="min-h-screen flex flex-col md:flex-row flex-grow">
        {/* Left Side: Editorial Image & Brand Section */}
        <section className="hidden md:flex md:w-5/12 lg:w-1/2 relative overflow-hidden bg-[#00236f]">
          <img
            alt="Stunning architectural photograph of a contemporary luxury villa in Rwanda at golden hour"
            className="absolute inset-0 w-full h-full object-cover opacity-85 mix-blend-multiply"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC38-4Puf1GZr8evJACUGqtPRL2uCyB_NRbK0d4r6-4bQUSWHOWOdHQGAv5Ln0A59o38-40sW4ummOU2jit_dEtXg0CaD2fKAA-bwmcyEyk0hwDAn31U-yigi7B29iNQn87Kh4vRsD856qfTI5nE9vP9heWd4XiG1yGct8EByFOoou3eGPxF5JVfwn3vQvn9aXjYvrL8SYDr78DIbjER5mZYFaT_fOmmjg6N4HweUdmPDRudZCIePSh77KQAQgH471baCwKCZWO7Ljn"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#00236f]/90 via-[#00236f]/30 to-transparent" />

          {/* Top Brand Logo */}
          <div className="absolute top-10 left-12 z-20">
            <button
              onClick={onNavigateToHome}
              className="font-['Manrope'] font-black text-2xl tracking-tighter text-white hover:opacity-90 cursor-pointer text-left"
            >
              EMMA &amp; DANY
            </button>
            <span className="block text-[10px] uppercase tracking-[0.25em] text-[#dce1ff] font-semibold mt-0.5">
              The Digital Estate · Rwanda
            </span>
          </div>

          {/* Bottom Editorial Content */}
          <div className="relative z-10 mt-auto p-12 lg:p-16 text-white">
            <div className="mb-6 h-[2px] w-20 bg-[#ffdcc1]" />
            <h2 className="font-['Manrope'] font-extrabold text-4xl lg:text-5xl tracking-tight mb-4 leading-tight">
              Horizon Kinshasa &amp; Kigali.<br />Architectural Integrity.
            </h2>
            <p className="font-['Inter'] text-base text-[#dce1ff] max-w-md leading-relaxed mb-6">
              Join a curated ecosystem of premier properties and discerning stakeholders in the Rwandan landscape.
            </p>

            <blockquote className="border-l-2 border-[#ffdcc1]/60 pl-4 py-1 italic text-sm text-white/90">
              "Luxury is defined by the space you don’t fill."
              <cite className="block text-[10px] uppercase tracking-widest text-[#ffdcc1] font-bold not-italic mt-1">
                Emma &amp; Dany Design Philosophy
              </cite>
            </blockquote>
          </div>
        </section>

        {/* Right Side: Sign-Up Form Section */}
        <section className="flex-1 flex items-center justify-center p-6 sm:p-10 md:p-12 lg:p-20 bg-[#f8f9fa] z-10">
          <div className="w-full max-w-xl">
            {/* Mobile Header Logo */}
            <div className="md:hidden flex justify-between items-center mb-8">
              <button
                onClick={onNavigateToHome}
                className="font-['Manrope'] font-extrabold text-xl text-[#00236f] tracking-tight"
              >
                The Digital Estate
              </button>
              <button
                onClick={onNavigateToSignIn}
                className="text-xs font-bold text-[#00236f] uppercase tracking-wider"
              >
                Log In
              </button>
            </div>

            {/* Header */}
            <header className="mb-8">
              <h1 className="font-['Manrope'] font-extrabold text-3xl sm:text-4xl text-[#00236f] mb-2 tracking-tight">
                Join the Digital Estate
              </h1>
              <p className="text-[#444651] text-sm">
                Create your account to start your journey with Emma &amp; Dany.
              </p>
            </header>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <span className="material-symbols-outlined text-base">error</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Role Selection: Bento Style Grid matching mockup */}
              <div className="space-y-3">
                <label className="font-['Manrope'] font-bold text-xs uppercase tracking-widest text-[#444651] block">
                  Choose Your Role
                </label>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {/* Buyer */}
                  <label
                    onClick={() => setRole('buyer')}
                    className="relative group cursor-pointer"
                  >
                    <div
                      className={`p-3.5 h-full flex flex-col items-center justify-center rounded-xl border-2 transition-all duration-200 ${
                        role === 'buyer'
                          ? 'border-[#1e3a8a] bg-white shadow-md'
                          : 'border-transparent bg-[#f3f4f5] hover:bg-[#e7e8e9]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[#00236f] text-2xl mb-1">
                        payments
                      </span>
                      <span className="font-['Inter'] text-xs font-bold text-[#191c1d]">
                        Buyer
                      </span>
                    </div>
                  </label>

                  {/* Tenant */}
                  <label
                    onClick={() => setRole('tenant')}
                    className="relative group cursor-pointer"
                  >
                    <div
                      className={`p-3.5 h-full flex flex-col items-center justify-center rounded-xl border-2 transition-all duration-200 ${
                        role === 'tenant'
                          ? 'border-[#1e3a8a] bg-white shadow-md'
                          : 'border-transparent bg-[#f3f4f5] hover:bg-[#e7e8e9]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[#00236f] text-2xl mb-1">
                        key
                      </span>
                      <span className="font-['Inter'] text-xs font-bold text-[#191c1d]">
                        Tenant
                      </span>
                    </div>
                  </label>

                  {/* Owner */}
                  <label
                    onClick={() => setRole('owner')}
                    className="relative group cursor-pointer"
                  >
                    <div
                      className={`p-3.5 h-full flex flex-col items-center justify-center rounded-xl border-2 transition-all duration-200 ${
                        role === 'owner'
                          ? 'border-[#1e3a8a] bg-white shadow-md'
                          : 'border-transparent bg-[#f3f4f5] hover:bg-[#e7e8e9]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[#00236f] text-2xl mb-1">
                        domain
                      </span>
                      <span className="font-['Inter'] text-xs font-bold text-[#191c1d]">
                        Owner
                      </span>
                    </div>
                  </label>

                  {/* Agent */}
                  <label
                    onClick={() => setRole('agent')}
                    className="relative group cursor-pointer"
                  >
                    <div
                      className={`p-3.5 h-full flex flex-col items-center justify-center rounded-xl border-2 transition-all duration-200 ${
                        role === 'agent'
                          ? 'border-[#1e3a8a] bg-white shadow-md'
                          : 'border-transparent bg-[#f3f4f5] hover:bg-[#e7e8e9]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[#00236f] text-2xl mb-1">
                        real_estate_agent
                      </span>
                      <span className="font-['Inter'] text-xs font-bold text-[#191c1d]">
                        Agent
                      </span>
                    </div>
                  </label>

                  {/* Staff / Admin */}
                  <label
                    onClick={() => setRole('staff')}
                    className="relative group cursor-pointer col-span-2 lg:col-span-1"
                  >
                    <div
                      className={`p-3.5 h-full flex flex-col items-center justify-center rounded-xl border-2 transition-all duration-200 ${
                        role === 'staff'
                          ? 'border-[#1e3a8a] bg-white shadow-md'
                          : 'border-transparent bg-[#f3f4f5] hover:bg-[#e7e8e9]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[#00236f] text-2xl mb-1">
                        admin_panel_settings
                      </span>
                      <span className="font-['Inter'] text-xs font-bold text-[#191c1d]">
                        Staff/Admin
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Input Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="space-y-1">
                  <label
                    className="block text-xs font-bold uppercase tracking-widest text-[#757682]"
                    htmlFor="signup-fullname"
                  >
                    Full Name *
                  </label>
                  <input
                    id="signup-fullname"
                    required
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full bg-[#f3f4f5] border-b-2 border-[#c5c5d3]/60 focus:border-[#00236f] focus:bg-white focus:outline-none py-2.5 px-3 text-sm text-[#191c1d] rounded-t transition-all"
                  />
                </div>

                {/* Email Address */}
                <div className="space-y-1">
                  <label
                    className="block text-xs font-bold uppercase tracking-widest text-[#757682]"
                    htmlFor="signup-email"
                  >
                    Email Address *
                  </label>
                  <input
                    id="signup-email"
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@horizon.com"
                    className="w-full bg-[#f3f4f5] border-b-2 border-[#c5c5d3]/60 focus:border-[#00236f] focus:bg-white focus:outline-none py-2.5 px-3 text-sm text-[#191c1d] rounded-t transition-all"
                  />
                </div>

                {/* Phone Number */}
                <div className="space-y-1">
                  <label
                    className="block text-xs font-bold uppercase tracking-widest text-[#757682]"
                    htmlFor="signup-phone"
                  >
                    Phone Number
                  </label>
                  <input
                    id="signup-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+250 000 000 000"
                    className="w-full bg-[#f3f4f5] border-b-2 border-[#c5c5d3]/60 focus:border-[#00236f] focus:bg-white focus:outline-none py-2.5 px-3 text-sm text-[#191c1d] rounded-t transition-all"
                  />
                </div>

                {/* Secure Password */}
                <div className="space-y-1">
                  <label
                    className="block text-xs font-bold uppercase tracking-widest text-[#757682]"
                    htmlFor="signup-password"
                  >
                    Secure Password *
                  </label>
                  <div className="relative">
                    <input
                      id="signup-password"
                      required
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-[#f3f4f5] border-b-2 border-[#c5c5d3]/60 focus:border-[#00236f] focus:bg-white focus:outline-none py-2.5 px-3 pr-10 text-sm text-[#191c1d] rounded-t transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#757682] hover:text-[#00236f] cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-lg">
                        {showPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Terms disclaimer */}
              <p className="text-xs text-[#444651] leading-relaxed">
                By creating an account, you agree to our{' '}
                <span className="text-[#432200] font-semibold underline decoration-[#f9ba82]/60 cursor-pointer">
                  Terms of Service
                </span>{' '}
                and{' '}
                <span className="text-[#432200] font-semibold underline decoration-[#f9ba82]/60 cursor-pointer">
                  Privacy Policy
                </span>
                .
              </p>

              {/* Primary Action Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#432200] hover:bg-[#2e1500] text-white font-['Manrope'] font-bold py-4 rounded-md active:scale-[0.98] transition-all shadow-xl shadow-[#432200]/10 tracking-widest uppercase text-xs cursor-pointer"
              >
                {isLoading ? 'Creating Your Account...' : 'Create Account'}
              </button>

              {/* Social Auth Separator */}
              <div className="flex items-center gap-4 pt-2">
                <div className="flex-1 h-px bg-[#c5c5d3]/40" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#757682]">
                  or authenticate with
                </span>
                <div className="flex-1 h-px bg-[#c5c5d3]/40" />
              </div>

              {/* 4 Social Logins: Google, Apple, Git, Facebook */}
              <div className="grid grid-cols-2 gap-3">
                {/* Google */}
                <button
                  type="button"
                  onClick={() => setActiveSocialModal('google')}
                  className="flex items-center justify-center gap-2.5 py-3 px-4 bg-white border border-[#c5c5d3]/50 rounded-md hover:bg-[#f3f4f5] transition-colors cursor-pointer group"
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
                  <span className="font-['Inter'] text-xs font-semibold uppercase tracking-wider text-[#191c1d]">
                    Google
                  </span>
                </button>

                {/* Apple ID */}
                <button
                  type="button"
                  onClick={() => setActiveSocialModal('apple')}
                  className="flex items-center justify-center gap-2.5 py-3 px-4 bg-white border border-[#c5c5d3]/50 rounded-md hover:bg-[#f3f4f5] transition-colors cursor-pointer group"
                >
                  <span className="material-symbols-outlined text-[#191c1d] text-lg">ios</span>
                  <span className="font-['Inter'] text-xs font-semibold uppercase tracking-wider text-[#191c1d]">
                    Apple ID
                  </span>
                </button>

                {/* Git Auth */}
                <button
                  type="button"
                  onClick={() => setActiveSocialModal('github')}
                  className="flex items-center justify-center gap-2.5 py-3 px-4 bg-white border border-[#c5c5d3]/50 rounded-md hover:bg-[#f3f4f5] transition-colors cursor-pointer group"
                >
                  <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  <span className="font-['Inter'] text-xs font-semibold uppercase tracking-wider text-[#191c1d]">
                    Git Auth
                  </span>
                </button>

                {/* Facebook */}
                <button
                  type="button"
                  onClick={() => setActiveSocialModal('facebook')}
                  className="flex items-center justify-center gap-2.5 py-3 px-4 bg-white border border-[#c5c5d3]/50 rounded-md hover:bg-[#f3f4f5] transition-colors cursor-pointer group text-[#1877F2]"
                >
                  <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  <span className="font-['Inter'] text-xs font-semibold uppercase tracking-wider text-[#191c1d]">
                    Facebook
                  </span>
                </button>
              </div>

              {/* Footer Links */}
              <footer className="text-center pt-2">
                <p className="font-['Inter'] text-sm text-[#444651]">
                  Already part of the estate?{' '}
                  <button
                    type="button"
                    onClick={onNavigateToSignIn}
                    className="text-[#00236f] font-bold hover:underline ml-1 cursor-pointer"
                  >
                    Log In
                  </button>
                </p>
              </footer>
            </form>
          </div>
        </section>
      </main>

      {/* Success Notification Popup matching mockup */}
      {showSuccessNotification && (
        <div className="fixed bottom-8 right-8 bg-white p-5 rounded-xl shadow-2xl border-l-4 border-[#432200] flex items-center gap-4 max-w-sm z-[100] animate-in slide-in-from-bottom-4 duration-300">
          <div className="bg-[#ffdcc1] p-2 rounded-full text-[#603609]">
            <span className="material-symbols-outlined text-xl">check_circle</span>
          </div>
          <div>
            <h4 className="font-['Manrope'] font-bold text-sm text-[#191c1d]">
              Welcome to the Estate
            </h4>
            <p className="font-['Inter'] text-xs text-[#444651]">
              Your registration as <strong className="uppercase">{role}</strong> has been processed with architectural precision.
            </p>
          </div>
        </div>
      )}

      {/* Site Footer Shell */}
      <footer className="w-full py-8 border-t border-[#c5c5d3]/20 bg-[#f8f9fa]">
        <div className="flex flex-col md:flex-row justify-between items-center px-6 md:px-8 max-w-7xl mx-auto gap-4 text-xs text-[#757682]">
          <div className="font-['Manrope'] font-bold text-[#00236f] text-sm">
            The Digital Estate
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            <span className="hover:text-[#00236f] cursor-pointer">Privacy Policy</span>
            <span className="hover:text-[#00236f] cursor-pointer">Terms of Service</span>
            <span className="hover:text-[#00236f] cursor-pointer">Cookie Policy</span>
            <span className="hover:text-[#00236f] cursor-pointer">Support</span>
          </div>
          <div className="opacity-80">
            © {new Date().getFullYear()} The Digital Estate. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Social Auth Modal */}
      <SocialAuthModal
        provider={activeSocialModal}
        selectedRole={role}
        onClose={() => setActiveSocialModal(null)}
        onSuccess={() => {
          setShowSuccessNotification(true);
          setTimeout(() => onNavigateToHome(), 1200);
        }}
      />
    </div>
  );
};
