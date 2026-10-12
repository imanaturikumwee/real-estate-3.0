import React, { useState } from 'react';
import { ActiveScreen, Property } from '../types';
import { KigaliRealMap } from './KigaliRealMap';

interface LandScreenProps {
  onNavigate?: (screen: ActiveScreen) => void;
  onOpenConsultation?: () => void;
}

export const LandScreen: React.FC<LandScreenProps> = ({
  onNavigate,
  onOpenConsultation,
}) => {
  const [minSize, setMinSize] = useState('');
  const [maxSize, setMaxSize] = useState('');
  const [zoning, setZoning] = useState('All Zoning');
  const [topography, setTopography] = useState('Any Terrain');
  const [selectedPlot, setSelectedPlot] = useState<any | null>(null);
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [inquiryFullName, setInquiryFullName] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('+250 788 ');
  const [inquirySuccessRef, setInquirySuccessRef] = useState<string | null>(null);

  const plots = [
    {
      id: 'plot-rebero-plateau',
      title: 'Rebero Panoramic Plateau',
      location: 'Rebero Summit, Kigali',
      price: 240000,
      priceDisplay: '$240,000',
      sizeSqm: 2500,
      zoning: 'Residential (R1)',
      topography: 'Plateau',
      investmentScore: 9.4,
      description:
        'Prime residential plot with 180-degree views of the valley. Fully serviced with water and electricity connections.',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuC4G7ws4vjXvK15UU3vlPq7cIlQ2J_J7ZdQAIANOk2mk-toIGPKKeZCB8g_7OG-NK0l7-eLEJt0EOIOB4SyeLhp7wxrjnYsPN4_FB5uAOi-qGf3FWqXwPAjE-PLrVPDajC0iKtwDkxtYwA8V1rKvJrtXxJjsNFIEQ6H-GZ7Y7tG33V7XtV8EKlWIuCPhXm9DwUvksQNUi4W_ypDeWt8OwG6Q3ES6VibXdm8BhFa8cglBUs7cBHOpLoPMF5wMXbwN9iES4zXIRbvYJti',
      coordinates: { lat: -1.988, lng: 30.082 },
      gradientAnalysis: '5% gradient on North-East quadrant, ideal for multi-level construction.',
      plotCode: 'PLOT 104',
    },
    {
      id: 'plot-kicukiro-commercial',
      title: 'Kicukiro Commercial Hub',
      location: 'Kicukiro Business Corridor, Kigali',
      price: 450000,
      priceDisplay: '$450,000',
      sizeSqm: 5000,
      zoning: 'Commercial (C1)',
      topography: 'Flat Plain',
      investmentScore: 8.8,
      description:
        'High-visibility corner plot ideal for mixed-use development or corporate headquarters with dual tarmac access.',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAoDmE4y1EDZXtslRW3AXWMu9WvaXMCyNCsxduYh739ZaFKPDmyriQvL4eMNByVb_KWowtVxQkJk8OX7ZAXpd-Tl9TANdRZNrzqkdYeHN9A_LhE6ZWZkUasmI8dmSEtLm8P1gHaHnWDstLw1Oj-3nKZ0lzmLYYRLDNZB8934LFmXvt0USgtDD4kv1wWPkpQXxM_vh0sMr510u_K5vwdbjPrcYvc9G4Y9NVbBkh7couW1K8Jc-Os3T3isvdIY-qNLyTKA4D-XQ96rAqh',
      coordinates: { lat: -1.968, lng: 30.112 },
      gradientAnalysis: 'Flat plain topography, ready for zero-excavation deep foundation.',
      plotCode: 'COMMERCIAL A',
    },
    {
      id: 'plot-nyarutarama-lakeview',
      title: 'Nyarutarama Lakeview Plot',
      location: 'Nyarutarama Ridge, Kigali',
      price: 380000,
      priceDisplay: '$380,000',
      sizeSqm: 3200,
      zoning: 'Residential (R1)',
      topography: 'Gentle Slope',
      investmentScore: 9.6,
      description:
        'Overlooking the Kigali Golf Course and natural water reservoir. Approved architectural blueprints included.',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDgk7t-O9neSfbz26AXs7VcRIgbb8g1We96jNHYU8WfCWFvoz0SEqIsCPKjcSeI-Pau3xO7mxViJhnic8SJwyKApmQXqn5Wat781J7dPEpKOYcKGji0sok8yYPyfQKhYtEheBaUf7rvdQZaddiylzEdvGyq_sYV39ggtFtCxxF2EVEQtI5dNoPsxPl1K9chO4Q6kY3TetNzj5dB548Qz6yOZP-9ERoTaTJKVqJovLtgnzsoTyZ0E4goYUnB3Vy1a61d9atrW6eKpECa',
      coordinates: { lat: -1.936, lng: 30.098 },
      gradientAnalysis: '8% gentle slope optimizing natural gravity drainage and stepped cantilever architecture.',
      plotCode: 'GOLF 08',
    },
  ];

  const filteredPlots = plots.filter((p) => {
    if (minSize && p.sizeSqm < Number(minSize)) return false;
    if (maxSize && p.sizeSqm > Number(maxSize)) return false;
    if (zoning !== 'All Zoning' && !p.zoning.includes(zoning.split(' ')[0])) return false;
    if (topography !== 'Any Terrain' && p.topography !== topography) return false;
    return true;
  });

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/land/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plotId: selectedPlot?.id || 'general-land',
          plotTitle: selectedPlot?.title || 'General Land Exploration',
          fullName: inquiryFullName,
          email: inquiryEmail,
          phone: inquiryPhone,
        }),
      });
      const data = await res.json();
      setInquirySuccessRef(data.inquiryRef || 'LAND-VIP-2026');
    } catch {
      setInquirySuccessRef('LAND-VIP-' + Math.floor(1000 + Math.random() * 9000));
    }
  };

  const propertyAdapters: Property[] = filteredPlots.map((plot) => ({
    id: plot.id,
    title: plot.title,
    neighborhood: plot.location.split(',')[0],
    location: plot.location,
    price: plot.price,
    priceDisplay: plot.priceDisplay,
    rwfPriceDisplay: `${Math.round(plot.price / 18000)}M RWF`,
    propertyType: 'Architectural Estate',
    beds: 0,
    baths: 0,
    sqft: plot.sizeSqm * 10.76,
    areaM2: plot.sizeSqm,
    image: plot.image,
    gallery: [plot.image],
    architecturalStyle: `${plot.zoning} · ${plot.topography}`,
    description: plot.description,
    highlights: [plot.zoning, plot.topography, `Score ${plot.investmentScore}`],
    zoning: plot.zoning,
    estimatedRentalYield: '14.2% land appreciation p.a.',
    yearBuilt: 2026,
    parkingSpaces: 0,
    lotSize: `${plot.sizeSqm.toLocaleString()} sqm`,
    coordinates: plot.coordinates,
  }));

  return (
    <div className="bg-[#f8f9fa] font-['Inter'] text-[#191c1d] min-h-screen">
      {/* Sub-Header Navigation Tabs */}
      <div className="bg-white border-b border-[#c5c5d3]/20 px-4 sm:px-8 py-3 sticky top-20 z-30">
        <div className="max-w-screen-2xl mx-auto flex items-center justify-between">
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
              className="text-[#00236f] border-b-2 border-[#00236f] pb-1 cursor-pointer flex items-center gap-1.5"
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

          <button
            onClick={() => {
              setSelectedPlot(null);
              setInquiryModalOpen(true);
            }}
            className="flex items-center gap-1.5 bg-[#00236f] text-white px-4 py-2 rounded-md font-bold text-xs uppercase tracking-wider hover:bg-[#001c55] shadow-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">add_location_alt</span>
            <span className="hidden sm:inline">Land Inquiry</span>
          </button>
        </div>
      </div>

      <main className="pt-6 pb-20 md:pb-12 px-4 sm:px-8 max-w-screen-2xl mx-auto">
        {/* Hero Section */}
        <header className="mb-10">
          <h1 className="font-['Manrope'] text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tighter text-[#191c1d] mb-4">
            Strategic <span className="text-[#432200]">Plots.</span>
          </h1>
          <p className="font-['Inter'] text-[#444651] max-w-2xl text-base sm:text-lg leading-relaxed">
            Discover high-yield development opportunities and residential foundations across Rwanda&apos;s
            most promising topographies.
          </p>
        </header>

        {/* Dynamic Filter Bar */}
        <section className="mb-12 p-6 bg-[#f3f4f5] rounded-2xl shadow-xs border border-[#c5c5d3]/20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
          <div className="space-y-2">
            <label className="font-['Inter'] text-xs font-bold tracking-widest text-[#444651] uppercase">
              Size Range (sqm)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={minSize}
                onChange={(e) => setMinSize(e.target.value)}
                placeholder="Min"
                className="w-full bg-white border border-[#c5c5d3]/30 rounded-lg p-2.5 text-xs text-[#191c1d] focus:outline-none focus:border-[#00236f]"
              />
              <span className="text-[#757682]">-</span>
              <input
                type="number"
                value={maxSize}
                onChange={(e) => setMaxSize(e.target.value)}
                placeholder="Max"
                className="w-full bg-white border border-[#c5c5d3]/30 rounded-lg p-2.5 text-xs text-[#191c1d] focus:outline-none focus:border-[#00236f]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="font-['Inter'] text-xs font-bold tracking-widest text-[#444651] uppercase">
              Zoning Category
            </label>
            <select
              value={zoning}
              onChange={(e) => setZoning(e.target.value)}
              className="w-full bg-white border border-[#c5c5d3]/30 rounded-lg p-2.5 text-xs text-[#191c1d] focus:outline-none focus:border-[#00236f] cursor-pointer"
            >
              <option>All Zoning</option>
              <option>Residential (R1)</option>
              <option>Commercial (C1)</option>
              <option>Industrial (I1)</option>
              <option>Agricultural</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="font-['Inter'] text-xs font-bold tracking-widest text-[#444651] uppercase">
              Topography
            </label>
            <select
              value={topography}
              onChange={(e) => setTopography(e.target.value)}
              className="w-full bg-white border border-[#c5c5d3]/30 rounded-lg p-2.5 text-xs text-[#191c1d] focus:outline-none focus:border-[#00236f] cursor-pointer"
            >
              <option>Any Terrain</option>
              <option>Flat Plain</option>
              <option>Gentle Slope</option>
              <option>Steep Gradient</option>
              <option>Plateau</option>
            </select>
          </div>

          <button
            onClick={() => {}}
            className="w-full h-[42px] bg-gradient-to-br from-[#00236f] to-[#1e3a8a] text-white font-bold text-xs uppercase tracking-wider rounded-lg hover:opacity-90 transition-opacity cursor-pointer shadow-sm"
          >
            Apply Filters ({filteredPlots.length} Plots)
          </button>
        </section>

        {/* Bento Layout: Interactive Topographic Map + Listings */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 items-start">
          {/* Interactive Topographic Map (8 cols) */}
          <div className="lg:col-span-8 rounded-2xl overflow-hidden bg-slate-200 border border-[#c5c5d3]/20 shadow-xs min-h-[550px] lg:min-h-[640px] relative">
            <KigaliRealMap
              properties={propertyAdapters}
              selectedProperty={null}
              hoveredPropertyId={selectedPlot?.id || null}
              onSelectProperty={(prop) => {
                const found = plots.find((p) => p.id === prop.id);
                if (found) setSelectedPlot(found);
              }}
              onHoverProperty={() => {}}
              onBookTour={() => {
                setInquiryModalOpen(true);
              }}
              currency="USD"
              showLandmarks={true}
              onToggleLandmarks={() => {}}
            />

            {/* Floating Topographic Terrain Analysis Card */}
            <div className="absolute bottom-6 left-6 z-10 bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-xl max-w-sm border border-white/60 pointer-events-auto">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="material-symbols-outlined text-[#432200] text-sm">landscape</span>
                <span className="font-['Inter'] text-[10px] font-bold tracking-widest uppercase text-[#444651]">
                  Terrain Analysis
                </span>
              </div>
              <p className="text-xs text-[#191c1d] leading-relaxed">
                {selectedPlot
                  ? selectedPlot.gradientAnalysis
                  : 'Topography shows 5% gradient on North-East quadrant, ideal for multi-level panoramic construction.'}
              </p>
            </div>
          </div>

          {/* Vertical Listing Column (4 cols) */}
          <div className="lg:col-span-4 space-y-6 max-h-[640px] overflow-y-auto no-scrollbar pr-1">
            {filteredPlots.map((plot) => (
              <article
                key={plot.id}
                onClick={() => setSelectedPlot(plot)}
                className={`bg-white rounded-2xl p-5 shadow-xs border transition-all cursor-pointer group ${
                  selectedPlot?.id === plot.id
                    ? 'border-[#00236f] ring-2 ring-[#00236f]/20 shadow-md'
                    : 'border-[#c5c5d3]/20 hover:border-slate-400'
                }`}
              >
                <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-4 bg-slate-100">
                  <img
                    src={plot.image}
                    alt={plot.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-[#00236f]/90 backdrop-blur text-white px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">
                    Investment Score: {plot.investmentScore}
                  </div>
                  <div className="absolute bottom-3 left-3 bg-black/60 text-white px-2 py-0.5 rounded text-[10px] font-mono font-bold">
                    {plot.plotCode}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-['Manrope'] text-lg font-bold text-[#191c1d] group-hover:text-[#00236f] transition-colors leading-snug">
                      {plot.title}
                    </h3>
                    <span className="text-[#00236f] font-bold text-lg shrink-0">
                      {plot.priceDisplay}
                    </span>
                  </div>

                  <div className="flex gap-4 text-xs text-[#444651] font-medium">
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">square_foot</span>
                      <span>{plot.sizeSqm.toLocaleString()} sqm</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">architecture</span>
                      <span>{plot.zoning}</span>
                    </div>
                  </div>

                  <p className="text-xs text-[#444651] line-clamp-2 leading-relaxed">
                    {plot.description}
                  </p>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPlot(plot);
                      setInquiryModalOpen(true);
                    }}
                    className="w-full py-2.5 bg-[#f3f4f5] text-[#00236f] font-bold text-xs rounded-lg uppercase tracking-wider hover:bg-[#00236f] hover:text-white transition-all cursor-pointer"
                  >
                    View Details &amp; Request Title
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Investment Insight Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-12 items-center py-12 lg:py-16 bg-[#f3f4f5] px-6 sm:px-12 mb-16 rounded-3xl border border-[#c5c5d3]/20">
          <div className="relative">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBhCvVAsvejoIbMWgNyMBWU9QkTYLjywkMjbIWnOTBUxHUcL_hehNVlTgGTFsmCeqprS-V7O7T22FR_ZwROB4owBmCa84MyyltwXkEbSJs-jCligIfYmXWkrhzt8IXabNRmLTNvX4wWgAWHqVIMDF6ply8O6g1UXPPumQIb3KZBMUGUxIA-bPUwKd25VAsmzwa11R2-ZfSNqSK-HVstYizn3zoQEUaszNz6gYcmJmsbli41YcNoB6QzdxhFPge6lNok0iSJUV-WdJRN"
              alt="Natural lush forest in Rwanda"
              className="rounded-2xl shadow-xl w-full object-cover max-h-[420px]"
            />
            <div className="absolute -bottom-6 -right-4 sm:right-6 bg-[#00236f] text-white p-5 rounded-2xl shadow-xl z-10 max-w-[200px]">
              <span className="block text-[#b6c4ff] text-[10px] font-bold uppercase tracking-widest mb-1">
                Growth Forecast
              </span>
              <span className="text-3xl font-extrabold">+12.4%</span>
              <span className="block text-white/70 text-xs mt-1">Avg Annual Apprec.</span>
            </div>
          </div>

          <div className="space-y-6">
            <span className="font-['Inter'] text-xs font-bold tracking-[0.2em] text-[#432200] uppercase">
              Strategic Advisory
            </span>
            <h2 className="font-['Manrope'] text-3xl sm:text-4xl font-extrabold text-[#191c1d] leading-tight">
              Why Land in Kigali?
            </h2>
            <p className="font-['Inter'] text-[#444651] text-sm sm:text-base leading-relaxed">
              Our proprietary <span className="text-[#00236f] font-bold">Investment Score</span> aggregates
              zoning potential, infrastructural proximity, and historical price movement. We don&apos;t just
              sell dirt; we curate the foundations of Rwanda&apos;s future skyline.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-white rounded-xl border border-[#c5c5d3]/20 shadow-xs">
                <span className="material-symbols-outlined text-[#432200] mb-2 text-2xl">verified</span>
                <h4 className="font-bold text-sm text-[#191c1d]">Verified Titles</h4>
                <p className="text-xs text-[#444651] mt-1">100% due diligence on every listing.</p>
              </div>
              <div className="p-4 bg-white rounded-xl border border-[#c5c5d3]/20 shadow-xs">
                <span className="material-symbols-outlined text-[#432200] mb-2 text-2xl">account_balance</span>
                <h4 className="font-bold text-sm text-[#191c1d]">Tax Efficiency</h4>
                <p className="text-xs text-[#444651] mt-1">Guidance on land-lease structures.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Floating Action Button (FAB) for Land Inquiry */}
      <button
        onClick={() => {
          setSelectedPlot(null);
          setInquiryModalOpen(true);
        }}
        className="fixed bottom-6 right-6 md:bottom-10 md:right-10 bg-[#00236f] text-white w-14 h-14 md:w-16 md:h-16 rounded-full shadow-2xl flex items-center justify-center z-40 active:scale-95 transition-transform hover:scale-105 cursor-pointer"
        title="Request Land Dossier"
      >
        <span className="material-symbols-outlined text-2xl">add_location_alt</span>
      </button>

      {/* Land Inquiry Modal */}
      {inquiryModalOpen && (
        <div
          onClick={() => {
            setInquiryModalOpen(false);
            setInquirySuccessRef(null);
          }}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#00236f] tracking-wider">
                  Land Registry &amp; Dossier
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                  {selectedPlot ? selectedPlot.title : 'Strategic Land Inquiry'}
                </h3>
              </div>
              <button
                onClick={() => {
                  setInquiryModalOpen(false);
                  setInquirySuccessRef(null);
                }}
                className="p-1 rounded-full text-slate-400 hover:text-slate-800"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            {inquirySuccessRef ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <span className="material-symbols-outlined text-2xl">check</span>
                </div>
                <h4 className="font-bold text-base text-slate-900">Dossier Request Received</h4>
                <p className="text-xs text-slate-600">
                  Reference: <span className="font-mono font-bold text-[#00236f]">{inquirySuccessRef}</span>
                </p>
                <p className="text-xs text-slate-500">
                  Our chief surveying architect will contact you within 2 business hours with verified title deeds.
                </p>
                <button
                  onClick={() => {
                    setInquiryModalOpen(false);
                    setInquirySuccessRef(null);
                  }}
                  className="w-full py-2.5 bg-[#00236f] text-white rounded-xl text-xs font-bold uppercase tracking-wider"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit} className="space-y-4 text-xs">
                {selectedPlot && (
                  <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-800">{selectedPlot.plotCode}</p>
                      <p className="text-slate-500">{selectedPlot.sizeSqm.toLocaleString()} sqm · {selectedPlot.zoning}</p>
                    </div>
                    <span className="font-bold text-[#00236f]">{selectedPlot.priceDisplay}</span>
                  </div>
                )}

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={inquiryFullName}
                    onChange={(e) => setInquiryFullName(e.target.value)}
                    placeholder="e.g. John Mugabo"
                    className="w-full p-2.5 bg-slate-100 border-none rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-[#00236f]/30 outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={inquiryEmail}
                    onChange={(e) => setInquiryEmail(e.target.value)}
                    placeholder="e.g. john@investment.rw"
                    className="w-full p-2.5 bg-slate-100 border-none rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-[#00236f]/30 outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={inquiryPhone}
                    onChange={(e) => setInquiryPhone(e.target.value)}
                    className="w-full p-2.5 bg-slate-100 border-none rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-[#00236f]/30 outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#00236f] text-white rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-[#001c55] transition-colors cursor-pointer shadow-md mt-2"
                >
                  Request Title &amp; Topographic Report
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
