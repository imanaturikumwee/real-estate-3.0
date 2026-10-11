import React, { useState } from 'react';
import { Property, ConsultationRequest } from '../types';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedProperty?: Property | null;
  properties: Property[];
}

export const ConsultationModal: React.FC<ConsultationModalProps> = ({
  isOpen,
  onClose,
  selectedProperty,
  properties,
}) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState<ConsultationRequest>({
    fullName: '',
    email: '',
    phone: '',
    preferredEstate: selectedProperty ? selectedProperty.title : 'General Portfolio Advisory',
    type: selectedProperty ? 'Private VIP Tour' : 'Architectural Consultation',
    date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    notes: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-[#c5c5d3]/30 text-[#191c1d] relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="bg-[#00236f] text-white px-6 py-5 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#90a8ff] block">
              Emma &amp; Dany · Private Client Desk
            </span>
            <h3 className="font-['Manrope'] text-lg sm:text-xl font-bold">
              {isSubmitted ? 'Consultation Confirmed' : 'Book a Private Consultation'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-full transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>

        {isSubmitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-[#00236f]/10 text-[#00236f] rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="material-symbols-outlined text-3xl">check_circle</span>
            </div>

            <h4 className="font-['Manrope'] text-xl font-bold text-[#191c1d]">
              Murakoze, {formData.fullName}!
            </h4>

            <p className="text-sm text-[#444651] max-w-md mx-auto leading-relaxed">
              Your appointment request for <strong>{formData.preferredEstate}</strong> has been logged with our primary advisor Dany Mugisha for <strong>{formData.date}</strong>.
            </p>

            <div className="p-4 bg-[#f3f4f5] rounded-xl text-left text-xs text-[#444651] space-y-1.5 max-w-md mx-auto border border-[#c5c5d3]/20">
              <p>
                <strong>Consultation Type:</strong> {formData.type}
              </p>
              <p>
                <strong>Contact Registered:</strong> {formData.phone} ({formData.email})
              </p>
              <p>
                <strong>Office Venue:</strong> Nyarutarama Business Center, KG 9 Ave, Kigali or Private Chauffeur Site Tour.
              </p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={`https://wa.me/250788123456?text=${encodeURIComponent(
                  `Muraho Dany, I just booked a ${formData.type} for ${formData.preferredEstate} on ${formData.date}. My name is ${formData.fullName}.`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="bg-[#25D366] hover:bg-[#20ba59] text-white px-6 py-3 rounded-md font-['Manrope'] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
              >
                <span className="material-symbols-outlined text-base">chat</span>
                Confirm on WhatsApp
              </a>

              <button
                onClick={handleReset}
                className="bg-[#00236f] text-white px-6 py-3 rounded-md font-['Manrope'] text-xs font-bold uppercase tracking-wider hover:bg-[#1e3a8a] transition-colors cursor-pointer"
              >
                Close Window
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4">
            <p className="text-xs text-[#444651] leading-relaxed mb-2">
              Whether you are acquiring a personal sanctuary in Nyarutarama or structuring diaspora asset allocations, our founders ensure complete discretion.
            </p>

            {/* Service Type Selection */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#757682] mb-1.5">
                Service Requested
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  'Private VIP Tour',
                  'Architectural Consultation',
                  'Investment Advisory',
                ].map((typeOption) => (
                  <button
                    key={typeOption}
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, type: typeOption as any })
                    }
                    className={`p-2.5 rounded-lg border text-xs font-semibold text-center transition-all cursor-pointer ${
                      formData.type === typeOption
                        ? 'border-[#00236f] bg-[#00236f]/5 text-[#00236f] font-bold'
                        : 'border-[#c5c5d3]/40 text-[#444651] hover:border-[#00236f]'
                    }`}
                  >
                    {typeOption}
                  </button>
                ))}
              </div>
            </div>

            {/* Preferred Property */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#757682] mb-1">
                Property or Focus of Interest
              </label>
              <select
                value={formData.preferredEstate}
                onChange={(e) =>
                  setFormData({ ...formData, preferredEstate: e.target.value })
                }
                className="w-full bg-[#f8f9fa] border border-[#c5c5d3]/30 rounded-lg p-2.5 text-xs text-[#191c1d] focus:outline-none focus:border-[#00236f]"
              >
                <option value="General Portfolio Advisory">
                  General Rwandan Luxury Portfolio Advisory
                </option>
                {properties.map((p) => (
                  <option key={p.id} value={p.title}>
                    {p.title} ({p.priceDisplay} · {p.neighborhood})
                  </option>
                ))}
              </select>
            </div>

            {/* Full Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#757682] mb-1">
                  Full Name *
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Jean-Paul Kagabo"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  className="w-full bg-[#f8f9fa] border border-[#c5c5d3]/30 rounded-lg p-2.5 text-xs text-[#191c1d] focus:outline-none focus:border-[#00236f]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#757682] mb-1">
                  Email Address *
                </label>
                <input
                  required
                  type="email"
                  placeholder="e.g. jp@domain.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full bg-[#f8f9fa] border border-[#c5c5d3]/30 rounded-lg p-2.5 text-xs text-[#191c1d] focus:outline-none focus:border-[#00236f]"
                />
              </div>
            </div>

            {/* Phone & Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#757682] mb-1">
                  Phone / WhatsApp *
                </label>
                <input
                  required
                  type="tel"
                  placeholder="+250 788 ... or Int'l"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full bg-[#f8f9fa] border border-[#c5c5d3]/30 rounded-lg p-2.5 text-xs text-[#191c1d] focus:outline-none focus:border-[#00236f]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#757682] mb-1">
                  Preferred Date
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  className="w-full bg-[#f8f9fa] border border-[#c5c5d3]/30 rounded-lg p-2.5 text-xs text-[#191c1d] focus:outline-none focus:border-[#00236f]"
                />
              </div>
            </div>

            {/* Additional Notes */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#757682] mb-1">
                Specific Architectural / Investment Requirements
              </label>
              <textarea
                rows={2}
                placeholder="Mention budget, desired move-in timeline, golf view preferences, or diaspora financing..."
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                className="w-full bg-[#f8f9fa] border border-[#c5c5d3]/30 rounded-lg p-2.5 text-xs text-[#191c1d] focus:outline-none focus:border-[#00236f]"
              />
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-xs font-semibold text-[#757682] hover:text-[#191c1d] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-[#00236f] hover:bg-[#1e3a8a] text-white px-6 py-2.5 rounded-lg font-['Manrope'] text-xs font-bold uppercase tracking-widest transition-all cursor-pointer shadow-md"
              >
                Request Confidential Appointment
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
