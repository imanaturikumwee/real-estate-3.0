import React, { useState, useMemo } from 'react';
import { Property, PropertyType } from '../types';
import { DISTRICTS, PROPERTY_TYPES, PRICE_RANGES } from '../data/properties';

interface PropertiesScreenProps {
  properties: Property[];
  onSelectProperty: (property: Property) => void;
  onBookTour: (property: Property) => void;
  initialFilters?: { location?: string; priceRange?: string; propertyType?: string };
}

export const PropertiesScreen: React.FC<PropertiesScreenProps> = ({
  properties,
  onSelectProperty,
  onBookTour,
  initialFilters,
}) => {
  const [selectedDistrict, setSelectedDistrict] = useState<string>(
    initialFilters?.location?.includes('Kigali') ? 'All Districts' : initialFilters?.location || 'All Districts'
  );
  const [selectedType, setSelectedType] = useState<string>(
    initialFilters?.propertyType || 'All Types'
  );
  const [selectedPriceLabel, setSelectedPriceLabel] = useState<string>(
    initialFilters?.priceRange || 'All Price Ranges'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'sqft'>('featured');

  const filteredProperties = useMemo(() => {
    return properties.filter((item) => {
      // District filter
      if (
        selectedDistrict !== 'All Districts' &&
        !item.neighborhood.toLowerCase().includes(selectedDistrict.toLowerCase())
      ) {
        return false;
      }

      // Property type filter
      if (
        selectedType !== 'All Types' &&
        item.propertyType.toLowerCase() !== selectedType.toLowerCase()
      ) {
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
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [properties, selectedDistrict, selectedType, selectedPriceLabel, searchQuery, sortBy]);

  return (
    <div className="py-12 md:py-16 bg-[#f8f9fa] min-h-screen">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        {/* Page Header */}
        <div className="mb-10">
          <span className="font-['Inter'] text-xs font-bold tracking-[0.25em] uppercase text-[#00236f] mb-2 block">
            Curated Portfolio · Rwanda
          </span>
          <h1 className="font-['Manrope'] text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#191c1d] tracking-tight mb-3">
            Architectural Masterpieces
          </h1>
          <p className="text-[#444651] max-w-2xl text-sm md:text-base leading-relaxed">
            Browse verified luxury villas, hillside estates, and prime duplexes across Kigali. Each residence is rigorously inspected for architectural integrity and legal title clear status.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-[#c5c5d3]/20 mb-8 space-y-4">
          {/* Top row: search + sort */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div className="relative w-full sm:w-80">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#757682] text-xl">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by neighborhood, feature, architect..."
                className="w-full pl-10 pr-4 py-2 bg-[#f8f9fa] border border-[#c5c5d3]/30 rounded-lg text-sm text-[#191c1d] focus:outline-none focus:border-[#00236f]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-[#757682] hover:text-[#191c1d]"
                >
                  <span className="material-symbols-outlined text-base">close</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <span className="text-xs font-semibold text-[#757682] uppercase tracking-wider">
                Sort by:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-[#f8f9fa] border border-[#c5c5d3]/30 text-xs font-bold text-[#191c1d] px-3 py-2 rounded-lg focus:outline-none cursor-pointer"
              >
                <option value="featured">Featured Curations</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="sqft">Living Area (sqft)</option>
              </select>
            </div>
          </div>

          {/* District Filter Pills / Segmented Controls */}
          <div className="pt-2 border-t border-[#c5c5d3]/20 flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-[#757682] uppercase tracking-wider mr-2">
              District:
            </span>
            {DISTRICTS.map((dist) => (
              <button
                key={dist}
                onClick={() => setSelectedDistrict(dist)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  selectedDistrict === dist
                    ? 'bg-[#00236f] text-white shadow-xs'
                    : 'bg-[#f3f4f5] text-[#444651] hover:bg-[#e7e8e9]'
                }`}
              >
                {dist}
              </button>
            ))}
          </div>

          {/* Secondary filter selectors */}
          <div className="flex flex-wrap items-center gap-4 text-xs pt-2">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#757682] uppercase tracking-wider">Type:</span>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="bg-[#f8f9fa] border border-[#c5c5d3]/30 text-[#191c1d] px-2.5 py-1.5 rounded-md font-medium"
              >
                {PROPERTY_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-bold text-[#757682] uppercase tracking-wider">Price:</span>
              <select
                value={selectedPriceLabel}
                onChange={(e) => setSelectedPriceLabel(e.target.value)}
                className="bg-[#f8f9fa] border border-[#c5c5d3]/30 text-[#191c1d] px-2.5 py-1.5 rounded-md font-medium"
              >
                {PRICE_RANGES.map((r) => (
                  <option key={r.label} value={r.label}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>

            {(selectedDistrict !== 'All Districts' ||
              selectedType !== 'All Types' ||
              selectedPriceLabel !== 'All Price Ranges' ||
              searchQuery) && (
              <button
                onClick={() => {
                  setSelectedDistrict('All Districts');
                  setSelectedType('All Types');
                  setSelectedPriceLabel('All Price Ranges');
                  setSearchQuery('');
                }}
                className="text-[#00236f] font-bold hover:underline ml-auto cursor-pointer"
              >
                Reset All Filters
              </button>
            )}
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex justify-between items-center mb-6 text-xs text-[#757682]">
          <span>
            Showing <strong className="text-[#191c1d]">{filteredProperties.length}</strong>{' '}
            architectural residences
          </span>
          <span className="italic">All properties vetted by Emma &amp; Dany</span>
        </div>

        {/* Property Grid */}
        {filteredProperties.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-[#c5c5d3]/20 shadow-xs">
            <span className="material-symbols-outlined text-4xl text-[#757682] mb-3">
              domain_disabled
            </span>
            <h3 className="font-['Manrope'] text-lg font-bold text-[#191c1d] mb-1">
              No matching estates found
            </h3>
            <p className="text-xs text-[#757682] max-w-md mx-auto mb-6">
              Try adjusting your district or price range filter, or reach out to our private curation team for off-market Rwandan listings.
            </p>
            <button
              onClick={() => {
                setSelectedDistrict('All Districts');
                setSelectedType('All Types');
                setSelectedPriceLabel('All Price Ranges');
                setSearchQuery('');
              }}
              className="bg-[#00236f] text-white px-5 py-2.5 rounded-md text-xs font-bold uppercase tracking-wider cursor-pointer"
            >
              Clear Filter Criteria
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map((property) => (
              <div
                key={property.id}
                onClick={() => onSelectProperty(property)}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-[#c5c5d3]/15 group cursor-pointer flex flex-col justify-between"
              >
                {/* Image */}
                <div className="aspect-[16/9] relative overflow-hidden bg-[#e1e3e4]">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  {property.badge && (
                    <span className="absolute top-3 left-3 bg-[#00236f]/90 text-white px-2.5 py-1 text-[9px] font-['Inter'] uppercase tracking-widest rounded-sm font-bold shadow-sm">
                      {property.badge}
                    </span>
                  )}
                  <span className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white px-2.5 py-1 text-xs font-bold rounded">
                    {property.neighborhood}
                  </span>
                </div>

                {/* Details */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <h3 className="font-['Manrope'] text-lg font-bold text-[#191c1d] group-hover:text-[#00236f] transition-colors leading-snug">
                        {property.title}
                      </h3>
                      <span className="text-[#00236f] font-['Manrope'] font-extrabold text-base whitespace-nowrap">
                        {property.priceDisplay}
                      </span>
                    </div>

                    <p className="text-xs text-[#757682] mb-4 line-clamp-2">
                      {property.description}
                    </p>
                  </div>

                  {/* Specs & Actions */}
                  <div>
                    <div className="flex items-center justify-between border-t border-[#c5c5d3]/20 pt-3 text-xs text-[#444651] font-medium">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm text-[#757682]">bed</span>
                        {property.beds} Beds
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm text-[#757682]">bathtub</span>
                        {property.baths} Baths
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm text-[#757682]">square_foot</span>
                        {property.sqft.toLocaleString()} sqft
                      </span>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#c5c5d3]/15 flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-[#00236f]">
                        {property.estimatedRentalYield.split('(')[0]}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onBookTour(property);
                        }}
                        className="text-xs font-bold text-[#432200] hover:text-[#00236f] flex items-center gap-1 uppercase tracking-wider"
                      >
                        Book Tour
                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
