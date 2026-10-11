export type PropertyType = 'Villa' | 'Duplex' | 'Penthouse' | 'Architectural Estate';

export interface Property {
  id: string;
  title: string;
  neighborhood: string;
  location: string;
  price: number;
  priceDisplay: string;
  propertyType: PropertyType;
  beds: number;
  baths: number;
  sqft: number;
  image: string;
  gallery: string[];
  badge?: string;
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

export type ActiveScreen = 'home' | 'properties' | 'invest' | 'about' | 'contact' | 'signin' | 'signup';

