import React, { useState } from 'react';
import { Property, ActiveScreen } from '../types';
import { KigaliRealMap } from './KigaliRealMap';

interface InvestmentsScreenProps {
  onSelectProperty?: (property: Property) => void;
  onBookTour?: (property: Property) => void;
  onNavigate?: (screen: ActiveScreen) => void;
  onOpenConsultation?: () => void;
  onOpenListProperty?: () => void;
}

export const InvestmentsScreen: React.FC<InvestmentsScreenProps> = ({
  onSelectProperty,
  onBookTour,
  onNavigate,
  onOpenConsultation,
  onOpenListProperty,
}) => {
  const [minRoi, setMinRoi] = useState<number>(6);
  const [landStatus, setLandStatus] = useState<'All' | 'New Construction' | 'Resale'>('All');
  const [selectedFilterTab, setSelectedFilterTab] = useState('price');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [mobileTab, setMobileTab] = useState<'list' | 'map'>('list');
  const [hoveredEstateId, setHoveredEstateId] = useState<string | null>(null);

  const estates = [
    {
      id: 'invest-nyaru-villa',
      title: 'Nyaru Villa Residencies',
      location: 'Rebero Heights, Kigali',
      price: 850000,
      priceDisplay: '$850,000',
      roiYield: '8.4% ROI',
      roiYieldNum: 8.4,
      tag: 'Investment Grade',
      landStatus: 'New Construction',
      beds: 4,
      areaM2: 1200,
      features: ['Solar-Ready', 'Infinity Pool', 'Sustainable Clay-Brick'],
      description:
        'Modern Afro-Minimalism. Featuring 4 ensuite bedrooms, infinity pool, and sustainable clay-brick integration.',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCilCaYhKOZCFXc6eh5EXLHWjm-I1OypFXkrmEHgLlmB3HsntZB7WlHGZIMSs0l6g7p4xgpLxAcTGaaq3p8eErYx1lXro_ep8GfK2O_RCd_R8F1yXre-MDc48ORIKDP5bmDi6y1u7K897FuQ84R9WKV8bMG8RhOaoMCGjayNhnd8jyd-K2XaIaScu7xBpIOc0ijlnyDaR0I4IHzcCfEr47GHBhNZ17m3UkCbiGKm5exe69HMbYTrPzLsoWl74Ay_ftvSG1sMd5t81HE',
      coordinates: { lat: -1.982, lng: 30.082 },
      mapPinLabel: '$850k',
    },
    {
      id: 'invest-the-timber-house',
      title: 'The Timber House',
      location: 'Nyarutarama District',
      price: 1250000,
      priceDisplay: '$1,250,000',
      roiYield: '7.1% ROI',
      roiYieldNum: 7.1,
      tag: 'High Demand',
      landStatus: 'New Construction',
      beds: 5,
      areaM2: 2500,
      features: ['Lap Pool', 'Teak Finishes', 'Smart-Home'],
      description:
        'Nordic-Tropical Hybrid. Floor-to-ceiling glass walls, premium teak finishes, and smart-home ecosystem integration.',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuChUT1KipIoxLG_OjqiTZYjqJHeN2POmhudYewqr2C16moRUbUnVdZmLmzc-8VwzvvbPf5i_bmW13ztGGLuTxGe-CnCOJO_CZIXaFOCh6dZWGKdMnDw_l1vYI9YQDy9JGvtJ6f4acQThE7hSx0xRAoAArxf0mxyJurcPzBGGThLjWgYMIHc8cBJEIudVmKYIDNiX_7pOyEkMVo4wd3OnSJyPPqkDPQhHrcWpM4lQk6JCQ5wVHBJU_lvI3XhToSwH4R_ajWby4uDtj9a',
      coordinates: { lat: -1.936, lng: 30.103 },
      mapPinLabel: '$1.25M',
    },
    {
      id: 'invest-kivubelt-luxury',
      title: 'Kiyovu Panoramic Estate',
      location: 'Old Kiyovu Heritage Zone',
      price: 640000,
      priceDisplay: '$640,000',
      roiYield: '9.2% ROI',
      roiYieldNum: 9.2,
      tag: 'Prime Yield',
      landStatus: 'Resale',
      beds: 3,
      areaM2: 850,
      features: ['Central Location', 'High Occupancy', 'Refurbished'],
      description:
        'Centrally located estate in Old Kiyovu with proven 9.2% annual yield, corporate long-lease tenancy, and mature garden.',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCGGBSEI_gmOrmBmbORG_C2nEM-GUyxCi-132RFPUTpZtPku_la-yK0nuOF1q4xHNRZ7opKZ6qFlATogkeDAXVB1DivZ9rO5F97MTbTfszjYqLyOrCeWuqSDRz1xVYfxWRpMu-q9vADJNCzIr4k4laQlG4sWwsIxODyyu4QPL1PGvu9FtqTMo_0ynyQU9RY816bT2BOPcp_WeBSJ_gVHlju9WifNEQ7PNG7V2BM4UboJfWGs9Q-wSfwzbIpLfOYJT1YfV2cOX8toGPE',
      coordinates: { lat: -1.956, lng: 30.064 },
      mapPinLabel: '$640k',
    },
  ];

  const filteredEstates = estates.filter((item) => {
    if (item.roiYieldNum < minRoi) return false;
    if (landStatus !== 'All' && item.landStatus !== landStatus) return false;
    return true;
  });

  const propertyAdapters: Property[] = filteredEstates.map((item) => ({
    id: item.id,
    title: item.title,
    neighborhood: item.location.split(',')[0],
    location: item.location,
    price: item.price,
    priceDisplay: item.priceDisplay,
    rwfPriceDisplay: `${Math.round(item.price / 18000)}M RWF`,
    propertyType: 'Architectural Estate',
    beds: item.beds,
    baths: 4,
    sqft: item.areaM2 * 10.76,
    areaM2: item.areaM2,
    image: item.image,
    gallery: [item.image],
    architecturalStyle: 'Luxury Investment Estate',
    description: item.description,
    highlights: [...item.features, item.roiYield],
    zoning: 'Prime Residential & Investment',
    estimatedRentalYield: item.roiYield,
    yearBuilt: 2024,
    parkingSpaces: 4,
    lotSize: `${item.areaM2.toLocaleString()} sqm`,
    coordinates: item.coordinates,
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
              className="text-[#00236f] border-b-2 border-[#00236f] pb-1 cursor-pointer flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-base">trending_up</span>
              <span>Investments</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
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
          className={`w-80 shrink-0 bg-[#f3f4f5] border-r border-[#c5c5d3]/20 p-6 flex flex-col justify-between overflow-y-auto ${
            mobileFilterOpen
              ? 'fixed inset-y-0 left-0 z-50 shadow-2xl block bg-white'
              : 'hidden lg:flex sticky top-36 h-[calc(100vh-9rem)]'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-['Manrope'] font-bold text-blue-950 text-lg">Advanced Filters</h2>
                <p className="font-['Inter'] text-xs text-slate-500">Refine your search</p>
              </div>
              {mobileFilterOpen && (
                <button onClick={() => setMobileFilterOpen(false)} className="lg:hidden p-1">
                  <span className="material-symbols-outlined text-lg">close</span>
                </button>
              )}
            </div>

            <div className="space-y-6">
              {/* Filter Tabs */}
              <div className="flex flex-col gap-1">
                {[
                  { id: 'price', label: 'Price Range', icon: 'payments' },
                  { id: 'type', label: 'Property Type', icon: 'home_work' },
                  { id: 'beds', label: 'Bedrooms', icon: 'bed' },
                  { id: 'amenities', label: 'Amenities', icon: 'pool' },
                  { id: 'year', label: 'Year Built', icon: 'calendar_today' },
                ].map((tab) => (
                  <div
                    key={tab.id}
                    onClick={() => setSelectedFilterTab(tab.id)}
                    className={`flex items-center gap-3 p-3 rounded-lg font-bold text-xs cursor-pointer hover:translate-x-1 transition-all ${
                      selectedFilterTab === tab.id
                        ? 'bg-white text-blue-900 border border-blue-900/10 shadow-xs'
                        : 'text-slate-500 hover:bg-slate-200/60'
                    }`}
                  >
                    <span className="material-symbols-outlined text-base">{tab.icon}</span>
                    <span className="font-medium">{tab.label}</span>
                  </div>
                ))}
              </div>

              {/* Land Status */}
              <div className="pt-2 space-y-2">
                <h3 className="font-['Manrope'] font-bold text-xs text-blue-900 uppercase tracking-wider">
                  Land Status
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(['All', 'New Construction', 'Resale'] as const).map((status) => (
                    <button
                      key={status}
                      onClick={() => setLandStatus(status)}
                      className={`px-3 py-1.5 text-[10px] font-bold rounded-full uppercase tracking-wider cursor-pointer transition-all ${
                        landStatus === status
                          ? 'bg-[#00236f] text-white shadow-xs'
                          : 'bg-white border border-[#c5c5d3]/30 text-slate-600 hover:border-[#00236f]'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {/* Min ROI Yield Slider */}
              <div className="pt-2 space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="font-['Manrope'] font-bold text-xs text-blue-900 uppercase tracking-wider">
                    Min. ROI Yield
                  </h3>
                  <span className="text-xs font-extrabold text-[#00236f]">{minRoi}%+</span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="12"
                  step="0.5"
                  value={minRoi}
                  onChange={(e) => setMinRoi(Number(e.target.value))}
                  className="w-full accent-[#00236f] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-bold text-slate-400">
                  <span>4%</span>
                  <span>12%+</span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => setMobileFilterOpen(false)}
            className="w-full bg-[#00236f] text-white py-3.5 rounded-lg font-bold text-xs uppercase tracking-widest active:scale-98 transition-transform cursor-pointer shadow-md mt-6"
          >
            Apply Filters ({filteredEstates.length} Estates)
          </button>
        </aside>

        {/* -------------------------------------------------------------
            Main Marketplace View (List Panel + Map)
            ------------------------------------------------------------- */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* List Panel */}
          <section
            className={`w-full md:w-1/2 lg:w-[550px] overflow-y-auto no-scrollbar bg-[#f8f9fa] p-6 sm:p-8 ${
              mobileTab === 'map' ? 'hidden md:block' : 'block'
            }`}
          >
            <header className="mb-10">
              <span className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px] block mb-1">
                Curated Portfolio
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-950 mt-1 mb-3 leading-tight font-['Manrope']">
                Elite Rwandan <br />Estates
              </h1>
              <p className="text-slate-500 text-xs sm:text-sm max-w-sm leading-relaxed">
                Discover investment-grade properties in Kigali&apos;s most prestigious developments.
              </p>
            </header>

            <div className="space-y-10 pb-12">
              {filteredEstates.map((estate) => (
                <article
                  key={estate.id}
                  onClick={() => {
                    const mapped = propertyAdapters.find((p) => p.id === estate.id);
                    if (mapped && onSelectProperty) onSelectProperty(mapped);
                  }}
                  onMouseEnter={() => setHoveredEstateId(estate.id)}
                  onMouseLeave={() => setHoveredEstateId(null)}
                  className="group relative bg-white rounded-2xl border border-[#c5c5d3]/20 overflow-hidden shadow-xs hover:shadow-lg transition-all p-4 cursor-pointer"
                >
                  <div className="aspect-[16/9] w-full overflow-hidden relative rounded-xl bg-slate-100">
                    <img
                      src={estate.image}
                      alt={estate.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4 flex gap-2">
                      <span className="bg-[#00236f] text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest shadow-md rounded-sm">
                        {estate.tag}
                      </span>
                      <span className="bg-white/90 backdrop-blur-md text-[#432200] text-[10px] font-bold px-3 py-1 shadow-md rounded-sm">
                        {estate.roiYield}
                      </span>
                    </div>
                  </div>

                  <div className="py-5 space-y-3">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold text-blue-950 group-hover:text-[#00236f] transition-colors font-['Manrope']">
                          {estate.title}
                        </h3>
                        <p className="text-xs text-slate-400 font-medium mt-0.5">
                          {estate.location}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xl font-extrabold text-[#00236f] font-['Manrope']">
                          {estate.priceDisplay}
                        </p>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                          Starting Price
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed font-light line-clamp-2">
                      {estate.description}
                    </p>

                    <div className="flex items-center gap-5 pt-3 border-t border-slate-100 text-xs text-slate-500 font-medium">
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-sm">bed</span>
                        <span>{estate.beds} Beds</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-sm">straighten</span>
                        <span>{estate.areaM2.toLocaleString()} m²</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-sm">bolt</span>
                        <span>Solar-Ready</span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* Map Panel (Right Side) */}
          <section
            className={`flex-1 relative bg-slate-200 sticky top-36 h-[calc(100vh-9rem)] border-l border-[#c5c5d3]/20 overflow-hidden ${
              mobileTab === 'list' ? 'hidden md:block' : 'block w-full'
            }`}
          >
            <div className="w-full h-full relative">
              <KigaliRealMap
                properties={propertyAdapters}
                selectedProperty={null}
                hoveredPropertyId={hoveredEstateId}
                onSelectProperty={(prop) => {
                  if (onSelectProperty) onSelectProperty(prop);
                }}
                onHoverProperty={(id) => setHoveredEstateId(id)}
                onBookTour={(prop) => {
                  if (onBookTour) onBookTour(prop);
                }}
                currency="USD"
                showLandmarks={true}
                onToggleLandmarks={() => {}}
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
