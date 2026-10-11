export type PropertyType = 'Villa' | 'Duplex' | 'Penthouse' | 'Architectural Estate';

export interface Property {
  id: string;
  title: string;
  neighborhood: string;
  location: string;
  price: number;
  priceDisplay: string;
  rwfPriceDisplay?: string;
  propertyType: PropertyType;
  beds: number;
  baths: number;
  sqft: number;
  areaM2?: number;
  image: string;
  gallery: string[];
  badge?: string;
  rating?: number;
  isFeatured?: boolean;
  matchScore?: number;
  matchReason?: string;
  architecturalStyle: string;
  description: string;
  highlights: string[];
  zoning: string;
  estimatedRentalYield: string;
  yearBuilt: number;
  parkingSpaces: number;
  lotSize: string;
  architect?: string;
  mapPin?: {
    top: string;
    left: string;
    label: string;
  };
  transitInfo?: {
    destination: string;
    walkingMins: number;
    drivingMins: number;
  };
  isFavorite?: boolean;
}

export interface ConsultationRequest {
  fullName: string;
  email: string;
  phone: string;
  preferredEstate?: string;
  date?: string;
  notes?: string;
  type: 'Architectural Consultation' | 'Private VIP Tour' | 'Investment Advisory';
}

export type UserRole = 'buyer' | 'tenant' | 'owner' | 'agent' | 'staff';

export type SocialProvider = 'google' | 'apple' | 'github' | 'facebook';

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  provider: 'local' | SocialProvider;
  avatar?: string;
  createdAt?: string;
}

export type ActiveScreen =
  | 'home'
  | 'properties'
  | 'portfolio'
  | 'saved'
  | 'aimatches'
  | 'messages'
  | 'invest'
  | 'about'
  | 'contact'
  | 'signin'
  | 'signup';

