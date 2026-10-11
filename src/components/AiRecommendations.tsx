import React, { useState } from 'react';
import { Property } from '../types';

interface AiRecommendationsProps {
  properties: Property[];
  onSelectProperty: (property: Property) => void;
}

export const AiRecommendations: React.FC<AiRecommendationsProps> = ({
  properties,
  onSelectProperty,
}) => {
  const [activePreference, setActivePreference] = useState<'sustainable' | 'yield' | 'panoramic'>('sustainable');

  // Find the featured AI matches from the dataset
  const zenPavilion = properties.find((p) => p.id === 'zen-pavilion');
  const skyPenthouse = properties.find((p) => p.id === 'sky-terrace-penthouse');
  const hilltop = properties.find((p) => p.id === 'hilltop-retreat');

  // Active items based on user preference toggle
  const match1 =
    activePreference === 'panoramic'
      ? hilltop || zenPavilion!
      : zenPavilion!;

  const match2 = skyPenthouse!;

  const match1Score = activePreference === 'panoramic' ? 99 : 98;
  const match1Reason =
    activePreference === 'panoramic'
      ? 'Dominates Rebero summit with 360° unobstructed panoramic mountain vistas.'
      : 'Matches your preference for open-concept floor plans and sustainable materials.';

  return (
    <section className="py-20 md:py-24 bg-[#f3f4f5]">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <span className="bg-[#00236f]/10 text-[#00236f] px-4 py-1 rounded-full text-[10px] font-['Inter'] font-bold uppercase tracking-widest inline-block mb-4">
            Smart Matching
          </span>
          <h2 className="font-['Manrope'] text-3xl sm:text-4xl font-extrabold text-[#191c1d] mb-4 tracking-tight">
            AI Recommendations
          </h2>
          <p className="text-[#444651] max-w-xl mx-auto text-sm md:text-base leading-relaxed">
            Properties perfectly matched to your aesthetic preferences and investment goals through our proprietary engine.
          </p>

          {/* Interactive Taste Profile Selector */}
          <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-2 p-1.5 bg-white/80 rounded-full border border-[#c5c5d3]/30 shadow-xs">
            <span className="text-[11px] font-semibold text-[#757682] px-3 uppercase tracking-wider">
              Profile:
            </span>
            <button
              onClick={() => setActivePreference('sustainable')}
              className={`px-3.5 py-1 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                activePreference === 'sustainable'
                  ? 'bg-[#00236f] text-white shadow-xs'
                  : 'text-[#444651] hover:text-[#00236f]'
              }`}
            >
              Sustainable Materials
            </button>
            <button
              onClick={() => setActivePreference('yield')}
              className={`px-3.5 py-1 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                activePreference === 'yield'
                  ? 'bg-[#00236f] text-white shadow-xs'
                  : 'text-[#444651] hover:text-[#00236f]'
              }`}
            >
              High-Yield Urban
            </button>
            <button
              onClick={() => setActivePreference('panoramic')}
              className={`px-3.5 py-1 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                activePreference === 'panoramic'
                  ? 'bg-[#00236f] text-white shadow-xs'
                  : 'text-[#444651] hover:text-[#00236f]'
              }`}
            >
              Hillside Views
            </button>
          </div>
        </div>

        {/* AI Recommendations Grid matching mockup */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* AI Property Card 1 */}
          <div className="flex flex-col md:flex-row bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-[#c5c5d3]/15 group">
            <div className="md:w-5/12 aspect-square md:aspect-auto overflow-hidden relative">
              <img
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                alt={match1.title}
                src={match1.image}
              />
              <div className="absolute top-3 left-3 bg-[#00236f]/90 text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                {match1.neighborhood}
              </div>
            </div>

            <div className="p-6 md:p-8 flex flex-col justify-between flex-1">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-[10px] font-extrabold text-[#00236f] font-['Inter'] uppercase tracking-tight whitespace-nowrap">
                    {match1Score}% Match
                  </span>
                  <div className="flex-1 h-[3px] bg-[#00236f]/15 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#00236f] rounded-full transition-all duration-700"
                      style={{ width: `${match1Score}%` }}
                    />
                  </div>
                </div>

                <div className="flex justify-between items-start gap-2 mb-2">
                  <h4 className="font-['Manrope'] text-xl font-bold text-[#191c1d] group-hover:text-[#00236f] transition-colors">
                    {match1.title}
                  </h4>
                  <span className="text-sm font-bold text-[#00236f] font-['Manrope']">
                    {match1.priceDisplay}
                  </span>
                </div>

                <p className="text-[#444651] text-xs sm:text-sm mb-6 leading-relaxed">
                  {match1Reason}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => onSelectProperty(match1)}
                  className="bg-[#e7e8e9] hover:bg-[#00236f] hover:text-white text-[#00236f] px-6 py-2.5 rounded-md font-['Manrope'] text-xs tracking-widest uppercase font-bold transition-all duration-200 cursor-pointer"
                >
                  Explore Details
                </button>
                <span className="text-xs text-[#757682] font-medium">
                  {match1.beds} Beds · {match1.sqft} sqft
                </span>
              </div>
            </div>
          </div>

          {/* AI Property Card 2 */}
          <div className="flex flex-col md:flex-row bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-[#c5c5d3]/15 group">
            <div className="md:w-5/12 aspect-square md:aspect-auto overflow-hidden relative">
              <img
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                alt={match2.title}
                src={match2.image}
              />
              <div className="absolute top-3 left-3 bg-[#00236f]/90 text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                {match2.neighborhood}
              </div>
            </div>

            <div className="p-6 md:p-8 flex flex-col justify-between flex-1">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-[10px] font-extrabold text-[#00236f] font-['Inter'] uppercase tracking-tight whitespace-nowrap">
                    94% Match
                  </span>
                  <div className="flex-1 h-[3px] bg-[#00236f]/15 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#00236f] rounded-full transition-all duration-700"
                      style={{ width: '94%' }}
                    />
                  </div>
                </div>

                <div className="flex justify-between items-start gap-2 mb-2">
                  <h4 className="font-['Manrope'] text-xl font-bold text-[#191c1d] group-hover:text-[#00236f] transition-colors">
                    {match2.title}
                  </h4>
                  <span className="text-sm font-bold text-[#00236f] font-['Manrope']">
                    {match2.priceDisplay}
                  </span>
                </div>

                <p className="text-[#444651] text-xs sm:text-sm mb-6 leading-relaxed">
                  Ideal for your search for high-yield investment properties in the city center.
                </p>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => onSelectProperty(match2)}
                  className="bg-[#e7e8e9] hover:bg-[#00236f] hover:text-white text-[#00236f] px-6 py-2.5 rounded-md font-['Manrope'] text-xs tracking-widest uppercase font-bold transition-all duration-200 cursor-pointer"
                >
                  Explore Details
                </button>
                <span className="text-xs text-[#757682] font-medium">
                  {match2.beds} Beds · {match2.sqft} sqft
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
