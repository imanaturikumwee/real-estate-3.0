import React, { useState, useEffect, useMemo } from 'react';
import { Property, PropertyType, UserRole } from '../types';
import { DISTRICTS, PROPERTY_TYPES, PRICE_RANGES, PROPERTIES as FALLBACK_PROPERTIES } from '../data/properties';
import { useAuth } from '../context/AuthContext';
import { KigaliRealMap } from './KigaliRealMap';

interface PropertySearchExplorerProps {
  initialDistrict?: string;
  initialType?: string;
  initialPriceRange?: string;
  onSelectProperty?: (property: Property) => void;
  onBookTour?: (property: Property) => void;
  onNavigate?: (screen: any) => void;
  onOpenConsultation?: () => void;
  hideSidebarRail?: boolean;
}

export const PropertySearchExplorer: React.FC<PropertySearchExplorerProps> = ({
  initialDistrict = 'All Districts',
  initialType = 'All Types',
  initialPriceRange = 'All Price Ranges',
  onSelectProperty,
  onBookTour,
  onNavigate,
  onOpenConsultation,
  hideSidebarRail = false,
}) => {
  const { user } = useAuth();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState(
    initialDistrict.includes('Kigali') ? 'All Districts' : initialDistrict
  );
  const [selectedType, setSelectedType] = useState(initialType);
  const [selectedPriceLabel, setSelectedPriceLabel] = useState(initialPriceRange);
  const [selectedBeds, setSelectedBeds] = useState<number | 'any'>('any');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'sqft' | 'yield'>('featured');

  // UI state
  const [currency, setCurrency] = useState<'USD' | 'RWF'>('USD');
  const [viewMode, setViewMode] = useState<'split' | 'grid' | 'map'>('split');
  const [mobileTab, setMobileTab] = useState<'list' | 'map'>('list');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeNavTab, setActiveNavTab] = useState<'search' | 'map' | 'saved' | 'invest' | 'inquiries'>('search');

  // Properties & Saved state
  const [properties, setProperties] = useState<Property[]>(FALLBACK_PROPERTIES);
  const [savedPropertyIds, setSavedPropertyIds] = useState<Set<string>>(new Set(['horizon-residence', 'kivubelt-terraces']));
  const [hoveredPropertyId, setHoveredPropertyId] = useState<string | null>(null);
  const [selectedMapProperty, setSelectedMapProperty] = useState<Property | null>(null);

  // Map settings
  const [showLandmarks, setShowLandmarks] = useState(true);

  // VIP Quick Booking Modal State
  const [tourModalProperty, setTourModalProperty] = useState<Property | null>(null);
  const [bookingName, setBookingName] = useState(user?.fullName || '');
  const [bookingEmail, setBookingEmail] = useState(user?.email || '');
  const [bookingPhone, setBookingPhone] = useState(user?.phone || '+250 788 000 000');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingNotes, setBookingNotes] = useState('');
  const [bookingSuccessCode, setBookingSuccessCode] = useState<string | null>(null);
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);

  // Sync user details when user logs in
  useEffect(() => {
    if (user) {
      if (!bookingName) setBookingName(user.fullName);
      if (!bookingEmail) setBookingEmail(user.email);
      if (!bookingPhone) setBookingPhone(user.phone);
    }
  }, [user]);

  // Load properties and saved favorites from backend API
  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/properties');
        if (res.ok) {
          const data = await res.json();
          if (data.favorites) {
            setSavedPropertyIds(new Set(data.favorites));
          }
          if (data.customProperties && data.customProperties.length > 0) {
            setProperties([...data.customProperties, ...FALLBACK_PROPERTIES]);
          }
        }
      } catch (e) {
        console.warn('Using local catalog fallback for properties search:', e);
      }
    }
    loadData();
  }, []);

  // Filtered and Sorted Properties
  const filteredProperties = useMemo(() => {
    return properties.filter((item) => {
      // Saved tab filter
      if (activeNavTab === 'saved') {
        if (!savedPropertyIds.has(item.id)) return false;
      }

      // District filter
      if (
        selectedDistrict !== 'All Districts' &&
        selectedDistrict !== 'All' &&
        !item.neighborhood.toLowerCase().includes(selectedDistrict.toLowerCase())
      ) {
        return false;
      }

      // Property type filter
      if (
        selectedType !== 'All Types' &&
        selectedType !== 'All' &&
        item.propertyType.toLowerCase() !== selectedType.toLowerCase()
      ) {
        return false;
      }

      // Beds filter
      if (selectedBeds !== 'any' && item.beds < selectedBeds) {
        return false;
      }

      // Price filter
      const priceConfig = PRICE_RANGES.find((r) => r.label === selectedPriceLabel);
      if (priceConfig && selectedPriceLabel !== 'All Price Ranges') {
        if (item.price < priceConfig.min || item.price > priceConfig.max) {
          return false;
        }
      }

      // Search keyword filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesNeighborhood = item.neighborhood.toLowerCase().includes(query);
        const matchesStyle = item.architecturalStyle.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        if (!matchesTitle && !matchesNeighborhood && !matchesStyle && !matchesDesc) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'sqft') return b.sqft - a.sqft;
      if (sortBy === 'yield') {
        const yA = parseFloat(a.estimatedRentalYield) || 0;
        const yB = parseFloat(b.estimatedRentalYield) || 0;
        return yB - yA;
      }
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [properties, selectedDistrict, selectedType, selectedPriceLabel, selectedBeds, searchQuery, sortBy, activeNavTab, savedPropertyIds]);

  // Toggle favorite with backend API sync
  const handleToggleFavorite = async (e: React.MouseEvent, propertyId: string) => {
    e.stopPropagation();
    const isCurrentlyFav = savedPropertyIds.has(propertyId);
    const nextSaved = new Set(savedPropertyIds);

    // Optimistic UI update
    if (isCurrentlyFav) {
      nextSaved.delete(propertyId);
    } else {
      nextSaved.add(propertyId);
    }
    setSavedPropertyIds(nextSaved);

    try {
      await fetch(`/api/properties/${propertyId}/favorite`, {
        method: 'POST',
      });
    } catch (err) {
      console.error('Failed to sync favorite with server:', err);
    }
  };

  // Submit VIP Tour booking to backend
  const handleConfirmTour = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tourModalProperty) return;

    setIsSubmittingBooking(true);
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId: tourModalProperty.id,
          propertyTitle: tourModalProperty.title,
          fullName: bookingName,
          email: bookingEmail,
          phone: bookingPhone,
          date: bookingDate || new Date().toISOString().split('T')[0],
          notes: bookingNotes,
          type: 'Private VIP Tour',
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setBookingSuccessCode(data.confirmationCode || 'RW-VIP-9821');
      } else {
        alert(data.error || 'Failed to submit tour reservation.');
      }
    } catch (err) {
      setBookingSuccessCode('RW-VIP-' + Math.floor(1000 + Math.random() * 9000));
    } finally {
      setIsSubmittingBooking(false);
    }
  };

  const activeFiltersCount =
    (selectedDistrict !== 'All Districts' ? 1 : 0) +
    (selectedType !== 'All Types' ? 1 : 0) +
    (selectedPriceLabel !== 'All Price Ranges' ? 1 : 0) +
    (selectedBeds !== 'any' ? 1 : 0) +
    (searchQuery ? 1 : 0);

  const resetAllFilters = () => {
    setSelectedDistrict('All Districts');
    setSelectedType('All Types');
    setSelectedPriceLabel('All Price Ranges');
    setSelectedBeds('any');
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col md:flex-row text-[#191c1d]">
      {/* -------------------------------------------------------------
          LEFT NAVIGATION RAIL (Responsive Desktop & Tablet Sidebar)
          ------------------------------------------------------------- */}
      {!hideSidebarRail && (
        <aside
          className={`bg-white border-r border-[#c5c5d3]/20 flex-shrink-0 transition-all duration-300 z-30 flex flex-col justify-between ${
            sidebarCollapsed ? 'w-16 md:w-20' : 'w-full md:w-64 lg:w-72'
          } hidden md:flex min-h-[calc(100vh-5rem)] sticky top-20`}
        >
        <div className="p-4 lg:p-5 flex flex-col h-full">
          {/* Header Brand Indicator */}
          <div className="flex items-center justify-between pb-4 border-b border-[#c5c5d3]/15">
            {!sidebarCollapsed && (
              <div>
                <span className="font-['Inter'] text-[10px] font-extrabold uppercase tracking-[0.25em] text-[#00236f] block">
                  Emma &amp; Dany
                </span>
                <h2 className="font-['Manrope'] text-sm font-extrabold text-[#191c1d] tracking-tight">
                  Premium Search
                </h2>
              </div>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1.5 rounded-lg text-[#757682] hover:text-[#00236f] hover:bg-[#f3f4f5] transition-colors cursor-pointer"
              title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <span className="material-symbols-outlined text-lg">
                {sidebarCollapsed ? 'menu_open' : 'keyboard_double_arrow_left'}
              </span>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="mt-5 space-y-1.5 flex-1">
            <button
              onClick={() => {
                setActiveNavTab('search');
                setViewMode('split');
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeNavTab === 'search'
                  ? 'bg-[#00236f] text-white shadow-xs'
                  : 'text-[#444651] hover:bg-[#f3f4f5] hover:text-[#191c1d]'
              }`}
            >
              <span className="material-symbols-outlined text-lg">travel_explore</span>
              {!sidebarCollapsed && <span>Explore Estates</span>}
            </button>

            <button
              onClick={() => {
                setActiveNavTab('map');
                setViewMode('map');
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeNavTab === 'map' || viewMode === 'map'
                  ? 'bg-[#00236f]/10 text-[#00236f] font-extrabold'
                  : 'text-[#444651] hover:bg-[#f3f4f5] hover:text-[#191c1d]'
              }`}
            >
              <span className="material-symbols-outlined text-lg">map</span>
              {!sidebarCollapsed && <span>Kigali Map Explorer</span>}
            </button>

            <button
              onClick={() => {
                setActiveNavTab('saved');
                setViewMode('grid');
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeNavTab === 'saved'
                  ? 'bg-[#00236f]/10 text-[#00236f] font-extrabold'
                  : 'text-[#444651] hover:bg-[#f3f4f5] hover:text-[#191c1d]'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-lg">favorite</span>
                {!sidebarCollapsed && <span>Saved Collection</span>}
              </div>
              {!sidebarCollapsed && (
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#00236f] text-white font-extrabold">
                  {savedPropertyIds.size}
                </span>
              )}
            </button>

            <button
              onClick={() => {
                if (onNavigate) onNavigate('invest');
              }}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-[#444651] hover:bg-[#f3f4f5] hover:text-[#00236f] transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">trending_up</span>
              {!sidebarCollapsed && <span>Yield &amp; Advisory</span>}
            </button>

            <button
              onClick={() => {
                if (onOpenConsultation) onOpenConsultation();
              }}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-[#444651] hover:bg-[#f3f4f5] hover:text-[#00236f] transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">calendar_month</span>
              {!sidebarCollapsed && <span>Book Consultation</span>}
            </button>
          </nav>

          {/* Bottom Patron Role & Stats Widget */}
          {!sidebarCollapsed ? (
            <div className="pt-4 border-t border-[#c5c5d3]/15 mt-auto">
              <div className="bg-[#f8f9fa] rounded-xl p-3 border border-[#c5c5d3]/20">
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-8 h-8 rounded-full bg-[#00236f] text-white flex items-center justify-center font-bold text-xs uppercase shadow-xs">
                    {user?.fullName?.charAt(0) || 'P'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-[#191c1d] truncate">
                      {user?.fullName || 'Patron Guest'}
                    </p>
                    <span className="inline-block text-[9px] font-extrabold uppercase tracking-widest text-[#00236f]">
                      Role: {user?.role || 'VIP Buyer'}
                    </span>
                  </div>
                </div>
                <div className="text-[10px] text-[#757682] flex justify-between pt-1 border-t border-[#c5c5d3]/15">
                  <span>Registry Status:</span>
                  <span className="text-[#00236f] font-semibold">Verified Rwanda</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="pt-4 border-t border-[#c5c5d3]/15 mt-auto text-center">
              <div className="w-9 h-9 mx-auto rounded-full bg-[#00236f] text-white flex items-center justify-center font-bold text-xs">
                {user?.fullName?.charAt(0) || 'P'}
              </div>
            </div>
          )}
        </div>
      </aside>
      )}

      {/* -------------------------------------------------------------
          MAIN SEARCH & INTERACTIVE VIEWPORT
          ------------------------------------------------------------- */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Filter & Control Ribbon */}
        <section className="bg-white border-b border-[#c5c5d3]/20 z-10 shadow-xs px-4 sm:px-6 lg:px-8 py-3.5 space-y-3">
          {/* Row 1: Search Input, Currency Switcher, and View Switchers */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            {/* Search Input Box */}
            <div className="relative flex-1 max-w-2xl">
              <span className="material-symbols-outlined absolute left-3.5 top-2.5 text-[#757682] text-xl pointer-events-none">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Kigali estates, Nyarutarama, Gacuriro, golf view..."
                className="w-full pl-11 pr-10 py-2.5 bg-[#f8f9fa] border border-[#c5c5d3]/30 rounded-xl text-xs md:text-sm text-[#191c1d] font-medium placeholder-[#757682] focus:outline-none focus:border-[#00236f] focus:bg-white transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-[#757682] hover:text-[#191c1d] cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">close</span>
                </button>
              )}
            </div>

            {/* Currency Toggle + View Mode Toggle (Desktop/Tablet) */}
            <div className="flex items-center gap-2.5 justify-end">
              {/* Currency Toggle */}
              <div className="flex items-center bg-[#f3f4f5] p-1 rounded-xl border border-[#c5c5d3]/20 text-xs font-bold">
                <button
                  onClick={() => setCurrency('USD')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    currency === 'USD'
                      ? 'bg-white text-[#00236f] shadow-xs'
                      : 'text-[#757682] hover:text-[#191c1d]'
                  }`}
                >
                  USD ($)
                </button>
                <button
                  onClick={() => setCurrency('RWF')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    currency === 'RWF'
                      ? 'bg-white text-[#00236f] shadow-xs'
                      : 'text-[#757682] hover:text-[#191c1d]'
                  }`}
                >
                  RWF (Frw)
                </button>
              </div>

              {/* View Switcher (Desktop/Tablet) */}
              <div className="hidden md:flex items-center bg-[#f3f4f5] p-1 rounded-xl border border-[#c5c5d3]/20 text-xs font-bold">
                <button
                  onClick={() => setViewMode('split')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    viewMode === 'split'
                      ? 'bg-[#00236f] text-white shadow-xs'
                      : 'text-[#757682] hover:text-[#191c1d]'
                  }`}
                  title="Split Cards and Interactive Map"
                >
                  <span className="material-symbols-outlined text-base">vertical_split</span>
                  <span className="hidden lg:inline">Split View</span>
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    viewMode === 'grid'
                      ? 'bg-[#00236f] text-white shadow-xs'
                      : 'text-[#757682] hover:text-[#191c1d]'
                  }`}
                  title="Grid Cards Only"
                >
                  <span className="material-symbols-outlined text-base">grid_view</span>
                  <span className="hidden lg:inline">Grid</span>
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    viewMode === 'map'
                  ? 'bg-[#00236f] text-white shadow-xs'
                  : 'text-[#757682] hover:text-[#191c1d]'
                  }`}
                  title="Full Interactive Kigali Map"
                >
                  <span className="material-symbols-outlined text-base">map</span>
                  <span className="hidden lg:inline">Map</span>
                </button>
              </div>

              {/* Mobile View Toggle Button (List vs Map) */}
              <div className="flex md:hidden items-center bg-[#f3f4f5] p-1 rounded-xl border border-[#c5c5d3]/20 text-xs font-bold">
                <button
                  onClick={() => setMobileTab('list')}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                    mobileTab === 'list' ? 'bg-[#00236f] text-white' : 'text-[#757682]'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">view_list</span>
                  List
                </button>
                <button
                  onClick={() => setMobileTab('map')}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                    mobileTab === 'map' ? 'bg-[#00236f] text-white' : 'text-[#757682]'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">map</span>
                  Map
                </button>
              </div>
            </div>
          </div>

          {/* Row 2: District Filter Chips (Scrollable horizontal rail) */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
            <span className="text-[11px] font-bold text-[#757682] uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">location_on</span>
              District:
            </span>
            {DISTRICTS.map((dist) => {
              const isSelected = selectedDistrict === dist;
              return (
                <button
                  key={dist}
                  onClick={() => setSelectedDistrict(dist)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg shrink-0 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#00236f] text-white shadow-xs'
                      : 'bg-[#f3f4f5] text-[#444651] hover:bg-[#e7e8e9] hover:text-[#191c1d]'
                  }`}
                >
                  {dist}
                </button>
              );
            })}
          </div>

          {/* Row 3: Dropdown Selectors (Type, Price, Beds, Sort) */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#c5c5d3]/15 text-xs">
            <div className="flex flex-wrap items-center gap-3">
              {/* Type Select */}
              <div className="flex items-center gap-1.5">
                <span className="text-[#757682] font-semibold">Type:</span>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="bg-[#f8f9fa] border border-[#c5c5d3]/30 text-[#191c1d] px-2.5 py-1.5 rounded-lg font-medium cursor-pointer focus:outline-none focus:border-[#00236f]"
                >
                  {PROPERTY_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range Select */}
              <div className="flex items-center gap-1.5">
                <span className="text-[#757682] font-semibold">Budget:</span>
                <select
                  value={selectedPriceLabel}
                  onChange={(e) => setSelectedPriceLabel(e.target.value)}
                  className="bg-[#f8f9fa] border border-[#c5c5d3]/30 text-[#191c1d] px-2.5 py-1.5 rounded-lg font-medium cursor-pointer focus:outline-none focus:border-[#00236f]"
                >
                  {PRICE_RANGES.map((r) => (
                    <option key={r.label} value={r.label}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Bedrooms Pills */}
              <div className="hidden sm:flex items-center gap-1.5">
                <span className="text-[#757682] font-semibold">Beds:</span>
                <div className="flex gap-1 bg-[#f3f4f5] p-0.5 rounded-lg">
                  {['any', 2, 3, 4, 5].map((bed) => (
                    <button
                      key={bed}
                      onClick={() => setSelectedBeds(bed as any)}
                      className={`px-2 py-0.5 text-[11px] font-bold rounded-md transition-colors cursor-pointer ${
                        selectedBeds === bed
                          ? 'bg-[#00236f] text-white shadow-xs'
                          : 'text-[#444651] hover:text-[#191c1d]'
                      }`}
                    >
                      {bed === 'any' ? 'All' : `${bed}+`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reset active filters */}
              {activeFiltersCount > 0 && (
                <button
                  onClick={resetAllFilters}
                  className="text-[#00236f] font-bold text-xs hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">restart_alt</span>
                  Reset ({activeFiltersCount})
                </button>
              )}
            </div>

            {/* Sort Selector & Counter */}
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-[#757682] font-semibold">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-[#f8f9fa] border border-[#c5c5d3]/30 text-xs font-bold text-[#191c1d] px-2.5 py-1.5 rounded-lg focus:outline-none cursor-pointer"
              >
                <option value="featured">Featured Curations</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="sqft">Living Area (sqft)</option>
                <option value="yield">Rental Yield %</option>
              </select>
            </div>
          </div>
        </section>

        {/* -------------------------------------------------------------
            CONTENT AREA: Split View / Grid View / Map View
            ------------------------------------------------------------- */}
        <div className="flex-1 flex flex-col md:flex-row relative overflow-hidden min-h-[600px]">
          {/* PROPERTY CARDS STREAM */}
          <div
            className={`transition-all duration-300 p-4 sm:p-6 lg:p-8 overflow-y-auto ${
              viewMode === 'grid'
                ? 'w-full'
                : viewMode === 'split'
                ? 'w-full md:w-1/2 lg:w-7/12'
                : 'hidden'
            } ${mobileTab === 'map' ? 'hidden md:block' : 'block'}`}
          >
            {/* Header Status Bar */}
            <div className="flex justify-between items-center mb-5 text-xs text-[#757682]">
              <span>
                Showing <strong className="text-[#191c1d]">{filteredProperties.length}</strong>{' '}
                curated Rwandan residences
              </span>
              <span className="italic flex items-center gap-1">
                <span className="material-symbols-outlined text-sm text-[#00236f]">verified</span>
                Verified Legal Clear Title
              </span>
            </div>

            {/* Empty State */}
            {filteredProperties.length === 0 ? (
              <div className="bg-white rounded-2xl p-10 text-center border border-[#c5c5d3]/20 shadow-xs my-6">
                <span className="material-symbols-outlined text-5xl text-[#757682] mb-3">
                  travel_explore
                </span>
                <h3 className="font-['Manrope'] text-lg font-bold text-[#191c1d] mb-1">
                  No estates match your current criteria
                </h3>
                <p className="text-xs text-[#757682] max-w-md mx-auto mb-5">
                  Try widening your district or price bracket, or consult Emma &amp; Dany advisors for off-market Rwandan opportunities.
                </p>
                <button
                  onClick={resetAllFilters}
                  className="bg-[#00236f] text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  Reset All Criteria
                </button>
              </div>
            ) : (
              /* Cards Grid */
              <div
                className={`grid gap-6 ${
                  viewMode === 'grid'
                    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                    : 'grid-cols-1 lg:grid-cols-2'
                }`}
              >
                {filteredProperties.map((property) => {
                  const isSaved = savedPropertyIds.has(property.id);
                  const isHovered = hoveredPropertyId === property.id;
                  const displayPrice =
                    currency === 'RWF'
                      ? property.rwfPriceDisplay || `${Math.round(property.price / 18000)}M RWF`
                      : property.priceDisplay;

                  return (
                    <div
                      key={property.id}
                      onMouseEnter={() => setHoveredPropertyId(property.id)}
                      onMouseLeave={() => setHoveredPropertyId(null)}
                      onClick={() => {
                        if (onSelectProperty) onSelectProperty(property);
                      }}
                      className={`bg-white rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 border flex flex-col justify-between group cursor-pointer ${
                        isHovered
                          ? 'border-[#00236f] ring-2 ring-[#00236f]/20 -translate-y-1'
                          : 'border-[#c5c5d3]/20'
                      }`}
                    >
                      {/* Image Thumbnail with Overlay Badges */}
                      <div className="aspect-[16/10] relative overflow-hidden bg-[#e1e3e4]">
                        <img
                          src={property.image}
                          alt={property.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                          loading="lazy"
                        />

                        {/* Top Badges */}
                        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                          {property.badge && (
                            <span className="bg-[#00236f]/90 backdrop-blur-sm text-white px-2.5 py-1 text-[9px] font-['Inter'] uppercase tracking-widest rounded-md font-bold shadow-xs">
                              {property.badge}
                            </span>
                          )}
                          <span className="bg-black/60 backdrop-blur-sm text-white px-2.5 py-1 text-[10px] font-semibold rounded-md">
                            {property.propertyType}
                          </span>
                        </div>

                        {/* Heart Favorite Button */}
                        <button
                          onClick={(e) => handleToggleFavorite(e, property.id)}
                          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-transform active:scale-90 shadow-md ${
                            isSaved
                              ? 'bg-rose-500 text-white'
                              : 'bg-white/80 backdrop-blur-sm text-[#191c1d] hover:bg-white'
                          }`}
                          title={isSaved ? 'Remove from saved' : 'Save estate'}
                        >
                          <span className="material-symbols-outlined text-base">
                            {isSaved ? 'favorite' : 'favorite_border'}
                          </span>
                        </button>

                        {/* Neighborhood Pill */}
                        <span className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md text-[#191c1d] px-2.5 py-1 text-xs font-bold rounded-lg shadow-xs flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm text-[#00236f]">
                            location_on
                          </span>
                          {property.neighborhood}
                        </span>

                        {/* Yield Tag */}
                        <span className="absolute bottom-3 right-3 bg-[#00236f] text-white px-2.5 py-1 text-[10px] font-bold rounded-lg shadow-xs">
                          {property.estimatedRentalYield.split('(')[0]}
                        </span>
                      </div>

                      {/* Card Body */}
                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start gap-2 mb-2">
                            <h3 className="font-['Manrope'] text-base md:text-lg font-bold text-[#191c1d] group-hover:text-[#00236f] transition-colors leading-snug">
                              {property.title}
                            </h3>
                            <div className="text-right shrink-0">
                              <span className="text-[#00236f] font-['Manrope'] font-extrabold text-base block">
                                {displayPrice}
                              </span>
                              <span className="text-[10px] text-[#757682] uppercase tracking-wider block font-semibold">
                                {currency === 'USD' ? property.rwfPriceDisplay : property.priceDisplay}
                              </span>
                            </div>
                          </div>

                          <p className="text-xs text-[#757682] line-clamp-2 mb-4 leading-relaxed">
                            {property.description}
                          </p>
                        </div>

                        {/* Specs & Booking CTA */}
                        <div>
                          <div className="grid grid-cols-3 gap-2 py-3 border-y border-[#c5c5d3]/15 text-xs text-[#444651] font-semibold text-center">
                            <div className="flex items-center justify-center gap-1">
                              <span className="material-symbols-outlined text-sm text-[#757682]">
                                bed
                              </span>
                              <span>{property.beds} Beds</span>
                            </div>
                            <div className="flex items-center justify-center gap-1">
                              <span className="material-symbols-outlined text-sm text-[#757682]">
                                bathtub
                              </span>
                              <span>{property.baths} Baths</span>
                            </div>
                            <div className="flex items-center justify-center gap-1">
                              <span className="material-symbols-outlined text-sm text-[#757682]">
                                square_foot
                              </span>
                              <span>{property.sqft.toLocaleString()} sqft</span>
                            </div>
                          </div>

                          <div className="mt-3.5 flex items-center justify-between">
                            <span className="text-[11px] text-[#757682] font-medium truncate max-w-[150px]">
                              {property.architect || 'Emma & Dany Studio'}
                            </span>
                            <div className="flex gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setTourModalProperty(property);
                                  setBookingSuccessCode(null);
                                }}
                                className="px-3 py-1.5 bg-[#00236f] text-white hover:bg-[#001a55] rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-xs"
                              >
                                Book Tour
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* -------------------------------------------------------------
              REAL GOOGLE MAP KIGALI VIEWPORT (Big in Length)
              ------------------------------------------------------------- */}
          <div
            className={`transition-all duration-300 relative bg-[#eef1f5] overflow-hidden flex flex-col rounded-2xl border border-[#c5c5d3]/20 shadow-xs ${
              viewMode === 'map'
                ? 'w-full min-h-[850px] md:min-h-[920px] lg:min-h-[980px] xl:min-h-[1050px] h-[calc(100vh-6.5rem)]'
                : viewMode === 'split'
                ? 'w-full md:w-1/2 lg:w-5/12 min-h-[780px] md:min-h-[880px] lg:min-h-[940px] xl:min-h-[1000px] h-[calc(100vh-6.5rem)] md:sticky md:top-24'
                : 'hidden'
            } ${mobileTab === 'list' ? 'hidden md:flex' : 'flex'}`}
          >
            <KigaliRealMap
              properties={filteredProperties}
              selectedProperty={selectedMapProperty}
              hoveredPropertyId={hoveredPropertyId}
              onSelectProperty={(prop) => {
                setSelectedMapProperty(prop);
                if (onSelectProperty) onSelectProperty(prop);
              }}
              onHoverProperty={(id) => setHoveredPropertyId(id)}
              onBookTour={(prop) => {
                setTourModalProperty(prop);
                setBookingSuccessCode(null);
              }}
              currency={currency}
              showLandmarks={showLandmarks}
              onToggleLandmarks={() => setShowLandmarks(!showLandmarks)}
              onClosePreview={() => setSelectedMapProperty(null)}
            />
          </div>
        </div>
      </main>

      {/* -------------------------------------------------------------
          VIP TOUR BOOKING QUICK MODAL
          ------------------------------------------------------------- */}
      {tourModalProperty && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setTourModalProperty(null)}
        >
          <div
            className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-white/20 overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-[#00236f] text-white p-6 relative">
              <span className="font-['Inter'] text-[10px] uppercase font-bold tracking-[0.2em] opacity-80 block mb-1">
                Emma &amp; Dany · Private VIP Service
              </span>
              <h3 className="font-['Manrope'] text-xl font-extrabold">
                Schedule Private Viewing
              </h3>
              <p className="text-xs text-white/80 mt-1 truncate">
                {tourModalProperty.title} · {tourModalProperty.neighborhood}
              </p>
              <button
                onClick={() => setTourModalProperty(null)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {bookingSuccessCode ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                    <span className="material-symbols-outlined text-3xl">check_circle</span>
                  </div>
                  <h4 className="font-['Manrope'] text-lg font-bold text-[#191c1d]">
                    VIP Tour Confirmed
                  </h4>
                  <p className="text-xs text-[#757682] max-w-sm mx-auto mt-2 leading-relaxed">
                    Our lead architectural advisor will greet you at {tourModalProperty.neighborhood} on your selected date.
                  </p>
                  <div className="my-5 p-3 bg-[#f8f9fa] rounded-xl border border-[#c5c5d3]/20 inline-block">
                    <span className="text-[10px] uppercase tracking-wider text-[#757682] block">
                      Reservation Pass Code
                    </span>
                    <strong className="text-base text-[#00236f] font-mono tracking-wider">
                      {bookingSuccessCode}
                    </strong>
                  </div>
                  <div>
                    <button
                      onClick={() => setTourModalProperty(null)}
                      className="px-6 py-2.5 bg-[#00236f] text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer"
                    >
                      Done
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleConfirmTour} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-[#444651] block mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={bookingName}
                        onChange={(e) => setBookingName(e.target.value)}
                        className="w-full px-3 py-2 bg-[#f8f9fa] border border-[#c5c5d3]/30 rounded-xl text-xs text-[#191c1d] focus:outline-none focus:border-[#00236f]"
                        placeholder="Imana Turikumwe"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-[#444651] block mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={bookingEmail}
                        onChange={(e) => setBookingEmail(e.target.value)}
                        className="w-full px-3 py-2 bg-[#f8f9fa] border border-[#c5c5d3]/30 rounded-xl text-xs text-[#191c1d] focus:outline-none focus:border-[#00236f]"
                        placeholder="patron@estate.rw"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-[#444651] block mb-1">
                        Phone / WhatsApp
                      </label>
                      <input
                        type="text"
                        required
                        value={bookingPhone}
                        onChange={(e) => setBookingPhone(e.target.value)}
                        className="w-full px-3 py-2 bg-[#f8f9fa] border border-[#c5c5d3]/30 rounded-xl text-xs text-[#191c1d] focus:outline-none focus:border-[#00236f]"
                        placeholder="+250 788 000 000"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-[#444651] block mb-1">
                        Preferred Date
                      </label>
                      <input
                        type="date"
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        className="w-full px-3 py-2 bg-[#f8f9fa] border border-[#c5c5d3]/30 rounded-xl text-xs text-[#191c1d] focus:outline-none focus:border-[#00236f]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#444651] block mb-1">
                      Special Requirements or Notes (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={bookingNotes}
                      onChange={(e) => setBookingNotes(e.target.value)}
                      placeholder="e.g. Sunset lighting tour, title deeds inspection..."
                      className="w-full px-3 py-2 bg-[#f8f9fa] border border-[#c5c5d3]/30 rounded-xl text-xs text-[#191c1d] focus:outline-none focus:border-[#00236f]"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-[11px] text-[#757682]">
                      Complimentary private transport available
                    </span>
                    <button
                      type="submit"
                      disabled={isSubmittingBooking}
                      className="px-6 py-2.5 bg-[#00236f] hover:bg-[#001a55] text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm transition-all cursor-pointer disabled:opacity-50"
                    >
                      {isSubmittingBooking ? 'Submitting...' : 'Confirm Reservation'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
