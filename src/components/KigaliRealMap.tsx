import React, { useEffect, useState, useCallback } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  useMap,
} from '@vis.gl/react-google-maps';
import { Property } from '../types';

interface KigaliRealMapProps {
  properties: Property[];
  selectedProperty: Property | null;
  hoveredPropertyId: string | null;
  onSelectProperty: (property: Property) => void;
  onHoverProperty: (propertyId: string | null) => void;
  onBookTour: (property: Property) => void;
  currency: 'USD' | 'RWF';
  showLandmarks: boolean;
  onToggleLandmarks: () => void;
  onClosePreview?: () => void;
}

// Prominent Kigali landmarks with real GPS coordinates
const KIGALI_LANDMARKS_GPS = [
  { name: 'Kigali Golf Club', lat: -1.9360, lng: 30.0975, icon: 'sports_golf', type: 'Recreation & Country Club' },
  { name: 'Kigali Convention Centre', lat: -1.9540, lng: 30.0925, icon: 'domain', type: 'Diplomatic & Events' },
  { name: 'BK Arena', lat: -1.9515, lng: 30.1130, icon: 'stadium', type: 'Entertainment Hub' },
  { name: 'Kigali Int’l Airport (Kanombe)', lat: -1.9680, lng: 30.1390, icon: 'flight', type: 'Aviation Corridor' },
  { name: 'Downtown Financial CBD', lat: -1.9440, lng: 30.0610, icon: 'account_balance', type: 'Banking & Financial' },
  { name: 'Rebero Panoramic Summit', lat: -1.9880, lng: 30.0820, icon: 'landscape', type: 'High Altitude Vista' },
  { name: 'Mount Kigali Ridge', lat: -1.9750, lng: 30.0350, icon: 'terrain', type: 'Nature & Forest Reserve' },
];

const DEFAULT_KIGALI_CENTER = { lat: -1.9441, lng: 30.0910 };
const DEFAULT_ZOOM = 13;

// Helper component inside Map that responds to property selection & controls
const MapController: React.FC<{
  selectedProperty: Property | null;
  hoveredPropertyId: string | null;
  properties: Property[];
  mapTypeId: string;
  onMapReady: (map: google.maps.Map | null) => void;
}> = ({ selectedProperty, hoveredPropertyId, properties, mapTypeId, onMapReady }) => {
  const map = useMap();

  useEffect(() => {
    onMapReady(map);
  }, [map, onMapReady]);

  // Update map type
  useEffect(() => {
    if (map) {
      map.setMapTypeId(mapTypeId);
    }
  }, [map, mapTypeId]);

  // Smoothly center when property is selected
  useEffect(() => {
    if (!map) return;
    if (selectedProperty && selectedProperty.coordinates) {
      map.panTo(selectedProperty.coordinates);
      const currentZoom = map.getZoom() || 13;
      if (currentZoom < 14) {
        map.setZoom(15);
      }
    }
  }, [map, selectedProperty]);

  // Gentle center when hovered
  useEffect(() => {
    if (!map || !hoveredPropertyId) return;
    const hoveredProp = properties.find((p) => p.id === hoveredPropertyId);
    if (hoveredProp?.coordinates) {
      // Pan without aggressive zooming
      map.panTo(hoveredProp.coordinates);
    }
  }, [map, hoveredPropertyId, properties]);

  return null;
};

