import React, { useState } from 'react';

interface ListPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ListPropertyModal: React.FC<ListPropertyModalProps> = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState('');
  const [neighborhood, setNeighborhood] = useState('Nyarutarama');
  const [propertyCategory, setPropertyCategory] = useState<'House' | 'Apartment' | 'Land' | 'Commercial'>('House');
  const [price, setPrice] = useState('');
  const [beds, setBeds] = useState('3');
  const [baths, setBaths] = useState('2');
  const [areaM2, setAreaM2] = useState('350');
  const [ownerName, setOwnerName] = useState('');
  const [ownerContact, setOwnerContact] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmationId, setConfirmationId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/properties/list', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          neighborhood,
          propertyCategory,
          price: Number(price) || 500000,
          beds: Number(beds) || 3,
          baths: Number(baths) || 2,
          areaM2: Number(areaM2) || 300,
          ownerName,
          ownerContact,
          description,
        }),
      });
      const data = await res.json();
      setConfirmationId(data.listingId || 'LST-' + Date.now().toString(36).toUpperCase());
    } catch {
      setConfirmationId('LST-' + Date.now().toString(36).toUpperCase());
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setConfirmationId(null);
    setTitle('');
    setPrice('');
    setDescription('');
    onClose();
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200"
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <span className="text-[10px] uppercase font-bold text-[#00236f] tracking-widest">
              The Digital Estate · Rwanda
            </span>
            <h3 className="font-['Manrope'] text-2xl font-bold text-[#191c1d] mt-1">
              List Your Property
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Connect with accredited high-net-worth buyers and diplomatic tenants in Kigali.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-800 transition-colors"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {confirmationId ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-3xl">verified</span>
            </div>
            <h4 className="font-['Manrope'] font-bold text-xl text-slate-900">
              Listing Submitted for Accreditation
            </h4>
            <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
              Listing Reference:{' '}
              <span className="font-mono font-bold text-[#00236f] text-sm block mt-1">
                {confirmationId}
              </span>
            </p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Our architectural verification team will inspect your title documents and dispatch a professional drone photographer within 24 hours.
            </p>
            <button
              onClick={handleReset}
              className="w-full py-3 bg-[#00236f] text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#001c55] transition-colors cursor-pointer shadow-md"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-['Inter']">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Property Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Nyarutarama Modern Hilltop Villa"
                className="w-full p-3 bg-slate-100 border-none rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-[#00236f]/30 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Category</label>
                <select
                  value={propertyCategory}
                  onChange={(e) => setPropertyCategory(e.target.value as any)}
                  className="w-full p-3 bg-slate-100 border-none rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-[#00236f]/30 outline-none cursor-pointer"
                >
                  <option value="House">House (Villa / Mansion)</option>
                  <option value="Apartment">Apartment / Penthouse</option>
                  <option value="Land">Strategic Land Plot</option>
                  <option value="Commercial">Commercial / Mixed-Use</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Neighborhood</label>
                <select
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  className="w-full p-3 bg-slate-100 border-none rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-[#00236f]/30 outline-none cursor-pointer"
                >
                  <option value="Nyarutarama">Nyarutarama</option>
                  <option value="Kiyovu">Old Kiyovu</option>
                  <option value="Kibagabaga">Kibagabaga</option>
                  <option value="Kimihurura">Kimihurura</option>
                  <option value="Rebero">Rebero Heights</option>
                  <option value="Gacuriro">Gacuriro</option>
                  <option value="Kicukiro">Kicukiro</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Asking Price ($ / RWF)</label>
                <input
                  type="text"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="e.g. 450,000"
                  className="w-full p-3 bg-slate-100 border-none rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-[#00236f]/30 outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Bedrooms</label>
                <input
                  type="number"
                  min="0"
                  value={beds}
                  onChange={(e) => setBeds(e.target.value)}
                  className="w-full p-3 bg-slate-100 border-none rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-[#00236f]/30 outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Area (m²)</label>
                <input
                  type="number"
                  min="50"
                  value={areaM2}
                  onChange={(e) => setAreaM2(e.target.value)}
                  className="w-full p-3 bg-slate-100 border-none rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-[#00236f]/30 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Owner / Agent Name</label>
                <input
                  type="text"
                  required
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  placeholder="e.g. Patrick Habimana"
                  className="w-full p-3 bg-slate-100 border-none rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-[#00236f]/30 outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Contact Phone</label>
                <input
                  type="tel"
                  required
                  value={ownerContact}
                  onChange={(e) => setOwnerContact(e.target.value)}
                  placeholder="+250 788 000 000"
                  className="w-full p-3 bg-slate-100 border-none rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-[#00236f]/30 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Architectural Highlights</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Mention pool, view, zoning, solar power, security perimeter..."
                className="w-full p-3 bg-slate-100 border-none rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-[#00236f]/30 outline-none resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-[#00236f] text-white rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-[#001c55] transition-colors cursor-pointer shadow-md disabled:opacity-50 mt-2"
            >
              {isSubmitting ? 'Submitting to Land Registry...' : 'Publish to Digital Estate'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
