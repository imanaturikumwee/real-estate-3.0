import React, { useState } from 'react';
import { HERO_IMAGE } from '../data/properties';

interface HeroSectionProps {
  onSearch: (filters: { location: string; priceRange: string; propertyType: string }) => void;
  onExploreCatalog: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onSearch, onExploreCatalog }) => {
  const [location, setLocation] = useState('Kigali, Rwanda');
  const [priceRange, setPriceRange] = useState('$200k - $500k');
  const [propertyType, setPropertyType] = useState('Villa');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ location, priceRange, propertyType });
  };

  return (
    <section className="relative min-h-[640px] md:h-[716px] flex items-center px-6 md:px-8 overflow-hidden bg-[#f3f4f5] pt-12 md:pt-0">
      <div className="grid grid-cols-12 gap-8 w-full max-w-7xl mx-auto items-center relative z-10">
        {/* Left Column Content */}
        <div className="col-span-12 md:col-span-6 lg:col-span-5 z-10 py-8">
          <span className="font-['Inter'] text-xs font-bold tracking-[0.25em] uppercase text-[#00236f] mb-4 block">
            Premier Real Estate
          </span>

          <h1 className="font-['Manrope'] text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#191c1d] mb-6 leading-[1.1]">
            Find your dream <br className="hidden sm:inline" />
            home in Rwanda
          </h1>

          <p className="text-[#444651] text-sm md:text-base leading-relaxed mb-8 max-w-md">
            Architecturally curated villas, elevated penthouses, and private hilltop sanctuaries across Kigali’s most prestigious enclaves.
          </p>

          {/* Compact Search Bar matching mockup */}
          <form
            onSubmit={handleSearchSubmit}
            className="bg-white p-2.5 sm:p-2 rounded-xl shadow-2xl shadow-[#191c1d]/8 flex flex-col md:flex-row items-stretch md:items-center gap-2 max-w-xl border border-[#c5c5d3]/20"
          >
            {/* Location Input */}
            <div className="flex-1 px-3 sm:px-4 py-2 hover:bg-[#f8f9fa] rounded-lg transition-colors">
              <label
                htmlFor="search-location"
                className="block font-['Inter'] text-[10px] font-bold uppercase tracking-wider text-[#757682] mb-1"
              >
                Location
              </label>
              <input
                id="search-location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-transparent border-none p-0 text-sm font-semibold text-[#191c1d] focus:outline-none placeholder:text-[#757682]"
                placeholder="Kigali, Rwanda"
                type="text"
              />
            </div>

            <div className="h-8 w-[1px] bg-[#c5c5d3]/40 hidden md:block" />

            {/* Price Range Select */}
            <div className="flex-1 px-3 sm:px-4 py-2 hover:bg-[#f8f9fa] rounded-lg transition-colors">
              <label
                htmlFor="search-price"
                className="block font-['Inter'] text-[10px] font-bold uppercase tracking-wider text-[#757682] mb-1"
              >
                Price Range
              </label>
              <select
                id="search-price"
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full bg-transparent border-none p-0 text-sm font-semibold text-[#191c1d] focus:outline-none appearance-none cursor-pointer"
              >
                <option value="All">$200k - $1M+</option>
                <option value="$200k - $500k">$200k - $500k</option>
                <option value="$500k - $1M">$500k - $1M</option>
                <option value="$1M+">$1M+</option>
              </select>
            </div>

            <div className="h-8 w-[1px] bg-[#c5c5d3]/40 hidden md:block" />

            {/* Property Type Select */}
            <div className="flex-1 px-3 sm:px-4 py-2 hover:bg-[#f8f9fa] rounded-lg transition-colors">
              <label
                htmlFor="search-type"
                className="block font-['Inter'] text-[10px] font-bold uppercase tracking-wider text-[#757682] mb-1"
              >
                Property Type
              </label>
              <select
                id="search-type"
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full bg-transparent border-none p-0 text-sm font-semibold text-[#191c1d] focus:outline-none appearance-none cursor-pointer"
              >
                <option value="Villa">Villa</option>
                <option value="Duplex">Duplex</option>
                <option value="Penthouse">Penthouse</option>
                <option value="Architectural Estate">Architectural Estate</option>
              </select>
            </div>

            {/* Search Button */}
            <button
              type="submit"
              className="bg-[#00236f] text-white p-4 rounded-lg flex items-center justify-center hover:bg-[#1e3a8a] transition-all duration-200 active:scale-95 shadow-md cursor-pointer shrink-0"
              title="Search Estates"
              aria-label="Search Estates"
            >
              <span className="material-symbols-outlined text-xl">search</span>
            </button>
          </form>

          {/* Quick neighborhood tags */}
          <div className="flex flex-wrap items-center gap-2 mt-6 text-xs text-[#444651]">
            <span className="font-semibold text-[#757682]">Prime Districts:</span>
            {['Nyarutarama', 'Gacuhiro', 'Rebero', 'Kiyovu', 'Kimihurura'].map((dist) => (
              <button
                key={dist}
                type="button"
                onClick={() => {
                  setLocation(`${dist}, Kigali`);
                  onSearch({ location: dist, priceRange, propertyType: 'All' });
                }}
                className="hover:text-[#00236f] hover:underline underline-offset-4 cursor-pointer font-medium"
              >
                {dist}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile preview image banner (visible only on small devices) */}
        <div className="col-span-12 md:hidden relative rounded-xl overflow-hidden shadow-lg h-60 my-2">
          <img
            src={HERO_IMAGE}
            alt="Modern architectural luxury villa in Kigali at twilight"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
            <span className="text-white text-xs font-semibold uppercase tracking-wider">
              Nyarutarama · Masterpiece Villa
            </span>
          </div>
        </div>
      </div>

      {/* Right Column Full Height Background Image on Desktop */}
      <div className="hidden md:block col-span-7 absolute right-0 top-0 bottom-0 w-3/5">
        <div className="relative h-full w-full">
          <img
            className="h-full w-full object-cover"
            alt="Modern architectural luxury villa in Kigali at twilight with warm interior lighting and lush tropical garden landscaping"
            src={HERO_IMAGE}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#f3f4f5] via-[#f3f4f5]/30 to-transparent" />
        </div>
      </div>
    </section>
  );
};
