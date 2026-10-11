import React, { useState } from 'react';
import { Property } from '../types';

interface PropertyDetailModalProps {
  property: Property | null;
  onClose: () => void;
  onBookTour: (property: Property) => void;
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  property,
  onClose,
  onBookTour,
}) => {
  if (!property) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [calculatorDownPayment, setCalculatorDownPayment] = useState(20);
  const [copiedLink, setCopiedLink] = useState(false);

  const images = property.gallery?.length ? property.gallery : [property.image];
  const activeImage = images[activeImageIndex] || property.image;

  // Mortgage & Investment calculation
  const downPaymentAmount = (property.price * calculatorDownPayment) / 100;
  const loanAmount = property.price - downPaymentAmount;
  const interestRate = 0.085; // typical international private bank loan rate in USD
  const loanTermYears = 20;
  const monthlyInterestRate = interestRate / 12;
  const totalMonths = loanTermYears * 12;
  const estimatedMonthlyMortgage = Math.round(
    (loanAmount * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, totalMonths))) /
      (Math.pow(1 + monthlyInterestRate, totalMonths) - 1)
  );

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-[#c5c5d3]/30 text-[#191c1d] relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky top action bar */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-[#c5c5d3]/20 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#00236f]">
              {property.neighborhood} · Kigali, Rwanda
            </span>
            <h3 className="font-['Manrope'] text-lg sm:text-xl font-extrabold text-[#191c1d] truncate">
              {property.title}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 text-[#757682] hover:text-[#00236f] hover:bg-[#f3f4f5] rounded-full transition-colors cursor-pointer text-xs flex items-center gap-1"
              title="Share Estate Link"
            >
              <span className="material-symbols-outlined text-lg">
                {copiedLink ? 'done' : 'share'}
              </span>
              <span className="hidden sm:inline font-semibold">
                {copiedLink ? 'Copied' : 'Share'}
              </span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-[#757682] hover:text-[#191c1d] hover:bg-[#f3f4f5] rounded-full transition-colors cursor-pointer"
              aria-label="Close dialog"
            >
              <span className="material-symbols-outlined text-2xl">close</span>
            </button>
          </div>
        </div>

        {/* Hero Gallery Container */}
        <div className="p-6">
          <div className="aspect-[16/9] w-full rounded-xl overflow-hidden bg-[#e1e3e4] relative shadow-inner">
            <img
              src={activeImage}
              alt={property.title}
              className="w-full h-full object-cover transition-all duration-300"
            />
            {property.badge && (
              <span className="absolute top-4 left-4 bg-[#00236f] text-white px-3 py-1 text-[10px] font-['Inter'] uppercase tracking-widest font-bold rounded-sm shadow-md">
                {property.badge}
              </span>
            )}
            <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md text-white px-3.5 py-1.5 rounded-md font-['Manrope'] font-bold text-lg sm:text-xl">
              {property.priceDisplay}
            </div>
          </div>

          {/* Thumbnail switcher if multiple images exist */}
          {images.length > 1 && (
            <div className="flex gap-3 mt-3 overflow-x-auto pb-1">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-20 h-14 rounded-md overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                    activeImageIndex === idx ? 'border-[#00236f] scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Architectural Specifications Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 mt-6 bg-[#f8f9fa] rounded-xl border border-[#c5c5d3]/20">
            <div>
              <span className="block text-[10px] uppercase font-bold tracking-wider text-[#757682]">
                Bedrooms
              </span>
              <span className="text-base font-extrabold text-[#191c1d]">
                {property.beds} Suites
              </span>
            </div>
            <div>
              <span className="block text-[10px] uppercase font-bold tracking-wider text-[#757682]">
                Bathrooms
              </span>
              <span className="text-base font-extrabold text-[#191c1d]">
                {property.baths} Bathrooms
              </span>
            </div>
            <div>
              <span className="block text-[10px] uppercase font-bold tracking-wider text-[#757682]">
                Living Area
              </span>
              <span className="text-base font-extrabold text-[#191c1d]">
                {property.sqft.toLocaleString()} sqft
              </span>
            </div>
            <div>
              <span className="block text-[10px] uppercase font-bold tracking-wider text-[#757682]">
                Lot Footprint
              </span>
              <span className="text-base font-extrabold text-[#191c1d]">
                {property.lotSize}
              </span>
            </div>
          </div>

          {/* Architectural Narrative */}
          <div className="mt-8 space-y-6">
            <div>
              <h4 className="font-['Manrope'] text-lg font-bold text-[#191c1d] mb-2">
                Architectural Statement
              </h4>
              <p className="text-[#444651] text-sm leading-relaxed">
                {property.description}
              </p>
            </div>

            {/* Key Architectural Highlights */}
            <div>
              <h5 className="font-['Manrope'] text-sm font-bold uppercase tracking-wider text-[#191c1d] mb-3">
                Signature Features &amp; Finishes
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {property.highlights.map((h, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs sm:text-sm text-[#444651]">
                    <span className="material-symbols-outlined text-[#00236f] text-base shrink-0 mt-0.5">
                      check_circle
                    </span>
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Masterplan Zoning & Investment Highlights */}
            <div className="p-4 bg-[#f3f4f5] rounded-xl border border-[#c5c5d3]/20 flex flex-col sm:flex-row justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#757682] block">
                  Kigali Masterplan Zoning
                </span>
                <span className="text-xs sm:text-sm font-semibold text-[#191c1d]">
                  {property.zoning}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#757682] block">
                  Estimated Rental Yield
                </span>
                <span className="text-xs sm:text-sm font-bold text-[#00236f]">
                  {property.estimatedRentalYield}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#757682] block">
                  Architecture Studio
                </span>
                <span className="text-xs sm:text-sm font-semibold text-[#191c1d]">
                  {property.architect || 'Emma Umutoni Studio'}
                </span>
              </div>
            </div>

            {/* Mortgage & Acquisition Calculator */}
            <div className="p-5 border border-[#c5c5d3]/30 rounded-xl bg-white shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <h5 className="font-['Manrope'] text-sm font-bold text-[#191c1d]">
                  Acquisition &amp; Financing Overview
                </h5>
                <span className="text-xs font-semibold text-[#00236f]">
                  20-Year Term @ 8.5% p.a.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="text-[#757682] block mb-1">
                    Down Payment: {calculatorDownPayment}% (${downPaymentAmount.toLocaleString()})
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="50"
                    step="5"
                    value={calculatorDownPayment}
                    onChange={(e) => setCalculatorDownPayment(Number(e.target.value))}
                    className="w-full accent-[#00236f]"
                  />
                </div>
                <div className="p-2.5 bg-[#f8f9fa] rounded">
                  <span className="text-[#757682] block text-[10px] uppercase">Financed Balance</span>
                  <span className="font-bold text-sm text-[#191c1d]">${loanAmount.toLocaleString()}</span>
                </div>
                <div className="p-2.5 bg-[#f8f9fa] rounded">
                  <span className="text-[#757682] block text-[10px] uppercase">Est. Monthly Payment</span>
                  <span className="font-bold text-sm text-[#00236f]">${estimatedMonthlyMortgage.toLocaleString()} / mo</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="sticky bottom-0 bg-white/95 backdrop-blur-md px-6 py-4 border-t border-[#c5c5d3]/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <span className="text-[10px] font-bold uppercase text-[#757682] tracking-wider block">
              Investment Price
            </span>
            <span className="font-['Manrope'] text-2xl font-extrabold text-[#00236f]">
              {property.priceDisplay}
            </span>
          </div>

          <div className="flex w-full sm:w-auto gap-3">
            <a
              href={`https://wa.me/250788123456?text=${encodeURIComponent(
                `Hello Dany, I am interested in ${property.title} (${property.priceDisplay}) in ${property.neighborhood}. Could you share the architectural dossier?`
              )}`}
              target="_blank"
              rel="noreferrer"
              className="flex-1 sm:flex-none border border-[#00236f] text-[#00236f] px-5 py-3 rounded-md font-['Manrope'] text-xs font-bold tracking-widest uppercase hover:bg-[#00236f]/5 transition-colors text-center flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">chat</span>
              WhatsApp Dany
            </a>

            <button
              onClick={() => {
                onClose();
                onBookTour(property);
              }}
              className="flex-1 sm:flex-none bg-[#00236f] hover:bg-[#1e3a8a] text-white px-6 py-3 rounded-md font-['Manrope'] text-xs font-bold tracking-widest uppercase transition-all shadow-md active:scale-95 text-center flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">calendar_month</span>
              Book VIP Tour
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
