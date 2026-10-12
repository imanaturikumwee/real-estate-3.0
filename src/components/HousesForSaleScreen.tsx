import React, { useState, useEffect } from 'react';
import { Property, ActiveScreen } from '../types';
import { KigaliRealMap } from './KigaliRealMap';

export interface HouseForSaleItem {
  id: string;
  title: string;
  neighborhood: string;
  location: string;
  priceUsd: number;
  priceRwf: number;
  priceDisplayUsd: string;
  priceDisplayRwf: string;
  beds: number;
  baths: number;
  areaM2: number;
  plotSizeM2: number;
  propertyType: string;
  category: string;
  aiScore: number;
  badge?: string;
  isFeatured?: boolean;
  titleDeedType: string;
  projectedAppreciation: string;
  projectedYield: string;
  yearBuilt: number;
  zoning: string;
  parkingSpaces: number;
  amenities: string[];
  image: string;
  coordinates: { lat: number; lng: number };
  mapPinLabel: string;
  description: string;
}

interface HousesForSaleScreenProps {
  onSelectProperty?: (property: Property) => void;
  onBookTour?: (property: Property) => void;
  onNavigate?: (screen: ActiveScreen) => void;
  onOpenConsultation?: () => void;
}

export const HousesForSaleScreen: React.FC<HousesForSaleScreenProps> = ({
  onSelectProperty,
  onBookTour,
  onNavigate,
  onOpenConsultation,
}) => {
  // Filter States
  const [maxPriceUsd, setMaxPriceUsd] = useState<number>(1500000);
  const [selectedBeds, setSelectedBeds] = useState<number>(0); // 0 = all
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string>('All');
  const [selectedTitleDeed, setSelectedTitleDeed] = useState<string>('All');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('ai-score');
  const [currency, setCurrency] = useState<'USD' | 'RWF'>('USD');
  const [showLandmarks, setShowLandmarks] = useState<boolean>(true);

  // UI States
  const [favorites, setFavorites] = useState<Set<string>>(new Set(['sale-sovereign-ridge-villa']));
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [mobileViewTab, setMobileViewTab] = useState<'list' | 'map'>('list');
  const [hoveredHouseId, setHoveredHouseId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Mortgage Calculator Modal
  const [calculatorHouse, setCalculatorHouse] = useState<HouseForSaleItem | null>(null);
  const [calcDownPaymentPct, setCalcDownPaymentPct] = useState<number>(20);
  const [calcTermYears, setCalcTermYears] = useState<number>(20);
  const [calcInterestRate, setCalcInterestRate] = useState<number>(8.5);

  // Fallback initial dataset in case backend is loading
  const fallbackSaleHouses: HouseForSaleItem[] = [
    {
      id: 'sale-sovereign-ridge-villa',
      title: 'The Sovereign Ridge Villa',
      neighborhood: 'Nyarutarama',
      location: 'Nyarutarama Ridge, Kigali',
      priceUsd: 950000,
      priceRwf: 1235000000,
      priceDisplayUsd: '$950,000',
      priceDisplayRwf: 'RWF 1.235B',
      beds: 5,
      baths: 5,
      areaM2: 580,
      plotSizeM2: 1400,
      propertyType: 'Diplomatic Villa',
      category: 'FREEHOLD ESTATE',
      aiScore: 9.9,
      badge: 'Prime Acquisition',
      isFeatured: true,
      titleDeedType: 'Clean UPI Freehold Deed',
      projectedAppreciation: '+13.8% YoY',
      projectedYield: '9.6% Net Yield',
      yearBuilt: 2024,
      zoning: 'R1A - Low Density Prime Residential',
      parkingSpaces: 4,
      amenities: ['Private Pool', 'Mountain View', 'Solar Energy', 'High-Speed WiFi', 'Staff Quarters', 'Gated Security'],
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBuGAIKUQvpl-Hl6r4oC2hhqwm3zmZXDhZCJrPC92MfOKGSmCkDOjOrbMBrXpF6_LEkgc1eYBV-B65sa0VnYpikb7k1MkHkdS7wdOZODq4FRm0e4b3S4OEUy5tg6rT_Sh7oabxkYDL5-kfG6W1A22D_-sg6OveoQ11i0bbonwkElpnd0tvkIGHxeowV5UAGaLg5ohUnDkS89BhmDUdYJLN0rK2BapuHYfM2WeBgYaNHp8X9oB4V9R62gd6Vmp52PZ3U9lbtBIac9_hR',
      coordinates: { lat: -1.9368, lng: 30.0988 },
      mapPinLabel: '$950k',
      description:
        'An architectural masterpiece with panoramic golf course vistas. Built with thermal volcanic stone cladding, cantilevered teak terraces, heated infinity lap pool, automated biometric entry, and full solar storage microgrid.',
    },
    {
      id: 'sale-kiyovu-presidential-manor',
      title: 'Kiyovu Presidential Manor',
      neighborhood: 'Kiyovu',
      location: 'Diplomatic Quarter, Kiyovu, Kigali',
      priceUsd: 1450000,
      priceRwf: 1885000000,
      priceDisplayUsd: '$1,450,000',
      priceDisplayRwf: 'RWF 1.885B',
      beds: 6,
      baths: 6,
      areaM2: 750,
      plotSizeM2: 2200,
      propertyType: 'Colonial Ambassadorial Manor',
      category: 'HERITAGE LUXURY',
      aiScore: 9.9,
      badge: 'Diplomatic Grade',
      isFeatured: true,
      titleDeedType: 'Clean UPI Freehold Deed',
      projectedAppreciation: '+12.4% YoY',
      projectedYield: '8.8% Net Yield',
      yearBuilt: 2023,
      zoning: 'R1A - Ambassadorial Prime',
      parkingSpaces: 6,
      amenities: ['Private Pool', 'Mountain View', 'Solar Energy', 'Staff Quarters', 'Gated Security', 'Tennis Court'],
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCGGBSEI_gmOrmBmbORG_C2nEM-GUyxCi-132RFPUTpZtPku_la-yK0nuOF1q4xHNRZ7opKZ6qFlATogkeDAXVB1DivZ9rO5F97MTbTfszjYqLyOrCeWuqSDRz1xVYfxWRpMu-q9vADJNCzIr4k4laQlG4sWwsIxODyyu4QPL1PGvu9FtqTMo_0ynyQU9RY816bT2BOPcp_WeBSJ_gVHlju9WifNEQ7PNG7V2BM4UboJfWGs9Q-wSfwzbIpLfOYJT1YfV2cOX8toGPE',
      coordinates: { lat: -1.956, lng: 30.064 },
      mapPinLabel: '$1.45M',
      description:
        'Prestigious embassy-ready estate situated in the heart of Old Kiyovu. Features a private regulation tennis court, mature century-old jacaranda groves, detached guest lodge, guard quarters, and expansive formal reception salon.',
    },
    {
      id: 'sale-rebero-obsidian-horizon',
      title: 'Rebero Obsidian Horizon',
      neighborhood: 'Rebero',
      location: 'Rebero Summit, Kigali',
      priceUsd: 680000,
      priceRwf: 884000000,
      priceDisplayUsd: '$680,000',
      priceDisplayRwf: 'RWF 884M',
      beds: 4,
      baths: 4,
      areaM2: 460,
      plotSizeM2: 950,
      propertyType: 'Contemporary Modern Villa',
      category: 'HILLTOP SANCTUARY',
      aiScore: 9.7,
      badge: "Architect's Choice",
      isFeatured: true,
      titleDeedType: 'Clean UPI Freehold Deed',
      projectedAppreciation: '+15.2% YoY',
      projectedYield: '10.5% Net Yield',
      yearBuilt: 2024,
      zoning: 'R1 - Low Density Residential',
      parkingSpaces: 3,
      amenities: ['Private Pool', 'Mountain View', 'Solar Energy', 'High-Speed WiFi', 'Gated Security'],
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDcedMGqJ2ghqMY2ljqkmRN5zTKzA-RDNdSxHfN7AC1S04DYDT-oIxOQ8XwGL11yHjLJ2cY7RcgeK7x0n3_djmJSN8IuZ7uOI-UpkFtiJ956BYnPER2yUEH4aRICejlUcbg4aAk764HzuyVDoXcYWXwY4oulkzTLiL5w6U5vKkjz29Tlahx9wPM_ro42zuSxNAxSp95bO33wT0t1b4Oay0BbYINH9hTixDEiCRxYeuGdDra4yWlW-Gd22vZUMV2zxUmxVTCc23VB5AA',
      coordinates: { lat: -1.982, lng: 30.082 },
      mapPinLabel: '$680k',
      description:
        'Suspended over the southwestern ridge of Rebero Hill, this home offers 270-degree sunset vistas of Kigali. Equipped with smart floor warming, frameless sliding glass panels, zero-carbon battery storage, and an infinity pool that merges with the clouds.',
    },
    {
      id: 'sale-kibagabaga-architectural-sanctuary',
      title: 'Kibagabaga Architectural Haven',
      neighborhood: 'Kibagabaga',
      location: 'Kibagabaga Hill, Kigali',
      priceUsd: 480000,
      priceRwf: 624000000,
      priceDisplayUsd: '$480,000',
      priceDisplayRwf: 'RWF 624M',
      beds: 4,
      baths: 3,
      areaM2: 380,
      plotSizeM2: 720,
      propertyType: 'Modern Townhouse Villa',
      category: 'PRIME VALUE',
      aiScore: 9.5,
      badge: 'Verified Title',
      isFeatured: false,
      titleDeedType: 'Instant Notarized Transfer',
      projectedAppreciation: '+11.8% YoY',
      projectedYield: '10.1% Net Yield',
      yearBuilt: 2024,
      zoning: 'R2 - Planned Residential Community',
      parkingSpaces: 3,
      amenities: ['Private Pool', 'Solar Energy', 'High-Speed WiFi', 'Gated Security'],
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuA3c7xi4yWp-mUwDymmU9GsMcopSAfVtpXn2GdlW9qSNfVOwCN_J0CSzti3O2MVU8_1YQIzGG4_Ppuw8BZ9ncyUv9c_4ui885INoTF_1unkGcidonAAarpRbx9akUp2fSt-G7UBJNnjg95XVkRyoB3U7ObNOZk08c1lxAmm6k1DbtlpZUzFjrqX9enYM-X_XpDYTroRUWj0hkCubWyaLt3dwECeyn6Qkc11Ub8Z6yL1WllnO2yhZ7wwaZXiNLqA6bLObjGstvrGEXk2',
      coordinates: { lat: -1.944, lng: 30.125 },
      mapPinLabel: '$480k',
      description:
        'Seamless blend of Scandinavian minimalism and Rwandan artisanal volcanic stone masonry. Offers a private landscaped courtyard, custom eucalyptus cabinetry, solar water heating, and rooftop sunset terrace.',
    },
    {
      id: 'sale-gacuriro-modernist-haven',
      title: 'Gacuriro Modernist Haven',
      neighborhood: 'Gacuriro',
      location: 'Gacuriro, Gasabo, Kigali',
      priceUsd: 590000,
      priceRwf: 767000000,
      priceDisplayUsd: '$590,000',
      priceDisplayRwf: 'RWF 767M',
      beds: 4,
      baths: 4,
      areaM2: 420,
      plotSizeM2: 850,
      propertyType: 'Contemporary Architectural Villa',
      category: 'NEW CONSTRUCTION',
      aiScore: 9.6,
      badge: 'Turnkey Luxury',
      isFeatured: false,
      titleDeedType: 'Clean UPI Freehold Deed',
      projectedAppreciation: '+13.0% YoY',
      projectedYield: '9.8% Net Yield',
      yearBuilt: 2024,
      zoning: 'R1 - Prime Residential',
      parkingSpaces: 4,
      amenities: ['Mountain View', 'Solar Energy', 'High-Speed WiFi', 'Staff Quarters', 'Gated Security'],
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAiD5Sf302m49Cgl-HKJ79zbgX_vYXr14YiY-2H3w1VccGCbknMc7gsPFVsvebvnaikmFIG90qJYlxf5cweT_l07hr1Ks94IrIQDYBSVfly_gNdV5KkXfm8s6U0r9VUx5kNCOqfIkPuwwCCctJqszViRLSBD-TqllsHp4q-8YjDHRVnAJl-fbU9obyTN9vslCKCvAy5sDSQOoAYZ4tcgi7C5EQoHF6dHHUSCCfGb2ImYaiwBT0Jjq1dEHcc9D628oT78YCPzen7-Yaq',
      coordinates: { lat: -1.925, lng: 30.108 },
      mapPinLabel: '$590k',
      description:
        'Elevated hillside residence designed for seamless indoor-outdoor living. Features soaring double-height ceilings, automated louvered screens, Italian porcelain tiles, and a private guest pavilion.',
    },
    {
      id: 'sale-kacyiru-diplomatic-enclave',
      title: 'Kacyiru Diplomatic Enclave Villa',
      neighborhood: 'Kacyiru',
      location: 'Ministries & Embassy Row, Kacyiru, Kigali',
      priceUsd: 820000,
      priceRwf: 1066000000,
      priceDisplayUsd: '$820,000',
      priceDisplayRwf: 'RWF 1.066B',
      beds: 5,
      baths: 4,
      areaM2: 510,
      plotSizeM2: 1100,
      propertyType: 'Diplomatic Residence',
      category: 'SECURE ENCLAVE',
      aiScore: 9.8,
      badge: 'High Security',
      isFeatured: false,
      titleDeedType: 'Clean UPI Freehold Deed',
      projectedAppreciation: '+12.1% YoY',
      projectedYield: '9.2% Net Yield',
      yearBuilt: 2023,
      zoning: 'R1A - Diplomatic Residential',
      parkingSpaces: 4,
      amenities: ['Private Pool', 'Solar Energy', 'High-Speed WiFi', 'Staff Quarters', 'Gated Security'],
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCUOhQL5jMcnbiwfsVMXu8wIJrtacsGdJmCc1cVFy-nc_HWacnpWp2iUct98HbBPMxx8L1q4FMktUDRKj-xLjvUUWWthqFE01CvpXMaLykGys6PXkk3HF7YtjM4Xp3GLOqJ0DWMvIMEfpsSOu0KunGp2lFZNnBY2hkLxxD67Q-S9__t5UCr3vnDLpVSt-8X9oq4UJvHy92eSyWm_NaDWL0oJsabAD117CG7-UQEZY4ouFRHLOGZh0WUaKHDyiVviz-lH40WEzrBIl4H',
      coordinates: { lat: -1.943, lng: 30.076 },
      mapPinLabel: '$820k',
      description:
        'Located steps from major international embassies in Kacyiru. Impeccable high-perimeter security, guard post, multi-vehicle carport, manicured tropical lawn, and dedicated chef kitchen with domestic staff suites.',
    },
    {
      id: 'sale-kimihurura-summit-villa',
      title: 'Kimihurura Summit Villa',
      neighborhood: 'Kimihurura',
      location: 'Kimihurura Hill, Gasabo, Kigali',
      priceUsd: 750000,
      priceRwf: 975000000,
      priceDisplayUsd: '$750,000',
      priceDisplayRwf: 'RWF 975M',
      beds: 4,
      baths: 4,
      areaM2: 490,
      plotSizeM2: 1000,
      propertyType: 'Hillside Modern Estate',
      category: 'CULINARY & CULTURAL HUB',
      aiScore: 9.7,
      badge: 'City Views',
      isFeatured: false,
      titleDeedType: 'Clean UPI Freehold Deed',
      projectedAppreciation: '+14.5% YoY',
      projectedYield: '10.2% Net Yield',
      yearBuilt: 2024,
      zoning: 'R1 - Prime Residential',
      parkingSpaces: 4,
      amenities: ['Private Pool', 'Mountain View', 'Solar Energy', 'High-Speed WiFi', 'Gated Security'],
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDcrj7BhiOC43OIwgUjrbO98kUY71phal0YovGq7UA3RLC0MNY7wgNngsUXucPDIWb0eYnp96lsPpDF0x5awXZrYB5ExUpsP_KFXcBvcRfyvLO9U-u4qdsiceJnj-wcM5l-7TCy2AaQro_bgClmiM23eKQk8zny3A256IUtKtUqseup6d3yxATov_gdW6hW5Zm4812k0sX3kvEl8lWIc4ZARP1UHal--OjYlS-gbDXSTvv65xoqC0686gzFQ4ZAgWFTs3PDee91OgN0',
      coordinates: { lat: -1.961, lng: 30.088 },
      mapPinLabel: '$750k',
      description:
        'Set upon the breezy ridgeline of Kimihurura with immediate proximity to Kigali Convention Centre and fine dining. Features a bespoke wine room, panoramic open salon, infinity plunge pool, and lush manicured gardens.',
    },
    {
      id: 'sale-vision-city-modern-gem',
      title: 'Vision City Modernist Gem',
      neighborhood: 'Gacuriro',
      location: 'Vision City, Gacuriro, Kigali',
      priceUsd: 390000,
      priceRwf: 507000000,
      priceDisplayUsd: '$390,000',
      priceDisplayRwf: 'RWF 507M',
      beds: 4,
      baths: 3,
      areaM2: 340,
      plotSizeM2: 600,
      propertyType: 'Master-Planned Villa',
      category: 'GATED COMMUNITY',
      aiScore: 9.4,
      badge: 'Turnkey Value',
      isFeatured: false,
      titleDeedType: 'Instant Notarized Transfer',
      projectedAppreciation: '+10.8% YoY',
      projectedYield: '9.5% Net Yield',
      yearBuilt: 2023,
      zoning: 'R2 - Planned Gated Community',
      parkingSpaces: 2,
      amenities: ['Solar Energy', 'High-Speed WiFi', 'Gated Security'],
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBIoH1CD8fCbIbvUl0dCcjQZgMlhVs3ydWlJEG32UisPFIr5_gW369a0uArsjdyIPEyzZjtT9SGlr7k1jGkXVDHl5mFy3lBW6LDiW1DgvkbzIONHklpO_YN-5_F5gwyJ0GuLHGhMk7JsP84P_vzFvOPC7g6Iz6z9pKeaEMYyfxvpdMSduibpWwR1hBjDUvJlx6egYWmU-YSNNXuJg01ek3JZBUNxaoP3H3shtEVN8Xq8mVd0kVwG7AO8Upm90fRb2z_M2j6UOKL6iye',
      coordinates: { lat: -1.921, lng: 30.112 },
      mapPinLabel: '$390k',
      description:
        'Immaculate turnkey luxury in Kigali’s premier master-planned gated district. 24/7 armed private community patrols, paved dual-carriageway access, underground utilities, and landscaped family playground parks.',
    },
  ];

  const [saleHouses, setSaleHouses] = useState<HouseForSaleItem[]>(fallbackSaleHouses);

  // Fetch houses for sale from API
  useEffect(() => {
    const fetchHousesForSale = async () => {
      try {
        setIsLoading(true);
        const params = new URLSearchParams();
        if (maxPriceUsd) params.append('maxPrice', String(maxPriceUsd));
        if (selectedBeds > 0) params.append('bedrooms', String(selectedBeds));
        if (selectedNeighborhood !== 'All') params.append('neighborhood', selectedNeighborhood);
        if (selectedTitleDeed !== 'All') params.append('titleDeed', selectedTitleDeed);
        if (searchQuery) params.append('search', searchQuery);
        if (sortBy) params.append('sortBy', sortBy);

        const res = await fetch(`/api/houses-for-sale?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          if (data.housesForSale && data.housesForSale.length > 0) {
            setSaleHouses(data.housesForSale);
          }
        }
      } catch (err) {
        console.warn('Using local fallback houses for sale dataset:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHousesForSale();
  }, [maxPriceUsd, selectedBeds, selectedNeighborhood, selectedTitleDeed, searchQuery, sortBy]);

  // Client-side filtering as instant refinement
  const filteredHouses = saleHouses.filter((house) => {
    if (house.priceUsd > maxPriceUsd) return false;
    if (selectedBeds > 0 && house.beds < selectedBeds) return false;
    if (selectedNeighborhood !== 'All' && house.neighborhood.toLowerCase() !== selectedNeighborhood.toLowerCase()) return false;
    if (selectedTitleDeed !== 'All' && !house.titleDeedType.toLowerCase().includes(selectedTitleDeed.toLowerCase())) return false;
    if (selectedAmenities.length > 0) {
      const hasAll = selectedAmenities.every((amenity) => house.amenities.includes(amenity));
      if (!hasAll) return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        house.title.toLowerCase().includes(q) ||
        house.location.toLowerCase().includes(q) ||
        house.neighborhood.toLowerCase().includes(q) ||
        house.description.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        showToast('Removed from saved acquisition portfolio');
      } else {
        next.add(id);
        showToast('Saved to VIP acquisition portfolio');
      }
      return next;
    });
  };

  const toggleAmenity = (name: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(name) ? prev.filter((a) => a !== name) : [...prev, name]
    );
  };

  // Adapter to Property interface so existing Detail Modal and Consultation work seamlessly
  const toPropertyAdapter = (h: HouseForSaleItem): Property => ({
    id: h.id,
    title: h.title,
    neighborhood: h.neighborhood,
    location: h.location,
    price: h.priceUsd,
    priceDisplay: h.priceDisplayUsd,
    rwfPriceDisplay: h.priceDisplayRwf,
    propertyType: 'Villa',
    beds: h.beds,
    baths: h.baths,
    sqft: Math.round(h.areaM2 * 10.76),
    areaM2: h.areaM2,
    image: h.image,
    gallery: [h.image],
    architecturalStyle: h.propertyType,
    description: h.description,
    highlights: [
      h.titleDeedType,
      `Plot Size: ${h.plotSizeM2.toLocaleString()} m²`,
      `Capital Appreciation: ${h.projectedAppreciation}`,
      `Gross Yield: ${h.projectedYield}`,
      `Zoning: ${h.zoning}`,
      ...h.amenities,
    ],
    zoning: h.zoning,
    estimatedRentalYield: h.projectedYield,
    yearBuilt: h.yearBuilt,
    parkingSpaces: h.parkingSpaces,
    lotSize: `${h.plotSizeM2.toLocaleString()} sqm`,
    coordinates: h.coordinates,
    badge: h.badge,
    matchScore: Math.round(h.aiScore * 10),
  });

  const propertyAdapters: Property[] = filteredHouses.map(toPropertyAdapter);

  const handleBookViewing = (house: HouseForSaleItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const adapter = toPropertyAdapter(house);
    if (onBookTour) {
      onBookTour(adapter);
    } else if (onOpenConsultation) {
      onOpenConsultation();
    }
  };

  const handleOpenDetail = (house: HouseForSaleItem) => {
    const adapter = toPropertyAdapter(house);
    if (onSelectProperty) {
      onSelectProperty(adapter);
    }
  };

  // Calculate monthly mortgage estimate
  const calcMortgage = () => {
    if (!calculatorHouse) return { monthly: 0, down: 0, loan: 0 };
    const price = calculatorHouse.priceUsd;
    const down = (price * calcDownPaymentPct) / 100;
    const loan = price - down;
    const monthlyRate = calcInterestRate / 100 / 12;
    const totalMonths = calcTermYears * 12;
    const monthly =
      (loan * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths))) /
      (Math.pow(1 + monthlyRate, totalMonths) - 1);
    return {
      monthly: Math.round(monthly),
      down: Math.round(down),
      loan: Math.round(loan),
    };
  };

  const mortgageNumbers = calcMortgage();

  return (
    <div className="bg-[#f8f9fa] font-['Inter'] text-[#191c1d] min-h-screen selection:bg-[#00236f] selection:text-white">
      {/* -------------------------------------------------------------
          Top Navigation Bar Sub-Header (Houses for Sale, Rentals, Apartments, Land, Investments)
          ------------------------------------------------------------- */}
      <div className="bg-white/95 backdrop-blur-md border-b border-[#c5c5d3]/20 sticky top-20 z-30 px-4 sm:px-8 py-3">
        <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Section Navigation Tabs & Rent/Sale Switcher */}
          <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto no-scrollbar py-1">
            {/* Prominent For Sale vs For Rent Segmented Switcher */}
            <div className="flex items-center bg-[#f1f3f9] p-1 rounded-xl shrink-0 border border-[#c5c5d3]/30">
              <button
                onClick={() => onNavigate?.('houses-for-sale')}
                className="px-3.5 py-1.5 rounded-lg text-xs font-extrabold uppercase tracking-wider bg-[#00236f] text-white shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm">sell</span>
                <span>For Sale</span>
              </button>
              <button
                onClick={() => onNavigate?.('houses')}
                className="px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-[#00236f] transition-colors cursor-pointer flex items-center gap-1.5"
                title="Switch to Rental Houses"
              >
                <span className="material-symbols-outlined text-sm">key</span>
                <span>For Rent</span>
              </button>
            </div>

            {/* Category Nav Links */}
            <nav className="flex items-center space-x-5 sm:space-x-7 font-['Manrope'] text-xs sm:text-sm tracking-wide uppercase shrink-0">
              <button
                onClick={() => onNavigate?.('houses-for-sale')}
                className="text-[#00236f] font-bold border-b-2 border-[#00236f] pb-1 cursor-pointer transition-all flex items-center gap-1.5 shrink-0"
              >
                <span className="material-symbols-outlined text-base">villa</span>
                <span>Houses for Sale</span>
              </button>
              <button
                onClick={() => onNavigate?.('houses')}
                className="text-slate-600 hover:text-[#00236f] font-semibold transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
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
                <span>Land Plots</span>
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

          {/* Right Action Bar: Currency Toggle, Mobile View Switcher, Filter Toggle */}
          <div className="flex items-center justify-between md:justify-end gap-3 shrink-0">
            {/* Currency Switcher */}
            <div className="flex items-center bg-slate-100 rounded-lg p-0.5 text-xs font-bold text-slate-700">
              <button
                onClick={() => setCurrency('USD')}
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  currency === 'USD' ? 'bg-white text-[#00236f] shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                USD ($)
              </button>
              <button
                onClick={() => setCurrency('RWF')}
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  currency === 'RWF' ? 'bg-white text-[#00236f] shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                RWF
              </button>
            </div>

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
              <span>Filters</span>
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
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-['Manrope'] text-xl font-bold text-[#191c1d]">Acquisition Filters</h2>
              <p className="text-[11px] text-[#757682] mt-0.5">Verified Rwandan Freehold Deeds</p>
            </div>
            {mobileFilterOpen && (
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="lg:hidden p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            )}
          </div>

          <div className="space-y-6">
            {/* Search Input */}
            <section>
              <label className="font-['Inter'] text-xs font-bold uppercase tracking-widest text-[#5e5e5e] mb-2 block">
                Keyword or Estate
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. Nyarutarama, Pool, Villa..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#c5c5d3]/40 rounded-lg text-xs font-medium focus:ring-2 focus:ring-[#00236f] focus:outline-hidden"
                />
                <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-slate-400 text-base">
                  search
                </span>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 text-xs"
                  >
                    ✕
                  </button>
                )}
              </div>
            </section>

            {/* Neighborhood Dropdown */}
            <section>
              <label className="font-['Inter'] text-xs font-bold uppercase tracking-widest text-[#5e5e5e] mb-2 block">
                Neighborhood / Enclave
              </label>
              <select
                value={selectedNeighborhood}
                onChange={(e) => setSelectedNeighborhood(e.target.value)}
                className="w-full bg-white border border-[#c5c5d3]/40 rounded-lg py-2.5 px-3 text-xs font-semibold text-[#191c1d] focus:ring-2 focus:ring-[#00236f] focus:outline-hidden"
              >
                <option value="All">All Neighborhoods</option>
                <option value="Nyarutarama">Nyarutarama (Golf Ridge)</option>
                <option value="Kiyovu">Old Kiyovu (Diplomatic Quarter)</option>
                <option value="Rebero">Rebero (Summit Panoramas)</option>
                <option value="Kibagabaga">Kibagabaga (Sunset Hill)</option>
                <option value="Gacuriro">Gacuriro & Vision City</option>
                <option value="Kacyiru">Kacyiru (Embassy Enclave)</option>
                <option value="Kimihurura">Kimihurura (Culinary District)</option>
              </select>
            </section>

            {/* Price Range Slider */}
            <section>
              <label className="font-['Inter'] text-xs font-bold uppercase tracking-widest text-[#5e5e5e] mb-2 block">
                Max Price: {currency === 'USD' ? `$${(maxPriceUsd / 1000).toFixed(0)}k` : `RWF ${(maxPriceUsd * 1300 / 1000000).toFixed(0)}M`}
              </label>
              <div className="space-y-2">
                <input
                  type="range"
                  min="300000"
                  max="2000000"
                  step="50000"
                  value={maxPriceUsd}
                  onChange={(e) => setMaxPriceUsd(Number(e.target.value))}
                  className="w-full accent-[#00236f] cursor-pointer"
                />
                <div className="flex justify-between font-['Inter'] text-[11px] text-[#444651] font-semibold">
                  <span>$300k</span>
                  <span className="text-[#00236f] font-bold">
                    ${(maxPriceUsd / 1000).toFixed(0)}k
                  </span>
                  <span>$2.0M+</span>
                </div>
              </div>
            </section>

            {/* Bedrooms Grid */}
            <section>
              <label className="font-['Inter'] text-xs font-bold uppercase tracking-widest text-[#5e5e5e] mb-2 block">
                Minimum Bedrooms
              </label>
              <div className="grid grid-cols-5 gap-1.5 font-['Inter'] text-xs">
                {[
                  { label: 'All', val: 0 },
                  { label: '3+', val: 3 },
                  { label: '4+', val: 4 },
                  { label: '5+', val: 5 },
                  { label: '6+', val: 6 },
                ].map((item) => (
                  <button
                    key={item.val}
                    onClick={() => setSelectedBeds(item.val)}
                    className={`py-2 rounded-md font-semibold transition-all cursor-pointer text-xs ${
                      selectedBeds === item.val
                        ? 'bg-[#00236f] text-white shadow-xs'
                        : 'bg-white border border-[#c5c5d3]/30 text-[#191c1d] hover:bg-[#00236f] hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </section>

            {/* Title Deed Type Filter */}
            <section>
              <label className="font-['Inter'] text-xs font-bold uppercase tracking-widest text-[#5e5e5e] mb-2 block">
                Title Deed Verification
              </label>
              <div className="space-y-1.5 text-xs">
                {[
                  { label: 'All Registered Titles', val: 'All' },
                  { label: 'Clean UPI Freehold Deed', val: 'Clean UPI' },
                  { label: 'Instant Notarized Transfer Ready', val: 'Instant Notarized' },
                ].map((deed) => (
                  <button
                    key={deed.val}
                    onClick={() => setSelectedTitleDeed(deed.val)}
                    className={`w-full text-left px-3 py-2 rounded-lg font-medium transition-all cursor-pointer flex items-center justify-between ${
                      selectedTitleDeed === deed.val
                        ? 'bg-[#00236f]/10 text-[#00236f] font-bold border border-[#00236f]/20'
                        : 'bg-white border border-gray-100 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{deed.label}</span>
                    {selectedTitleDeed === deed.val && (
                      <span className="material-symbols-outlined text-sm text-[#00236f]">check</span>
                    )}
                  </button>
                ))}
              </div>
            </section>

            {/* Amenities Checkboxes */}
            <section>
              <label className="font-['Inter'] text-xs font-bold uppercase tracking-widest text-[#5e5e5e] mb-2 block">
                Luxury Amenities
              </label>
              <div className="space-y-2.5 font-['Inter'] text-xs">
                {[
                  { name: 'Private Pool' },
                  { name: 'Mountain View' },
                  { name: 'Solar Energy' },
                  { name: 'High-Speed WiFi' },
                  { name: 'Staff Quarters' },
                  { name: 'Gated Security' },
                ].map((amenity) => {
                  const isChecked = selectedAmenities.includes(amenity.name);
                  return (
                    <label
                      key={amenity.name}
                      onClick={() => toggleAmenity(amenity.name)}
                      className="flex items-center space-x-2.5 cursor-pointer group select-none"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="rounded border-[#c5c5d3] text-[#00236f] focus:ring-[#00236f] h-3.5 w-3.5"
                      />
                      <span className="text-xs text-[#444651] group-hover:text-[#191c1d]">
                        {amenity.name}
                      </span>
                    </label>
                  );
                })}
              </div>
            </section>

            {/* Reset Filters */}
            <button
              onClick={() => {
                setMaxPriceUsd(1500000);
                setSelectedBeds(0);
                setSelectedNeighborhood('All');
                setSelectedTitleDeed('All');
                setSelectedAmenities([]);
                setSearchQuery('');
                setSortBy('ai-score');
                setMobileFilterOpen(false);
                showToast('Filters reset to all luxury houses for sale.');
              }}
              className="w-full py-2.5 text-xs text-slate-500 hover:text-slate-900 border border-slate-200 rounded-md transition-colors cursor-pointer bg-white"
            >
              Reset All Filters
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
          <header className="mb-6 md:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00236f]/10 text-[#00236f] text-[11px] font-bold uppercase tracking-wider mb-2">
                  <span className="material-symbols-outlined text-xs">verified</span>
                  <span>Rwanda Land Management Authority Verified</span>
                </div>
                <h1 className="font-['Manrope'] text-3xl sm:text-4xl font-extrabold tracking-tight text-[#191c1d] max-w-2xl leading-tight">
                  Exclusive Houses for Sale in <span className="text-[#00236f]">Kigali</span>
                </h1>
                <p className="font-['Inter'] text-[#444651] mt-2 max-w-2xl text-sm sm:text-base leading-relaxed">
                  Prime freehold estates and turnkey architect-designed residences across Nyarutarama, Old Kiyovu, Rebero, and Kibagabaga. 100% clean title deeds guaranteed.
                </p>
              </div>

              {/* Quick Sort Dropdown */}
              <div className="flex items-center gap-2 self-start sm:self-center">
                <span className="text-xs text-slate-500 font-semibold whitespace-nowrap">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white border border-[#c5c5d3]/40 rounded-lg py-2 px-3 text-xs font-bold text-[#00236f] focus:outline-hidden cursor-pointer shadow-2xs"
                >
                  <option value="ai-score">Highest AI Match</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="size-desc">Plot & Living Size</option>
                </select>
              </div>
            </div>

            {/* Quick KPI Stat Chips */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
              <div className="bg-white p-3.5 rounded-xl border border-[#c5c5d3]/30 shadow-2xs">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Available For Sale</p>
                <p className="text-xl font-extrabold text-[#00236f] mt-0.5">{filteredHouses.length} Estates</p>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-[#c5c5d3]/30 shadow-2xs">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Capital Appreciation</p>
                <p className="text-xl font-extrabold text-emerald-700 mt-0.5">+13.8% YoY</p>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-[#c5c5d3]/30 shadow-2xs">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Legal Guarantee</p>
                <p className="text-xl font-extrabold text-[#191c1d] mt-0.5">100% UPI Deeds</p>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-[#c5c5d3]/30 shadow-2xs">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Foreign Ownership</p>
                <p className="text-xl font-extrabold text-[#00236f] mt-0.5">100% Freehold</p>
              </div>
            </div>
          </header>

          {isLoading && (
            <div className="py-8 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
              <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>
              <span>Loading verified houses for sale in Kigali...</span>
            </div>
          )}

          {filteredHouses.length === 0 && !isLoading && (
            <div className="bg-white rounded-2xl p-12 text-center border border-gray-200 my-8">
              <span className="material-symbols-outlined text-4xl text-slate-400 mb-2">search_off</span>
              <h3 className="text-lg font-bold text-slate-800">No estates match your current criteria</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4">
                Try widening your price range or clearing selected filters to explore available freehold acquisitions.
              </p>
              <button
                onClick={() => {
                  setMaxPriceUsd(1500000);
                  setSelectedBeds(0);
                  setSelectedNeighborhood('All');
                  setSelectedTitleDeed('All');
                  setSelectedAmenities([]);
                  setSearchQuery('');
                }}
                className="px-4 py-2 bg-[#00236f] text-white text-xs font-bold rounded-lg cursor-pointer hover:bg-[#001c55]"
              >
                Reset Filters
              </button>
            </div>
          )}

          {/* Houses for Sale Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
            {filteredHouses.map((house) => (
              <article
                key={house.id}
                onClick={() => handleOpenDetail(house)}
                onMouseEnter={() => setHoveredHouseId(house.id)}
                onMouseLeave={() => setHoveredHouseId(null)}
                className={`group bg-white rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl border ${
                  hoveredHouseId === house.id
                    ? 'border-[#00236f] shadow-lg -translate-y-1'
                    : 'border-[#c5c5d3]/20 shadow-xs'
                } cursor-pointer flex flex-col justify-between`}
              >
                {/* Image & Badges */}
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <img
                    src={house.image}
                    alt={house.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <span className="bg-[#00236f]/90 text-white px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md backdrop-blur-xs">
                      {house.category}
                    </span>
                    <span className="bg-amber-900/90 text-amber-200 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md backdrop-blur-xs">
                      AI MATCH {house.aiScore}
                    </span>
                    {house.badge && (
                      <span className="bg-emerald-800/90 text-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md backdrop-blur-xs">
                        {house.badge}
                      </span>
                    )}
                  </div>

                  {/* Favorite Button */}
                  <button
                    onClick={(e) => toggleFavorite(house.id, e)}
                    className="absolute top-3 right-3 bg-white/40 hover:bg-white backdrop-blur-md p-2 rounded-full transition-colors cursor-pointer text-slate-800 hover:text-rose-600 shadow-xs"
                    title="Save to favorites"
                  >
                    <span
                      className={`material-symbols-outlined text-lg ${
                        favorites.has(house.id) ? 'text-rose-600' : 'text-slate-800'
                      }`}
                      style={{
                        fontVariationSettings: favorites.has(house.id)
                          ? "'FILL' 1"
                          : "'FILL' 0",
                      }}
                    >
                      favorite
                    </span>
                  </button>

                  {/* Title Deed Stamp */}
                  <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm px-2.5 py-1 rounded-md text-[10px] text-white flex items-center gap-1 font-semibold">
                    <span className="material-symbols-outlined text-xs text-emerald-400">gavel</span>
                    <span>{house.titleDeedType}</span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    {/* Price and Neighborhood */}
                    <div className="flex items-baseline justify-between mb-1">
                      <div>
                        <span className="font-['Manrope'] text-2xl font-extrabold text-[#00236f]">
                          {currency === 'USD' ? house.priceDisplayUsd : house.priceDisplayRwf}
                        </span>
                        <span className="text-[11px] text-slate-500 ml-2 font-medium">
                          ({currency === 'USD' ? house.priceDisplayRwf : house.priceDisplayUsd})
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        {house.projectedAppreciation}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-['Manrope'] text-lg font-bold text-[#191c1d] group-hover:text-[#00236f] transition-colors line-clamp-1">
                      {house.title}
                    </h3>
                    <p className="text-xs text-[#757682] flex items-center gap-1 mt-0.5">
                      <span className="material-symbols-outlined text-xs">location_on</span>
                      <span>{house.location}</span>
                    </p>

                    <p className="text-xs text-slate-600 mt-2.5 line-clamp-2 leading-relaxed">
                      {house.description}
                    </p>

                    {/* Key Specs Grid */}
                    <div className="grid grid-cols-4 gap-2 pt-3 border-t border-gray-100 text-center font-['Inter'] text-xs mt-3">
                      <div className="bg-slate-50 p-1.5 rounded-lg">
                        <span className="text-[10px] text-slate-400 block uppercase">Beds</span>
                        <span className="font-bold text-slate-800">{house.beds} Bed</span>
                      </div>
                      <div className="bg-slate-50 p-1.5 rounded-lg">
                        <span className="text-[10px] text-slate-400 block uppercase">Baths</span>
                        <span className="font-bold text-slate-800">{house.baths} Bath</span>
                      </div>
                      <div className="bg-slate-50 p-1.5 rounded-lg">
                        <span className="text-[10px] text-slate-400 block uppercase">Living</span>
                        <span className="font-bold text-slate-800">{house.areaM2} m²</span>
                      </div>
                      <div className="bg-slate-50 p-1.5 rounded-lg">
                        <span className="text-[10px] text-slate-400 block uppercase">Plot</span>
                        <span className="font-bold text-slate-800">{house.plotSizeM2} m²</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Action Buttons */}
                  <div className="pt-2 flex items-center gap-2">
                    <button
                      onClick={(e) => handleBookViewing(house, e)}
                      className="flex-1 py-2.5 px-3 bg-[#00236f] hover:bg-[#001c55] text-white text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1 shadow-xs active:scale-98"
                    >
                      <span className="material-symbols-outlined text-sm">calendar_month</span>
                      <span>Private Viewing</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setCalculatorHouse(house);
                      }}
                      className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center"
                      title="Mortgage Calculator"
                    >
                      <span className="material-symbols-outlined text-base">calculate</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenDetail(house);
                      }}
                      className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center"
                      title="View Full Dossier"
                    >
                      <span className="material-symbols-outlined text-base">description</span>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Legal Due Diligence & Foreign Buyer Advisory Banner */}
          <section className="bg-gradient-to-br from-[#00236f] to-[#001440] text-white rounded-2xl p-6 sm:p-8 mt-2 mb-12 shadow-md">
            <div className="max-w-3xl">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#ffdcc1] bg-white/10 px-3 py-1 rounded-full">
                Rwanda Investment & Land Code Protection
              </span>
              <h3 className="font-['Manrope'] text-2xl font-bold mt-3 mb-2">
                100% Freehold Title Deeds for International & Diaspora Buyers
              </h3>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                Under the revised Rwanda Land Law and Rwanda Development Board (RDB) Investment Code, qualifying residential property purchases grant clean, indefeasible freehold or 99-year renewable registered titles. All transactions pass through digital Notarized Title Registry (Irembo), completely eliminating title disputes.
              </p>
              <div className="flex flex-wrap items-center gap-3 mt-4">
                <button
                  onClick={() => onOpenConsultation?.()}
                  className="px-4 py-2 bg-white text-[#00236f] text-xs font-bold rounded-lg cursor-pointer hover:bg-slate-100 transition-colors shadow-xs"
                >
                  Schedule Legal Due Diligence Call
                </button>
                <button
                  onClick={() => onNavigate?.('invest')}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  View Investment Advisory Guide
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* =========================================================
            3. Right Map Column (Split View Desktop & Full Tab Mobile)
            ========================================================= */}
        <div
          className={`w-full xl:w-[480px] 2xl:w-[560px] shrink-0 border-l border-[#c5c5d3]/20 bg-white sticky top-36 h-[calc(100vh-9rem)] overflow-hidden flex flex-col ${
            mobileViewTab === 'list' ? 'hidden xl:flex' : 'flex'
          }`}
        >
          {/* Map Controls Header */}
          <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white z-10 shrink-0">
            <div>
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#00236f] text-base">explore</span>
                <span>Kigali Hilltop Coordinates</span>
              </h3>
              <p className="text-[11px] text-slate-500">
                {filteredHouses.length} houses mapped across Gasabo & Nyarugenge
              </p>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setShowLandmarks(!showLandmarks)}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-md border transition-colors cursor-pointer flex items-center gap-1 ${
                  showLandmarks
                    ? 'bg-[#00236f] text-white border-[#00236f]'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
                title="Toggle Kigali Key Landmarks (Golf Club, BK Arena, Convention Centre)"
              >
                <span className="material-symbols-outlined text-xs">tour</span>
                <span>{showLandmarks ? 'Landmarks On' : 'Landmarks Off'}</span>
              </button>
            </div>
          </div>

          {/* Real Kigali Map Component */}
          <div className="flex-1 relative">
            <KigaliRealMap
              properties={propertyAdapters}
              selectedProperty={
                hoveredHouseId
                  ? propertyAdapters.find((p) => p.id === hoveredHouseId) || null
                  : null
              }
              hoveredPropertyId={hoveredHouseId}
              onSelectProperty={(prop) => {
                const match = saleHouses.find((h) => h.id === prop.id);
                if (match) {
                  setHoveredHouseId(match.id);
                  handleOpenDetail(match);
                }
              }}
              onHoverProperty={(id) => setHoveredHouseId(id)}
              onBookTour={(prop) => {
                const match = saleHouses.find((h) => h.id === prop.id);
                if (match) {
                  handleBookViewing(match);
                }
              }}
              currency={currency}
              showLandmarks={showLandmarks}
              onToggleLandmarks={() => setShowLandmarks(!showLandmarks)}
              onClosePreview={() => setHoveredHouseId(null)}
            />
          </div>
        </div>
      </main>

      {/* -------------------------------------------------------------
          Mortgage Calculator Modal
          ------------------------------------------------------------- */}
      {calculatorHouse && (
        <div
          onClick={() => setCalculatorHouse(null)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100"
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#00236f] text-2xl">calculate</span>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Kigali Financing & Mortgage</h3>
                  <p className="text-xs text-slate-500">{calculatorHouse.title}</p>
                </div>
              </div>
              <button
                onClick={() => setCalculatorHouse(null)}
                className="p-1 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Total Price</span>
                <p className="text-2xl font-extrabold text-[#00236f]">
                  ${calculatorHouse.priceUsd.toLocaleString()} USD
                  <span className="text-xs font-normal text-slate-500 ml-2">
                    (~RWF {(calculatorHouse.priceUsd * 1300 / 1000000).toFixed(0)}M)
                  </span>
                </p>
              </div>

              {/* Down Payment Slider */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Down Payment ({calcDownPaymentPct}%)</span>
                  <span className="text-[#00236f] font-bold">${mortgageNumbers.down.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="50"
                  step="5"
                  value={calcDownPaymentPct}
                  onChange={(e) => setCalcDownPaymentPct(Number(e.target.value))}
                  className="w-full accent-[#00236f] cursor-pointer"
                />
              </div>

              {/* Loan Term Slider */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Loan Term ({calcTermYears} Years)</span>
                  <span className="text-slate-700">{calcTermYears * 12} Monthly Payments</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="25"
                  step="1"
                  value={calcTermYears}
                  onChange={(e) => setCalcTermYears(Number(e.target.value))}
                  className="w-full accent-[#00236f] cursor-pointer"
                />
              </div>

              {/* Interest Rate */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Interest Rate ({calcInterestRate}% USD / Bank of Kigali)</span>
                  <span className="text-slate-700">Prime Diaspora Rate</span>
                </div>
                <input
                  type="range"
                  min="6.0"
                  max="14.0"
                  step="0.5"
                  value={calcInterestRate}
                  onChange={(e) => setCalcInterestRate(Number(e.target.value))}
                  className="w-full accent-[#00236f] cursor-pointer"
                />
              </div>

              {/* Calculation Summary Box */}
              <div className="bg-[#f1f3f9] p-4 rounded-xl space-y-2 border border-[#c5c5d3]/30">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 font-medium">Estimated Monthly Payment:</span>
                  <span className="font-extrabold text-xl text-[#00236f]">
                    ${mortgageNumbers.monthly.toLocaleString()} / mo
                  </span>
                </div>
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Loan Principal:</span>
                  <span>${mortgageNumbers.loan.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Annual Property Land Tax (~0.1%):</span>
                  <span>~${Math.round(calculatorHouse.priceUsd * 0.001)} / yr</span>
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  onClick={() => {
                    const house = calculatorHouse;
                    setCalculatorHouse(null);
                    handleBookViewing(house);
                  }}
                  className="flex-1 py-3 bg-[#00236f] hover:bg-[#001c55] text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-xs"
                >
                  Book Bank Pre-Approval Tour
                </button>
                <button
                  onClick={() => setCalculatorHouse(null)}
                  className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-all cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#00236f] text-white text-xs px-5 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-in slide-in-from-bottom-2">
          <span className="material-symbols-outlined text-sm text-emerald-400">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
