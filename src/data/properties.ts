import { Property } from '../types';

export const HERO_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDcrj7BhiOC43OIwgUjrbO98kUY71phal0YovGq7UA3RLC0MNY7wgNngsUXucPDIWb0eYnp96lsPpDF0x5awXZrYB5ExUpsP_KFXcBvcRfyvLO9U-u4qdsiceJnj-wcM5l-7TCy2AaQro_bgClmiM23eKQk8zny3A256IUtKtUqseup6d3yxATov_gdW6hW5Zm4812k0sX3kvEl8lWIc4ZARP1UHal--OjYlS-gbDXSTvv65xoqC0686gzFQ4ZAgWFTs3PDee91OgN0';

export const CTA_TEXTURE_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBNL21SMFOnVZ6ae_YzGqRQF9bgAFocU8hotgpFDOI9Sf-iD9XaT8Sk9ZEq3CHdIE9yM5oeuhTrDCHZVYDr6hSfJSi8vvHQ_f_RK_RzXc3IM0d9reG36Ez9VAMruRHPrQzomUiIbZGKMxXzou_J8oWpXAol7hs3vv5MoJ_5E3Q-zi7bISIr7zIwRc33z9uqclvDzH3bxZNlSCkNbohQOoPynW0M8hdTO-b8cgMkQDYOz5Tr_ZrH086l1WLICgM7LCvDQrFQqYfkM8tL';

export const ADVISOR_DANY_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCtjmMQOY5sAAxNgQYW5ltoLNUo1kLKAdH1c6IzmD9AwmUbfTRMsN9e_K3Ft0MJTY8nv7PaPxe8ISn0cMPArCETMKbk7kdxSjiWPkeFVE2hAQ_ObZCyfzHuthpgvn5BnbSHTXLdSziG0EtQBiP3C8UMktBKjS7HTmvcziBajKSlA_9eraozrZiTDwCSD76913-r21ISJUQGLm45TbCKUatMhvrRAjHTg3eDWVw-Lyxgzr7ZA0zjy36EQ5xclzAjsdeTXyJ-V01YasjL';

