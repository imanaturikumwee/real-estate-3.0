import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { SocialProvider } from '../types';
import { SocialAuthModal } from './SocialAuthModal';

interface SignInScreenProps {
  onNavigateToSignUp: () => void;
  onNavigateToHome: () => void;
}

export const SignInScreen: React.FC<SignInScreenProps> = ({
  onNavigateToSignUp,
  onNavigateToHome,
}) => {
  const { login, isLoading, error, forgotPassword } = useAuth();
  const [email, setEmail] = useState('imanaturikumwee@gmail.com');
  const [password, setPassword] = useState('estate2024');
  const [activeSocialModal, setActiveSocialModal] = useState<SocialProvider | null>(null);
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      onNavigateToHome();
    }
  };

  const handleForgotPassword = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!email) {
      setResetMessage('Please input your email address first.');
      return;
    }
    const msg = await forgotPassword(email);
    setResetMessage(msg);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#191c1d] flex flex-col font-['Inter']">
      {/* TopAppBar Navigation Shell */}
      <header className="fixed top-0 w-full z-40 bg-[#f8f9fa]/80 backdrop-blur-xl border-b border-[#c5c5d3]/20">
        <div className="flex justify-between items-center px-6 md:px-8 py-4 max-w-7xl mx-auto">
          <button
            onClick={onNavigateToHome}
            className="text-xl font-bold text-[#00236f] tracking-tight font-['Manrope'] cursor-pointer hover:opacity-85 text-left"
          >
            The Digital Estate
          </button>
          <div className="flex items-center gap-6">
            <span className="text-[#444651] text-xs font-['Inter'] uppercase tracking-widest hidden md:block font-bold">
              Emma &amp; Dany
            </span>
            <button
              onClick={onNavigateToHome}
              className="text-[#444651] hover:text-[#00236f] text-xs font-semibold uppercase tracking-wider cursor-pointer"
            >
              Browse Estates
            </button>
          </div>
        </div>
      </header>

      {/* Main Split Layout */}
      <main className="min-h-screen flex flex-col md:flex-row pt-16 md:pt-0 flex-grow">
        {/* Left Side: Asymmetric Editorial Image Section */}
        <section className="hidden md:flex md:w-7/12 lg:w-3/5 h-screen sticky top-0 bg-[#f3f4f5] overflow-hidden">
          <div className="relative w-full h-full">
            <img
              className="absolute inset-0 w-full h-full object-cover"
              alt="Modern architectural masterpiece in Rwanda at sunset, golden light reflecting off floor-to-ceiling glass windows with lush tropical gardens"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDG3wsWCjYzRqV9n_92QPWgwlDryPB8g2LxpY4nKo1Bsv5IlI0DqVPhCLK4srtniEMSo4Gb97eyDXeiXmqi_ILV9PKYGCLQvfUIj8vNOLvRAKoPvwFN4GIgg1TKNythud-Qc2WTYqlkGdMni270F7xUVYendVaHxgsER_ZiQwT6dKLpKsVMTEpvbNzvoKc4FIKvzP6-TFhZb56mEf89fhbxu30kHMqx6rop42gp6s2NcDRgb97VMIeaUnx5-sw1lDke1tdGSKCmTHds"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-[#00236f]/50 via-transparent to-transparent" />
            <div className="absolute bottom-16 left-16 max-w-lg z-10">
              <h1 className="font-['Manrope'] text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-4 drop-shadow-sm tracking-tight">
                Welcome Home to <br />Emma &amp; Dany.
              </h1>
              <p className="text-white/95 text-base lg:text-lg leading-relaxed font-light">
                Access the most exclusive architectural gems in the heart of Rwanda. Your digital sanctuary awaits.
              </p>
            </div>
          </div>
        </section>

        {/* Right Side: Minimal Login Form */}
        <section className="flex-1 flex flex-col justify-center px-8 md:px-12 lg:px-20 py-12 bg-[#f8f9fa] z-10">
          <div className="max-w-md w-full mx-auto">
            {/* Header */}
            <header className="mb-8 md:mb-10">
              <h2 className="font-['Manrope'] text-3xl font-extrabold text-[#191c1d] mb-2 tracking-tight">
                Sign In
              </h2>
              <p className="text-[#444651] text-sm">
                Enter your credentials to access your estate portfolio.
              </p>
            </header>

            {/* Error or Alert banner */}
            {error && (
              <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <span className="material-symbols-outlined text-base">error</span>
                <span>{error}</span>
              </div>
            )}

            {resetMessage && (
              <div className="mb-6 p-4 rounded-lg bg-blue-50 border border-blue-200 text-[#00236f] text-xs flex items-center gap-2">
                <span className="material-symbols-outlined text-base">info</span>
                <span>{resetMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div className="space-y-1.5">
                <label
                  className="block text-xs font-['Inter'] uppercase tracking-widest text-[#444651] font-bold"
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
                  className="w-full px-4 py-3 bg-[#f3f4f5] border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-[#00236f] focus:bg-white text-sm text-[#191c1d] transition-all"
                />
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label
                    className="block text-xs font-['Inter'] uppercase tracking-widest text-[#444651] font-bold"
                    htmlFor="signin-password"
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-xs font-medium text-[#432200] hover:text-[#00236f] transition-colors underline decoration-[#f9ba82]/50 decoration-2 underline-offset-4 cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <input
                  id="signin-password"
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-[#f3f4f5] border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-[#00236f] focus:bg-white text-sm text-[#191c1d] transition-all"
                />
              </div>

              {/* Primary Action Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-[#432200] hover:bg-[#2e1500] text-white font-['Manrope'] font-bold rounded-md active:scale-[0.98] transition-all shadow-lg shadow-[#191c1d]/5 mt-4 text-xs tracking-widest uppercase cursor-pointer"
              >
                {isLoading ? 'Verifying Portfolio Access...' : 'Sign In to Estate'}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-8 text-center">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-[#c5c5d3]/30" />
              </div>
              <span className="relative px-4 bg-[#f8f9fa] text-[10px] font-['Inter'] uppercase tracking-widest text-[#757682] font-semibold">
                Or continue with
              </span>
            </div>

            {/* All 4 Social Auth Providers: Google, Apple, Git, Facebook */}
            <div className="grid grid-cols-2 gap-3">
              {/* Google Auth */}
              <button
                type="button"
                onClick={() => setActiveSocialModal('google')}
                className="flex items-center justify-center gap-2.5 py-3 px-3 bg-white rounded-md text-xs font-semibold border border-[#c5c5d3]/40 hover:bg-[#f3f4f5] hover:border-[#00236f] transition-all cursor-pointer shadow-xs"
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
                className="flex items-center justify-center gap-2 py-3 px-3 bg-white rounded-md text-xs font-semibold border border-[#c5c5d3]/40 hover:bg-[#f3f4f5] hover:border-[#00236f] transition-all cursor-pointer shadow-xs"
              >
                <span className="material-symbols-outlined text-base">ios</span>
                <span>Apple</span>
              </button>

              {/* Git Auth */}
              <button
                type="button"
                onClick={() => setActiveSocialModal('github')}
                className="flex items-center justify-center gap-2 py-3 px-3 bg-white rounded-md text-xs font-semibold border border-[#c5c5d3]/40 hover:bg-[#f3f4f5] hover:border-[#00236f] transition-all cursor-pointer shadow-xs"
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
                className="flex items-center justify-center gap-2 py-3 px-3 bg-white rounded-md text-xs font-semibold border border-[#c5c5d3]/40 hover:bg-[#f3f4f5] hover:border-[#00236f] transition-all cursor-pointer shadow-xs text-[#1877F2]"
              >
                <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span className="text-[#191c1d]">Facebook</span>
              </button>
            </div>

            {/* Footer Text */}
            <footer className="mt-8 text-center">
              <p className="text-xs text-[#444651]">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={onNavigateToSignUp}
                  className="text-[#00236f] font-bold hover:underline underline-offset-4 cursor-pointer"
                >
                  Create an account
                </button>
              </p>
            </footer>
          </div>
        </section>
      </main>

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
        onClose={() => setActiveSocialModal(null)}
        onSuccess={onNavigateToHome}
      />
    </div>
  );
};
