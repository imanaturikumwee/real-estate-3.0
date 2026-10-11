import React, { useState } from 'react';
import { ADVISOR_DANY_IMAGE } from '../data/properties';

export const ContactScreen: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    interest: 'Acquisition & Investment',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="py-12 md:py-16 bg-[#f8f9fa] min-h-screen">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="max-w-3xl mb-12">
          <span className="font-['Inter'] text-xs font-bold tracking-[0.25em] uppercase text-[#00236f] mb-2 block">
            Direct Private Client Desk
          </span>
          <h1 className="font-['Manrope'] text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#191c1d] tracking-tight mb-4">
            Connect with Emma &amp; Dany
          </h1>
          <p className="text-[#444651] text-base leading-relaxed">
            Our offices are situated at the Nyarutarama Business Center overlooking the Kigali Golf Course. We welcome private appointments and international inquiries.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Office details & Co-founder presence */}
          <div className="lg:col-span-5 space-y-6">
            {/* Headquarters Card */}
            <div className="bg-white p-7 rounded-2xl border border-[#c5c5d3]/20 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#00236f] block mb-2">
                Kigali Headquarters
              </span>
              <h3 className="font-['Manrope'] text-xl font-bold text-[#191c1d] mb-1">
                Nyarutarama Business Center
              </h3>
              <p className="text-xs text-[#757682] mb-4">
                KG 9 Avenue, Sector Remera / Nyarutarama, Gasabo District, Kigali
              </p>

              <div className="space-y-2.5 text-xs text-[#444651] border-t border-[#c5c5d3]/20 pt-4">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#00236f] text-base">call</span>
                  <a href="tel:+250788123456" className="font-bold text-[#191c1d] hover:underline">
                    +250 788 123 456
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#00236f] text-base">mail</span>
                  <a href="mailto:curator@emma-dany.rw" className="hover:underline">
                    curator@emma-dany.rw
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#00236f] text-base">schedule</span>
                  <span>Monday – Saturday: 08:30 – 18:00 CAT (Central Africa Time)</span>
                </div>
              </div>
            </div>

            {/* Direct Advisor Card */}
            <div className="bg-[#1e3a8a] text-white p-6 rounded-2xl flex items-center gap-5 shadow-lg">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/80 shrink-0">
                <img
                  src={ADVISOR_DANY_IMAGE}
                  alt="Dany Mugisha"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="text-[#90a8ff] text-[10px] font-bold uppercase tracking-wider block">
                  On-Duty Principal
                </span>
                <h4 className="font-['Manrope'] font-bold text-lg">Dany Mugisha</h4>
                <p className="text-xs text-[#dce1ff] mb-2">Co-Founder &amp; Investment Advisor</p>
                <a
                  href="https://wa.me/250788123456"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">chat</span>
                  WhatsApp Chat
                </a>
              </div>
            </div>

            {/* Kigali Location Features */}
            <div className="bg-[#f3f4f5] p-5 rounded-2xl border border-[#c5c5d3]/20 text-xs text-[#444651] space-y-2">
              <h5 className="font-bold text-[#191c1d] uppercase tracking-wider text-[10px]">
                Neighborhood Proximity
              </h5>
              <div className="flex justify-between">
                <span>Kigali Golf Club:</span>
                <span className="font-semibold text-[#191c1d]">2 minutes drive</span>
              </div>
              <div className="flex justify-between">
                <span>Kigali Convention Centre:</span>
                <span className="font-semibold text-[#191c1d]">7 minutes drive</span>
              </div>
              <div className="flex justify-between">
                <span>Kigali International Airport:</span>
                <span className="font-semibold text-[#191c1d]">12 minutes drive</span>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Message Form */}
          <div className="lg:col-span-7">
            <div className="bg-white p-8 sm:p-10 rounded-2xl border border-[#c5c5d3]/20 shadow-sm">
              <h3 className="font-['Manrope'] text-2xl font-bold text-[#191c1d] mb-2">
                Send an Inquiry
              </h3>
              <p className="text-xs text-[#757682] mb-6">
                All communications are handled under strict confidentiality protocols.
              </p>

              {submitted ? (
                <div className="p-8 text-center bg-[#f8f9fa] rounded-xl border border-[#c5c5d3]/20 space-y-3">
                  <span className="material-symbols-outlined text-4xl text-[#00236f]">
                    mark_email_read
                  </span>
                  <h4 className="font-['Manrope'] text-lg font-bold text-[#191c1d]">
                    Message Transmitted
                  </h4>
                  <p className="text-xs text-[#444651]">
                    Thank you, {formData.name}. Dany Mugisha and Emma Umutoni have received your request and will respond within 4 business hours.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-xs font-bold text-[#00236f] uppercase tracking-wider underline cursor-pointer mt-2 block mx-auto"
                  >
                    Send another inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#757682] mb-1">
                        Full Name *
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="Your full name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                        placeholder="Your email address"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-[#f8f9fa] border border-[#c5c5d3]/30 rounded-lg p-2.5 text-xs text-[#191c1d] focus:outline-none focus:border-[#00236f]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#757682] mb-1">
                        Phone / WhatsApp
                      </label>
                      <input
                        type="tel"
                        placeholder="+250 788... or international"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-[#f8f9fa] border border-[#c5c5d3]/30 rounded-lg p-2.5 text-xs text-[#191c1d] focus:outline-none focus:border-[#00236f]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#757682] mb-1">
                        Primary Interest
                      </label>
                      <select
                        value={formData.interest}
                        onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                        className="w-full bg-[#f8f9fa] border border-[#c5c5d3]/30 rounded-lg p-2.5 text-xs text-[#191c1d] focus:outline-none focus:border-[#00236f]"
                      >
                        <option value="Acquisition & Investment">Acquisition &amp; Investment</option>
                        <option value="Private Architectural Tour">Private Architectural Tour</option>
                        <option value="Off-Market Portfolio Inquiry">Off-Market Portfolio Inquiry</option>
                        <option value="Sell/List Exclusive Property">List an Exclusive Property</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#757682] mb-1">
                      Message / Architectural Brief
                    </label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Share your timeline, target neighborhoods, or particular architectural criteria..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-[#f8f9fa] border border-[#c5c5d3]/30 rounded-lg p-2.5 text-xs text-[#191c1d] focus:outline-none focus:border-[#00236f]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#00236f] hover:bg-[#1e3a8a] text-white py-3.5 rounded-lg font-['Manrope'] text-xs font-bold uppercase tracking-widest transition-all cursor-pointer shadow-md"
                  >
                    Submit Confidential Brief
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
