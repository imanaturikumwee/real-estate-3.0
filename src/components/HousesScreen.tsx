import React, { useState, useEffect } from 'react';
import { Property, ActiveScreen } from '../types';
import { KigaliRealMap } from './KigaliRealMap';

interface HousesScreenProps {
  onSelectProperty?: (property: Property) => void;
  onBookTour?: (property: Property) => void;
  onNavigate?: (screen: ActiveScreen) => void;
  onOpenConsultation?: () => void;
}

export const HousesScreen: React.FC<HousesScreenProps> = ({
  onSelectProperty,
  onBookTour,
  onNavigate,
  onOpenConsultation,
}) => {
  const [rentLimit, setRentLimit] = useState<number>(5000000);
  const [selectedBeds, setSelectedBeds] = useState<number>(2);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    'Private Pool',
    'High-Speed WiFi',
  ]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set(['house-obsidian-ridge']));
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [mobileViewTab, setMobileViewTab] = useState<'list' | 'map'>('list');
  const [hoveredHouseId, setHoveredHouseId] = useState<string | null>(null);

  // Houses data matching the uploaded page
  const houses = [
    {
      id: 'house-obsidian-ridge',
      title: 'The Obsidian Ridge',
      neighborhood: 'Nyarutarama',
      location: 'Nyarutarama, Kigali',
      monthlyRentRwf: 3200000,
      priceDisplay: 'RWF 3.2M',
      beds: 4,
      baths: 3,
      areaM2: 450,
      propertyType: 'Residential Villa',
      category: 'RESIDENTIAL',
      aiScore: 9.8,
      amenities: ['Private Pool', 'Mountain View', 'Solar Energy', 'High-Speed WiFi'],
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBuGAIKUQvpl-Hl6r4oC2hhqwm3zmZXDhZCJrPC92MfOKGSmCkDOjOrbMBrXpF6_LEkgc1eYBV-B65sa0VnYpikb7k1MkHkdS7wdOZODq4FRm0e4b3S4OEUy5tg6rT_Sh7oabxkYDL5-kfG6W1A22D_-sg6OveoQ11i0bbonwkElpnd0tvkIGHxeowV5UAGaLg5ohUnDkS89BhmDUdYJLN0rK2BapuHYfM2WeBgYaNHp8X9oB4V9R62gd6Vmp52PZ3U9lbtBIac9_hR',
      coordinates: { lat: -1.9368, lng: 30.0988 },
      mapPinLabel: 'RWF 3.2M',
      description:
        'Handcrafted architectural villa featuring Musanze volcanic stone, floor-to-ceiling glass, private heated lap pool, and panoramic views of Kigali Golf Club.',
    },
    {
      id: 'house-emerald-terraces',
      title: 'Emerald Terraces',
      neighborhood: 'Kibagabaga',
      location: 'Kibagabaga, Kigali',
      monthlyRentRwf: 1800000,
      priceDisplay: 'RWF 1.8M',
      beds: 3,
      baths: 2,
      areaM2: 320,
      propertyType: 'Modern Townhouse',
      category: 'PREMIUM',
      aiScore: 9.2,
      amenities: ['Private Pool', 'Solar Energy', 'High-Speed WiFi'],
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBIoH1CD8fCbIbvUl0dCcjQZgMlhVs3ydWlJEG32UisPFIr5_gW369a0uArsjdyIPEyzZjtT9SGlr7k1jGkXVDHl5mFy3lBW6LDiW1DgvkbzIONHklpO_YN-5_F5gwyJ0GuLHGhMk7JsP84P_vzFvOPC7g6Iz6z9pKeaEMYyfxvpdMSduibpWwR1hBjDUvJlx6egYWmU-YSNNXuJg01ek3JZBUNxaoP3H3shtEVN8Xq8mVd0kVwG7AO8Upm90fRb2z_M2j6UOKL6iye',
      coordinates: { lat: -1.944, lng: 30.125 },
      mapPinLabel: 'RWF 1.8M',
      description:
        'Sleek Scandinavian-tropical hybrid residence with open courtyard garden, natural timber louvers, and infinity views overlooking the Kimironko valley.',
    },
    {
      id: 'house-horizon-heights',
      title: 'Horizon Heights',
      neighborhood: 'Rebero',
      location: 'Rebero Hill, Kigali',
      monthlyRentRwf: 4500000,
      priceDisplay: 'RWF 4.5M',
      beds: 5,
      baths: 5,
      areaM2: 680,
      propertyType: 'Estate Mansion',
      category: 'INVESTMENT GRADE',
      aiScore: 9.9,
      badge: "Editor's Choice",
      amenities: ['Private Pool', 'Mountain View', 'Solar Energy', 'High-Speed WiFi'],
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDcedMGqJ2ghqMY2ljqkmRN5zTKzA-RDNdSxHfN7AC1S04DYDT-oIxOQ8XwGL11yHjLJ2cY7RcgeK7x0n3_djmJSN8IuZ7uOI-UpkFtiJ956BYnPER2yUEH4aRICejlUcbg4aAk764HzuyVDoXcYWXwY4oulkzTLiL5w6U5vKkjz29Tlahx9wPM_ro42zuSxNAxSp95bO33wT0t1b4Oay0BbYINH9hTixDEiCRxYeuGdDra4yWlW-Gd22vZUMV2zxUmxVTCc23VB5AA',
      coordinates: { lat: -1.982, lng: 30.082 },
      mapPinLabel: 'RWF 4.5M',
      description:
        'Experience unparalleled panoramic views of the city. This state-of-the-art smart home features zero-carbon energy systems, a triple-tier security perimeter, and an infinity pool that merges with the horizon.',
    },
  ];

  const filteredHouses = houses.filter((h) => {
    if (h.monthlyRentRwf > rentLimit) return false;
    if (h.beds < selectedBeds) return false;
    return true;
  });

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAmenity = (name: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(name) ? prev.filter((a) => a !== name) : [...prev, name]
    );
  };

  // Adapter for map component
  const propertyAdapters: Property[] = filteredHouses.map((h) => ({
    id: h.id,
    title: h.title,
    neighborhood: h.neighborhood,
    location: h.location,
    price: Math.round(h.monthlyRentRwf / 1300),
    priceDisplay: `$${Math.round(h.monthlyRentRwf / 1300).toLocaleString()}`,
    rwfPriceDisplay: h.priceDisplay,
    propertyType: 'Villa',
    beds: h.beds,
    baths: h.baths,
    sqft: h.areaM2 * 10.76,
    areaM2: h.areaM2,
    image: h.image,
    gallery: [h.image],
    architecturalStyle: h.propertyType,
    description: h.description,
    highlights: h.amenities,
    zoning: 'Residential Prime',
    estimatedRentalYield: '9.8% yield',
    yearBuilt: 2024,
    parkingSpaces: 3,
    lotSize: `${h.areaM2 * 2} sqm`,
    coordinates: h.coordinates,
  }));

  return (
    <div className="bg-[#f8f9fa] font-['Inter'] text-[#191c1d] min-h-screen">
      {/* Sub-Header Navigation Tabs */}
      <div className="bg-white border-b border-[#c5c5d3]/20 px-4 sm:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6 overflow-x-auto no-scrollbar font-['Manrope'] text-xs uppercase tracking-wider font-bold">
            <button
              onClick={() => onNavigate?.('houses')}
              className="text-[#00236f] border-b-2 border-[#00236f] pb-1 cursor-pointer flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-base">villa</span>
              <span>Houses</span>
            </button>
            <button
              onClick={() => onNavigate?.('apartments')}
              className="text-slate-500 hover:text-[#00236f] transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-base">apartment</span>
              <span>Apartments</span>
            </button>
            <button
              onClick={() => onNavigate?.('land')}
              className="text-slate-500 hover:text-[#00236f] transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-base">landscape</span>
              <span>Land &amp; Plots</span>
            </button>
            <button
              onClick={() => onNavigate?.('investments')}
              className="text-slate-500 hover:text-[#00236f] transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-base">trending_up</span>
              <span>Investments</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Mobile View Toggle */}
            <div className="flex xl:hidden bg-slate-100 p-1 rounded-lg text-xs font-bold">
              <button
                onClick={() => setMobileViewTab('list')}
                className={`px-3 py-1 rounded-md transition-all ${
                  mobileViewTab === 'list' ? 'bg-[#00236f] text-white shadow-xs' : 'text-slate-600'
                }`}
              >
                List
              </button>
              <button
                onClick={() => setMobileViewTab('map')}
                className={`px-3 py-1 rounded-md transition-all ${
                  mobileViewTab === 'map' ? 'bg-[#00236f] text-white shadow-xs' : 'text-slate-600'
                }`}
              >
                Map
              </button>
            </div>

            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden flex items-center gap-1 px-3 py-1.5 bg-slate-100 rounded-lg text-xs font-bold text-slate-700"
            >
              <span className="material-symbols-outlined text-sm">tune</span>
              <span>Filters</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex min-h-[calc(100vh-8rem)] max-w-[1920px] mx-auto">
        {/* -------------------------------------------------------------
            Sidebar Filter (Desktop & Mobile Drawer)
            ------------------------------------------------------------- */}
        <aside
          className={`w-80 shrink-0 bg-[#f3f4f5] border-r border-[#c5c5d3]/20 p-6 sm:p-8 overflow-y-auto ${
            mobileFilterOpen
              ? 'fixed inset-y-0 left-0 z-50 shadow-2xl block bg-white'
              : 'hidden lg:block sticky top-20 h-[calc(100vh-5rem)]'
          }`}
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-['Manrope'] text-xl font-bold text-[#191c1d]">Curated Filters</h2>
            {mobileFilterOpen && (
              <button onClick={() => setMobileFilterOpen(false)} className="lg:hidden p-1">
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            )}
          </div>

          <div className="space-y-8">
            {/* Price Range Slider */}
            <div>
              <label className="font-['Inter'] text-xs font-bold uppercase tracking-widest text-[#5e5e5e] mb-3 block">
                Monthly Rent (RWF)
              </label>
              <div className="space-y-2">
                <input
                  type="range"
                  min="500000"
                  max="5000000"
                  step="100000"
                  value={rentLimit}
                  onChange={(e) => setRentLimit(Number(e.target.value))}
                  className="w-full accent-[#00236f] cursor-pointer"
                />
                <div className="flex justify-between font-['Inter'] text-xs font-bold text-[#444651]">
                  <span>500k</span>
                  <span className="text-[#00236f]">Up to {(rentLimit / 1000000).toFixed(1)}M</span>
                  <span>5M+</span>
                </div>
              </div>
            </div>

            {/* Bedrooms */}
            <div>
              <label className="font-['Inter'] text-xs font-bold uppercase tracking-widest text-[#5e5e5e] mb-3 block">
                Bedrooms
              </label>
              <div className="grid grid-cols-4 gap-2 font-['Inter'] text-sm">
                {[1, 2, 3, 4].map((beds) => (
                  <button
                    key={beds}
                    onClick={() => setSelectedBeds(beds)}
                    className={`py-2 rounded-md font-semibold transition-all cursor-pointer ${
                      selectedBeds === beds
                        ? 'bg-[#00236f] text-white shadow-xs'
                        : 'bg-white border border-[#c5c5d3]/30 text-[#191c1d] hover:border-[#00236f]'
                    }`}
                  >
                    {beds}+
                  </button>
                ))}
              </div>
            </div>

            {/* Amenities */}
            <div>
              <label className="font-['Inter'] text-xs font-bold uppercase tracking-widest text-[#5e5e5e] mb-3 block">
                Amenities
              </label>
              <div className="space-y-3 font-['Inter'] text-sm">
                {[
                  { name: 'Private Pool', icon: 'pool' },
                  { name: 'Mountain View', icon: 'landscape' },
                  { name: 'Solar Energy', icon: 'solar_power' },
                  { name: 'High-Speed WiFi', icon: 'wifi' },
                ].map((amenity) => {
                  const isChecked = selectedAmenities.includes(amenity.name);
                  return (
                    <label
                      key={amenity.name}
                      onClick={() => toggleAmenity(amenity.name)}
                      className="flex items-center space-x-3 cursor-pointer group select-none"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="rounded border-[#c5c5d3] text-[#00236f] focus:ring-[#00236f] h-4 w-4"
                      />
                      <span className="text-xs font-medium text-[#444651] group-hover:text-[#191c1d]">
                        {amenity.name}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            <button
              onClick={() => setMobileFilterOpen(false)}
              className="w-full py-3.5 bg-[#00236f] text-white font-['Manrope'] font-bold text-xs uppercase tracking-wider rounded-md hover:bg-[#001c55] transition-all shadow-md cursor-pointer"
            >
              Update Search ({filteredHouses.length} Estates)
            </button>
          </div>
        </aside>

        {/* -------------------------------------------------------------
            Main Content Area: House List
            ------------------------------------------------------------- */}
        <div
          className={`flex-1 px-4 sm:px-8 py-6 overflow-y-auto ${
            mobileViewTab === 'map' ? 'hidden xl:block' : 'block'
          }`}
        >
          <header className="mb-8">
            <h1 className="font-['Manrope'] text-3xl sm:text-4xl font-extrabold tracking-tight text-[#191c1d] max-w-2xl leading-tight">
              Exclusive Rental Estates in <span className="text-[#00236f]">Kigali</span>
            </h1>
            <p className="font-['Inter'] text-[#444651] mt-3 max-w-xl text-sm sm:text-base leading-relaxed">
              Discover hand-picked architectural gems, selected for their design integrity and premium
              Rwandan craftsmanship.
            </p>
          </header>

          {/* Houses Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-12">
            {/* House Card 1 & 2 */}
            {filteredHouses.slice(0, 2).map((house) => {
              const isFav = favorites.has(house.id);
              return (
                <article
                  key={house.id}
                  onClick={() => {
                    const mapped = propertyAdapters.find((p) => p.id === house.id);
                    if (mapped && onSelectProperty) onSelectProperty(mapped);
                  }}
                  onMouseEnter={() => setHoveredHouseId(house.id)}
                  onMouseLeave={() => setHoveredHouseId(null)}
                  className="group bg-white rounded-xl overflow-hidden border border-[#c5c5d3]/20 shadow-xs hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
                >
                  <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
                    <img
                      src={house.image}
                      alt={house.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4 flex gap-2">
                      <span className="bg-[#00236f]/90 text-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-md backdrop-blur-sm">
                        {house.category}
                      </span>
                      <span className="bg-[#603609]/90 text-[#ffdcc1] px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-md backdrop-blur-sm">
                        AI SCORE {house.aiScore}
                      </span>
                    </div>

                    <button
                      onClick={(e) => toggleFavorite(house.id, e)}
                      className="absolute top-4 right-4 bg-white/30 hover:bg-white/60 backdrop-blur-md p-2 rounded-full transition-colors cursor-pointer text-white"
                      title={isFav ? 'Remove from favorites' : 'Save to favorites'}
                    >
                      <span
                        className="material-symbols-outlined text-base"
                        style={{ fontVariationSettings: isFav ? "'FILL' 1" : "'FILL' 0" }}
                      >
                        favorite
                      </span>
                    </button>
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <h3 className="font-['Manrope'] text-xl font-bold text-[#191c1d] group-hover:text-[#00236f] transition-colors">
                          {house.title}
                        </h3>
                        <p className="text-[#444651] text-xs flex items-center mt-1">
                          <span className="material-symbols-outlined text-sm mr-1 text-slate-400">
                            location_on
                          </span>
                          {house.location}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="block font-['Manrope'] text-xl font-extrabold text-[#00236f]">
                          {house.priceDisplay}
                        </span>
                        <span className="text-[11px] text-[#5e5e5e] font-medium">per month</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-6 py-2 border-t border-slate-100 text-xs text-[#444651]">
                      <div className="flex items-center space-x-1">
                        <span className="material-symbols-outlined text-sm">bed</span>
                        <span>{house.beds} Beds</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="material-symbols-outlined text-sm">bathtub</span>
                        <span>{house.baths} Baths</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="material-symbols-outlined text-sm">straighten</span>
                        <span>{house.areaM2} m²</span>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}

            {/* House Card 3 (Featured Wide Spanning Estate) */}
            {filteredHouses.length >= 3 && (
              <article
                onClick={() => {
                  const mapped = propertyAdapters.find((p) => p.id === filteredHouses[2].id);
                  if (mapped && onSelectProperty) onSelectProperty(mapped);
                }}
                className="group bg-white rounded-xl overflow-hidden border border-[#c5c5d3]/20 shadow-xs hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer md:col-span-2"
              >
                <div className="grid md:grid-cols-5 h-full">
                  <div className="md:col-span-3 relative aspect-[16/9] md:aspect-auto overflow-hidden bg-slate-100 min-h-[300px]">
                    <img
                      src={filteredHouses[2].image}
                      alt={filteredHouses[2].title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute bottom-4 left-4">
                      <span className="bg-[#432200] text-white px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-md shadow-md">
                        Editor&apos;s Choice
                      </span>
                    </div>
                  </div>

                  <div className="md:col-span-2 p-6 sm:p-8 flex flex-col justify-between space-y-6">
                    <div>
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <span className="bg-[#b6c4ff] text-[#00236f] px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-md mb-2 inline-block">
                            INVESTMENT GRADE
                          </span>
                          <h3 className="font-['Manrope'] text-2xl sm:text-3xl font-extrabold text-[#191c1d]">
                            {filteredHouses[2].title}
                          </h3>
                          <p className="text-[#444651] text-xs sm:text-sm flex items-center mt-1">
                            <span className="material-symbols-outlined text-sm mr-1 text-slate-400">
                              location_on
                            </span>
                            {filteredHouses[2].location}
                          </p>
                        </div>
                        <div className="bg-[#f3f4f5] p-2.5 rounded-xl text-center min-w-[70px]">
                          <span className="block text-[9px] text-[#5e5e5e] font-bold uppercase">AI SCORE</span>
                          <span className="text-xl font-black text-[#00236f]">
                            {filteredHouses[2].aiScore}
                          </span>
                        </div>
                      </div>

                      <p className="text-[#444651] text-xs leading-relaxed mt-4 line-clamp-3">
                        {filteredHouses[2].description}
                      </p>
                    </div>

                    <div className="flex justify-between items-center border-t border-slate-100 pt-5">
                      <div>
                        <span className="font-['Manrope'] text-2xl font-black text-[#00236f]">
                          {filteredHouses[2].priceDisplay}
                        </span>
                        <span className="text-xs text-[#5e5e5e] font-medium ml-1">/mo</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const mapped = propertyAdapters.find((p) => p.id === filteredHouses[2].id);
                          if (mapped && onBookTour) onBookTour(mapped);
                        }}
                        className="px-6 py-2.5 bg-[#432200] text-white text-xs font-bold uppercase tracking-wider rounded-md hover:bg-[#603609] transition-colors cursor-pointer shadow-sm"
                      >
                        Book View
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            )}
          </div>
        </div>

        {/* -------------------------------------------------------------
            Integrated Interactive Map View (Right Side)
            ------------------------------------------------------------- */}
        <aside
          className={`w-full xl:w-[480px] shrink-0 sticky top-20 h-[calc(100vh-5rem)] bg-[#eef1f5] border-l border-[#c5c5d3]/20 overflow-hidden ${
            mobileViewTab === 'list' ? 'hidden xl:block' : 'block'
          }`}
        >
          <div className="w-full h-full relative">
            <KigaliRealMap
              properties={propertyAdapters}
              selectedProperty={null}
              hoveredPropertyId={hoveredHouseId}
              onSelectProperty={(prop) => {
                if (onSelectProperty) onSelectProperty(prop);
              }}
              onHoverProperty={(id) => setHoveredHouseId(id)}
              onBookTour={(prop) => {
                if (onBookTour) onBookTour(prop);
              }}
              currency="RWF"
              showLandmarks={true}
              onToggleLandmarks={() => {}}
            />
          </div>
        </aside>
      </div>
    </div>
  );
};
