import React, { useState, useEffect } from 'react';
import { Property, ActiveScreen } from '../types';
import { KigaliRealMap } from './KigaliRealMap';

interface HouseItem {
  id: string;
  title: string;
  neighborhood: string;
  location: string;
  monthlyRentRwf: number;
  priceDisplay: string;
  beds: number;
  baths: number;
  areaM2: number;
  propertyType: string;
  category: string;
  aiScore: number;
  badge?: string;
  amenities: string[];
  image: string;
  coordinates: { lat: number; lng: number };
  mapPinLabel: string;
  description: string;
}

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
  // Filter states matching the uploaded design
  const [rentLimit, setRentLimit] = useState<number>(5000000);
  const [selectedBeds, setSelectedBeds] = useState<number>(2);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    'Private Pool',
    'High-Speed WiFi',
  ]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set(['house-obsidian-ridge']));
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [mobileViewTab, setMobileViewTab] = useState<'list' | 'map'>('list');
  const [mapMode, setMapMode] = useState<'stylized' | 'interactive'>('stylized');
  const [mapLayer, setMapLayer] = useState<'standard' | 'satellite'>('standard');
  const [hoveredHouseId, setHoveredHouseId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // House listings from backend / fallback
  const fallbackHouses: HouseItem[] = [
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
    {
      id: 'house-kacyiru-embassy-villa',
      title: 'Kacyiru Diplomatic Villa',
      neighborhood: 'Kacyiru',
      location: 'Kacyiru, Kigali',
      monthlyRentRwf: 2800000,
      priceDisplay: 'RWF 2.8M',
      beds: 4,
      baths: 3,
      areaM2: 410,
      propertyType: 'Diplomatic Residence',
      category: 'RESIDENTIAL',
      aiScore: 9.5,
      amenities: ['Private Pool', 'High-Speed WiFi', 'Solar Energy'],
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCUOhQL5jMcnbiwfsVMXu8wIJrtacsGdJmCc1cVFy-nc_HWacnpWp2iUct98HbBPMxx8L1q4FMktUDRKj-xLjvUUWWthqFE01CvpXMaLykGys6PXkk3HF7YtjM4Xp3GLOqJ0DWMvIMEfpsSOu0KunGp2lFZNnBY2hkLxxD67Q-S9__t5UCr3vnDLpVSt-8X9oq4UJvHy92eSyWm_NaDWL0oJsabAD117CG7-UQEZY4ouFRHLOGZh0WUaKHDyiVviz-lH40WEzrBIl4H',
      coordinates: { lat: -1.943, lng: 30.076 },
      mapPinLabel: 'RWF 2.8M',
      description:
        'Nestled in the quiet diplomatic enclave of Kacyiru with manicured private gardens, guardhouse perimeter, and floor-to-ceiling glass interiors.',
    },
    {
      id: 'house-gacuriro-sky-estate',
      title: 'Gacuriro Sky Sanctuary',
      neighborhood: 'Gacuriro',
      location: 'Gacuriro, Kigali',
      monthlyRentRwf: 3600000,
      priceDisplay: 'RWF 3.6M',
      beds: 4,
      baths: 4,
      areaM2: 520,
      propertyType: 'Luxury Contemporary Villa',
      category: 'PREMIUM',
      aiScore: 9.7,
      amenities: ['Private Pool', 'Mountain View', 'Solar Energy', 'High-Speed WiFi'],
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAiD5Sf302m49Cgl-HKJ79zbgX_vYXr14YiY-2H3w1VccGCbknMc7gsPFVsvebvnaikmFIG90qJYlxf5cweT_l07hr1Ks94IrIQDYBSVfly_gNdV5KkXfm8s6U0r9VUx5kNCOqfIkPuwwCCctJqszViRLSBD-TqllsHp4q-8YjDHRVnAJl-fbU9obyTN9vslCKCvAy5sDSQOoAYZ4tcgi7C5EQoHF6dHHUSCCfGb2ImYaiwBT0Jjq1dEHcc9D628oT78YCPzen7-Yaq',
      coordinates: { lat: -1.925, lng: 30.108 },
      mapPinLabel: 'RWF 3.6M',
      description:
        'High-elevation residence featuring double-height entertainment salons, automated thermal blinds, solar microgrid, and cascading terraces overlooking Gasabo valleys.',
    },
  ];

  const [houses, setHouses] = useState<HouseItem[]>(fallbackHouses);

  // Fetch houses from backend API
  useEffect(() => {
    setIsLoading(true);
    const params = new URLSearchParams();
    if (rentLimit) params.append('maxRent', rentLimit.toString());
    if (selectedBeds) params.append('bedrooms', selectedBeds.toString());

    fetch(`/api/houses?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.houses) && data.houses.length > 0) {
          setHouses(data.houses);
        } else {
          setHouses(fallbackHouses);
        }
      })
      .catch((err) => {
        console.warn('Using fallback rental houses data', err);
        setHouses(fallbackHouses);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [rentLimit, selectedBeds]);

  // Client-side filtering for amenities
  const filteredHouses = houses.filter((h) => {
    if (h.monthlyRentRwf > rentLimit) return false;
    if (h.beds < selectedBeds) return false;
    if (selectedAmenities.length > 0) {
      // Must contain all selected amenities if any
      const matchesAll = selectedAmenities.every((amenity) =>
        h.amenities?.includes(amenity)
      );
      if (!matchesAll) return false;
    }
    return true;
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        showToast('Removed from saved estates');
      } else {
        next.add(id);
        showToast('Saved to your VIP favorites dossier');
      }
      return next;
    });
  };

  const toggleAmenity = (name: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(name) ? prev.filter((a) => a !== name) : [...prev, name]
    );
  };

  // Convert to Property adapter for compatibility with modals
  const toPropertyAdapter = (h: HouseItem): Property => ({
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
  });

  const propertyAdapters: Property[] = filteredHouses.map(toPropertyAdapter);

  const handleBookViewing = (house: HouseItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const adapter = toPropertyAdapter(house);
    if (onBookTour) {
      onBookTour(adapter);
    } else if (onOpenConsultation) {
      onOpenConsultation();
    }
  };

  return (
    <div className="bg-[#f8f9fa] font-['Inter'] text-[#191c1d] min-h-screen selection:bg-[#00236f] selection:text-white">
      {/* -------------------------------------------------------------
          Top Navigation Bar Sub-Header (Houses, Apartments, Land, Investments)
          ------------------------------------------------------------- */}
      <div className="bg-white/90 backdrop-blur-md border-b border-[#c5c5d3]/20 sticky top-20 z-30 px-4 sm:px-8 py-3">
        <div className="max-w-screen-2xl mx-auto flex items-center justify-between">
          {/* Section Navigation Tabs */}
          <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto no-scrollbar py-1">
            {/* Prominent For Sale vs For Rent Segmented Switcher */}
            <div className="flex items-center bg-[#f1f3f9] p-1 rounded-xl shrink-0 border border-[#c5c5d3]/30">
              <button
                onClick={() => onNavigate?.('houses-for-sale')}
                className="px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-[#00236f] transition-colors cursor-pointer flex items-center gap-1.5"
                title="Switch to Houses for Sale"
              >
                <span className="material-symbols-outlined text-sm">sell</span>
                <span>For Sale</span>
              </button>
              <button
                onClick={() => onNavigate?.('houses')}
                className="px-3 py-1 rounded-lg text-xs font-extrabold uppercase tracking-wider bg-[#00236f] text-white shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm">key</span>
                <span>For Rent</span>
              </button>
            </div>

            <nav className="flex items-center space-x-5 sm:space-x-7 font-['Manrope'] text-xs sm:text-sm tracking-wide uppercase shrink-0">
              <button
                onClick={() => onNavigate?.('houses-for-sale')}
                className="text-slate-600 hover:text-[#00236f] font-semibold transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
              >
                <span className="material-symbols-outlined text-base">villa</span>
                <span>Houses for Sale</span>
              </button>
              <button
                onClick={() => onNavigate?.('houses')}
                className="text-[#00236f] font-bold border-b-2 border-[#00236f] pb-1 cursor-pointer transition-all flex items-center gap-1.5 shrink-0"
              >
                <span className="material-symbols-outlined text-base">home_work</span>
                <span>Rental Houses</span>
              </button>
              <button
                onClick={() => onNavigate?.('apartments')}
                className="text-slate-600 hover:text-[#00236f] font-semibold transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
              >
                <span className="material-symbols-outlined text-base">apartment</span>
                <span>Apartments</span>
              </button>
              <button
                onClick={() => onNavigate?.('land')}
                className="text-slate-600 hover:text-[#00236f] font-semibold transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
              >
                <span className="material-symbols-outlined text-base">landscape</span>
                <span>Land</span>
              </button>
              <button
                onClick={() => onNavigate?.('investments')}
                className="text-slate-600 hover:text-[#00236f] font-semibold transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
              >
                <span className="material-symbols-outlined text-base">trending_up</span>
                <span>Investments</span>
              </button>
            </nav>
          </div>

          {/* Right Mobile Actions */}
          <div className="flex items-center gap-2.5">
            {/* Mobile View Toggle: List vs Map */}
            <div className="flex xl:hidden bg-slate-100 p-1 rounded-xl text-xs font-bold">
              <button
                onClick={() => setMobileViewTab('list')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  mobileViewTab === 'list'
                    ? 'bg-[#00236f] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                List
              </button>
              <button
                onClick={() => setMobileViewTab('map')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  mobileViewTab === 'map'
                    ? 'bg-[#00236f] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Map
              </button>
            </div>

            {/* Filter Toggle Button for Tablet/Mobile */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-800 transition-colors cursor-pointer shadow-xs"
              aria-label="Toggle filters"
            >
              <span className="material-symbols-outlined text-base">tune</span>
              <span className="hidden sm:inline">Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------------
          Main Page Content (Curated Filters | Houses Bento | Map View)
          ------------------------------------------------------------- */}
      <main className="flex min-h-[calc(100vh-8rem)] max-w-screen-2xl mx-auto">
        {/* =========================================================
            1. Sidebar Filter (Desktop & Mobile Drawer)
            ========================================================= */}
        <aside
          className={`w-80 shrink-0 bg-[#f3f4f5] border-r border-[#c5c5d3]/20 px-6 sm:px-8 py-6 overflow-y-auto ${
            mobileFilterOpen
              ? 'fixed inset-y-0 left-0 z-50 shadow-2xl block bg-white'
              : 'hidden lg:block sticky top-36 h-[calc(100vh-9rem)]'
          }`}
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-['Manrope'] text-xl font-bold text-[#191c1d]">Curated Filters</h2>
            {mobileFilterOpen && (
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="lg:hidden p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            )}
          </div>

          <div className="space-y-8">
            {/* Price Range Slider */}
            <section>
              <label className="font-['Inter'] text-xs font-bold uppercase tracking-widest text-[#5e5e5e] mb-3 block">
                Monthly Rent (RWF)
              </label>
              <div className="space-y-3">
                <input
                  type="range"
                  min="500000"
                  max="5000000"
                  step="100000"
                  value={rentLimit}
                  onChange={(e) => setRentLimit(Number(e.target.value))}
                  className="w-full accent-[#00236f] cursor-pointer"
                />
                <div className="flex justify-between font-['Inter'] text-xs text-[#444651] font-semibold">
                  <span>500k</span>
                  <span className="text-[#00236f] font-bold">
                    Up to {(rentLimit / 1000000).toFixed(1)}M
                  </span>
                  <span>5M+</span>
                </div>
              </div>
            </section>

            {/* Bedrooms Grid */}
            <section>
              <label className="font-['Inter'] text-xs font-bold uppercase tracking-widest text-[#5e5e5e] mb-3 block">
                Bedrooms
              </label>
              <div className="grid grid-cols-4 gap-2 font-['Inter'] text-sm">
                {[1, 2, 3, 4].map((beds) => (
                  <button
                    key={beds}
                    onClick={() => setSelectedBeds(beds)}
                    className={`py-2 rounded-md font-semibold transition-all cursor-pointer text-sm ${
                      selectedBeds === beds
                        ? 'bg-[#00236f] text-white shadow-xs'
                        : 'bg-white border border-[#c5c5d3]/30 text-[#191c1d] hover:bg-[#00236f] hover:text-white'
                    }`}
                  >
                    {beds}+
                  </button>
                ))}
              </div>
            </section>

            {/* Amenities Checkboxes */}
            <section>
              <label className="font-['Inter'] text-xs font-bold uppercase tracking-widest text-[#5e5e5e] mb-3 block">
                Amenities
              </label>
              <div className="space-y-3 font-['Inter'] text-sm">
                {[
                  { name: 'Private Pool' },
                  { name: 'Mountain View' },
                  { name: 'Solar Energy' },
                  { name: 'High-Speed WiFi' },
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
                      <span className="text-sm text-[#444651] group-hover:text-[#191c1d]">
                        {amenity.name}
                      </span>
                    </label>
                  );
                })}
              </div>
            </section>

            {/* Update Search Button */}
            <button
              onClick={() => {
                setMobileFilterOpen(false);
                showToast(`Filters applied: ${filteredHouses.length} curated estates matched.`);
              }}
              className="w-full py-4 bg-[#00236f] text-white font-['Manrope'] font-bold text-sm rounded-md hover:bg-[#001c55] hover:shadow-xl transition-all cursor-pointer shadow-xs active:scale-98"
            >
              Update Search
            </button>
          </div>
        </aside>

        {/* Mobile Filter Drawer Overlay */}
        {mobileFilterOpen && (
          <div
            onClick={() => setMobileFilterOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 lg:hidden"
          />
        )}

        {/* =========================================================
            2. Main Content Area: House List Bento Grid
            ========================================================= */}
        <div
          className={`flex-1 px-4 sm:px-8 py-6 overflow-y-auto ${
            mobileViewTab === 'map' ? 'hidden xl:block' : 'block'
          }`}
        >
          {/* Header Title & Subtitle */}
          <header className="mb-8 md:mb-12">
            <h1 className="font-['Manrope'] text-3xl sm:text-4xl font-extrabold tracking-tight text-[#191c1d] max-w-2xl leading-tight">
              Exclusive Rental Estates in <span className="text-[#00236f]">Kigali</span>
            </h1>
            <p className="font-['Inter'] text-[#444651] mt-3 sm:mt-4 max-w-xl text-base sm:text-lg leading-relaxed">
              Discover hand-picked architectural gems, selected for their design integrity and premium
              Rwandan craftsmanship.
            </p>
          </header>

          {isLoading && (
            <div className="py-8 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
              <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>
              <span>Loading curated rental houses...</span>
            </div>
          )}

          {/* Houses Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-12">
            {/* House Card 1 (The Obsidian Ridge) */}
            {filteredHouses.length > 0 && (
              <article
                onClick={() => {
                  const mapped = toPropertyAdapter(filteredHouses[0]);
                  onSelectProperty?.(mapped);
                }}
                onMouseEnter={() => setHoveredHouseId(filteredHouses[0].id)}
                onMouseLeave={() => setHoveredHouseId(null)}
                className="group bg-white rounded-md overflow-hidden transition-all duration-500 hover:translate-y-[-4px] border border-[#c5c5d3]/20 shadow-xs cursor-pointer flex flex-col justify-between"
              >
                <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
                  <img
                    src={filteredHouses[0].image}
                    alt={filteredHouses[0].title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="bg-[#00236f]/90 text-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-md backdrop-blur-sm">
                      {filteredHouses[0].category}
                    </span>
                    <span className="bg-[#603609]/90 text-[#ffdcc1] px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-md backdrop-blur-sm">
                      AI SCORE {filteredHouses[0].aiScore}
                    </span>
                  </div>

                  <button
                    onClick={(e) => toggleFavorite(filteredHouses[0].id, e)}
                    className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 backdrop-blur-md p-2 rounded-full transition-colors cursor-pointer text-white"
                    title="Save to favorites"
                  >
                    <span
                      className="material-symbols-outlined text-white"
                      style={{
                        fontVariationSettings: favorites.has(filteredHouses[0].id)
                          ? "'FILL' 1"
                          : "'FILL' 0",
                      }}
                    >
                      favorite
                    </span>
                  </button>
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h3 className="font-['Manrope'] text-xl font-bold text-[#191c1d] group-hover:text-[#00236f] transition-colors">
                        {filteredHouses[0].title}
                      </h3>
                      <p className="text-[#444651] text-sm flex items-center mt-1">
                        <span className="material-symbols-outlined text-xs mr-1 text-slate-400">
                          location_on
                        </span>
                        {filteredHouses[0].location}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="block font-['Manrope'] text-2xl font-extrabold text-[#00236f]">
                        {filteredHouses[0].priceDisplay}
                      </span>
                      <span className="text-xs text-[#5e5e5e] font-medium">per month</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6 py-2 border-t border-slate-100 text-sm text-[#444651]">
                    <div className="flex items-center space-x-1">
                      <span className="material-symbols-outlined text-lg">bed</span>
                      <span>{filteredHouses[0].beds} Beds</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="material-symbols-outlined text-lg">bathtub</span>
                      <span>{filteredHouses[0].baths} Baths</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="material-symbols-outlined text-lg">straighten</span>
                      <span>{filteredHouses[0].areaM2} m²</span>
                    </div>
                  </div>
                </div>
              </article>
            )}

            {/* House Card 2 (Emerald Terraces) */}
            {filteredHouses.length > 1 && (
              <article
                onClick={() => {
                  const mapped = toPropertyAdapter(filteredHouses[1]);
                  onSelectProperty?.(mapped);
                }}
                onMouseEnter={() => setHoveredHouseId(filteredHouses[1].id)}
                onMouseLeave={() => setHoveredHouseId(null)}
                className="group bg-white rounded-md overflow-hidden transition-all duration-500 hover:translate-y-[-4px] border border-[#c5c5d3]/20 shadow-xs cursor-pointer flex flex-col justify-between"
              >
                <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
                  <img
                    src={filteredHouses[1].image}
                    alt={filteredHouses[1].title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="bg-[#00236f]/90 text-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-md backdrop-blur-sm">
                      {filteredHouses[1].category}
                    </span>
                    <span className="bg-[#603609]/90 text-[#ffdcc1] px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-md backdrop-blur-sm">
                      AI SCORE {filteredHouses[1].aiScore}
                    </span>
                  </div>

                  <button
                    onClick={(e) => toggleFavorite(filteredHouses[1].id, e)}
                    className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 backdrop-blur-md p-2 rounded-full transition-colors cursor-pointer text-white"
                    title="Save to favorites"
                  >
                    <span
                      className="material-symbols-outlined text-white"
                      style={{
                        fontVariationSettings: favorites.has(filteredHouses[1].id)
                          ? "'FILL' 1"
                          : "'FILL' 0",
                      }}
                    >
                      favorite
                    </span>
                  </button>
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h3 className="font-['Manrope'] text-xl font-bold text-[#191c1d] group-hover:text-[#00236f] transition-colors">
                        {filteredHouses[1].title}
                      </h3>
                      <p className="text-[#444651] text-sm flex items-center mt-1">
                        <span className="material-symbols-outlined text-xs mr-1 text-slate-400">
                          location_on
                        </span>
                        {filteredHouses[1].location}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="block font-['Manrope'] text-2xl font-extrabold text-[#00236f]">
                        {filteredHouses[1].priceDisplay}
                      </span>
                      <span className="text-xs text-[#5e5e5e] font-medium">per month</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6 py-2 border-t border-slate-100 text-sm text-[#444651]">
                    <div className="flex items-center space-x-1">
                      <span className="material-symbols-outlined text-lg">bed</span>
                      <span>{filteredHouses[1].beds} Beds</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="material-symbols-outlined text-lg">bathtub</span>
                      <span>{filteredHouses[1].baths} Baths</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="material-symbols-outlined text-lg">pool</span>
                      <span>Pool</span>
                    </div>
                  </div>
                </div>
              </article>
            )}

            {/* House Card 3 (Horizon Heights - Editor's Choice Wide Spanning Estate) */}
            {filteredHouses.length > 2 && (
              <article
                onClick={() => {
                  const mapped = toPropertyAdapter(filteredHouses[2]);
                  onSelectProperty?.(mapped);
                }}
                onMouseEnter={() => setHoveredHouseId(filteredHouses[2].id)}
                onMouseLeave={() => setHoveredHouseId(null)}
                className="group bg-white rounded-md overflow-hidden transition-all duration-500 hover:translate-y-[-4px] md:col-span-2 border border-[#c5c5d3]/20 shadow-xs cursor-pointer"
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
                    <button
                      onClick={(e) => toggleFavorite(filteredHouses[2].id, e)}
                      className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 backdrop-blur-md p-2 rounded-full transition-colors cursor-pointer text-white"
                    >
                      <span
                        className="material-symbols-outlined text-white"
                        style={{
                          fontVariationSettings: favorites.has(filteredHouses[2].id)
                            ? "'FILL' 1"
                            : "'FILL' 0",
                        }}
                      >
                        favorite
                      </span>
                    </button>
                  </div>

                  <div className="md:col-span-2 p-6 sm:p-8 flex flex-col justify-between space-y-6">
                    <div>
                      <div className="flex justify-between items-end gap-2">
                        <div>
                          <span className="bg-[#b6c4ff] text-[#264191] px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-md mb-3 inline-block">
                            INVESTMENT GRADE
                          </span>
                          <h3 className="font-['Manrope'] text-3xl font-extrabold text-[#191c1d]">
                            {filteredHouses[2].title}
                          </h3>
                          <p className="text-[#444651] text-base flex items-center mt-2">
                            <span className="material-symbols-outlined text-sm mr-1 text-slate-400">
                              location_on
                            </span>
                            {filteredHouses[2].location}
                          </p>
                        </div>
                        <div className="bg-[#f3f4f5] p-2.5 rounded-xl text-center min-w-[90px]">
                          <span className="block text-[10px] text-[#5e5e5e] font-bold uppercase">
                            AI SCORE
                          </span>
                          <span className="text-2xl font-black text-[#00236f]">
                            {filteredHouses[2].aiScore}
                          </span>
                        </div>
                      </div>

                      <p className="text-[#444651] line-clamp-3 leading-relaxed mt-4 text-sm">
                        {filteredHouses[2].description}
                      </p>
                    </div>

                    <div className="flex justify-between items-center border-t border-[#c5c5d3]/20 pt-6">
                      <span className="font-['Manrope'] text-3xl font-black text-[#00236f]">
                        {filteredHouses[2].priceDisplay}
                        <span className="text-sm font-normal text-[#5e5e5e]">/mo</span>
                      </span>
                      <button
                        onClick={(e) => handleBookViewing(filteredHouses[2], e)}
                        className="px-6 py-3 bg-[#432200] text-white font-bold rounded-md hover:bg-[#603609] transition-colors cursor-pointer text-sm shadow-xs active:scale-95"
                      >
                        Book View
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            )}

            {/* Additional Cards if matched */}
            {filteredHouses.slice(3).map((house) => (
              <article
                key={house.id}
                onClick={() => {
                  const mapped = toPropertyAdapter(house);
                  onSelectProperty?.(mapped);
                }}
                onMouseEnter={() => setHoveredHouseId(house.id)}
                onMouseLeave={() => setHoveredHouseId(null)}
                className="group bg-white rounded-md overflow-hidden transition-all duration-500 hover:translate-y-[-4px] border border-[#c5c5d3]/20 shadow-xs cursor-pointer flex flex-col justify-between"
              >
                <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
                  <img
                    src={house.image}
                    alt={house.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
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
                    className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 backdrop-blur-md p-2 rounded-full transition-colors cursor-pointer text-white"
                  >
                    <span
                      className="material-symbols-outlined text-white"
                      style={{
                        fontVariationSettings: favorites.has(house.id) ? "'FILL' 1" : "'FILL' 0",
                      }}
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
                      <p className="text-[#444651] text-sm flex items-center mt-1">
                        <span className="material-symbols-outlined text-xs mr-1 text-slate-400">
                          location_on
                        </span>
                        {house.location}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="block font-['Manrope'] text-2xl font-extrabold text-[#00236f]">
                        {house.priceDisplay}
                      </span>
                      <span className="text-xs text-[#5e5e5e] font-medium">per month</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6 py-2 border-t border-slate-100 text-sm text-[#444651]">
                    <div className="flex items-center space-x-1">
                      <span className="material-symbols-outlined text-lg">bed</span>
                      <span>{house.beds} Beds</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="material-symbols-outlined text-lg">bathtub</span>
                      <span>{house.baths} Baths</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="material-symbols-outlined text-lg">straighten</span>
                      <span>{house.areaM2} m²</span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {filteredHouses.length === 0 && (
            <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300">
              <span className="material-symbols-outlined text-4xl text-slate-300">search_off</span>
              <h3 className="text-base font-bold text-slate-700 mt-2">No matching rental houses</h3>
              <p className="text-xs text-slate-500 mt-1">Try expanding your rent limit or bedroom criteria.</p>
              <button
                onClick={() => {
                  setRentLimit(5000000);
                  setSelectedBeds(1);
                  setSelectedAmenities([]);
                }}
                className="mt-4 px-4 py-2 bg-[#00236f] text-white text-xs font-bold rounded-lg cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>

        {/* =========================================================
            3. Integrated Map View (Right Side Desktop & Mobile Tab)
            ========================================================= */}
        <aside
          className={`w-full xl:w-[400px] 2xl:w-[440px] shrink-0 sticky top-36 h-[calc(100vh-9rem)] bg-[#edeeef] border-l border-[#c5c5d3]/20 overflow-hidden ${
            mobileViewTab === 'list' ? 'hidden xl:block' : 'block'
          }`}
        >
          {mapMode === 'stylized' ? (
            /* Stylized Map matching the uploaded code design exactly */
            <div className="w-full h-full relative overflow-hidden group">
              <div
                className={`absolute inset-0 transition-all duration-300 ${
                  mapLayer === 'satellite' ? 'brightness-90 contrast-110' : 'grayscale-[15%] opacity-90'
                }`}
                style={{
                  backgroundImage:
                    mapLayer === 'satellite'
                      ? "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDQy0BGOJaIgImehvvS8OtJRPfwyjRJGv-yVUegwZf0Lm7qUzzI2cUKrnwnKwn2GjJC0MATkT7_BX9vkYLAUh8XSRE9I_61jMDQdNS4uBcZULn9piHz3AD6SwvFspbmMRCnU8MC4iC5eveXAUwlkKj3jtn5TFkV-9YAQQpW2m-n9M6w05HFsX85GaBuVbOqimfjOJv0bouNRbygUzX3PGlbW4Om6xfPhuwFYgV2K79W__ZAbSYfAD9hXvCwAs5PjSDfGJZ6Psn-YfVO')"
                      : "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDQy0BGOJaIgImehvvS8OtJRPfwyjRJGv-yVUegwZf0Lm7qUzzI2cUKrnwnKwn2GjJC0MATkT7_BX9vkYLAUh8XSRE9I_61jMDQdNS4uBcZULn9piHz3AD6SwvFspbmMRCnU8MC4iC5eveXAUwlkKj3jtn5TFkV-9YAQQpW2m-n9M6w05HFsX85GaBuVbOqimfjOJv0bouNRbygUzX3PGlbW4Om6xfPhuwFYgV2K79W__ZAbSYfAD9hXvCwAs5PjSDfGJZ6Psn-YfVO')",
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />

              {/* Map UI Elements & Price Markers */}
              <div className="absolute inset-0 pointer-events-none">
                {/* Map Pin 1: RWF 3.2M (Nyarutarama) */}
                <div
                  onClick={() => {
                    const mapped = toPropertyAdapter(fallbackHouses[0]);
                    onSelectProperty?.(mapped);
                  }}
                  className="absolute top-1/4 left-1/3 pointer-events-auto transform -translate-x-1/2 -translate-y-1/2"
                >
                  <div className="bg-[#00236f] text-white px-3 py-1 rounded-full font-bold text-sm shadow-xl flex items-center gap-1 hover:scale-110 transition-transform cursor-pointer">
                    <span>RWF 3.2M</span>
                    <span
                      className="material-symbols-outlined text-xs text-amber-300"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      star
                    </span>
                  </div>
                  <div className="w-2 h-2 bg-[#00236f] rotate-45 mx-auto -mt-1 shadow-lg" />
                </div>

                {/* Map Pin 2: RWF 1.8M (Kibagabaga) */}
                <div
                  onClick={() => {
                    const mapped = toPropertyAdapter(fallbackHouses[1]);
                    onSelectProperty?.(mapped);
                  }}
                  className="absolute top-1/2 left-2/3 pointer-events-auto transform -translate-x-1/2 -translate-y-1/2"
                >
                  <div className="bg-white text-[#00236f] px-3 py-1 rounded-full font-bold text-sm shadow-xl flex items-center gap-1 hover:scale-110 transition-transform cursor-pointer border border-[#c5c5d3]/40">
                    <span>RWF 1.8M</span>
                  </div>
                  <div className="w-2 h-2 bg-white rotate-45 mx-auto -mt-1 shadow-lg" />
                </div>

                {/* Map Pin 3: RWF 4.5M (Rebero) */}
                <div
                  onClick={() => {
                    const mapped = toPropertyAdapter(fallbackHouses[2]);
                    onSelectProperty?.(mapped);
                  }}
                  className="absolute bottom-1/4 left-1/4 pointer-events-auto transform -translate-x-1/2 -translate-y-1/2"
                >
                  <div className="bg-[#432200] text-white px-3 py-1 rounded-full font-bold text-sm shadow-xl flex items-center gap-1 hover:scale-110 transition-transform cursor-pointer">
                    <span>RWF 4.5M</span>
                  </div>
                  <div className="w-2 h-2 bg-[#432200] rotate-45 mx-auto -mt-1 shadow-lg" />
                </div>
              </div>

              {/* Map Overlay Controls */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10 w-full px-4 justify-center">
                <button
                  onClick={() => setMapLayer(mapLayer === 'standard' ? 'satellite' : 'standard')}
                  className="bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-md shadow-lg flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider text-[#191c1d] hover:bg-white cursor-pointer active:scale-95 transition-all"
                >
                  <span className="material-symbols-outlined text-sm">
                    {mapLayer === 'satellite' ? 'map' : 'layers'}
                  </span>
                  <span>{mapLayer === 'satellite' ? 'Map' : 'Satellite'}</span>
                </button>

                <button
                  onClick={() => setMapMode('interactive')}
                  className="bg-[#00236f] text-white px-3.5 py-2.5 rounded-md shadow-lg flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider hover:bg-[#001c55] cursor-pointer active:scale-95 transition-all"
                  title="Switch to live Google Map with zoom and pan"
                >
                  <span className="material-symbols-outlined text-sm">travel_explore</span>
                  <span>Live Map</span>
                </button>
              </div>
            </div>
          ) : (
            /* Live Interactive Kigali Map Component */
            <div className="w-full h-full relative">
              <KigaliRealMap
                properties={propertyAdapters}
                selectedProperty={null}
                hoveredPropertyId={hoveredHouseId}
                onSelectProperty={(prop) => onSelectProperty?.(prop)}
                onHoverProperty={(id) => setHoveredHouseId(id)}
                onBookTour={(prop) => onBookTour?.(prop)}
                currency="RWF"
                showLandmarks={true}
                onToggleLandmarks={() => {}}
              />
              <button
                onClick={() => setMapMode('stylized')}
                className="absolute top-4 right-4 bg-white/90 backdrop-blur-md p-2 rounded-lg text-xs font-bold text-slate-800 shadow-md hover:bg-white z-20 cursor-pointer flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">view_compact</span>
                <span>Compact View</span>
              </button>
            </div>
          )}
        </aside>
      </main>

      {/* -------------------------------------------------------------
          Bottom Navigation Bar (Mobile Only matching attached code)
          ------------------------------------------------------------- */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center px-4 py-3 pb-safe bg-white/90 backdrop-blur-xl z-40 shadow-2xl border-t border-[#c5c5d3]/20">
        <button
          onClick={() => {
            setMobileViewTab('list');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex flex-col items-center justify-center text-[#00236f] font-bold scale-105 transition-transform active:scale-95 cursor-pointer"
        >
          <span
            className="material-symbols-outlined text-xl"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            explore
          </span>
          <span className="font-['Inter'] text-[10px] font-medium tracking-tight mt-0.5">Explore</span>
        </button>
        <button
          onClick={() => {
            if (onNavigate) onNavigate('tenant-dashboard');
          }}
          className="flex flex-col items-center justify-center text-slate-400 hover:text-[#00236f] transition-transform active:scale-95 cursor-pointer"
        >
          <span className="material-symbols-outlined text-xl">favorite</span>
          <span className="font-['Inter'] text-[10px] font-medium tracking-tight mt-0.5">Saved</span>
        </button>
        <button
          onClick={() => {
            if (onNavigate) onNavigate('tenant-dashboard');
          }}
          className="flex flex-col items-center justify-center text-slate-400 hover:text-[#00236f] transition-transform active:scale-95 cursor-pointer"
        >
          <span className="material-symbols-outlined text-xl">mail</span>
          <span className="font-['Inter'] text-[10px] font-medium tracking-tight mt-0.5">Messages</span>
        </button>
        <button
          onClick={() => {
            if (onNavigate) onNavigate('tenant-dashboard');
          }}
          className="flex flex-col items-center justify-center text-slate-400 hover:text-[#00236f] transition-transform active:scale-95 cursor-pointer"
        >
          <span className="material-symbols-outlined text-xl">person</span>
          <span className="font-['Inter'] text-[10px] font-medium tracking-tight mt-0.5">Profile</span>
        </button>
      </nav>

      {/* -------------------------------------------------------------
          Floating Action Button (FAB for Filter on Mobile)
          ------------------------------------------------------------- */}
      <button
        onClick={() => setMobileFilterOpen(true)}
        className="md:hidden fixed bottom-20 right-5 bg-[#00236f] text-white h-14 w-14 rounded-full shadow-2xl flex items-center justify-center z-40 transition-transform active:scale-95 cursor-pointer"
        aria-label="Open Filters"
      >
        <span className="material-symbols-outlined text-2xl">tune</span>
      </button>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-24 md:bottom-8 right-6 z-50 bg-[#00236f] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-bold animate-in slide-in-from-bottom-5">
          <span className="material-symbols-outlined text-base text-emerald-400">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
