import React, { useState, useEffect } from 'react';
import { Property, ActiveScreen } from '../types';
import { KigaliRealMap } from './KigaliRealMap';

interface ApartmentItem {
  id: string;
  title: string;
  neighborhood: string;
  districtLabel: string;
  location: string;
  monthlyRentUsd: number;
  monthlyRentRwf: number;
  priceDisplay: string;
  priceDisplayRwf: string;
  beds: number;
  baths: number;
  areaM2: number;
  floorLevel: string;
  floorLevelCategory: 'All' | 'Ground' | '1-5' | '6+';
  aiScore: number;
  category: string;
  amenities: string[];
  tags: string[];
  image: string;
  coordinates: { lat: number; lng: number };
  mapPinLabel: string;
  description: string;
}

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
  // Filter states
  const [selectedFloor, setSelectedFloor] = useState<'All' | 'Ground' | '1-5' | '6+'>('All');
  const [isFloorFilterOpen, setIsFloorFilterOpen] = useState(false);
  const [filterGym, setFilterGym] = useState(false);
  const [filterSecurity, setFilterSecurity] = useState(false);
  const [filterParking, setFilterParking] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currency, setCurrency] = useState<'USD' | 'RWF'>('USD');
  const [mobileTab, setMobileTab] = useState<'list' | 'map'>('list');
  const [hoveredAptId, setHoveredAptId] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set(['apt-horizon-penthouse']));
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [mapDisplayMode, setMapDisplayMode] = useState<'stylized' | 'interactive'>('stylized');
  const [showLandmarks, setShowLandmarks] = useState(true);

  // Fallback apartment listings matching the design attachments
  const defaultApartments: ApartmentItem[] = [
    {
      id: 'apt-horizon-penthouse',
      title: 'The Horizon Penthouse',
      neighborhood: 'Kiyovu',
      districtLabel: 'Kiyovu District',
      location: 'Kiyovu District, Central Kigali',
      monthlyRentUsd: 2400,
      monthlyRentRwf: 3120000,
      priceDisplay: '$2,400',
      priceDisplayRwf: 'RWF 3,120,000',
      beds: 3,
      baths: 2,
      areaM2: 185,
      floorLevel: '12th Floor',
      floorLevelCategory: '6+',
      aiScore: 9.9,
      category: 'Kiyovu District',
      amenities: ['Gym', 'Security', 'Parking', 'Concierge'],
      tags: ['Penthouse', 'Panoramic View'],
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCCVNPuuLKyLUmITRD4iv_J6YPSEG7K0KJjEJ85wW0jubAAOHu10KyiEB4RLiLrc2NyOectXONaKMDKAkbG3eet9Y4OOOU9nnbT_b15a9J7L_1NXgxrhQNUWlWUVBo9S5_-duxBdcCUTsFLohuJacMYcQivLpCGuuXgpLZLF15ivSJvUQcm015bFm6Pq4RN6mCZ3jTwLuGFspOk1NpyLqr_LHK91rI1ERK-H39dIvfcFBkAVEqAAP6iSdy8ql0la46AzO1Z2sqDOyXr',
      coordinates: { lat: -1.956, lng: 30.064 },
      mapPinLabel: '$2,400',
      description:
        'Stunning 12th floor residence featuring panoramic views of the city center. Includes 24/7 concierge, private gym access, and biometric security.',
    },
    {
      id: 'apt-serene-garden-loft',
      title: 'Serene Garden Loft',
      neighborhood: 'Kicukiro',
      districtLabel: 'Kicukiro Heights',
      location: 'Kicukiro Heights, Kigali',
      monthlyRentUsd: 1850,
      monthlyRentRwf: 2405000,
      priceDisplay: '$1,850',
      priceDisplayRwf: 'RWF 2,405,000',
      beds: 2,
      baths: 2,
      areaM2: 120,
      floorLevel: '2nd Floor',
      floorLevelCategory: '1-5',
      aiScore: 9.5,
      category: 'Kicukiro Heights',
      amenities: ['Gym', 'Security', 'Parking'],
      tags: ['Garden Terrace', 'High-Speed Fiber'],
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuB4A5pPbu2n4wff1Tr7qv9v9zry3eeSo9nE_KtITAGPrz9a0R5L8ch4R3UDds7X48FppaN41kUFw7lVZr04BbA7xVq5Z1VhR7Enltmqf760cls17sOd9RKlJmFlZ4KAstBWqF_JfMOcqBIuZO2JgHz2rJTxFynuXDhKdfuJE_k3764WID9z_0Stj3BavZhcLHjoBifj3PlADM_4_5FAokdn2ryLDdthmMxecLVsKeH4EOaLDt-WZf2h66-Gpt0nLBomaaWyYK22QwCL',
      coordinates: { lat: -1.970, lng: 30.105 },
      mapPinLabel: '$1,850',
      description:
        'A tranquil escape located in the heart of Kicukiro. Minimalist design paired with lush terrace gardens and high-speed fiber connectivity.',
    },
    {
      id: 'apt-executive-studio',
      title: 'The Executive Studio',
      neighborhood: 'Nyarugenge',
      districtLabel: 'Nyarugenge Central',
      location: 'Nyarugenge Central, Financial District',
      monthlyRentUsd: 1200,
      monthlyRentRwf: 1560000,
      priceDisplay: '$1,200',
      priceDisplayRwf: 'RWF 1,560,000',
      beds: 1,
      baths: 1,
      areaM2: 75,
      floorLevel: '5th Floor',
      floorLevelCategory: '1-5',
      aiScore: 9.3,
      category: 'Nyarugenge Central',
      amenities: ['Security', 'Parking', 'Gym'],
      tags: ['Smart Home', 'Rooftop Lounge'],
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAuXDmAhGOsE_s4GLfOwd-Mw01QwuewhhlMARSQ_GJ2i-BlD6AbD-P4XUST-OqxSKs-ueLWWo9R23LuOpLKjZEese6rXorWcBdLYtdev4hJ0HcLjHD0Bq_WKHcgXFwhD8BNpwV42JE4co4zJnjQmCD2ut4DGV0eq7BfU3uJXLOPF3VdEehQxFgpUWQV8_d41EYxRFs-GzqXt32w_YHEdyIOkV7dS4qud9NuTU5AXx-CxWr1FR7Rpq2v9oeEIvZmXN7nZyKSBhQb4zxS',
      coordinates: { lat: -1.944, lng: 30.061 },
      mapPinLabel: '$1,200',
      description:
        'Optimized for the modern professional. Steps away from the financial district, featuring smart home integration and rooftop lounge access.',
    },
    {
      id: 'apt-kimihurura-garden-suites',
      title: 'Kimihurura Garden Suites',
      neighborhood: 'Kimihurura',
      districtLabel: 'Kimihurura Ridge',
      location: 'Kimihurura, Gasabo, Kigali',
      monthlyRentUsd: 1800,
      monthlyRentRwf: 2340000,
      priceDisplay: '$1,800',
      priceDisplayRwf: 'RWF 2,340,000',
      beds: 2,
      baths: 2,
      areaM2: 140,
      floorLevel: 'Ground',
      floorLevelCategory: 'Ground',
      aiScore: 9.4,
      category: 'Kimihurura Ridge',
      amenities: ['Gym', 'Security', 'Parking'],
      tags: ['Pool View', 'Private Garden Patio'],
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAufnkaZ4rdFl3uxX5o5ILbYJk3wSWx7h3ZVo2qg_t2cAOGoIK290ODFUXHBS8dUYes8anKezaamrv1mrcP8qGvFTKFgF370KwYwS06Z5WgtPgrYAheH2ZdXx5DGC85XSEU2hkabtYXjptOjOcFBDK_GXnhMh0cedDYHYfT1PSOgldaYeqxj57SJOywVMPqBUs2aOdOm3L7cl8OIJJPxPNYqitFWlPB7eSHJrnNrvPVkSAVpz3xfBOq7N0a7q43CwPBcMtnTdgaaixJ',
      coordinates: { lat: -1.961, lng: 30.088 },
      mapPinLabel: '$1,800',
      description:
        'Luxury infinity pool and private garden patio at dusk, reflecting the city lights of Kigali under a deep indigo sky.',
    },
    {
      id: 'apt-horizon-heights',
      title: 'Nyarutarama Golf Panorama Penthouse',
      neighborhood: 'Nyarutarama',
      districtLabel: 'Nyarutarama Enclave',
      location: 'Nyarutarama, District Gasabo',
      monthlyRentUsd: 2600,
      monthlyRentRwf: 3380000,
      priceDisplay: '$2,600',
      priceDisplayRwf: 'RWF 3,380,000',
      beds: 3,
      baths: 2.5,
      areaM2: 210,
      floorLevel: '14th Floor',
      floorLevelCategory: '6+',
      aiScore: 9.8,
      category: 'Nyarutarama Enclave',
      amenities: ['Gym', 'Security', 'Parking', 'Concierge'],
      tags: ['Golf Course Vista', 'Underground Valet'],
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuA9L4OJgOUvfqUbnCl1v-rgiVQpBceNUeNhWfZ0_rliHxExMPPfU7FZrviRNnTKab7XFP-91UHPcEEhvMPa2vfyMpFi8hrK4x-UYo1U8XtfE3OQHiV7J_XdOyIIoELXmXNVU-GIOqSWkTQLiRFJe02JzXU45Fu14N06AUBZnG5aqA_yZoU4FDyZpddYKAt5d17VEsHSYiLjLP7O3patxwuuNk8UylkVj_tNIxZKnhhmsB3vepfwIPsiQS1pPq_ppw-_hSGtsRaoK7kH',
      coordinates: { lat: -1.9368, lng: 30.0988 },
      mapPinLabel: '$2,600',
      description:
        'High-end penthouse living with floor-to-ceiling glass windows at sunset, private balcony lounge, 24/7 concierge, and underground valet parking.',
    },
  ];

  const [apartments, setApartments] = useState<ApartmentItem[]>(defaultApartments);

  // Fetch live from server
  useEffect(() => {
    const fetchApartments = async () => {
      try {
        const params = new URLSearchParams();
        if (selectedFloor !== 'All') params.append('floorLevel', selectedFloor);
        if (filterGym) params.append('gym', 'true');
        if (filterSecurity) params.append('security', 'true');
        if (filterParking) params.append('parking', 'true');
        if (searchQuery) params.append('search', searchQuery);

        const res = await fetch(`/api/apartments?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          if (data.apartments && data.apartments.length > 0) {
            setApartments(data.apartments);
          }
        }
      } catch (e) {
        console.warn('Fallback to local apartments data:', e);
      }
    };
    fetchApartments();
  }, [selectedFloor, filterGym, filterSecurity, filterParking, searchQuery]);

  // Client-side filtering fallback for instant responsiveness
  const filteredApts = apartments.filter((apt) => {
    if (selectedFloor !== 'All' && apt.floorLevelCategory !== selectedFloor) return false;
    if (filterGym && !apt.amenities.includes('Gym')) return false;
    if (filterSecurity && !apt.amenities.includes('Security')) return false;
    if (filterParking && !apt.amenities.includes('Parking')) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matches =
        apt.title.toLowerCase().includes(q) ||
        apt.neighborhood.toLowerCase().includes(q) ||
        apt.location.toLowerCase().includes(q) ||
        apt.description.toLowerCase().includes(q);
      if (!matches) return false;
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
        showToast('Removed from saved apartments');
      } else {
        next.add(id);
        showToast('Saved to your favorite residences');
      }
      return next;
    });
  };

  // Convert to Property adapter for modals
  const toPropertyAdapter = (apt: ApartmentItem): Property => ({
    id: apt.id,
    title: apt.title,
    neighborhood: apt.neighborhood,
    location: apt.location,
    price: apt.monthlyRentUsd,
    priceDisplay: apt.priceDisplay,
    rwfPriceDisplay: apt.priceDisplayRwf,
    propertyType: 'Penthouse',
    beds: apt.beds,
    baths: apt.baths,
    sqft: Math.round(apt.areaM2 * 10.76),
    areaM2: apt.areaM2,
    image: apt.image,
    gallery: [apt.image],
    architecturalStyle: 'Luxury High-Rise Residence',
    description: apt.description,
    highlights: [
      `Floor: ${apt.floorLevel}`,
      ...apt.amenities,
      ...apt.tags,
    ],
    zoning: 'Urban Residential High-Density',
    estimatedRentalYield: '11.8% annual net yield',
    yearBuilt: 2024,
    parkingSpaces: 2,
    lotSize: 'Shared Luxury Complex',
    coordinates: apt.coordinates,
    badge: apt.category,
    matchScore: Math.round(apt.aiScore * 10),
  });

  const propertyAdapters: Property[] = filteredApts.map(toPropertyAdapter);

  const handleOpenDetail = (apt: ApartmentItem) => {
    const adapter = toPropertyAdapter(apt);
    if (onSelectProperty) {
      onSelectProperty(adapter);
    }
  };

  return (
    <div className="bg-[#f8f9fa] text-[#191c1d] font-['Inter'] min-h-screen selection:bg-[#00236f] selection:text-white">
      {/* -------------------------------------------------------------
          ORIGINAL SUB-HEADER NAVIGATION BAR (Preserved Exactly as Requested)
          ------------------------------------------------------------- */}
      <div className="bg-white border-b border-[#c5c5d3]/20 px-4 sm:px-8 py-3 sticky top-20 z-30 shadow-2xs">
        <div className="max-w-[1920px] mx-auto flex items-center justify-between">
          {/* Main Category Nav Tabs */}
          <div className="flex items-center gap-6 overflow-x-auto no-scrollbar font-['Manrope'] text-xs uppercase tracking-wider font-bold">
            <button
              onClick={() => onNavigate?.('houses-for-sale')}
              className="text-slate-500 hover:text-[#00236f] transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
            >
              <span className="material-symbols-outlined text-base">sell</span>
              <span>For Sale</span>
            </button>
            <button
              onClick={() => onNavigate?.('houses')}
              className="text-slate-500 hover:text-[#00236f] transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
            >
              <span className="material-symbols-outlined text-base">villa</span>
              <span>Houses</span>
            </button>
            <button
              onClick={() => onNavigate?.('apartments')}
              className="text-[#00236f] border-b-2 border-[#00236f] pb-1 cursor-pointer flex items-center gap-1.5 shrink-0 font-extrabold"
            >
              <span className="material-symbols-outlined text-base">apartment</span>
              <span>Apartments</span>
            </button>
            <button
              onClick={() => onNavigate?.('land')}
              className="text-slate-500 hover:text-[#00236f] transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
            >
              <span className="material-symbols-outlined text-base">landscape</span>
              <span>Land &amp; Plots</span>
            </button>
            <button
              onClick={() => onNavigate?.('investments')}
              className="text-slate-500 hover:text-[#00236f] transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
            >
              <span className="material-symbols-outlined text-base">trending_up</span>
              <span>Investments</span>
            </button>
          </div>

          {/* Right Header Controls: Currency, Search, Mobile Tab, List Property */}
          <div className="flex items-center gap-3">
            {/* Currency toggle */}
            <div className="flex items-center bg-slate-100 rounded-lg p-0.5 text-xs font-bold text-slate-700">
              <button
                onClick={() => setCurrency('USD')}
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  currency === 'USD' ? 'bg-white text-[#00236f] shadow-2xs font-extrabold' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                USD ($)
              </button>
              <button
                onClick={() => setCurrency('RWF')}
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  currency === 'RWF' ? 'bg-white text-[#00236f] shadow-2xs font-extrabold' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                RWF
              </button>
            </div>

            {/* Quick search input in subheader */}
            <div className="hidden lg:flex items-center bg-[#f3f4f5] px-3.5 py-1.5 rounded-lg border border-[#c5c5d3]/30">
              <span className="material-symbols-outlined text-slate-400 text-sm mr-2">search</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Kigali apartments..."
                className="bg-transparent border-none text-xs w-44 focus:outline-none placeholder-slate-400 text-[#191c1d]"
              />
            </div>

            {/* Mobile View Toggle */}
            <div className="flex lg:hidden bg-slate-100 p-1 rounded-lg text-xs font-bold">
              <button
                onClick={() => setMobileTab('list')}
                className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                  mobileTab === 'list' ? 'bg-[#00236f] text-white shadow-2xs' : 'text-slate-600'
                }`}
              >
                List
              </button>
              <button
                onClick={() => setMobileTab('map')}
                className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                  mobileTab === 'map' ? 'bg-[#00236f] text-white shadow-2xs' : 'text-slate-600'
                }`}
              >
                Map
              </button>
            </div>

            {/* Original List Property Button */}
            <button
              onClick={() => onOpenListProperty?.()}
              className="hidden sm:flex items-center gap-1.5 bg-gradient-to-br from-[#00236f] to-[#1e3a8a] text-white px-4 py-2 rounded-md font-bold text-xs uppercase tracking-wider hover:opacity-95 shadow-xs cursor-pointer active:scale-98 transition-transform"
            >
              <span className="material-symbols-outlined text-sm">add_business</span>
              <span>List Property</span>
            </button>
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------------
          MAIN ATTACHED APARTMENT EDITORIAL PAGE CONTENT
          ------------------------------------------------------------- */}
      <main className="pt-8 sm:pt-12 pb-24 max-w-screen-2xl mx-auto px-4 sm:px-8">
        {/* =========================================================
            1. Hero Editorial Header (Asymmetrical Architecture)
            ========================================================= */}
        <header className="grid grid-cols-12 gap-8 mb-12 sm:mb-16 items-end">
          <div className="col-span-12 md:col-span-5 flex flex-col justify-end pb-2 sm:pb-8">
            <span className="font-['Inter'] text-xs tracking-[0.2em] text-[#00236f] mb-3 sm:mb-4 font-bold uppercase">
              Curated Collections
            </span>
            <h1 className="font-['Manrope'] text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tighter text-[#191c1d] leading-[0.95] mb-4 sm:mb-6">
              Vertical Living in Kigali
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-[#444651] font-['Inter'] leading-relaxed max-w-md">
              Experience the new standard of Rwandan luxury. High-rise residences designed with architectural precision and panoramic city views.
            </p>
          </div>
          <div className="col-span-12 md:col-span-7 aspect-[16/8] sm:aspect-[16/7] bg-[#f3f4f5] rounded-xl overflow-hidden shadow-xs border border-[#c5c5d3]/15">
            <img
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              alt="Modern high-rise apartment building with sleek glass windows against a clear blue sky in Kigali"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDYNUC-qXnf5EESCLUKv6_rltlHjqqHSuRLwroYoWWAeCdEy69jmUcAHWiqC0t_WTJxmdohzjZQSfzUZi42jMXXbidt0TLPWJIo_6Bi3LLMFS0QP1IRePjkFRLb5C8W71hgaMEVtES3C1hjrFYYo-0sEGghBUBh1Q2Z50Bn2HC7hI7t0ikjh6l3iyovWwi0UHz60zXkw4XVTD0oZ8mPaODMg5YoORkK8vmXuYVa0PYUnL1YR391ZwkHxbadVTdpJK6WKWeQrFN3Uiy0"
            />
          </div>
        </header>

        {/* =========================================================
            2. Dynamic Filter Bar (Sticky with Floor Level, Gym, Security, Parking)
            ========================================================= */}
        <section className="mb-12 sticky top-36 z-25 bg-[#f8f9fa]/90 backdrop-blur-md py-3.5 border-y border-[#c5c5d3]/20">
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            {/* Search Input */}
            <div className="flex-1 min-w-[220px] relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-[#757682] text-lg">
                search
              </span>
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#f3f4f5] border-none rounded-lg pl-12 pr-10 py-3 text-xs sm:text-sm focus:ring-2 focus:ring-[#00236f]/30 font-['Inter'] text-[#191c1d] placeholder:text-slate-400 focus:bg-white transition-all outline-hidden"
                placeholder="Search by neighborhood..."
                type="text"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Quick Filter Buttons from Attachment */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              {/* Floor Level Filter with Popover Selector */}
              <div className="relative">
                <button
                  onClick={() => setIsFloorFilterOpen(!isFloorFilterOpen)}
                  className={`px-5 py-2.5 rounded-md font-['Inter'] text-xs sm:text-sm font-semibold flex items-center gap-2 cursor-pointer transition-all shadow-2xs ${
                    selectedFloor !== 'All'
                      ? 'bg-[#00236f] text-white'
                      : 'bg-[#e1e3e4] text-[#00236f] hover:bg-[#d0d3d5]'
                  }`}
                >
                  <span className="material-symbols-outlined text-lg">layers</span>
                  <span>{selectedFloor === 'All' ? 'Floor level' : `Floor: ${selectedFloor}`}</span>
                  <span className="material-symbols-outlined text-sm">
                    {isFloorFilterOpen ? 'expand_less' : 'expand_more'}
                  </span>
                </button>

                {isFloorFilterOpen && (
                  <div className="absolute left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-40 text-xs animate-in fade-in slide-in-from-top-1">
                    <p className="px-3 py-1 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      Select Elevation
                    </p>
                    {[
                      { id: 'All', label: 'All Floor Levels' },
                      { id: 'Ground', label: 'Ground Floor Suites' },
                      { id: '1-5', label: 'Mid-Rise (1st–5th Fl)' },
                      { id: '6+', label: 'High-Rise & Penthouses (6+)' },
                    ].map((lvl) => (
                      <button
                        key={lvl.id}
                        onClick={() => {
                          setSelectedFloor(lvl.id as any);
                          setIsFloorFilterOpen(false);
                          showToast(`Filter set to: ${lvl.label}`);
                        }}
                        className={`w-full text-left px-3.5 py-2 font-medium hover:bg-slate-50 transition-colors flex items-center justify-between cursor-pointer ${
                          selectedFloor === lvl.id ? 'text-[#00236f] font-bold bg-[#00236f]/5' : 'text-slate-700'
                        }`}
                      >
                        <span>{lvl.label}</span>
                        {selectedFloor === lvl.id && (
                          <span className="material-symbols-outlined text-sm text-[#00236f]">check</span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Gym Filter */}
              <button
                onClick={() => {
                  setFilterGym(!filterGym);
                  showToast(!filterGym ? 'Showing apartments with Fitness Gym' : 'Gym filter cleared');
                }}
                className={`px-5 py-2.5 rounded-md font-['Inter'] text-xs sm:text-sm font-semibold flex items-center gap-2 cursor-pointer transition-all shadow-2xs ${
                  filterGym
                    ? 'bg-[#00236f] text-white'
                    : 'bg-[#e1e3e4] text-[#00236f] hover:bg-[#d0d3d5]'
                }`}
              >
                <span className="material-symbols-outlined text-lg">fitness_center</span>
                <span>Gym</span>
              </button>

              {/* Security Filter */}
              <button
                onClick={() => {
                  setFilterSecurity(!filterSecurity);
                  showToast(!filterSecurity ? 'Showing 24/7 Biometric Security residences' : 'Security filter cleared');
                }}
                className={`px-5 py-2.5 rounded-md font-['Inter'] text-xs sm:text-sm font-semibold flex items-center gap-2 cursor-pointer transition-all shadow-2xs ${
                  filterSecurity
                    ? 'bg-[#00236f] text-white'
                    : 'bg-[#e1e3e4] text-[#00236f] hover:bg-[#d0d3d5]'
                }`}
              >
                <span className="material-symbols-outlined text-lg">verified_user</span>
                <span>Security</span>
              </button>

              {/* Parking Filter */}
              <button
                onClick={() => {
                  setFilterParking(!filterParking);
                  showToast(!filterParking ? 'Showing apartments with Dedicated Parking' : 'Parking filter cleared');
                }}
                className={`px-5 py-2.5 rounded-md font-['Inter'] text-xs sm:text-sm font-semibold flex items-center gap-2 cursor-pointer transition-all shadow-2xs ${
                  filterParking
                    ? 'bg-[#00236f] text-white'
                    : 'bg-[#e1e3e4] text-[#00236f] hover:bg-[#d0d3d5]'
                }`}
              >
                <span className="material-symbols-outlined text-lg">local_parking</span>
                <span>Parking</span>
              </button>

              {(selectedFloor !== 'All' || filterGym || filterSecurity || filterParking || searchQuery) && (
                <button
                  onClick={() => {
                    setSelectedFloor('All');
                    setFilterGym(false);
                    setFilterSecurity(false);
                    setFilterParking(false);
                    setSearchQuery('');
                    showToast('All apartment filters cleared');
                  }}
                  className="px-3 py-2 text-xs text-slate-500 hover:text-slate-900 cursor-pointer font-bold underline"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </section>

        {/* =========================================================
            3. Main Content Grid (Editorial Asymmetrical Listings & Sidebar)
            ========================================================= */}
        <div className="grid grid-cols-12 gap-8 lg:gap-12">
          {/* Apartment Listings Column */}
          <div
            className={`col-span-12 lg:col-span-8 space-y-12 sm:space-y-16 ${
              mobileTab === 'map' ? 'hidden lg:block' : 'block'
            }`}
          >
            {filteredApts.length === 0 && (
              <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
                <span className="material-symbols-outlined text-4xl text-slate-400 mb-2">apartment</span>
                <h3 className="text-lg font-bold text-slate-800">No apartments match your criteria</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4">
                  Try clearing some filter tags or adjusting your search term to see Kigali's luxury high-rises.
                </p>
                <button
                  onClick={() => {
                    setSelectedFloor('All');
                    setFilterGym(false);
                    setFilterSecurity(false);
                    setFilterParking(false);
                    setSearchQuery('');
                  }}
                  className="px-4 py-2 bg-[#00236f] text-white text-xs font-bold rounded-lg cursor-pointer"
                >
                  View All Residences
                </button>
              </div>
            )}

            {filteredApts.map((apt, index) => {
              // Alternating Asymmetrical Rhythm: Even items Image Left, Odd items Text Left (Image Right)
              const isEven = index % 2 === 0;
              const isFav = favorites.has(apt.id);
              const priceString =
                currency === 'USD' ? apt.priceDisplay : apt.priceDisplayRwf;

              return (
                <article
                  key={apt.id}
                  onClick={() => handleOpenDetail(apt)}
                  onMouseEnter={() => setHoveredAptId(apt.id)}
                  onMouseLeave={() => setHoveredAptId(null)}
                  className="group cursor-pointer"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-center bg-white p-3 sm:p-5 rounded-2xl border border-[#c5c5d3]/15 shadow-2xs hover:shadow-md transition-shadow">
                    {/* Image Container with alternating order */}
                    <div
                      className={`${
                        isEven ? 'order-1' : 'order-1 md:order-2'
                      } aspect-[4/3] rounded-xl overflow-hidden bg-[#f3f4f5] shadow-xs transition-transform duration-500 group-hover:scale-[1.02] relative`}
                    >
                      <img
                        className="w-full h-full object-cover"
                        alt={apt.title}
                        src={apt.image}
                      />
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                        <span className="bg-white/90 backdrop-blur-xs text-[#00236f] px-2.5 py-0.5 rounded-sm text-[10px] font-['Inter'] font-extrabold tracking-widest uppercase">
                          {apt.floorLevel}
                        </span>
                      </div>
                    </div>

                    {/* Content Details with alternating order */}
                    <div
                      className={`${
                        isEven ? 'order-2' : 'order-2 md:order-1'
                      } flex flex-col h-full justify-between py-2`}
                    >
                      <div>
                        {/* District Badge and Favorite Heart */}
                        <div className="flex justify-between items-start mb-3 sm:mb-4">
                          <span className="bg-[#b6c4ff] text-[#264191] px-3 py-1 rounded-xs text-xs font-['Inter'] font-bold tracking-widest uppercase">
                            {apt.districtLabel}
                          </span>
                          <button
                            onClick={(e) => toggleFavorite(apt.id, e)}
                            className="p-1 text-[#757682] hover:text-[#ba1a1a] transition-colors cursor-pointer"
                            title="Save to favorites"
                          >
                            <span
                              className="material-symbols-outlined text-xl"
                              style={{ fontVariationSettings: isFav ? "'FILL' 1" : "'FILL' 0" }}
                            >
                              favorite
                            </span>
                          </button>
                        </div>

                        {/* Title */}
                        <h3 className="text-2xl sm:text-3xl font-bold font-['Manrope'] text-[#191c1d] mb-2 tracking-tight group-hover:text-[#00236f] transition-colors">
                          {apt.title}
                        </h3>

                        {/* Key Specs Icons */}
                        <div className="flex items-center gap-4 text-[#757682] text-xs sm:text-sm mb-4 sm:mb-6 font-['Inter']">
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-base">bed</span>
                            <span>{apt.beds} Beds</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-base">bathtub</span>
                            <span>{apt.baths} Baths</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-base">square_foot</span>
                            <span>{apt.areaM2}m²</span>
                          </span>
                        </div>

                        {/* Description */}
                        <p className="text-[#444651] font-['Inter'] text-xs sm:text-sm line-clamp-2 mb-6 leading-relaxed">
                          {apt.description}
                        </p>
                      </div>

                      {/* Pricing and Action CTA */}
                      <div className="flex items-center justify-between border-t border-[#c5c5d3]/20 pt-5 sm:pt-6 mt-auto">
                        <div>
                          <span className="block text-[10px] text-[#757682] font-['Inter'] uppercase tracking-wider font-semibold">
                            Starting from
                          </span>
                          <span className="text-xl sm:text-2xl font-bold font-['Manrope'] text-[#00236f]">
                            {priceString}
                            <span className="text-xs sm:text-sm font-medium text-slate-500">/mo</span>
                          </span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenDetail(apt);
                          }}
                          className="px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-br from-[#00236f] to-[#1e3a8a] text-white rounded-md font-['Inter'] font-semibold text-xs sm:text-sm tracking-wide shadow-md shadow-[#00236f]/15 hover:opacity-95 active:scale-95 transition-all cursor-pointer"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* =========================================================
              4. Map & Neighborhood Context Sidebar
              ========================================================= */}
          <aside
            className={`col-span-12 lg:col-span-4 space-y-8 ${
              mobileTab === 'list' ? 'hidden lg:block' : 'block'
            }`}
          >
            <div className="sticky top-40 space-y-8">
              {/* Interactive Map Card */}
              <div className="bg-white rounded-xl overflow-hidden p-1 shadow-sm border border-[#c5c5d3]/20">
                <div className="relative w-full h-[400px] bg-[#f3f4f5] overflow-hidden rounded-lg">
                  {mapDisplayMode === 'stylized' ? (
                    <>
                      {/* Stylized Map View from Attachment */}
                      <img
                        className="w-full h-full object-cover grayscale contrast-125 opacity-75"
                        alt="Stylized map view of Kigali city streets with location pins"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDEVkEfwWjIqEhs5soor1tnHYb4L-OdFM9E2QgZ6bL-Z1BcNXCJqCZ_UjEJUtziwIPMJ5ahpc954ennoMzrEPqfhEiXrJoTc9zbdyLO9wmwhTxm3bSNg2QC88mtnroGiw5U5CxJR90v0Rvvbz0pxl4oPC81QGNq-jNmQdL3B2e11L5FkfWXIe0RAte7Bkubs5khFQzUxs0_Ku2MvE2jIuFNjpPVNjZ3dQ40PQG8v2FS8Q5wTfrS-5WdDJtSZQzoEvEJ41g6T3kwhHzK"
                      />
                      {/* Custom Animated Map Pin */}
                      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                        <div className="bg-[#00236f] p-3 rounded-full shadow-2xl animate-pulse text-white flex items-center justify-center">
                          <span className="material-symbols-outlined text-xl">apartment</span>
                        </div>
                      </div>

                      {/* Map Toggle to Live Leaflet/Google Map */}
                      <button
                        onClick={() => setMapDisplayMode('interactive')}
                        className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-md text-[11px] font-bold text-[#00236f] shadow-xs cursor-pointer hover:bg-white flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-xs">travel_explore</span>
                        <span>Live GPS Map</span>
                      </button>
                    </>
                  ) : (
                    /* Live Interactive Map using KigaliRealMap */
                    <div className="w-full h-full relative">
                      <KigaliRealMap
                        properties={propertyAdapters}
                        selectedProperty={
                          hoveredAptId
                            ? propertyAdapters.find((p) => p.id === hoveredAptId) || null
                            : null
                        }
                        hoveredPropertyId={hoveredAptId}
                        onSelectProperty={(prop) => {
                          const match = apartments.find((a) => a.id === prop.id);
                          if (match) handleOpenDetail(match);
                        }}
                        onHoverProperty={(id) => setHoveredAptId(id)}
                        onBookTour={(prop) => {
                          const match = apartments.find((a) => a.id === prop.id);
                          if (match && onBookTour) onBookTour(toPropertyAdapter(match));
                        }}
                        currency={currency}
                        showLandmarks={showLandmarks}
                        onToggleLandmarks={() => setShowLandmarks(!showLandmarks)}
                        onClosePreview={() => setHoveredAptId(null)}
                      />
                      <button
                        onClick={() => setMapDisplayMode('stylized')}
                        className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-md text-[11px] font-bold text-slate-800 shadow-xs cursor-pointer hover:bg-white z-20 flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-xs">map</span>
                        <span>Stylized View</span>
                      </button>
                    </div>
                  )}

                  {/* Proximity Guide Bottom Card with Concierge Button */}
                  <div className="absolute bottom-3 left-3 right-3 bg-[#f8f9fa]/95 backdrop-blur-md p-3.5 rounded-lg border border-slate-200/50 shadow-md">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-xs font-bold text-[#191c1d] flex items-center gap-1.5 font-['Manrope']">
                        <span className="material-symbols-outlined text-[#00236f] text-sm">distance</span>
                        <span>Proximity Guide</span>
                      </h4>
                      <button
                        onClick={() => onOpenConsultation?.()}
                        className="bg-[#00236f] hover:bg-[#1e3a8a] text-white px-3 py-1 rounded-md text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <span className="material-symbols-outlined text-xs">chat_bubble</span>
                        <span>Concierge</span>
                      </button>
                    </div>
                    <ul className="space-y-1.5">
                      <li className="flex justify-between text-[11px] font-['Inter'] text-[#444651]">
                        <span>Kigali Convention Center</span>
                        <span className="font-bold text-[#00236f]">8 mins</span>
                      </li>
                      <li className="flex justify-between text-[11px] font-['Inter'] text-[#444651]">
                        <span>Nyarugenge City Market</span>
                        <span className="font-bold text-[#00236f]">12 mins</span>
                      </li>
                      <li className="flex justify-between text-[11px] font-['Inter'] text-[#444651]">
                        <span>Kigali Heights</span>
                        <span className="font-bold text-[#00236f]">5 mins</span>
                      </li>
                      <li className="flex justify-between text-[11px] font-['Inter'] text-[#444651]">
                        <span>Kigali Golf Club</span>
                        <span className="font-bold text-[#00236f]">10 mins</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Market Insights Spotlight Card from Attachment */}
              <div className="bg-[#f3f4f5] p-6 sm:p-8 rounded-xl border border-[#c5c5d3]/20 shadow-2xs">
                <h4 className="text-xl font-bold mb-3 tracking-tight font-['Manrope'] text-[#191c1d]">
                  Investment Spotlight
                </h4>
                <p className="text-xs sm:text-sm text-[#444651] leading-relaxed mb-6 font-['Inter']">
                  Kigali's vertical residential market has seen a 14% growth in rental yields this year. Managed by Emma &amp; Dany experts.
                </p>
                <button
                  onClick={() => onOpenConsultation?.()}
                  className="text-[#432200] font-['Inter'] text-sm font-bold flex items-center gap-2 group cursor-pointer"
                >
                  <span>Explore Investment Report</span>
                  <span className="material-symbols-outlined text-lg transition-transform group-hover:translate-x-1">
                    arrow_forward
                  </span>
                </button>
                <div className="h-[2px] w-14 bg-[#f9ba82] mt-2"></div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* -------------------------------------------------------------
          Bottom Navigation Bar (Mobile Only matching attached code)
          ------------------------------------------------------------- */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-xl border-t border-slate-100 z-50 flex justify-around items-center px-4 py-3 pb-safe shadow-2xl">
        <button
          onClick={() => onNavigate?.('home')}
          className="flex flex-col items-center justify-center text-slate-400 font-medium font-['Inter'] text-[10px] tracking-tight transition-transform active:scale-90 cursor-pointer"
        >
          <span className="material-symbols-outlined text-lg">explore</span>
          <span>Explore</span>
        </button>
        <button
          onClick={() => onNavigate?.('apartments')}
          className="flex flex-col items-center justify-center text-[#00236f] font-bold font-['Inter'] text-[10px] tracking-tight transition-transform active:scale-90 scale-105 cursor-pointer"
        >
          <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
            apartment
          </span>
          <span>Apartments</span>
        </button>
        <button
          onClick={() => onNavigate?.('tenant-dashboard')}
          className="flex flex-col items-center justify-center text-slate-400 font-medium font-['Inter'] text-[10px] tracking-tight transition-transform active:scale-90 cursor-pointer"
        >
          <span className="material-symbols-outlined text-lg">favorite</span>
          <span>Saved</span>
        </button>
        <button
          onClick={() => onNavigate?.('tenant-dashboard')}
          className="flex flex-col items-center justify-center text-slate-400 font-medium font-['Inter'] text-[10px] tracking-tight transition-transform active:scale-90 cursor-pointer"
        >
          <span className="material-symbols-outlined text-lg">person</span>
          <span>Profile</span>
        </button>
      </nav>

      {/* -------------------------------------------------------------
          Floating Concierge Contact Action Button from Attachment
          ------------------------------------------------------------- */}
      <button
        onClick={() => onOpenConsultation?.()}
        className="fixed bottom-20 right-6 sm:bottom-8 sm:right-8 z-40 bg-[#00236f] hover:bg-[#1e3a8a] text-white p-4 rounded-full shadow-2xl transition-transform hover:scale-105 active:scale-95 flex items-center gap-3 pr-6 cursor-pointer"
        title="Connect with Luxury Concierge"
      >
        <span className="material-symbols-outlined text-xl">chat_bubble</span>
        <span className="font-['Inter'] font-bold text-sm tracking-wide">Concierge</span>
      </button>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 bg-[#00236f] text-white text-xs px-5 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-in slide-in-from-bottom-2">
          <span className="material-symbols-outlined text-sm text-emerald-400">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
