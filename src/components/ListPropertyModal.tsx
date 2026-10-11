import React, { useState } from 'react';
import { Property } from '../types';

interface ListPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPropertyCreated: (newProperty: Property) => void;
}

export const ListPropertyModal: React.FC<ListPropertyModalProps> = ({
  isOpen,
  onClose,
  onPropertyCreated,
}) => {
  const [title, setTitle] = useState('');
  const [neighborhood, setNeighborhood] = useState('Nyarutarama');
  const [propertyType, setPropertyType] = useState<'Villa' | 'Duplex' | 'Penthouse' | 'Architectural Estate'>('Villa');
  const [priceRwf, setPriceRwf] = useState('42M RWF');
  const [priceUsd, setPriceUsd] = useState(750000);
  const [beds, setBaths] = useState(4);
  const [baths, setBeds] = useState(3);
  const [areaM2, setAreaM2] = useState(280);
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAiD5Sf302m49Cgl-HKJ79zbgX_vYXr14YiY-2H3w1VccGCbknMc7gsPFVsvebvnaikmFIG90qJYlxf5cweT_l07hr1Ks94IrIQDYBSVfly_gNdV5KkXfm8s6U0r9VUx5kNCOqfIkPuwwCCctJqszViRLSBD-TqllsHp4q-8YjDHRVnAJl-fbU9obyTN9vslCKCvAy5sDSQOoAYZ4tcgi7C5EQoHF6dHHUSCCfGb2ImYaiwBT0Jjq1dEHcc9D628oT78YCPzen7-Yaq'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          neighborhood,
          propertyType,
          price: priceUsd,
          priceDisplay: `$${Number(priceUsd).toLocaleString()}`,
          rwfPriceDisplay: priceRwf,
          beds,
          baths,
          areaM2,
          image,
          description,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to list property');
      }

      onPropertyCreated(data.estate);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error listing estate');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl max-h-[92vh] rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl border border-white/20 bg-white my-auto flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-[#00236f] text-white p-6 flex justify-between items-center">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#90a8ff] block">
              The Digital Estate · Rwanda
            </span>
            <h3 className="font-['Manrope'] text-xl font-bold">List Architectural Property</h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-full transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs text-[#191c1d]">
          {error && (
            <div className="p-3 bg-red-50 text-red-700 rounded-lg border border-red-200">
              {error}
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#757682] mb-1">
              Estate Title *
            </label>
            <input
              required
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Kagugu Hilltop Sanctuary"
              className="w-full px-3 py-2.5 bg-[#f8f9fa] border border-[#c5c5d3]/40 rounded-lg focus:outline-none focus:border-[#00236f]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#757682] mb-1">
                District / Neighborhood *
              </label>
              <select
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#f8f9fa] border border-[#c5c5d3]/40 rounded-lg focus:outline-none focus:border-[#00236f]"
              >
                <option value="Nyarutarama">Nyarutarama</option>
                <option value="Kibagabaga">Kibagabaga</option>
                <option value="Gacuhiro">Gacuhiro</option>
                <option value="Rebero">Rebero</option>
                <option value="Kiyovu">Kiyovu</option>
                <option value="Kimihurura">Kimihurura</option>
                <option value="Kacyiru">Kacyiru</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#757682] mb-1">
                Property Type
              </label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value as any)}
                className="w-full px-3 py-2.5 bg-[#f8f9fa] border border-[#c5c5d3]/40 rounded-lg focus:outline-none focus:border-[#00236f]"
              >
                <option value="Villa">Villa</option>
                <option value="Duplex">Duplex</option>
                <option value="Penthouse">Penthouse</option>
                <option value="Architectural Estate">Architectural Estate</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#757682] mb-1">
                Price in RWF (e.g. 45M RWF)
              </label>
              <input
                type="text"
                value={priceRwf}
                onChange={(e) => setPriceRwf(e.target.value)}
                placeholder="45M RWF"
                className="w-full px-3 py-2.5 bg-[#f8f9fa] border border-[#c5c5d3]/40 rounded-lg focus:outline-none focus:border-[#00236f]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#757682] mb-1">
                Price in USD ($)
              </label>
              <input
                type="number"
                value={priceUsd}
                onChange={(e) => setPriceUsd(Number(e.target.value))}
                placeholder="750000"
                className="w-full px-3 py-2.5 bg-[#f8f9fa] border border-[#c5c5d3]/40 rounded-lg focus:outline-none focus:border-[#00236f]"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#757682] mb-1">
                Bedrooms
              </label>
              <input
                type="number"
                min="1"
                max="12"
                value={beds}
                onChange={(e) => setBaths(Number(e.target.value))}
                className="w-full px-3 py-2.5 bg-[#f8f9fa] border border-[#c5c5d3]/40 rounded-lg focus:outline-none focus:border-[#00236f]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#757682] mb-1">
                Bathrooms
              </label>
              <input
                type="number"
                min="1"
                max="12"
                value={baths}
                onChange={(e) => setBeds(Number(e.target.value))}
                className="w-full px-3 py-2.5 bg-[#f8f9fa] border border-[#c5c5d3]/40 rounded-lg focus:outline-none focus:border-[#00236f]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#757682] mb-1">
                Living Area (m²)
              </label>
              <input
                type="number"
                min="50"
                max="2000"
                value={areaM2}
                onChange={(e) => setAreaM2(Number(e.target.value))}
                className="w-full px-3 py-2.5 bg-[#f8f9fa] border border-[#c5c5d3]/40 rounded-lg focus:outline-none focus:border-[#00236f]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#757682] mb-1">
              Image URL
            </label>
            <input
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2.5 bg-[#f8f9fa] border border-[#c5c5d3]/40 rounded-lg focus:outline-none focus:border-[#00236f]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#757682] mb-1">
              Architectural Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Highlight sustainable materials, panoramic views, private pool, or zoning details..."
              className="w-full px-3 py-2.5 bg-[#f8f9fa] border border-[#c5c5d3]/40 rounded-lg focus:outline-none focus:border-[#00236f]"
            />
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-bold text-[#757682] hover:text-[#191c1d] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#00236f] hover:bg-[#1e3a8a] text-white px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-md"
            >
              {isSubmitting ? 'Publishing Estate...' : 'List Estate on Map'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
