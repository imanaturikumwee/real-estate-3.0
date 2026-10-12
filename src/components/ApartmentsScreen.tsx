import React, { useState } from 'react';
import { Property, ActiveScreen } from '../types';
import { KigaliRealMap } from './KigaliRealMap';

interface ApartmentsScreenProps {
  onSelectProperty?: (property: Property) => void;
  onBookTour?: (property: Property) => void;
  onNavigate?: (screen: ActiveScreen) => void;
  onOpenConsultation?: () => void;
  onOpenListProperty?: () => void;
}

export const ApartmentsScreen: React.FC<ApartmentsScreenProps> = ({
  onSelectProperty,
  onBookTour,
  onNavigate,
  onOpenConsultation,
  onOpenListProperty,
}) => {
  const [selectedFloor, setSelectedFloor] = useState<'All' | 'Ground' | '1-5' | '6+'>('1-5');
  const [selectedCategoryTab, setSelectedCategoryTab] = useState<'price' | 'type' | 'beds' | 'amenities' | 'year'>('price');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [mobileTab, setMobileTab] = useState<'list' | 'map'>('list');
  const [hoveredAptId, setHoveredAptId] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set(['apt-horizon-heights']));

  const apartments = [
    {
      id: 'apt-horizon-heights',
      title: 'Horizon Heights Penthouse',
      neighborhood: 'Nyarutarama',
      location: 'Nyarutarama, District Gasabo',
      monthlyRentRwf: 2400000,
      priceDisplay: 'RWF 2,400,000',
      rateType: 'Starting from',
      beds: 3,
      baths: 2.5,
      floorLevel: '12th Floor',
      floorLevelCategory: '6+',
      aiScore: '9.8',
      tags: ['Featured', 'New Construction'],
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuA9L4OJgOUvfqUbnCl1v-rgiVQpBceNUeNhWfZ0_rliHxExMPPfU7FZrviRNnTKab7XFP-91UHPcEEhvMPa2vfyMpFi8hrK4x-UYo1U8XtfE3OQHiV7J_XdOyIIoELXmXNVU-GIOqSWkTQLiRFJe02JzXU45Fu14N06AUBZnG5aqA_yZoU4FDyZpddYKAt5d17VEsHSYiLjLP7O3patxwuuNk8UylkVj_tNIxZKnhhmsB3vepfwIPsiQS1pPq_ppw-_hSGtsRaoK7kH',
      coordinates: { lat: -1.9368, lng: 30.0988 },
      mapPinLabel: '2.4M',
      description:
        'Modern minimalist apartment building with floor-to-ceiling glass windows at sunset, soft architectural lighting and lush landscaping in Kigali.',
    },
    {
      id: 'apt-kiyovu-lofts',
      title: 'The Kiyovu Lofts',
      neighborhood: 'Kiyovu',
      location: 'Kiyovu, Central Business District',
      monthlyRentRwf: 950000,
      priceDisplay: 'RWF 950,000',
      rateType: 'Fixed rate',
      beds: 1,
      baths: 1,
      floorLevel: '3rd Floor',
      floorLevelCategory: '1-5',
      aiScore: '8.4',
      tags: ['Eco-Certified'],
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDbE739TfZTQEEtWRmI6KY2lRaqSGEkwhiW4nmmSHKwuVnuIU1268aab8JT3I4Aif8HbwdLdR8HhXhMBugo7B6pFbJgyuvV23XyEEJBnDsISBzX2PnRJVM3loUbeX1zjOUNsHzb7983dWN63ZV0wpCkySoiZbwp1EsLGUbE9nTZq8jQwjs3P2WtugebwGU6WGbwM44Nnk4S_JaXwVVwuFG-LOvC38vw2q02FZnzqJj8tAydCbYxhjuMm4Ke3MqlIakUhsYlTgvpPaUn',
      coordinates: { lat: -1.956, lng: 30.064 },
      mapPinLabel: '950K',
      description:
        'Sleek Scandinavian interior of a living room with warm wood accents, large balcony overlooking rolling green hills of Rwanda.',
    },
    {
      id: 'apt-kimihurura-garden-suites',
      title: 'Kimihurura Garden Suites',
      neighborhood: 'Kimihurura',
      location: 'Kimihurura, Gasabo',
      monthlyRentRwf: 1800000,
      priceDisplay: 'RWF 1,800,000',
      rateType: 'Price on request',
      beds: 2,
      baths: 2,
      floorLevel: 'Ground',
      floorLevelCategory: 'Ground',
      aiScore: '9.1',
      tags: ['Pool View'],
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAufnkaZ4rdFl3uxX5o5ILbYJk3wSWx7h3ZVo2qg_t2cAOGoIK290ODFUXHBS8dUYes8anKezaamrv1mrcP8qGvFTKFgF370KwYwS06Z5WgtPgrYAheH2ZdXx5DGC85XSEU2hkabtYXjptOjOcFBDK_GXnhMh0cedDYHYfT1PSOgldaYeqxj57SJOywVMPqBUs2aOdOm3L7cl8OIJJPxPNYqitFWlPB7eSHJrnNrvPVkSAVpz3xfBOq7N0a7q43CwPBcMtnTdgaaixJ',
      coordinates: { lat: -1.961, lng: 30.088 },
      mapPinLabel: '1.8M',
      description:
        'Luxury infinity pool at an apartment complex at dusk, glowing blue water reflecting the city lights of Kigali under a deep indigo sky.',
    },
  ];

  const filteredApts = apartments.filter((apt) => {
    if (selectedFloor !== 'All' && apt.floorLevelCategory !== selectedFloor) {
      return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        apt.title.toLowerCase().includes(q) ||
        apt.neighborhood.toLowerCase().includes(q) ||
        apt.location.toLowerCase().includes(q)
      );
    }
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

  const propertyAdapters: Property[] = filteredApts.map((apt) => ({
    id: apt.id,
    title: apt.title,
    neighborhood: apt.neighborhood,
    location: apt.location,
    price: Math.round(apt.monthlyRentRwf / 1300),
    priceDisplay: `$${Math.round(apt.monthlyRentRwf / 1300).toLocaleString()}`,
    rwfPriceDisplay: apt.priceDisplay,
    propertyType: 'Penthouse',
    beds: apt.beds,
    baths: apt.baths,
    sqft: apt.beds * 750,
    areaM2: apt.beds * 70,
    image: apt.image,
    gallery: [apt.image],
    architecturalStyle: 'Luxury Apartment Residence',
    description: apt.description,
    highlights: apt.tags,
    zoning: 'Urban Residential',
    estimatedRentalYield: '10.5% gross yield',
    yearBuilt: 2024,
    parkingSpaces: 2,
    lotSize: 'Shared Complex',
    coordinates: apt.coordinates,
  }));

  return (
    <div className="bg-[#f8f9fa] text-[#191c1d] font-['Inter'] min-h-screen">
      {/* Sub-Header Navigation Bar */}
      <div className="bg-white border-b border-[#c5c5d3]/20 px-4 sm:px-8 py-3 sticky top-20 z-30">
        <div className="max-w-[1920px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6 overflow-x-auto no-scrollbar font-['Manrope'] text-xs uppercase tracking-wider font-bold">
            <button
              onClick={() => onNavigate?.('houses')}
              className="text-slate-500 hover:text-[#00236f] transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-base">villa</span>
              <span>Houses</span>
            </button>
            <button
              onClick={() => onNavigate?.('apartments')}
              className="text-[#00236f] border-b-2 border-[#00236f] pb-1 cursor-pointer flex items-center gap-1.5"
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

          <div className="flex items-center gap-3">
            {/* Quick search input */}
            <div className="hidden lg:flex items-center bg-[#f3f4f5] px-3.5 py-1.5 rounded-lg border border-[#c5c5d3]/30">
              <span className="material-symbols-outlined text-slate-400 text-sm mr-2">search</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Kigali apartments..."
                className="bg-transparent border-none text-xs w-48 focus:outline-none"
              />
            </div>

            {/* Mobile View Toggle */}
            <div className="flex md:hidden bg-slate-100 p-1 rounded-lg text-xs font-bold">
              <button
                onClick={() => setMobileTab('list')}
                className={`px-3 py-1 rounded-md transition-all ${
                  mobileTab === 'list' ? 'bg-[#00236f] text-white shadow-xs' : 'text-slate-600'
                }`}
              >
                List
              </button>
              <button
                onClick={() => setMobileTab('map')}
                className={`px-3 py-1 rounded-md transition-all ${
                  mobileTab === 'map' ? 'bg-[#00236f] text-white shadow-xs' : 'text-slate-600'
                }`}
              >
                Map
              </button>
            </div>

            <button
              onClick={() => onOpenListProperty?.()}
              className="hidden sm:flex items-center gap-1.5 bg-gradient-to-br from-[#00236f] to-[#1e3a8a] text-white px-4 py-2 rounded-md font-bold text-xs uppercase tracking-wider hover:opacity-95 shadow-sm cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">add_business</span>
              <span>List Property</span>
            </button>

            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden p-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">tune</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex min-h-[calc(100vh-8rem)] max-w-[1920px] mx-auto">
        {/* -------------------------------------------------------------
            SideNavBar (Filters)
            ------------------------------------------------------------- */}
        <aside
          className={`w-80 shrink-0 bg-[#f3f4f5] border-r border-[#c5c5d3]/20 p-6 flex flex-col gap-4 overflow-y-auto ${
            mobileFilterOpen
              ? 'fixed inset-y-0 left-0 z-50 shadow-2xl block bg-white'
              : 'hidden lg:flex sticky top-36 h-[calc(100vh-9rem)]'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-['Manrope'] font-bold text-blue-950 text-xl">Advanced Filters</h2>
              <p className="font-['Inter'] text-xs font-medium text-slate-500">Refine your search</p>
            </div>
            {mobileFilterOpen && (
              <button onClick={() => setMobileFilterOpen(false)} className="lg:hidden p-1">
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            )}
          </div>

          <nav className="flex flex-col gap-1.5">
            {[
              { id: 'price', label: 'Price Range', icon: 'payments' },
              { id: 'type', label: 'Property Type', icon: 'home_work' },
              { id: 'beds', label: 'Bedrooms', icon: 'bed' },
              { id: 'amenities', label: 'Amenities', icon: 'pool' },
              { id: 'year', label: 'Year Built', icon: 'calendar_today' },
            ].map((tab) => (
              <div
                key={tab.id}
                onClick={() => setSelectedCategoryTab(tab.id as any)}
                className={`flex items-center gap-3 p-3 rounded-lg font-bold text-xs shadow-xs cursor-pointer hover:translate-x-1 transition-all select-none ${
                  selectedCategoryTab === tab.id
                    ? 'bg-white text-blue-900 border border-blue-900/10'
                    : 'text-slate-500 hover:bg-slate-200/60'
                }`}
              >
                <span className="material-symbols-outlined text-lg">{tab.icon}</span>
                <span className="font-medium">{tab.label}</span>
              </div>
            ))}
          </nav>

          <div className="mt-6 pt-6 border-t border-[#c5c5d3]/30">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#444651] mb-3">
              Floor Level
            </h3>
            <div className="grid grid-cols-4 gap-2">
              {(['All', 'Ground', '1-5', '6+'] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => setSelectedFloor(level)}
                  className={`py-2 text-xs font-semibold rounded-md border transition-all cursor-pointer ${
                    selectedFloor === level
                      ? 'bg-[#00236f] text-white border-[#00236f] shadow-xs'
                      : 'bg-white border-[#c5c5d3]/30 text-slate-700 hover:border-[#00236f]'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => setMobileFilterOpen(false)}
            className="mt-auto w-full bg-blue-950 text-white py-3.5 rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-blue-900 transition-colors cursor-pointer shadow-md"
          >
            Apply Filters ({filteredApts.length} Results)
          </button>
        </aside>

        {/* -------------------------------------------------------------
            Main Content Area (Split Screen)
            ------------------------------------------------------------- */}
        <div className="flex-1 flex overflow-hidden">
          {/* Listings Panel */}
          <section
            className={`w-full md:w-[58%] overflow-y-auto px-6 sm:px-10 py-8 bg-[#f8f9fa] ${
              mobileTab === 'map' ? 'hidden md:block' : 'block'
            }`}
          >
            <header className="mb-10">
              <div className="flex items-baseline gap-4 mb-2">
                <h1 className="font-['Manrope'] text-3xl sm:text-4xl font-extrabold tracking-tight text-[#191c1d]">
                  Modern Living in Kigali
                </h1>
                <span className="text-[#5e5e5e] font-medium italic text-base">
                  128 results
                </span>
              </div>
              <p className="text-[#444651] text-xs sm:text-sm max-w-xl leading-relaxed">
                Discover high-end apartment living with curated views of the thousand hills. From executive
                penthouses in Nyarutarama to minimalist lofts in Kiyovu.
              </p>
            </header>

            <div className="grid grid-cols-1 gap-10">
              {filteredApts.map((apt) => {
                const isFav = favorites.has(apt.id);
                return (
                  <article
                    key={apt.id}
                    onClick={() => {
                      const mapped = propertyAdapters.find((p) => p.id === apt.id);
                      if (mapped && onSelectProperty) onSelectProperty(mapped);
                    }}
                    onMouseEnter={() => setHoveredAptId(apt.id)}
                    onMouseLeave={() => setHoveredAptId(null)}
                    className="bg-white group cursor-pointer transition-all duration-300 rounded-2xl border border-[#c5c5d3]/20 shadow-xs hover:shadow-lg p-3 sm:p-4"
                  >
                    <div className="relative overflow-hidden aspect-[16/9] rounded-xl bg-slate-100">
                      <img
                        src={apt.image}
                        alt={apt.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute top-4 left-4 flex gap-2">
                        {apt.tags.map((tag) => (
                          <span
                            key={tag}
                            className="bg-[#00236f]/90 text-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-sm backdrop-blur-sm"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <button
                        onClick={(e) => toggleFavorite(apt.id, e)}
                        className="absolute top-4 right-4 w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center text-[#00236f] hover:bg-white transition-colors cursor-pointer shadow-sm"
                      >
                        <span
                          className="material-symbols-outlined text-base"
                          style={{ fontVariationSettings: isFav ? "'FILL' 1" : "'FILL' 0" }}
                        >
                          favorite
                        </span>
                      </button>
                    </div>

                    <div className="py-5 grid grid-cols-12 gap-4 items-center">
                      <div className="col-span-12 sm:col-span-8">
                        <h3 className="font-['Manrope'] text-xl font-bold text-blue-950 mb-1 group-hover:text-[#00236f] transition-colors">
                          {apt.title}
                        </h3>
                        <p className="text-[#444651] flex items-center gap-1 text-xs mb-3">
                          <span className="material-symbols-outlined text-sm text-slate-400">
                            location_on
                          </span>
                          {apt.location}
                        </p>
                        <div className="flex gap-4 sm:gap-6 text-xs text-[#5e5e5e] font-medium">
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">bed</span>
                            {apt.beds} Beds
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">bathtub</span>
                            {apt.baths} Baths
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">layers</span>
                            {apt.floorLevel}
                          </span>
                        </div>
                      </div>

                      <div className="col-span-12 sm:col-span-4 sm:text-right flex sm:flex-col justify-between items-end border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                        <div>
                          <span className="block text-[10px] font-bold text-[#444651] uppercase tracking-tighter">
                            {apt.rateType}
                          </span>
                          <span className="text-xl sm:text-2xl font-black text-[#00236f]">
                            {apt.priceDisplay}
                          </span>
                          <span className="block text-xs text-[#5e5e5e] italic">/ month</span>
                        </div>
                        <div className="mt-2">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#ffdcc1] text-[#683d0f] rounded text-[10px] font-black">
                            AI SCORE: {apt.aiScore}
                          </span>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          {/* Map Panel (Right Side) */}
          <section
            className={`flex-1 bg-slate-200 sticky top-36 h-[calc(100vh-9rem)] relative overflow-hidden border-l border-[#c5c5d3]/20 ${
              mobileTab === 'list' ? 'hidden md:block' : 'block w-full'
            }`}
          >
            <div className="w-full h-full relative">
              <KigaliRealMap
                properties={propertyAdapters}
                selectedProperty={null}
                hoveredPropertyId={hoveredAptId}
                onSelectProperty={(prop) => {
                  if (onSelectProperty) onSelectProperty(prop);
                }}
                onHoverProperty={(id) => setHoveredAptId(id)}
                onBookTour={(prop) => {
                  if (onBookTour) onBookTour(prop);
                }}
                currency="RWF"
                showLandmarks={true}
                onToggleLandmarks={() => {}}
              />

              {/* Floating Currently Viewing Badge */}
              <div className="absolute top-4 left-4 z-10 pointer-events-none">
                <div className="bg-white/90 backdrop-blur px-4 py-2.5 rounded-xl shadow-md border border-white/40">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-0.5">
                    Currently Viewing
                  </p>
                  <h4 className="font-['Manrope'] font-bold text-xs text-blue-950">
                    Nyarutarama &amp; Kiyovu Corridor
                  </h4>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