export const PROPERTIES: Property[] = [
  {
    id: 'nyarutarama-heights',
    title: 'Nyarutarama Heights',
    neighborhood: 'Nyarutarama',
    location: 'Kigali, Rwanda',
    price: 850000,
    priceDisplay: '$850,000',
    propertyType: 'Villa',
    beds: 5,
    baths: 4,
    sqft: 4200,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCUOhQL5jMcnbiwfsVMXu8wIJrtacsGdJmCc1cVFy-nc_HWacnpWp2iUct98HbBPMxx8L1q4FMktUDRKj-xLjvUUWWthqFE01CvpXMaLykGys6PXkk3HF7YtjM4Xp3GLOqJ0DWMvIMEfpsSOu0KunGp2lFZNnBY2hkLxxD67Q-S9__t5UCr3vnDLpVSt-8X9oq4UJvHy92eSyWm_NaDWL0oJsabAD117CG7-UQEZY4ouFRHLOGZh0WUaKHDyiVviz-lH40WEzrBIl4H',
    gallery: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCUOhQL5jMcnbiwfsVMXu8wIJrtacsGdJmCc1cVFy-nc_HWacnpWp2iUct98HbBPMxx8L1q4FMktUDRKj-xLjvUUWWthqFE01CvpXMaLykGys6PXkk3HF7YtjM4Xp3GLOqJ0DWMvIMEfpsSOu0KunGp2lFZNnBY2hkLxxD67Q-S9__t5UCr3vnDLpVSt-8X9oq4UJvHy92eSyWm_NaDWL0oJsabAD117CG7-UQEZY4ouFRHLOGZh0WUaKHDyiVviz-lH40WEzrBIl4H',
      HERO_IMAGE,
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD2EM6jH0Hi1NNiDmQIIP7GwWjjAnOhldBUxbD_AnJYGN7d6tAG_KolV9u8fdOoQWCOklPneDd8SjID4_QjUr3A9gp1tyYCerCF5FRP31JbAXi1mijntzH2Ksv3t0gNhfLi45GWVXE8h_PFfLUGF0eh8teau-IlMEp_KNbWUb5t2ps-PlmrXgHiBKJKSAsJuUFmykwqUxO6Kj_0au1is72yYFknZnP5iOZyE-1ntZvw6JMiAbln8b0o4PYREBf5-zE6aYXV_dt5uSFW',
    ],
    badge: 'PREMIUM LISTING',
    isFeatured: true,
    architecturalStyle: 'Modern Minimalist Villa with Infinity Pool',
    description:
      'Perched prominently in diplomatic Nyarutarama, this modernist residence combines expansive glass curtain walls with local Musanze volcanic basalt detailing. Features an infinity lap pool overlooking the Kigali Golf Course greens, double-height atrium living areas, and integrated solar harvesting.',
    highlights: [
      'Direct panoramic vistas of Kigali Golf Course',
      'Heated infinity pool with cantilevered sun deck',
      'Smart home automation and integrated greywater filtration',
      'Staff quarters with separate service entry',
      'Master suite with Italian travertine en-suite bath',
    ],
    zoning: 'R1A - Low Density Prime Residential',
    estimatedRentalYield: '9.8% gross annual yield ($7,000/mo)',
    yearBuilt: 2024,
    parkingSpaces: 4,
    lotSize: '1,450 sqm',
    architect: 'Emma Umutoni Studio + Kigali Urban Design',
  },
  {
    id: 'vision-city-duplex',
    title: 'Vision City Duplex',
    neighborhood: 'Gacuhiro',
    location: 'Gacuhiro, Rwanda',
    price: 425000,
    priceDisplay: '$425,000',
    propertyType: 'Duplex',
    beds: 3,
    baths: 3,
    sqft: 2800,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCFkv3aTYakD1H_X4UZmHAQ5ymG4msN8PxppnuxoNIyM3Iq8YJizoq9rSlR2zjlhTaYG9uHx-1qsuWLxwKSkI5e5TCsvPC2Kyj_3vYDvJaaTCzmHMai8RP6iBQqrnPVZF5CwVYychiNEUsyu4kduW_zRpk7KtOY6_-d0TLSnBAS3JyGoq-cYsRUvvNRY3ckapXE8R7RdcSvG2ZOQ90NmEjUkBY7JSnaxbMyx35BLy04aRqGzQZwAXGmwaQgFJ8cskamSxlY2C1t4ld3',
    gallery: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCFkv3aTYakD1H_X4UZmHAQ5ymG4msN8PxppnuxoNIyM3Iq8YJizoq9rSlR2zjlhTaYG9uHx-1qsuWLxwKSkI5e5TCsvPC2Kyj_3vYDvJaaTCzmHMai8RP6iBQqrnPVZF5CwVYychiNEUsyu4kduW_zRpk7KtOY6_-d0TLSnBAS3JyGoq-cYsRUvvNRY3ckapXE8R7RdcSvG2ZOQ90NmEjUkBY7JSnaxbMyx35BLy04aRqGzQZwAXGmwaQgFJ8cskamSxlY2C1t4ld3',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCq22PAOj0R1YTr1O-EC4p76p4EoOl16sC3OZy5eNz6u_BPqWB-K54BNZ69O156ckYfgx_Ipm0e1eA02CzmbLCOH9YuTgXV0YWtbrmYyVbWAfMz3IRx1eroleA6GRGoVfw8mYM459NW0qwYUJI0Ik6xrUEgI-VsxGrBwiTbLfUT9i8z3bD9wKpagTPuy5ei24wqMsJu9Hn4IWpgRajHR1CBf3tiKjAmRR9HEX5-Fkb1V86S-HmrNiq-oVdJKUt_c5qVRJehfTosdz_H',
    ],
    isFeatured: true,
    architecturalStyle: 'Contemporary Geometric Terraces',
    description:
      'Engineered for flexible modern living within the gated enclave of Vision City in Gacuhiro. Multi-level terraced layout with bespoke European cabinetry, high ceilings, private courtyard garden, and 24/7 biometric estate security.',
    highlights: [
      'Pristine community infrastructure with underground utility lines',
      'Fiber-optic connectivity and backup solar inverter',
      'Walkable access to tennis courts and communal parklands',
      'High rental demand among multinational executives',
    ],
    zoning: 'R2 - Medium Density Planned Community',
    estimatedRentalYield: '10.5% gross annual yield ($3,800/mo)',
    yearBuilt: 2023,
    parkingSpaces: 2,
    lotSize: '620 sqm',
    architect: 'Ultimate Developers Ltd & Atelier Dany',
  },
  {
    id: 'hilltop-retreat',
    title: 'Hilltop Retreat',
    neighborhood: 'Rebero',
    location: 'Rebero, Rwanda',
    price: 1200000,
    priceDisplay: '$1,200,000',
    propertyType: 'Architectural Estate',
    beds: 6,
    baths: 5,
    sqft: 6500,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDWkgzghzdmuld-W3wMbZ_o3gMjuSVvKU_KDM1BetkI5EiSEn9m-ZIn8m5c_cdDlT72YYrWmdnqZ-1kw9fFqimJEHeAwXyzHxwGkoHrdJ7V_GI4WBD6EXQedHE8qtdoXzjysdXg7kFbINO4ori8TOxHsvXitR1uR9X0huLLDH1nJFTkv5j2iDovGKnb4yxoO99CSrWrHb5NQYlzrQWjNJjpAzbhTy_7OEvvzDqJ-VfQjI4wLEQM1Uk--sdR5dJmRvMBpQePPjcqLskJ',
    gallery: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDWkgzghzdmuld-W3wMbZ_o3gMjuSVvKU_KDM1BetkI5EiSEn9m-ZIn8m5c_cdDlT72YYrWmdnqZ-1kw9fFqimJEHeAwXyzHxwGkoHrdJ7V_GI4WBD6EXQedHE8qtdoXzjysdXg7kFbINO4ori8TOxHsvXitR1uR9X0huLLDH1nJFTkv5j2iDovGKnb4yxoO99CSrWrHb5NQYlzrQWjNJjpAzbhTy_7OEvvzDqJ-VfQjI4wLEQM1Uk--sdR5dJmRvMBpQePPjcqLskJ',
      HERO_IMAGE,
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD2EM6jH0Hi1NNiDmQIIP7GwWjjAnOhldBUxbD_AnJYGN7d6tAG_KolV9u8fdOoQWCOklPneDd8SjID4_QjUr3A9gp1tyYCerCF5FRP31JbAXi1mijntzH2Ksv3t0gNhfLi45GWVXE8h_PFfLUGF0eh8teau-IlMEp_KNbWUb5t2ps-PlmrXgHiBKJKSAsJuUFmykwqUxO6Kj_0au1is72yYFknZnP5iOZyE-1ntZvw6JMiAbln8b0o4PYREBf5-zE6aYXV_dt5uSFW',
    ],
    isFeatured: true,
    architecturalStyle: 'Earthy Hillside Pavilion & Sustainable Timber',
    description:
      'Dominating the summit of Rebero hill with 360-degree vistas across the thousand hills and Kigali downtown skyline. Mastercrafted using locally quarried slate, plantation eucalyptus timber framing, and expansive green roof systems that harmonize with Rwandan topography.',
    highlights: [
      '360° unobstructed city and rolling mountain panorama',
      'Wine cellar carved into natural basalt bedrock',
      'Infinity edge ozone-treated pool',
      'Extensive terraced indigenous fruit and floral gardens',
      'Dedicated wellness wing with sauna and steam spa',
    ],
    zoning: 'R1 - Hilltop Low Density Conservation',
    estimatedRentalYield: '8.9% gross annual yield ($9,200/mo)',
    yearBuilt: 2024,
    parkingSpaces: 6,
    lotSize: '2,800 sqm',
    architect: 'Kigali Hilltop Master Architects',
  },
  {
    id: 'zen-pavilion',
    title: 'The Zen Pavilion',
    neighborhood: 'Kiyovu',
    location: 'Kiyovu, Rwanda',
    price: 960000,
    priceDisplay: '$960,000',
    propertyType: 'Villa',
    beds: 4,
    baths: 4,
    sqft: 4800,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD2EM6jH0Hi1NNiDmQIIP7GwWjjAnOhldBUxbD_AnJYGN7d6tAG_KolV9u8fdOoQWCOklPneDd8SjID4_QjUr3A9gp1tyYCerCF5FRP31JbAXi1mijntzH2Ksv3t0gNhfLi45GWVXE8h_PFfLUGF0eh8teau-IlMEp_KNbWUb5t2ps-PlmrXgHiBKJKSAsJuUFmykwqUxO6Kj_0au1is72yYFknZnP5iOZyE-1ntZvw6JMiAbln8b0o4PYREBf5-zE6aYXV_dt5uSFW',
    gallery: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD2EM6jH0Hi1NNiDmQIIP7GwWjjAnOhldBUxbD_AnJYGN7d6tAG_KolV9u8fdOoQWCOklPneDd8SjID4_QjUr3A9gp1tyYCerCF5FRP31JbAXi1mijntzH2Ksv3t0gNhfLi45GWVXE8h_PFfLUGF0eh8teau-IlMEp_KNbWUb5t2ps-PlmrXgHiBKJKSAsJuUFmykwqUxO6Kj_0au1is72yYFknZnP5iOZyE-1ntZvw6JMiAbln8b0o4PYREBf5-zE6aYXV_dt5uSFW',
      HERO_IMAGE,
    ],
    badge: 'SMART MATCH TOP PICK',
    matchScore: 98,
    matchReason:
      'Matches your preference for open-concept floor plans and sustainable materials.',
    architecturalStyle: 'Japanese-Rwandan Wabi-Sabi Fusion',
    description:
      'Located in quiet, leafy Old Kiyovu just minutes from prime embassies and luxury boutique bistros. Designed around an internal reflecting pool and central courtyard with cedar louvers that filter natural equatorial sunlight.',
    highlights: [
      'Floor-to-ceiling glass sliding partitions for indoor-outdoor flow',
      'Zero-VOC certified natural clay plaster and volcanic stone tiles',
      'Central Zen courtyard garden with reflective waterfall',
      'High-security embassy quarter perimeter',
    ],
    zoning: 'R1 - Kiyovu Residential Heritage & Luxury',
    estimatedRentalYield: '9.2% gross annual yield ($7,500/mo)',
    yearBuilt: 2024,
    parkingSpaces: 3,
    lotSize: '1,200 sqm',
    architect: 'Studio Emma Umutoni',
  },
  {
    id: 'sky-terrace-penthouse',
    title: 'Sky Terrace Penthouse',
    neighborhood: 'Kimihurura',
    location: 'Kimihurura, Rwanda',
    price: 680000,
    priceDisplay: '$680,000',
    propertyType: 'Penthouse',
    beds: 3,
    baths: 3,
    sqft: 3100,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCq22PAOj0R1YTr1O-EC4p76p4EoOl16sC3OZy5eNz6u_BPqWB-K54BNZ69O156ckYfgx_Ipm0e1eA02CzmbLCOH9YuTgXV0YWtbrmYyVbWAfMz3IRx1eroleA6GRGoVfw8mYM459NW0qwYUJI0Ik6xrUEgI-VsxGrBwiTbLfUT9i8z3bD9wKpagTPuy5ei24wqMsJu9Hn4IWpgRajHR1CBf3tiKjAmRR9HEX5-Fkb1V86S-HmrNiq-oVdJKUt_c5qVRJehfTosdz_H',
    gallery: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCq22PAOj0R1YTr1O-EC4p76p4EoOl16sC3OZy5eNz6u_BPqWB-K54BNZ69O156ckYfgx_Ipm0e1eA02CzmbLCOH9YuTgXV0YWtbrmYyVbWAfMz3IRx1eroleA6GRGoVfw8mYM459NW0qwYUJI0Ik6xrUEgI-VsxGrBwiTbLfUT9i8z3bD9wKpagTPuy5ei24wqMsJu9Hn4IWpgRajHR1CBf3tiKjAmRR9HEX5-Fkb1V86S-HmrNiq-oVdJKUt_c5qVRJehfTosdz_H',
      HERO_IMAGE,
    ],
    badge: 'HIGH-YIELD ASSET',
    matchScore: 94,
    matchReason:
      'Ideal for your search for high-yield investment properties in the city center.',
    architecturalStyle: 'High-Altitude Urban Modernism',
    description:
      'Hovering over Kimihurura’s culinary and diplomatic corridor, this top-floor duplex penthouse offers private elevator access and a 140 sqm wraparound terrace capturing the iconic illuminated dome of the Kigali Convention Centre at night.',
    highlights: [
      'Private rooftop hot tub overlooking the Convention Centre dome',
      'Direct elevator foyer with coded biometric access',
      'High-yield executive rental track record with UN & corporate tenants',
      'Dual designer kitchens: showcase chef bar & prep kitchen',
    ],
    zoning: 'C2 - Commercial Mixed Urban Corridor',
    estimatedRentalYield: '11.8% gross annual yield ($6,500/mo)',
    yearBuilt: 2023,
    parkingSpaces: 2,
    lotSize: '310 sqm floorplate',
    architect: 'Atelier Dany Mugisha Partners',
  },
  {
    id: 'kacyiru-glass-sanctuary',
    title: 'Kacyiru Glass Sanctuary',
    neighborhood: 'Kacyiru',
    location: 'Kacyiru, Rwanda',
    price: 1450000,
    priceDisplay: '$1,450,000',
    propertyType: 'Architectural Estate',
    beds: 5,
    baths: 6,
    sqft: 5600,
    image: HERO_IMAGE,
    gallery: [
      HERO_IMAGE,
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCUOhQL5jMcnbiwfsVMXu8wIJrtacsGdJmCc1cVFy-nc_HWacnpWp2iUct98HbBPMxx8L1q4FMktUDRKj-xLjvUUWWthqFE01CvpXMaLykGys6PXkk3HF7YtjM4Xp3GLOqJ0DWMvIMEfpsSOu0KunGp2lFZNnBY2hkLxxD67Q-S9__t5UCr3vnDLpVSt-8X9oq4UJvHy92eSyWm_NaDWL0oJsabAD117CG7-UQEZY4ouFRHLOGZh0WUaKHDyiVviz-lH40WEzrBIl4H',
    ],
    isFeatured: false,
    architecturalStyle: 'Modernist Cantilever Villa',
    description:
      'An iconic architectural residence in Kacyiru’s ministerial district. Features dual cantilevered glass volumes, cascading tropical landscaping, a saltwater pool, and expansive entertainment decks with views toward Mount Kigali.',
    highlights: [
      'Cantilevered architectural wings with triple-glazed glass',
      'Full subterranean backup solar storage and generator array',
      'Commercial grade kitchen with Gaggenau appliances',
      'Separate diplomatic guest lodge',
    ],
    zoning: 'R1A - Prime Ministerial & Residential',
    estimatedRentalYield: '9.0% gross annual yield ($10,500/mo)',
    yearBuilt: 2024,
    parkingSpaces: 5,
    lotSize: '1,800 sqm',
    architect: 'Emma Umutoni Studio',
  },
];

export const DISTRICTS = [
  'All Districts',
  'Nyarutarama',
  'Gacuhiro',
  'Rebero',
  'Kiyovu',
  'Kimihurura',
  'Kacyiru',
];

export const PROPERTY_TYPES = [
  'All Types',
  'Villa',
  'Duplex',
  'Penthouse',
  'Architectural Estate',
];

export const PRICE_RANGES = [
  { label: 'All Price Ranges', min: 0, max: 10000000 },
  { label: '$200k - $500k', min: 200000, max: 500000 },
  { label: '$500k - $1M', min: 500000, max: 1000000 },
  { label: '$1M+', min: 1000000, max: 10000000 },
];
