import { Property } from '../types';

export const HERO_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDcrj7BhiOC43OIwgUjrbO98kUY71phal0YovGq7UA3RLC0MNY7wgNngsUXucPDIWb0eYnp96lsPpDF0x5awXZrYB5ExUpsP_KFXcBvcRfyvLO9U-u4qdsiceJnj-wcM5l-7TCy2AaQro_bgClmiM23eKQk8zny3A256IUtKtUqseup6d3yxATov_gdW6hW5Zm4812k0sX3kvEl8lWIc4ZARP1UHal--OjYlS-gbDXSTvv65xoqC0686gzFQ4ZAgWFTs3PDee91OgN0';

export const CTA_TEXTURE_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBNL21SMFOnVZ6ae_YzGqRQF9bgAFocU8hotgpFDOI9Sf-iD9XaT8Sk9ZEq3CHdIE9yM5oeuhTrDCHZVYDr6hSfJSi8vvHQ_f_RK_RzXc3IM0d9reG36Ez9VAMruRHPrQzomUiIbZGKMxXzou_J8oWpXAol7hs3vv5MoJ_5E3Q-zi7bISIr7zIwRc33z9uqclvDzH3bxZNlSCkNbohQOoPynW0M8hdTO-b8cgMkQDYOz5Tr_ZrH086l1WLICgM7LCvDQrFQqYfkM8tL';

export const ADVISOR_DANY_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCtjmMQOY5sAAxNgQYW5ltoLNUo1kLKAdH1c6IzmD9AwmUbfTRMsN9e_K3Ft0MJTY8nv7PaPxe8ISn0cMPArCETMKbk7kdxSjiWPkeFVE2hAQ_ObZCyfzHuthpgvn5BnbSHTXLdSziG0EtQBiP3C8UMktBKjS7HTmvcziBajKSlA_9eraozrZiTDwCSD76913-r21ISJUQGLm45TbCKUatMhvrRAjHTg3eDWVw-Lyxgzr7ZA0zjy36EQ5xclzAjsdeTXyJ-V01YasjL';

export const KIGALI_MAP_BG =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCwBCag5bCWq2zgsfHpN1EVm7ZdRf9to52kXtfdPzw2ymeCaJZ8WQO8-FmTzkF8z74_6m2yrm7l-o8IU_HVk78zKvDdjyWvGLCWlA9Zt8zcMp6bB4CoqQrCtwWjBAunWwQMYoA9fMkOhOUO2IWux4NJ9g84s_M-PHHx_G_sTl-NiKgBsh_cY86iPuivNnpi1fmEjDvnId9jMuW-W5L4s40dzWG_Ure-oZHNdi825NDmahIZ-E2E_f0WO588U8oFa0pzayf4fyzXl15k';

export const USER_PORTRAIT_AVATAR =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBkEYBwQdj22uzsG5xbR3We4YJZjZF6C47WsA6IMz3nbLXib7u4n0RqYNrxFMsmt7KIu2Ku_asEMadxy9RRyQ5uGfyxLcFABKFUWw4V300uKhZ5oEEUMEcqb34FrrV1ZVVQaME6bqx1dlyKAAizARTiz4uuB0i87vBkoHiRMVNKHCgahb0CvkVGnqYKgxyi9ljDDCmAIzeJThGQGXd1x5y02i8EcwMCdXLUn_IImh5Em-18pMI1JqENAiX4isBIMxLIA1JFgZhczvOk';

