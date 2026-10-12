import React from 'react';
import { ActiveScreen } from '../types';

interface FooterProps {
  onNavigate: (screen: ActiveScreen) => void;
  onOpenConsultation: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenConsultation }) => {
  return (
    <footer className="bg-[#f3f4f5] border-t border-[#c5c5d3]/20">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 max-w-7xl mx-auto px-6 md:px-8 py-20 md:py-24">
        {/* Col 1: Brand & Ethos */}
        <div className="md:col-span-1">
          <div className="font-['Manrope'] text-2xl font-bold text-[#191c1d] mb-4 tracking-tight">
            Emma &amp; Dany
          </div>
          <p className="text-[#444651] opacity-90 text-sm leading-relaxed mb-6 font-['Inter']">
            Redefining real estate in Rwanda through an architectural lens. We don't just sell properties; we curate lifestyles.
          </p>
          <div className="flex gap-4 items-center">
            <button
              onClick={() => onNavigate('about')}
              title="Global Vision"
              className="text-[#444651] hover:text-[#00236f] transition-colors p-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-xl">social_leaderboard</span>
            </button>
            <button
              onClick={onOpenConsultation}
              title="Email Advisory"
              className="text-[#444651] hover:text-[#00236f] transition-colors p-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-xl">alternate_email</span>
            </button>
            <a
              href="https://visitrwanda.com"
              target="_blank"
              rel="noreferrer"
              title="Rwanda Global Hub"
              className="text-[#444651] hover:text-[#00236f] transition-colors p-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-xl">public</span>
            </a>
          </div>
        </div>

        {/* Col 2: Properties */}
        <div className="md:col-span-1">
          <h5 className="font-['Manrope'] text-xs font-bold uppercase tracking-[0.2em] text-[#191c1d] mb-6">
            Properties
          </h5>
          <ul className="space-y-3.5">
            <li>
              <button
                onClick={() => onNavigate('houses-for-sale')}
                className="text-[#444651] text-sm hover:translate-x-1 hover:text-[#00236f] transition-all inline-block cursor-pointer font-medium"
              >
                Houses for Sale
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('houses')}
                className="text-[#444651] text-sm hover:translate-x-1 hover:text-[#00236f] transition-all inline-block cursor-pointer"
              >
                Rental Houses
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('apartments')}
                className="text-[#444651] text-sm hover:translate-x-1 hover:text-[#00236f] transition-all inline-block cursor-pointer"
              >
                Luxury Apartments
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('land')}
                className="text-[#444651] text-sm hover:translate-x-1 hover:text-[#00236f] transition-all inline-block cursor-pointer"
              >
                Land &amp; Strategic Plots
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('investments')}
                className="text-[#444651] text-sm hover:translate-x-1 hover:text-[#00236f] transition-all inline-block cursor-pointer"
              >
                Investments Marketplace
              </button>
            </li>
          </ul>
        </div>

        {/* Col 3: Company */}
        <div className="md:col-span-1">
          <h5 className="font-['Manrope'] text-xs font-bold uppercase tracking-[0.2em] text-[#191c1d] mb-6">
            Company
          </h5>
          <ul className="space-y-3.5">
            <li>
              <button
                onClick={() => onNavigate('about')}
                className="text-[#444651] text-sm hover:translate-x-1 hover:text-[#00236f] transition-all inline-block cursor-pointer"
              >
                About Our Vision
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('about')}
                className="text-[#444651] text-sm hover:translate-x-1 hover:text-[#00236f] transition-all inline-block cursor-pointer"
              >
                Meet the Team
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('about')}
                className="text-[#444651] text-sm hover:translate-x-1 hover:text-[#00236f] transition-all inline-block cursor-pointer"
              >
                Client Stories
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('contact')}
                className="text-[#444651] text-sm hover:translate-x-1 hover:text-[#00236f] transition-all inline-block cursor-pointer"
              >
                Contact Us
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('signin')}
                className="text-[#00236f] font-semibold text-sm hover:translate-x-1 transition-all inline-block cursor-pointer"
              >
                Client Sign In
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('signup')}
                className="text-[#432200] font-semibold text-sm hover:translate-x-1 transition-all inline-block cursor-pointer"
              >
                Join Digital Estate
              </button>
            </li>
          </ul>
        </div>

        {/* Col 4: Office */}
        <div className="md:col-span-1">
          <h5 className="font-['Manrope'] text-xs font-bold uppercase tracking-[0.2em] text-[#191c1d] mb-6">
            Office
          </h5>
          <p className="text-[#444651] text-sm leading-relaxed mb-1 font-medium">
            Nyarutarama Business Center
          </p>
          <p className="text-[#757682] text-sm leading-relaxed mb-4">
            KG 9 Ave, Nyarutarama, Kigali, Rwanda
          </p>
          <a
            href="tel:+250788123456"
            className="text-[#00236f] font-bold text-sm tracking-wide hover:underline block mb-2"
          >
            +250 788 123 456
          </a>
          <a
            href="mailto:curator@emma-dany.rw"
            className="text-xs text-[#757682] hover:text-[#00236f] transition-colors"
          >
            curator@emma-dany.rw
          </a>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-6 border-t border-[#c5c5d3]/20 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-[#757682]">
        <p className="font-['Inter']">
          © {new Date().getFullYear()} Emma &amp; Dany. Architectural Excellence in Rwanda.
        </p>
        <div className="flex gap-6">
          <span className="hover:text-[#00236f] cursor-pointer">Privacy Policy</span>
          <span className="hover:text-[#00236f] cursor-pointer">Terms of Service</span>
          <span className="hover:text-[#00236f] cursor-pointer">RDB Real Estate License #RW-2024</span>
        </div>
      </div>
    </footer>
  );
};
