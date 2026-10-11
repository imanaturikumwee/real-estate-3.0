import React, { useRef } from 'react';
import { Property } from '../types';

interface FeaturedEstatesProps {
  properties: Property[];
  onSelectProperty: (property: Property) => void;
  onViewAll: () => void;
}

export const FeaturedEstates: React.FC<FeaturedEstatesProps> = ({
  properties,
  onSelectProperty,
  onViewAll,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -420 : 420;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const featuredList = properties.filter((p) => p.isFeatured);

  return (
    <section className="py-20 md:py-24 bg-[#f8f9fa]">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        {/* Header row */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10 md:mb-12">
          <div>
            <h2 className="font-['Manrope'] text-3xl md:text-4xl font-extrabold text-[#191c1d] mb-2 tracking-tight">
              Featured Estates
            </h2>
            <p className="text-[#444651] max-w-md text-sm md:text-base">
              Handpicked architectural masterpieces across Rwanda's most prestigious districts.
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Scroll Navigation arrows */}
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => scroll('left')}
                className="w-10 h-10 rounded-full border border-[#c5c5d3]/40 flex items-center justify-center text-[#191c1d] hover:bg-[#e7e8e9] transition-colors cursor-pointer"
                aria-label="Scroll left"
              >
                <span className="material-symbols-outlined text-lg">chevron_left</span>
              </button>
              <button
                onClick={() => scroll('right')}
                className="w-10 h-10 rounded-full border border-[#c5c5d3]/40 flex items-center justify-center text-[#191c1d] hover:bg-[#e7e8e9] transition-colors cursor-pointer"
                aria-label="Scroll right"
              >
                <span className="material-symbols-outlined text-lg">chevron_right</span>
              </button>
            </div>

            <button
              onClick={onViewAll}
              className="group flex items-center gap-2 font-['Manrope'] text-xs tracking-[0.2em] uppercase font-bold text-[#432200] hover:text-[#00236f] transition-colors cursor-pointer"
            >
              <span>View All</span>
              <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </button>
          </div>
        </div>

        {/* Horizontal scrollable cards matching mockup */}
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto gap-8 pb-8 hide-scrollbar snap-x scroll-smooth -mx-2 px-2"
        >
          {featuredList.map((property) => (
            <div
              key={property.id}
              onClick={() => onSelectProperty(property)}
              className="min-w-[310px] sm:min-w-[360px] md:min-w-[400px] snap-start bg-white rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl cursor-pointer group border border-[#c5c5d3]/15 flex flex-col"
            >
              {/* Image Container with Aspect Ratio 16/9 */}
              <div className="aspect-[16/9] relative overflow-hidden bg-[#e1e3e4]">
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  alt={property.title}
                  src={property.image}
                  loading="lazy"
                />

                {property.badge && (
                  <span className="absolute top-4 left-4 bg-[#00236f]/90 text-white px-3 py-1 text-[10px] font-['Inter'] uppercase tracking-widest rounded-sm backdrop-blur-md font-bold shadow-sm">
                    {property.badge}
                  </span>
                )}

                <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur-sm text-[#00236f] px-3 py-1 rounded text-xs font-bold uppercase tracking-wider">
                  Inspect Estate
                </div>
              </div>

              {/* Card Details */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4 gap-2">
                    <div>
                      <h3 className="font-['Manrope'] text-xl font-bold text-[#191c1d] group-hover:text-[#00236f] transition-colors">
                        {property.title}
                      </h3>
                      <p className="text-[#444651] text-xs sm:text-sm flex items-center gap-1 mt-1">
                        <span className="material-symbols-outlined text-sm text-[#00236f]">
                          location_on
                        </span>
                        {property.location}
                      </p>
                    </div>
                    <span className="text-[#00236f] font-['Manrope'] font-extrabold text-lg sm:text-xl whitespace-nowrap">
                      {property.priceDisplay}
                    </span>
                  </div>

                  <p className="text-xs text-[#757682] line-clamp-2 mb-4 leading-relaxed">
                    {property.description}
                  </p>
                </div>

                {/* Specs row */}
                <div className="flex items-center justify-between border-t border-[#c5c5d3]/20 pt-4">
                  <div className="flex items-center gap-1.5 text-[#444651] text-xs font-semibold">
                    <span className="material-symbols-outlined text-base text-[#757682]">bed</span>
                    <span>{property.beds} Beds</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#444651] text-xs font-semibold">
                    <span className="material-symbols-outlined text-base text-[#757682]">
                      bathtub
                    </span>
                    <span>{property.baths} Baths</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#444651] text-xs font-semibold">
                    <span className="material-symbols-outlined text-base text-[#757682]">
                      square_foot
                    </span>
                    <span>{property.sqft.toLocaleString()} sqft</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