export const PROPERTIES: Property[] = [
  {
    id: 'horizon-residence',
    title: 'The Horizon Residence',
    neighborhood: 'Nyarutarama',
    location: 'Nyarutarama, Kigali',
    price: 850000,
    priceDisplay: '$850,000',
    rwfPriceDisplay: '45M RWF',
    propertyType: 'Villa',
    beds: 4,
    baths: 3,
    sqft: 3450,
    areaM2: 320,
    rating: 9.2,
    badge: 'Premium',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAiD5Sf302m49Cgl-HKJ79zbgX_vYXr14YiY-2H3w1VccGCbknMc7gsPFVsvebvnaikmFIG90qJYlxf5cweT_l07hr1Ks94IrIQDYBSVfly_gNdV5KkXfm8s6U0r9VUx5kNCOqfIkPuwwCCctJqszViRLSBD-TqllsHp4q-8YjDHRVnAJl-fbU9obyTN9vslCKCvAy5sDSQOoAYZ4tcgi7C5EQoHF6dHHUSCCfGb2ImYaiwBT0Jjq1dEHcc9D628oT78YCPzen7-Yaq',
    gallery: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAiD5Sf302m49Cgl-HKJ79zbgX_vYXr14YiY-2H3w1VccGCbknMc7gsPFVsvebvnaikmFIG90qJYlxf5cweT_l07hr1Ks94IrIQDYBSVfly_gNdV5KkXfm8s6U0r9VUx5kNCOqfIkPuwwCCctJqszViRLSBD-TqllsHp4q-8YjDHRVnAJl-fbU9obyTN9vslCKCvAy5sDSQOoAYZ4tcgi7C5EQoHF6dHHUSCCfGb2ImYaiwBT0Jjq1dEHcc9D628oT78YCPzen7-Yaq',
      HERO_IMAGE,
    ],
    isFeatured: true,
    architecturalStyle: 'Contemporary Scandinavian-Rwandan Villa',
    description:
      'Masterfully positioned in prime Nyarutarama overlooking Kigali Golf Club. Features triple-pane floor-to-ceiling glass facades, custom hardwood louvers, heated pool, and private landscaped courtyard.',
    highlights: [
      'Walking distance to Kigali Golf Club and diplomatic residences',
      'Solar-integrated backup with dual Tesla powerwalls',
      'Italian porcelain tiles & Musanze volcanic stone cladding',
      '24/7 security patrol with smart biometric entry',
    ],
    zoning: 'R1A - Low Density Prime Residential',
    estimatedRentalYield: '10.2% annual yield (4.2M RWF/mo)',
    yearBuilt: 2024,
    parkingSpaces: 4,
    lotSize: '1,200 sqm',
    architect: 'Emma Umutoni Studio',
    coordinates: { lat: -1.9368, lng: 30.0988 },
    mapPin: { top: '38%', left: '42%', label: '45M' },
    transitInfo: {
      destination: 'Nyarutarama Business Hub',
      walkingMins: 12,
      drivingMins: 4,
    },
  },
  {
    id: 'kivubelt-terraces',
    title: 'Kivubelt Terraces',
    neighborhood: 'Kibagabaga',
    location: 'Kibagabaga, Kigali',
    price: 620000,
    priceDisplay: '$620,000',
    rwfPriceDisplay: '32M RWF',
    propertyType: 'Duplex',
    beds: 3,
    baths: 2,
    sqft: 2260,
    areaM2: 210,
    rating: 8.8,
    badge: 'New Build',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA3c7xi4yWp-mUwDymmU9GsMcopSAfVtpXn2GdlW9qSNfVOwCN_J0CSzti3O2MVU8_1YQIzGG4_Ppuw8BZ9ncyUv9c_4ui885INoTF_1unkGcidonAAarpRbx9akUp2fSt-G7UBJNnjg95XVkRyoB3U7ObNOZk08c1lxAmm6k1DbtlpZUzFjrqX9enYM-X_XpDYTroRUWj0hkCubWyaLt3dwECeyn6Qkc11Ub8Z6yL1WllnO2yhZ7wwaZXiNLqA6bLObjGstvrGEXk2',
    gallery: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA3c7xi4yWp-mUwDymmU9GsMcopSAfVtpXn2GdlW9qSNfVOwCN_J0CSzti3O2MVU8_1YQIzGG4_Ppuw8BZ9ncyUv9c_4ui885INoTF_1unkGcidonAAarpRbx9akUp2fSt-G7UBJNnjg95XVkRyoB3U7ObNOZk08c1lxAmm6k1DbtlpZUzFjrqX9enYM-X_XpDYTroRUWj0hkCubWyaLt3dwECeyn6Qkc11Ub8Z6yL1WllnO2yhZ7wwaZXiNLqA6bLObjGstvrGEXk2',
      HERO_IMAGE,
    ],
    isFeatured: true,
    architecturalStyle: 'Modern Terraced Hillside Townhome',
    description:
      'Perched on the rising ridgeline of Kibagabaga with panoramic views of the Kimironko valley. Open-concept double-height living room with private garden terrace and rooftop sunset pavilion.',
    highlights: [
      'Expansive rooftop entertainment deck with city lights panorama',
      'Ultra-efficient passive ventilation design',
      'Dedicated domestic staff quarters and covered carport',
      'High rental yield with international tech professionals',
    ],
    zoning: 'R2 - Medium Density Planned Community',
    estimatedRentalYield: '11.5% annual yield (3.1M RWF/mo)',
    yearBuilt: 2024,
    parkingSpaces: 2,
    lotSize: '650 sqm',
    architect: 'Atelier Dany Mugisha',
    coordinates: { lat: -1.9312, lng: 30.1245 },
    mapPin: { top: '48%', left: '68%', label: '32M' },
    transitInfo: {
      destination: 'Kigali Convention Centre',
      walkingMins: 22,
      drivingMins: 7,
    },
  },
  {
    id: 'nyarutarama-heights',
    title: 'Nyarutarama Heights',
    neighborhood: 'Nyarutarama',
    location: 'Nyarutarama, Kigali',
    price: 850000,
    priceDisplay: '$850,000',
    rwfPriceDisplay: '52M RWF',
    propertyType: 'Villa',
    beds: 5,
    baths: 4,
    sqft: 4200,
    areaM2: 390,
    rating: 9.6,
    badge: 'Premium Listing',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCUOhQL5jMcnbiwfsVMXu8wIJrtacsGdJmCc1cVFy-nc_HWacnpWp2iUct98HbBPMxx8L1q4FMktUDRKj-xLjvUUWWthqFE01CvpXMaLykGys6PXkk3HF7YtjM4Xp3GLOqJ0DWMvIMEfpsSOu0KunGp2lFZNnBY2hkLxxD67Q-S9__t5UCr3vnDLpVSt-8X9oq4UJvHy92eSyWm_NaDWL0oJsabAD117CG7-UQEZY4ouFRHLOGZh0WUaKHDyiVviz-lH40WEzrBIl4H',
    gallery: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCUOhQL5jMcnbiwfsVMXu8wIJrtacsGdJmCc1cVFy-nc_HWacnpWp2iUct98HbBPMxx8L1q4FMktUDRKj-xLjvUUWWthqFE01CvpXMaLykGys6PXkk3HF7YtjM4Xp3GLOqJ0DWMvIMEfpsSOu0KunGp2lFZNnBY2hkLxxD67Q-S9__t5UCr3vnDLpVSt-8X9oq4UJvHy92eSyWm_NaDWL0oJsabAD117CG7-UQEZY4ouFRHLOGZh0WUaKHDyiVviz-lH40WEzrBIl4H',
      HERO_IMAGE,
    ],
    isFeatured: true,
    architecturalStyle: 'Modern Minimalist Villa with Infinity Pool',
    description:
      'Perched prominently in diplomatic Nyarutarama, this modernist residence combines expansive glass curtain walls with local Musanze volcanic basalt detailing.',
    highlights: [
      'Direct panoramic vistas of Kigali Golf Course',
      'Heated infinity pool with cantilevered sun deck',
      'Smart home automation and integrated greywater filtration',
      'Staff quarters with separate service entry',
    ],
    zoning: 'R1A - Low Density Prime Residential',
    estimatedRentalYield: '9.8% gross annual yield ($7,000/mo)',
    yearBuilt: 2024,
    parkingSpaces: 4,
    lotSize: '1,450 sqm',
    architect: 'Emma Umutoni Studio + Kigali Urban Design',
    coordinates: { lat: -1.9345, lng: 30.1032 },
    mapPin: { top: '34%', left: '46%', label: '52M' },
    transitInfo: {
      destination: 'Kigali Golf Club',
      walkingMins: 5,
      drivingMins: 2,
    },
  },
  {
    id: 'vision-city-duplex',
    title: 'Vision City Duplex',
    neighborhood: 'Gacuhiro',
    location: 'Gacuhiro, Rwanda',
    price: 425000,
    priceDisplay: '$425,000',
    rwfPriceDisplay: '28M RWF',
    propertyType: 'Duplex',
    beds: 3,
    baths: 3,
    sqft: 2800,
    areaM2: 260,
    rating: 8.9,
    badge: 'Popular',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCFkv3aTYakD1H_X4UZmHAQ5ymG4msN8PxppnuxoNIyM3Iq8YJizoq9rSlR2zjlhTaYG9uHx-1qsuWLxwKSkI5e5TCsvPC2Kyj_3vYDvJaaTCzmHMai8RP6iBQqrnPVZF5CwVYychiNEUsyu4kduW_zRpk7KtOY6_-d0TLSnBAS3JyGoq-cYsRUvvNRY3ckapXE8R7RdcSvG2ZOQ90NmEjUkBY7JSnaxbMyx35BLy04aRqGzQZwAXGmwaQgFJ8cskamSxlY2C1t4ld3',
    gallery: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCFkv3aTYakD1H_X4UZmHAQ5ymG4msN8PxppnuxoNIyM3Iq8YJizoq9rSlR2zjlhTaYG9uHx-1qsuWLxwKSkI5e5TCsvPC2Kyj_3vYDvJaaTCzmHMai8RP6iBQqrnPVZF5CwVYychiNEUsyu4kduW_zRpk7KtOY6_-d0TLSnBAS3JyGoq-cYsRUvvNRY3ckapXE8R7RdcSvG2ZOQ90NmEjUkBY7JSnaxbMyx35BLy04aRqGzQZwAXGmwaQgFJ8cskamSxlY2C1t4ld3',
    ],
    isFeatured: true,
    architecturalStyle: 'Contemporary Geometric Terraces',
    description:
      'Engineered for flexible modern living within the gated enclave of Vision City in Gacuhiro. Multi-level terraced layout with bespoke European cabinetry.',
    highlights: [
      'Pristine community infrastructure with underground utility lines',
      'Fiber-optic connectivity and backup solar inverter',
      'Walkable access to tennis courts and communal parklands',
    ],
    zoning: 'R2 - Medium Density Planned Community',
    estimatedRentalYield: '10.5% gross annual yield ($3,800/mo)',
    yearBuilt: 2023,
    parkingSpaces: 2,
    lotSize: '620 sqm',
    architect: 'Ultimate Developers Ltd & Atelier Dany',
    coordinates: { lat: -1.9215, lng: 30.0918 },
    mapPin: { top: '25%', left: '60%', label: '28M' },
    transitInfo: {
      destination: 'Vision City Hub',
      walkingMins: 8,
      drivingMins: 3,
    },
  },
  {
    id: 'hilltop-retreat',
    title: 'Hilltop Retreat',
    neighborhood: 'Rebero',
    location: 'Rebero, Rwanda',
    price: 1200000,
    priceDisplay: '$1,200,000',
    rwfPriceDisplay: '68M RWF',
    propertyType: 'Architectural Estate',
    beds: 6,
    baths: 5,
    sqft: 6500,
    areaM2: 600,
    rating: 9.8,
    badge: 'Exclusive',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDWkgzghzdmuld-W3wMbZ_o3gMjuSVvKU_KDM1BetkI5EiSEn9m-ZIn8m5c_cdDlT72YYrWmdnqZ-1kw9fFqimJEHeAwXyzHxwGkoHrdJ7V_GI4WBD6EXQedHE8qtdoXzjysdXg7kFbINO4ori8TOxHsvXitR1uR9X0huLLDH1nJFTkv5j2iDovGKnb4yxoO99CSrWrHb5NQYlzrQWjNJjpAzbhTy_7OEvvzDqJ-VfQjI4wLEQM1Uk--sdR5dJmRvMBpQePPjcqLskJ',
    gallery: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDWkgzghzdmuld-W3wMbZ_o3gMjuSVvKU_KDM1BetkI5EiSEn9m-ZIn8m5c_cdDlT72YYrWmdnqZ-1kw9fFqimJEHeAwXyzHxwGkoHrdJ7V_GI4WBD6EXQedHE8qtdoXzjysdXg7kFbINO4ori8TOxHsvXitR1uR9X0huLLDH1nJFTkv5j2iDovGKnb4yxoO99CSrWrHb5NQYlzrQWjNJjpAzbhTy_7OEvvzDqJ-VfQjI4wLEQM1Uk--sdR5dJmRvMBpQePPjcqLskJ',
    ],
    isFeatured: true,
    architecturalStyle: 'Earthy Hillside Pavilion & Sustainable Timber',
    description:
      'Dominating the summit of Rebero hill with 360-degree vistas across the thousand hills and Kigali downtown skyline.',
    highlights: [
      '360° unobstructed city and rolling mountain panorama',
      'Wine cellar carved into natural basalt bedrock',
      'Infinity edge ozone-treated pool',
    ],
    zoning: 'R1 - Hilltop Low Density Conservation',
    estimatedRentalYield: '8.9% gross annual yield ($9,200/mo)',
    yearBuilt: 2024,
    parkingSpaces: 6,
    lotSize: '2,800 sqm',
    architect: 'Kigali Hilltop Master Architects',
    coordinates: { lat: -1.9875, lng: 30.0822 },
    mapPin: { top: '65%', left: '35%', label: '68M' },
    transitInfo: {
      destination: 'Kigali Financial District',
      walkingMins: 35,
      drivingMins: 11,
    },
  },
  {
    id: 'zen-pavilion',
    title: 'The Zen Pavilion',
    neighborhood: 'Kiyovu',
    location: 'Kiyovu, Rwanda',
    price: 960000,
    priceDisplay: '$960,000',
    rwfPriceDisplay: '58M RWF',
    propertyType: 'Villa',
    beds: 4,
    baths: 4,
    sqft: 4800,
    areaM2: 445,
    rating: 9.7,
    badge: 'Smart Match Top Pick',
    matchScore: 98,
    matchReason:
      'Matches your preference for open-concept floor plans and sustainable materials.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD2EM6jH0Hi1NNiDmQIIP7GwWjjAnOhldBUxbD_AnJYGN7d6tAG_KolV9u8fdOoQWCOklPneDd8SjID4_QjUr3A9gp1tyYCerCF5FRP31JbAXi1mijntzH2Ksv3t0gNhfLi45GWVXE8h_PFfLUGF0eh8teau-IlMEp_KNbWUb5t2ps-PlmrXgHiBKJKSAsJuUFmykwqUxO6Kj_0au1is72yYFknZnP5iOZyE-1ntZvw6JMiAbln8b0o4PYREBf5-zE6aYXV_dt5uSFW',
    gallery: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD2EM6jH0Hi1NNiDmQIIP7GwWjjAnOhldBUxbD_AnJYGN7d6tAG_KolV9u8fdOoQWCOklPneDd8SjID4_QjUr3A9gp1tyYCerCF5FRP31JbAXi1mijntzH2Ksv3t0gNhfLi45GWVXE8h_PFfLUGF0eh8teau-IlMEp_KNbWUb5t2ps-PlmrXgHiBKJKSAsJuUFmykwqUxO6Kj_0au1is72yYFknZnP5iOZyE-1ntZvw6JMiAbln8b0o4PYREBf5-zE6aYXV_dt5uSFW',
    ],
    architecturalStyle: 'Japanese-Rwandan Wabi-Sabi Fusion',
    description:
      'Located in quiet Old Kiyovu near embassies. Designed around an internal reflecting pool and central courtyard.',
    highlights: [
      'Floor-to-ceiling glass sliding partitions for indoor-outdoor flow',
      'Zero-VOC certified natural clay plaster and volcanic stone tiles',
      'High-security embassy quarter perimeter',
    ],
    zoning: 'R1 - Kiyovu Residential Heritage & Luxury',
    estimatedRentalYield: '9.2% gross annual yield ($7,500/mo)',
    yearBuilt: 2024,
    parkingSpaces: 3,
    lotSize: '1,200 sqm',
    architect: 'Studio Emma Umutoni',
    coordinates: { lat: -1.9562, lng: 30.0635 },
    mapPin: { top: '42%', left: '32%', label: '58M' },
    transitInfo: {
      destination: 'Downtown Kigali',
      walkingMins: 10,
      drivingMins: 3,
    },
  },
  {
    id: 'sky-terrace-penthouse',
    title: 'Sky Terrace Penthouse',
    neighborhood: 'Kimihurura',
    location: 'Kimihurura, Rwanda',
    price: 680000,
    priceDisplay: '$680,000',
    rwfPriceDisplay: '39M RWF',
    propertyType: 'Penthouse',
    beds: 3,
    baths: 3,
    sqft: 3100,
    areaM2: 290,
    rating: 9.4,
    badge: 'High-Yield Asset',
    matchScore: 94,
    matchReason:
      'Ideal for your search for high-yield investment properties in the city center.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCq22PAOj0R1YTr1O-EC4p76p4EoOl16sC3OZy5eNz6u_BPqWB-K54BNZ69O156ckYfgx_Ipm0e1eA02CzmbLCOH9YuTgXV0YWtbrmYyVbWAfMz3IRx1eroleA6GRGoVfw8mYM459NW0qwYUJI0Ik6xrUEgI-VsxGrBwiTbLfUT9i8z3bD9wKpagTPuy5ei24wqMsJu9Hn4IWpgRajHR1CBf3tiKjAmRR9HEX5-Fkb1V86S-HmrNiq-oVdJKUt_c5qVRJehfTosdz_H',
    gallery: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCq22PAOj0R1YTr1O-EC4p76p4EoOl16sC3OZy5eNz6u_BPqWB-K54BNZ69O156ckYfgx_Ipm0e1eA02CzmbLCOH9YuTgXV0YWtbrmYyVbWAfMz3IRx1eroleA6GRGoVfw8mYM459NW0qwYUJI0Ik6xrUEgI-VsxGrBwiTbLfUT9i8z3bD9wKpagTPuy5ei24wqMsJu9Hn4IWpgRajHR1CBf3tiKjAmRR9HEX5-Fkb1V86S-HmrNiq-oVdJKUt_c5qVRJehfTosdz_H',
    ],
    architecturalStyle: 'High-Altitude Urban Modernism',
    description:
      'Hovering over Kimihurura’s culinary and diplomatic corridor with wraparound terrace capturing the illuminated Convention Centre.',
    highlights: [
      'Private rooftop hot tub overlooking the Convention Centre dome',
      'Direct elevator foyer with coded biometric access',
      'High-yield executive rental track record with UN & corporate tenants',
    ],
    zoning: 'C2 - Commercial Mixed Urban Corridor',
    estimatedRentalYield: '11.8% gross annual yield ($6,500/mo)',
    yearBuilt: 2023,
    parkingSpaces: 2,
    lotSize: '310 sqm floorplate',
    architect: 'Atelier Dany Mugisha Partners',
    coordinates: { lat: -1.9535, lng: 30.0838 },
    mapPin: { top: '55%', left: '55%', label: '39M' },
    transitInfo: {
      destination: 'Kigali Convention Centre',
      walkingMins: 7,
      drivingMins: 2,
    },
  },
];

export const DISTRICTS = [
  'All Districts',
  'Nyarutarama',
  'Kibagabaga',
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