export const KigaliRealMap: React.FC<KigaliRealMapProps> = ({
  properties,
  selectedProperty,
  hoveredPropertyId,
  onSelectProperty,
  onHoverProperty,
  onBookTour,
  currency,
  showLandmarks,
  onToggleLandmarks,
  onClosePreview,
}) => {
  const apiKey =
    import.meta.env.VITE_GOOGLE_MAPS_API_KEY ||
    'AIzaSyDifQTb2Rh5nUkDgikiTC15ReOJ1ayHmq0';

  const [mapTypeId, setMapTypeId] = useState<string>('roadmap');
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  const [activeEstateModal, setActiveEstateModal] = useState<Property | null>(null);

  // Sync active modal with external selectedProperty
  useEffect(() => {
    if (selectedProperty) {
      setActiveEstateModal(selectedProperty);
    }
  }, [selectedProperty]);

  const handleZoomIn = () => {
    if (mapInstance) {
      mapInstance.setZoom((mapInstance.getZoom() || DEFAULT_ZOOM) + 1);
    }
  };

  const handleZoomOut = () => {
    if (mapInstance) {
      mapInstance.setZoom((mapInstance.getZoom() || DEFAULT_ZOOM) - 1);
    }
  };

  const handleRecenter = () => {
    if (mapInstance) {
      mapInstance.panTo(DEFAULT_KIGALI_CENTER);
      mapInstance.setZoom(DEFAULT_ZOOM);
    }
  };

  const handleMarkerClick = (property: Property) => {
    setActiveEstateModal(property);
    onSelectProperty(property);
    if (mapInstance && property.coordinates) {
      mapInstance.panTo(property.coordinates);
    }
  };

  // If no API key is provided
  if (!apiKey) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-[#f1f3f5] p-6 text-center">
        <span className="material-symbols-outlined text-4xl text-[#00236f] mb-2">map</span>
        <h4 className="font-bold text-base text-[#191c1d]">Google Maps API Key Required</h4>
        <p className="text-xs text-[#757682] max-w-sm mt-1">
          Please provide a valid Google Maps API key to activate the live interactive Kigali satellite &amp; street view.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative overflow-hidden select-none bg-[#e8ecf1]">
      <APIProvider apiKey={apiKey} libraries={['marker']}>
        {/* Floating Custom Top Controls Ribbon */}
        <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
          {/* Status Chip */}
          <div className="bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-xl shadow-md border border-white/60 pointer-events-auto flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-bold text-[#191c1d]">
              Live Kigali Map
            </span>
            <span className="text-[10px] uppercase font-bold text-[#757682] hidden sm:inline">
              · {properties.length} Estates
            </span>
          </div>

          {/* Map Layer & Zoom Controls */}
          <div className="flex items-center gap-1.5 pointer-events-auto">
            {/* Landmarks Toggle */}
            <button
              onClick={onToggleLandmarks}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1 cursor-pointer ${
                showLandmarks
                  ? 'bg-[#00236f] text-white'
                  : 'bg-white/95 backdrop-blur-md text-[#444651] hover:text-[#00236f]'
              }`}
              title="Toggle Kigali Landmarks"
            >
              <span className="material-symbols-outlined text-sm">near_me</span>
              <span className="hidden md:inline text-[11px]">Landmarks</span>
            </button>

            {/* Map Style (Roadmap / Satellite / Hybrid / Terrain) */}
            <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-md p-0.5 flex border border-white/60">
              <button
                onClick={() => setMapTypeId('roadmap')}
                className={`px-2 py-1 text-[11px] font-bold rounded-lg transition-colors cursor-pointer ${
                  mapTypeId === 'roadmap'
                    ? 'bg-[#00236f] text-white'
                    : 'text-[#444651] hover:text-[#00236f]'
                }`}
                title="Standard Map View"
              >
                Map
              </button>
              <button
                onClick={() => setMapTypeId('hybrid')}
                className={`px-2 py-1 text-[11px] font-bold rounded-lg transition-colors cursor-pointer ${
                  mapTypeId === 'hybrid'
                    ? 'bg-[#00236f] text-white'
                    : 'text-[#444651] hover:text-[#00236f]'
                }`}
                title="Satellite Imagery"
              >
                Satellite
              </button>
              <button
                onClick={() => setMapTypeId('terrain')}
                className={`px-2 py-1 text-[11px] font-bold rounded-lg transition-colors cursor-pointer ${
                  mapTypeId === 'terrain'
                    ? 'bg-[#00236f] text-white'
                    : 'text-[#444651] hover:text-[#00236f]'
                }`}
                title="High-Altitude Topographic Terrain"
              >
                Terrain
              </button>
            </div>

            {/* Zoom / Recenter Controls */}
            <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-md flex items-center overflow-hidden border border-white/60">
              <button
                onClick={handleZoomIn}
                className="p-1.5 text-[#444651] hover:text-[#00236f] hover:bg-gray-100 transition-colors cursor-pointer"
                title="Zoom in"
              >
                <span className="material-symbols-outlined text-base">add</span>
              </button>
              <button
                onClick={handleZoomOut}
                className="p-1.5 text-[#444651] hover:text-[#00236f] hover:bg-gray-100 transition-colors cursor-pointer border-l border-gray-200"
                title="Zoom out"
              >
                <span className="material-symbols-outlined text-base">remove</span>
              </button>
              <button
                onClick={handleRecenter}
                className="p-1.5 text-[#444651] hover:text-[#00236f] hover:bg-gray-100 transition-colors cursor-pointer border-l border-gray-200"
                title="Reset to Kigali Center"
              >
                <span className="material-symbols-outlined text-base">my_location</span>
              </button>
            </div>
          </div>
        </div>

        {/* Real Google Map Instance */}
        <Map
          id="kigali-real-estate-map"
          mapId="DEMO_MAP_ID"
          defaultCenter={DEFAULT_KIGALI_CENTER}
          defaultZoom={DEFAULT_ZOOM}
          gestureHandling="greedy"
          disableDefaultUI={true}
          internalUsageAttributionIds={['gmp_git_agentskills_v1']}
          className="w-full h-full"
        >
          {/* Map Controller Helper */}
          <MapController
            selectedProperty={selectedProperty}
            hoveredPropertyId={hoveredPropertyId}
            properties={properties}
            mapTypeId={mapTypeId}
            onMapReady={(map) => setMapInstance(map)}
          />

          {/* Landmarks Markers */}
          {showLandmarks &&
            KIGALI_LANDMARKS_GPS.map((landmark) => (
              <AdvancedMarker
                key={landmark.name}
                position={{ lat: landmark.lat, lng: landmark.lng }}
                title={`${landmark.name} (${landmark.type})`}
              >
                <div className="flex flex-col items-center pointer-events-none group -translate-y-1">
                  <div className="w-6 h-6 rounded-full bg-[#1e293b]/90 text-white flex items-center justify-center shadow-lg border border-white/60">
                    <span className="material-symbols-outlined text-[13px]">{landmark.icon}</span>
                  </div>
                  <span className="text-[10px] font-bold text-[#1e293b] bg-white/95 backdrop-blur-sm px-2 py-0.5 rounded-md shadow-md mt-0.5 whitespace-nowrap border border-black/5">
                    {landmark.name}
                  </span>
                </div>
              </AdvancedMarker>
            ))}

          {/* Curated Rwandan Real Estate Property Markers */}
          {properties.map((property) => {
            const isHovered = hoveredPropertyId === property.id;
            const isSelected = activeEstateModal?.id === property.id;
            const coords = property.coordinates || { lat: -1.944, lng: 30.09 };

            const priceDisplay =
              currency === 'RWF'
                ? property.rwfPriceDisplay?.split(' ')[0] || `${Math.round(property.price / 18000)}M`
                : `$${Math.round(property.price / 1000)}k`;

            return (
              <AdvancedMarker
                key={property.id}
                position={coords}
                title={`${property.title} - ${property.priceDisplay} (${property.neighborhood})`}
                onClick={() => handleMarkerClick(property)}
              >
                <div
                  className="relative group cursor-pointer transition-all duration-200 -translate-y-1"
                  onMouseEnter={() => onHoverProperty(property.id)}
                  onMouseLeave={() => onHoverProperty(null)}
                >
                  {/* Glowing ring animation on active / hovered */}
                  {(isHovered || isSelected) && (
                    <span className="absolute -inset-2 rounded-full bg-[#00236f]/30 animate-ping"></span>
                  )}

                  {/* High-Fidelity Architectural Pin Badge */}
                  <div
                    className={`px-3 py-1.5 rounded-full font-['Manrope'] text-xs font-extrabold shadow-xl transition-all duration-200 flex items-center gap-1.5 ${
                      isSelected || isHovered
                        ? 'bg-[#00236f] text-white scale-115 ring-2 ring-white ring-offset-2 ring-offset-[#00236f]'
                        : 'bg-white text-[#191c1d] border border-[#c5c5d3]/40 hover:scale-105'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        property.propertyType === 'Villa'
                          ? 'bg-emerald-500'
                          : property.propertyType === 'Penthouse'
                          ? 'bg-purple-500'
                          : property.propertyType === 'Architectural Estate'
                          ? 'bg-amber-500'
                          : 'bg-blue-500'
                      }`}
                    ></span>
                    <span>{priceDisplay}</span>
                  </div>

                  {/* Triangle pin arrow pointer */}
                  <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] border-t-white mx-auto -mt-0.5 filter drop-shadow-xs" />
                </div>
              </AdvancedMarker>
            );
          })}
        </Map>
      </APIProvider>

      {/* Floating Rwandan Estate Preview Card (When an estate pin is clicked) */}
      {activeEstateModal && (
        <div className="absolute bottom-4 left-4 right-4 z-30 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-white/60 animate-in slide-in-from-bottom-2 duration-200 max-w-md mx-auto">
          <div className="flex gap-4 items-center">
            {/* Thumbnail */}
            <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-[#e1e3e4] relative">
              <img
                src={activeEstateModal.image}
                alt={activeEstateModal.title}
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                {activeEstateModal.neighborhood}
              </span>
            </div>

            {/* Info & CTAs */}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <h4 className="font-['Manrope'] text-sm font-bold text-[#191c1d] truncate">
                  {activeEstateModal.title}
                </h4>
                <button
                  onClick={() => {
                    setActiveEstateModal(null);
                    if (onClosePreview) onClosePreview();
                  }}
                  className="text-[#757682] hover:text-[#191c1d] p-1 cursor-pointer transition-colors"
                  title="Close preview"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              </div>

              <p className="text-xs font-extrabold text-[#00236f] mt-0.5">
                {currency === 'RWF'
                  ? activeEstateModal.rwfPriceDisplay
                  : activeEstateModal.priceDisplay}
              </p>

              <div className="flex items-center gap-2 text-[11px] text-[#444651] mt-1 font-medium">
                <span>{activeEstateModal.beds} Beds</span>
                <span>·</span>
                <span>{activeEstateModal.baths} Baths</span>
                <span>·</span>
                <span>{activeEstateModal.sqft} sqft</span>
              </div>

              <div className="flex items-center gap-2 mt-2.5">
                <button
                  onClick={() => onSelectProperty(activeEstateModal)}
                  className="px-2.5 py-1 bg-[#f3f4f5] hover:bg-[#e7e8e9] text-[#191c1d] rounded-lg text-[11px] font-bold cursor-pointer transition-colors"
                >
                  View Details
                </button>
                <button
                  onClick={() => onBookTour(activeEstateModal)}
                  className="px-2.5 py-1 bg-[#00236f] text-white hover:bg-[#001a55] rounded-lg text-[11px] font-bold cursor-pointer transition-colors shadow-xs"
                >
                  Book VIP Tour
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
