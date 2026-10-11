import React from 'react';
import { ADVISOR_DANY_IMAGE, HERO_IMAGE } from '../data/properties';

interface AboutScreenProps {
  onOpenConsultation: () => void;
  onExploreProperties: () => void;
}

export const AboutScreen: React.FC<AboutScreenProps> = ({
  onOpenConsultation,
  onExploreProperties,
}) => {
  return (
    <div className="py-12 md:py-16 bg-[#f8f9fa] min-h-screen">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        {/* Narrative Intro */}
        <div className="max-w-3xl mb-16">
          <span className="font-['Inter'] text-xs font-bold tracking-[0.25em] uppercase text-[#00236f] mb-3 block">
            Our Vision &amp; Heritage
          </span>
          <h1 className="font-['Manrope'] text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#191c1d] tracking-tight mb-6">
            The Editorial Architect
          </h1>
          <p className="text-[#444651] text-base md:text-lg leading-relaxed font-normal">
            Emma &amp; Dany was founded on a singular conviction: luxury real estate in Rwanda should not resemble a generic sales catalog. Every home in Kigali is an architectural statement carved into the land of a thousand hills.
          </p>
        </div>

        {/* Hero Architectural Image Feature */}
        <div className="relative rounded-2xl overflow-hidden aspect-[21/9] mb-16 shadow-xl border border-[#c5c5d3]/20">
          <img
            src={HERO_IMAGE}
            alt="Rwandan Modernist Architecture"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-8 sm:p-12">
            <div className="max-w-xl text-white">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#90a8ff] block mb-2">
                Curatorial Philosophy
              </span>
              <p className="font-['Manrope'] text-xl sm:text-2xl font-bold leading-snug">
                "We don't merely broker transactions. We curate living galleries that celebrate Rwandan natural geography and timeless international minimalism."
              </p>
            </div>
          </div>
        </div>

        {/* Meet the Founders */}
        <div className="mb-20">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#00236f] block mb-1">
              Leadership
            </span>
            <h2 className="font-['Manrope'] text-3xl font-extrabold text-[#191c1d]">
              Meet Emma &amp; Dany
            </h2>
            <p className="text-xs sm:text-sm text-[#444651] mt-2">
              Combining world-class architectural rigor with institutional investment precision.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Emma Umutoni */}
            <div className="bg-white rounded-2xl p-8 border border-[#c5c5d3]/20 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-[#00236f]/10 overflow-hidden flex items-center justify-center text-[#00236f] font-bold text-2xl font-['Manrope']">
                    EU
                  </div>
                  <div>
                    <h3 className="font-['Manrope'] text-xl font-bold text-[#191c1d]">
                      Emma Umutoni
                    </h3>
                    <p className="text-xs font-bold uppercase tracking-wider text-[#00236f]">
                      Chief Architectural Curator
                    </p>
                    <p className="text-xs text-[#757682]">
                      M.Arch, ETH Zürich · Rwandan Institute of Architects (RIA)
                    </p>
                  </div>
                </div>
                <p className="text-[#444651] text-sm leading-relaxed">
                  Emma leads the spatial curation and design vetting for every estate. Having practiced in Zurich and Nairobi before returning to Kigali, Emma champions biophilic design that pairs indigenous Musanze volcanic rock and sustainably harvested eucalyptus with Scandinavian minimalism.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#c5c5d3]/20 text-xs text-[#757682] italic">
                "A true Rwandan luxury home lets the hillside breeze circulate naturally through open volumes without forcing artificial barriers."
              </div>
            </div>

            {/* Dany Mugisha */}
            <div className="bg-white rounded-2xl p-8 border border-[#c5c5d3]/20 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#00236f] shrink-0">
                    <img
                      src={ADVISOR_DANY_IMAGE}
                      alt="Dany Mugisha"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-['Manrope'] text-xl font-bold text-[#191c1d]">
                      Dany Mugisha
                    </h3>
                    <p className="text-xs font-bold uppercase tracking-wider text-[#00236f]">
                      Co-Founder &amp; Investment Advisor
                    </p>
                    <p className="text-xs text-[#757682]">
                      MSc Finance, London Business School · Certified RDB Advisor
                    </p>
                  </div>
                </div>
                <p className="text-[#444651] text-sm leading-relaxed">
                  Dany orchestrates acquisition structuring and legal title verification for private family offices, diaspora executives, and international diplomats. His deep knowledge of Kigali Masterplan 2050 zoning guarantees that every acquisition possesses legal safety and yield resilience.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#c5c5d3]/20 text-xs text-[#757682] italic">
                "We protect our clients' capital with transparent Rwandan land registries, clear titles, and vetted rental returns."
              </div>
            </div>
          </div>
        </div>

        {/* The 4 Architectural Tenets */}
        <div className="bg-[#f3f4f5] rounded-2xl p-8 md:p-12 mb-16 border border-[#c5c5d3]/30">
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#00236f] block mb-1">
              Design Manifesto
            </span>
            <h2 className="font-['Manrope'] text-2xl sm:text-3xl font-extrabold text-[#191c1d]">
              The 4 Architectural Tenets
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-[#444651]">
            <div className="space-y-2">
              <strong className="text-[#191c1d] block font-['Manrope'] text-base">
                1. Topographical Harmony
              </strong>
              <p>
                Homes should not bulldoze the hills of Kigali; they should step naturally down the slopes, preserving natural water runoffs and framing dramatic panoramic vistas.
              </p>
            </div>
            <div className="space-y-2">
              <strong className="text-[#191c1d] block font-['Manrope'] text-base">
                2. Authentic Materiality
              </strong>
              <p>
                We celebrate local basalt stone masonry, cedar timber screens, and polished terrazzo flooring over synthetic imported plastics that age poorly in tropical light.
              </p>
            </div>
            <div className="space-y-2">
              <strong className="text-[#191c1d] block font-['Manrope'] text-base">
                3. Passive Climate Engineering
              </strong>
              <p>
                Kigali enjoys year-round 18°C–27°C spring-like temperatures. Proper cantilevered eaves and cross-ventilation atria eliminate the need for 24/7 mechanical air conditioning.
              </p>
            </div>
            <div className="space-y-2">
              <strong className="text-[#191c1d] block font-['Manrope'] text-base">
                4. Private Sanctuary &amp; Security
              </strong>
              <p>
                Discreet embassy-grade perimeter walls, integrated smart cameras, and lush indigenous ficus landscaping create private havens for our distinguished residents.
              </p>
            </div>
          </div>
        </div>

        {/* Client Stories */}
        <div className="mb-16">
          <h3 className="font-['Manrope'] text-2xl font-bold text-[#191c1d] mb-8 text-center">
            What Our Patrons Say
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-[#c5c5d3]/20 shadow-xs">
              <div className="flex gap-1 text-[#432200] mb-3">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="material-symbols-outlined text-sm">star</span>
                ))}
              </div>
              <p className="text-xs text-[#444651] leading-relaxed mb-4 italic">
                "Relocating our diplomatic delegation from Geneva to Kigali required a residence with specific architectural security and golf course views. Emma &amp; Dany secured our Nyarutarama villa within two weeks."
              </p>
              <p className="font-bold text-xs text-[#191c1d]">Ambassador H. von Berner</p>
              <p className="text-[10px] text-[#757682]">European Diplomatic Mission</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-[#c5c5d3]/20 shadow-xs">
              <div className="flex gap-1 text-[#432200] mb-3">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="material-symbols-outlined text-sm">star</span>
                ))}
              </div>
              <p className="text-xs text-[#444651] leading-relaxed mb-4 italic">
                "As a Rwandan working in San Francisco, buying property back home from overseas used to be opaque. Dany handled the RDB title registration seamlessly and our Gacuhiro duplex is generating 11% net yield."
              </p>
              <p className="font-bold text-xs text-[#191c1d]">Dr. Claire Uwera</p>
              <p className="text-[10px] text-[#757682]">Diaspora Tech Founder, Bay Area</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-[#c5c5d3]/20 shadow-xs">
              <div className="flex gap-1 text-[#432200] mb-3">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="material-symbols-outlined text-sm">star</span>
                ))}
              </div>
              <p className="text-xs text-[#444651] leading-relaxed mb-4 italic">
                "The Zen Pavilion was our dream home. The spatial flow and natural light are extraordinary. Emma &amp; Dany's architectural eye is unmatched in East Africa."
              </p>
              <p className="font-bold text-xs text-[#191c1d]">Marc &amp; Sarah Tremblay</p>
              <p className="text-[10px] text-[#757682]">Private Equity Partners, Kigali</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center py-8">
          <button
            onClick={onOpenConsultation}
            className="bg-[#00236f] hover:bg-[#1e3a8a] text-white px-8 py-4 rounded-md font-['Manrope'] text-xs font-bold uppercase tracking-widest shadow-lg active:scale-95 transition-all cursor-pointer mr-4"
          >
            Meet the Advisory Team
          </button>
          <button
            onClick={onExploreProperties}
            className="border border-[#00236f] text-[#00236f] px-8 py-4 rounded-md font-['Manrope'] text-xs font-bold uppercase tracking-widest hover:bg-[#00236f]/5 transition-all cursor-pointer"
          >
            Explore Masterpieces
          </button>
        </div>
      </div>
    </div>
  );
};
