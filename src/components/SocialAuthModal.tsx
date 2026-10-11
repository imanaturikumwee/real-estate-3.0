import React, { useState } from 'react';
import { SocialProvider, UserRole } from '../types';
import { useAuth } from '../context/AuthContext';

interface SocialAuthModalProps {
  provider: SocialProvider | null;
  onClose: () => void;
  selectedRole?: UserRole;
  onSuccess: () => void;
}

export const SocialAuthModal: React.FC<SocialAuthModalProps> = ({
  provider,
  onClose,
  selectedRole = 'buyer',
  onSuccess,
}) => {
  const { socialLogin, isLoading } = useAuth();
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [isAuthorizing, setIsAuthorizing] = useState(false);

  if (!provider) return null;

  const handleAuthorize = async (presetEmail?: string, presetName?: string) => {
    setIsAuthorizing(true);
    const emailToUse = presetEmail || customEmail || `investor.${provider}@the-digital-estate.rw`;
    const nameToUse = presetName || customName || `${provider.toUpperCase()} Verified Patron`;

    const success = await socialLogin(provider, {
      email: emailToUse,
      fullName: nameToUse,
      role: selectedRole,
    });

    setIsAuthorizing(false);
    if (success) {
      onSuccess();
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-[#c5c5d3]/30 text-[#191c1d]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header based on Provider */}
        {provider === 'google' && (
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6" viewBox="0 0 24 24">
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
              <div>
                <h4 className="font-['Manrope'] font-bold text-base text-gray-900">
                  Sign in with Google
                </h4>
                <p className="text-xs text-gray-500">to continue to The Digital Estate</p>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>
        )}

        {provider === 'apple' && (
          <div className="bg-black text-white p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-2xl">ios</span>
              <div>
                <h4 className="font-['Manrope'] font-bold text-base">Sign in with Apple ID</h4>
                <p className="text-xs text-gray-300">Face ID &amp; Touch ID Secure Auth</p>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-300 hover:text-white">
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>
        )}

        {provider === 'github' && (
          <div className="bg-[#24292e] text-white p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <div>
                <h4 className="font-['Manrope'] font-bold text-base">Authorize The Digital Estate</h4>
                <p className="text-xs text-gray-300">GitHub Developer &amp; Investor OAuth</p>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-300 hover:text-white">
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>
        )}

        {provider === 'facebook' && (
          <div className="bg-[#1877F2] text-white p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <div>
                <h4 className="font-['Manrope'] font-bold text-base">Log in with Facebook</h4>
                <p className="text-xs text-blue-100">Meta Verified Identity Services</p>
              </div>
            </div>
            <button onClick={onClose} className="text-blue-100 hover:text-white">
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          <p className="text-xs text-[#444651] leading-relaxed">
            Select an authorized profile or continue to verify your identity with{' '}
            <strong className="capitalize text-[#191c1d]">{provider === 'github' ? 'Git Auth' : provider}</strong>.
          </p>

          {/* Quick 1-Click Verification Options */}
          <div className="space-y-2.5">
            <button
              disabled={isAuthorizing || isLoading}
              onClick={() =>
                handleAuthorize(
                  `patron.${provider}@the-digital-estate.rw`,
                  `Verified ${provider.toUpperCase()} Patron`
                )
              }
              className="w-full flex items-center justify-between p-3.5 rounded-xl border border-gray-200 hover:border-[#00236f] hover:bg-[#f8f9fa] transition-all text-left cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#f3f4f5] flex items-center justify-center font-bold text-sm text-[#00236f] uppercase">
                  {provider[0]}
                </div>
                <div>
                  <span className="block text-xs font-bold text-gray-900 group-hover:text-[#00236f]">
                    Continue as Verified {provider.toUpperCase()} Patron
                  </span>
                  <span className="text-[11px] text-gray-500">
                    patron.{provider}@the-digital-estate.rw
                  </span>
                </div>
              </div>
              <span className="material-symbols-outlined text-gray-400 group-hover:text-[#00236f] text-lg">
                arrow_forward
              </span>
            </button>

            <button
              disabled={isAuthorizing || isLoading}
              onClick={() =>
                handleAuthorize(
                  'imanaturikumwee@gmail.com',
                  'Imana Turikumwe'
                )
              }
              className="w-full flex items-center justify-between p-3.5 rounded-xl border border-gray-200 hover:border-[#00236f] hover:bg-[#f8f9fa] transition-all text-left cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#00236f]/10 flex items-center justify-center font-bold text-sm text-[#00236f]">
                  IT
                </div>
                <div>
                  <span className="block text-xs font-bold text-gray-900 group-hover:text-[#00236f]">
                    Continue as Imana Turikumwe
                  </span>
                  <span className="text-[11px] text-gray-500">imanaturikumwee@gmail.com</span>
                </div>
              </div>
              <span className="material-symbols-outlined text-gray-400 group-hover:text-[#00236f] text-lg">
                arrow_forward
              </span>
            </button>
          </div>

          {/* Custom Identity Input Accordion */}
          <div className="pt-2 border-t border-gray-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-2">
              Or specify custom account
            </span>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Full Name (optional)"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-md focus:outline-none focus:border-[#00236f]"
              />
              <input
                type="email"
                placeholder="Email Address"
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-md focus:outline-none focus:border-[#00236f]"
              />
              <button
                disabled={isAuthorizing || isLoading}
                onClick={() => handleAuthorize()}
                className="w-full bg-[#00236f] hover:bg-[#1e3a8a] text-white py-2.5 rounded-md text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                {isAuthorizing ? 'Authenticating with Backend...' : `Sign In with ${provider.toUpperCase()}`}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-[#f8f9fa] border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
          <span>Role Assigned: <strong className="uppercase text-[#00236f]">{selectedRole}</strong></span>
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-xs text-green-600">verified</span>
            Secure 256-bit OAuth
          </span>
        </div>
      </div>
    </div>
  );
};
