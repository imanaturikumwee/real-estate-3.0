import React from 'react';
import { Property } from '../types';
import { PropertySearchExplorer } from './PropertySearchExplorer';

interface PropertiesScreenProps {
  properties: Property[];
  onSelectProperty: (property: Property) => void;
  onBookTour: (property: Property) => void;
  initialFilters?: { location?: string; priceRange?: string; propertyType?: string };
  onNavigate?: (screen: any) => void;
  onOpenConsultation?: () => void;
  isHeaderNavHidden?: boolean;
  onToggleHeaderNav?: () => void;
}

export const PropertiesScreen: React.FC<PropertiesScreenProps> = ({
  onSelectProperty,
  onBookTour,
  initialFilters,
  onNavigate,
  onOpenConsultation,
  isHeaderNavHidden,
  onToggleHeaderNav,
}) => {
  return (
    <PropertySearchExplorer
      initialDistrict={initialFilters?.location}
      initialType={initialFilters?.propertyType}
      initialPriceRange={initialFilters?.priceRange}
      onSelectProperty={onSelectProperty}
      onBookTour={onBookTour}
      onNavigate={onNavigate}
      onOpenConsultation={onOpenConsultation}
      isHeaderNavHidden={isHeaderNavHidden}
      onToggleHeaderNav={onToggleHeaderNav}
    />
  );
};
