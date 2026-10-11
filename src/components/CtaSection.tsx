import React from 'react';
import { CTA_TEXTURE_IMAGE, ADVISOR_DANY_IMAGE } from '../data/properties';

interface CtaSectionProps {
  onBookConsultation: () => void;
  onSearchAll: () => void;
  onDirectContact: () => void;
}

export const CtaSection: React.FC<CtaSectionProps> = ({
  onBookConsultation,
  onSearchAll,
  onDirectContact,
}) => {
  return (
    <section className="py-20 md:py-24 px-6 md:px-8 bg-[#f8f9fa]">
      <div className="max-w-7xl mx-auto bg-[#1e3a8a] rounded-2xl overflow-hidden relative shadow-2xl">
        {/* Architectural Texture Overlay */}
        <div className="absolute inset-0 opacity-25 pointer-events-none mix-blend-overlay">
          <img
            className="w-full h-full object-cover"
            alt="Abstract architectural lines of modern Rwandan construction"
            src={CTA_TEXTURE_IMAGE}
          />
        </div>

        {/* Ambient background glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#00236f] rounded-full blur-3xl opacity-50 -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#4059aa] rounded-full blur-3xl opacity-30 -ml-20 -mb-20 pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-12 p-8 sm:p-12 md:p-16 lg:p-20 items-center">
          {/* Left Column Text & CTAs */}
          <div className="md:col-span-7">
            <span className="text-[#90a8ff] text-xs font-bold tracking-[0.25em] uppercase block mb-3 font-['Inter']">
              Private Client Advisory
            </span>
            <h2 className="font-['Manrope'] text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight tracking-tight">
              Ready to start your journey?
            </h2>
            <p className="text-[#dce1ff] text-base md:text-lg mb-10 max-w-lg leading-relaxed font-light">
              Our team of architectural experts and investment advisors is ready to guide you to your perfect estate.
            </p>

            <div className="flex flex-wrap gap-4 items-center">
              <button
                onClick={onBookConsultation}
                className="bg-white text-[#00236f] px-7 sm:px-8 py-3.5 sm:py-4 rounded-md font-['Manrope'] text-xs sm:text-sm tracking-widest uppercase font-bold hover:bg-[#f8f9fa] hover:shadow-lg active:scale-95 transition-all duration-200 cursor-pointer shadow-md"
              >
                Book a Consultation
              </button>

              <button
                onClick={onSearchAll}
                className="border border-white/40 text-white px-7 sm:px-8 py-3.5 sm:py-4 rounded-md font-['Manrope'] text-xs sm:text-sm tracking-widest uppercase font-bold hover:bg-white/10 active:scale-95 transition-all duration-200 cursor-pointer"
              >
                Search All Listings
              </button>
            </div>
          </div>

          {/* Right Column Direct Contact Box matching mockup */}
          <div className="md:col-span-5">
            <div className="bg-white p-7 sm:p-8 rounded-xl shadow-2xl relative overflow-hidden border border-[#c5c5d3]/20">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#ffdcc1]/40 rounded-full blur-2xl -mr-12 -mt-12 pointer-events-none" />

              <div className="flex items-center justify-between mb-4">
                <h4 className="font-['Manrope'] text-xl font-bold text-[#191c1d]">
                  Direct Contact
                </h4>
                <span className="text-[10px] font-bold bg-[#f3f4f5] text-[#00236f] px-2.5 py-1 rounded-sm uppercase tracking-wider">
                  Available Now
                </span>
              </div>

              <p className="text-[#444651] text-sm mb-8 italic leading-relaxed">
                "Building the future of Rwandan luxury living, one foundation at a time."
              </p>

              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-full bg-[#c5c5d3] overflow-hidden border-2 border-white shadow-md shrink-0">
                  <img
                    className="w-full h-full object-cover"
                    alt="Dany Mugisha - Co-Founder & Advisor"
                    src={ADVISOR_DANY_IMAGE}
                  />
                </div>
                <div>
                  <p className="font-['Manrope'] font-bold text-base text-[#191c1d]">
                    Dany Mugisha
                  </p>
                  <p className="text-xs text-[#757682] font-['Inter'] font-semibold uppercase tracking-widest">
                    Co-Founder &amp; Advisor
                  </p>
                  <p className="text-xs text-[#00236f] font-medium mt-0.5">
                    Kigali, Rwanda
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#c5c5d3]/20">
                <button
                  onClick={onDirectContact}
                  className="w-full py-2.5 bg-[#f8f9fa] hover:bg-[#e7e8e9] text-[#191c1d] rounded text-xs font-bold uppercase tracking-wider text-center transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm text-[#00236f]">call</span>
                  Direct Call
                </button>
                <button
                  onClick={onBookConsultation}
                  className="w-full py-2.5 bg-[#00236f] hover:bg-[#1e3a8a] text-white rounded text-xs font-bold uppercase tracking-wider text-center transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm">calendar_month</span>
                  Schedule
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
