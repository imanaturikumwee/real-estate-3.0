import React, { useState } from 'react';
import { ADVISOR_DANY_IMAGE } from '../data/properties';

interface InvestScreenProps {
  onOpenConsultation: () => void;
  onExploreProperties: () => void;
}

export const InvestScreen: React.FC<InvestScreenProps> = ({
  onOpenConsultation,
  onExploreProperties,
}) => {
  const [purchasePrice, setPurchasePrice] = useState(850000);
  const [monthlyRental, setMonthlyRental] = useState(6500);
  const [occupancyRate, setOccupancyRate] = useState(90);
  const [annualAppreciation, setAnnualAppreciation] = useState(8); // historical ~7-10% for Kigali prime

  // Calculations
  const grossAnnualRent = monthlyRental * 12 * (occupancyRate / 100);
  const grossYield = ((grossAnnualRent / purchasePrice) * 100).toFixed(1);
  const propertyManagementExpense = grossAnnualRent * 0.12; // 12% management & maintenance
  const netAnnualIncome = Math.round(grossAnnualRent - propertyManagementExpense);

  // 5-year capital appreciation projection
  const futureValue5Years = Math.round(
    purchasePrice * Math.pow(1 + annualAppreciation / 100, 5)
  );
  const capitalGain5Years = futureValue5Years - purchasePrice;
  const total5YearReturn = Math.round(capitalGain5Years + netAnnualIncome * 5);
  const totalRoiPercentage = ((total5YearReturn / purchasePrice) * 100).toFixed(1);

  return (
    <div className="py-12 md:py-16 bg-[#f8f9fa] min-h-screen">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <span className="font-['Inter'] text-xs font-bold tracking-[0.25em] uppercase text-[#00236f] mb-2 block">
            Institutional &amp; Diaspora Wealth
          </span>
          <h1 className="font-['Manrope'] text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#191c1d] tracking-tight mb-4">
            Invest in Kigali Real Estate
          </h1>
          <p className="text-[#444651] text-base md:text-lg leading-relaxed">
            Rwanda has emerged as Africa's premier destination for wealth preservation, offering double-digit rental yields, unmatched security, transparent land registries, and progressive urban planning.
          </p>
        </div>

        {/* 4 Pillars of Rwandan Real Estate */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="bg-white p-6 rounded-xl border border-[#c5c5d3]/20 shadow-xs">
            <div className="w-10 h-10 rounded-lg bg-[#00236f]/10 text-[#00236f] flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-2xl">trending_up</span>
            </div>
            <h3 className="font-['Manrope'] text-base font-bold text-[#191c1d] mb-2">
              8–12% Gross Yields
            </h3>
            <p className="text-xs text-[#444651] leading-relaxed">
              Sustained influx of multilateral organizations, embassies, and tech multinationals creates premium USD-denominated tenant demand in Nyarutarama and Kimihurura.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-[#c5c5d3]/20 shadow-xs">
            <div className="w-10 h-10 rounded-lg bg-[#00236f]/10 text-[#00236f] flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-2xl">verified_user</span>
            </div>
            <h3 className="font-['Manrope'] text-base font-bold text-[#191c1d] mb-2">
              100% Freehold Protection
            </h3>
            <p className="text-xs text-[#444651] leading-relaxed">
              Rwanda Development Board (RDB) guarantees full legal protection for foreign and diaspora investors with digitized instantaneous title deeds and zero land disputes.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-[#c5c5d3]/20 shadow-xs">
            <div className="w-10 h-10 rounded-lg bg-[#00236f]/10 text-[#00236f] flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-2xl">eco</span>
            </div>
            <h3 className="font-['Manrope'] text-base font-bold text-[#191c1d] mb-2">
              Vision 2050 Masterplan
            </h3>
            <p className="text-xs text-[#444651] leading-relaxed">
              World Bank recognized green urban zoning, Bugesera International Airport infrastructure, and sustainable smart city regulations safeguarding long-term asset values.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-[#c5c5d3]/20 shadow-xs">
            <div className="w-10 h-10 rounded-lg bg-[#00236f]/10 text-[#00236f] flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-2xl">currency_exchange</span>
            </div>
            <h3 className="font-['Manrope'] text-base font-bold text-[#191c1d] mb-2">
              USD Capital Repatriation
            </h3>
            <p className="text-xs text-[#444651] leading-relaxed">
              Unrestricted capital repatriation through the National Bank of Rwanda, with zero capital gains tax on primary residential property held past statutory holding periods.
            </p>
          </div>
        </div>

        {/* Interactive Rwandan Yield & ROI Simulator */}
        <div className="bg-white rounded-2xl border border-[#c5c5d3]/30 shadow-xl p-8 md:p-12 mb-16">
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#00236f] block mb-1">
              Interactive Financial Modeling
            </span>
            <h2 className="font-['Manrope'] text-2xl sm:text-3xl font-extrabold text-[#191c1d]">
              Rwandan Luxury Yield &amp; ROI Simulator
            </h2>
            <p className="text-xs sm:text-sm text-[#444651] mt-2">
              Model your returns based on actual rental indices in Kigali’s diplomatic corridors.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Controls Slider Column */}
            <div className="lg:col-span-7 space-y-6">
              {/* Purchase Price */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#757682]">
                    Property Acquisition Price
                  </label>
                  <span className="font-['Manrope'] font-extrabold text-[#00236f] text-base">
                    ${purchasePrice.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min="250000"
                  max="2000000"
                  step="25000"
                  value={purchasePrice}
                  onChange={(e) => setPurchasePrice(Number(e.target.value))}
                  className="w-full accent-[#00236f]"
                />
                <div className="flex justify-between text-[10px] text-[#757682] mt-1">
                  <span>$250k (Duplex)</span>
                  <span>$850k (Luxury Villa)</span>
                  <span>$2M+ (Estate)</span>
                </div>
              </div>

              {/* Monthly Rental Income */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#757682]">
                    Expected Monthly Rental (USD)
                  </label>
                  <span className="font-['Manrope'] font-extrabold text-[#00236f] text-base">
                    ${monthlyRental.toLocaleString()} / mo
                  </span>
                </div>
                <input
                  type="range"
                  min="2000"
                  max="15000"
                  step="250"
                  value={monthlyRental}
                  onChange={(e) => setMonthlyRental(Number(e.target.value))}
                  className="w-full accent-[#00236f]"
                />
                <div className="flex justify-between text-[10px] text-[#757682] mt-1">
                  <span>$2,000/mo</span>
                  <span>$6,500/mo</span>
                  <span>$15,000/mo</span>
                </div>
              </div>

              {/* Occupancy Rate */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#757682]">
                    Occupancy Rate
                  </label>
                  <span className="font-bold text-[#191c1d] text-sm">{occupancyRate}%</span>
                </div>
                <input
                  type="range"
                  min="70"
                  max="100"
                  step="2"
                  value={occupancyRate}
                  onChange={(e) => setOccupancyRate(Number(e.target.value))}
                  className="w-full accent-[#00236f]"
                />
              </div>

              {/* Annual Appreciation Rate */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#757682]">
                    Projected Annual Appreciation
                  </label>
                  <span className="font-bold text-[#191c1d] text-sm">{annualAppreciation}% p.a.</span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="12"
                  step="0.5"
                  value={annualAppreciation}
                  onChange={(e) => setAnnualAppreciation(Number(e.target.value))}
                  className="w-full accent-[#00236f]"
                />
              </div>
            </div>

            {/* Results Projection Card */}
            <div className="lg:col-span-5 bg-[#f3f4f5] p-6 sm:p-8 rounded-2xl border border-[#c5c5d3]/30">
              <div className="text-center pb-6 border-b border-[#c5c5d3]/30">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#757682] block mb-1">
                  Gross Annual Yield
                </span>
                <span className="font-['Manrope'] text-4xl sm:text-5xl font-extrabold text-[#00236f]">
                  {grossYield}%
                </span>
                <span className="text-xs text-[#444651] block mt-1">
                  Benchmark: London (3.2%), Dubai (6.5%), Kigali Prime ({grossYield}%)
                </span>
              </div>

              <div className="py-6 space-y-3.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#444651]">Net Annual Rent (after mgmt):</span>
                  <strong className="text-[#191c1d]">${netAnnualIncome.toLocaleString()}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#444651]">5-Year Capital Growth:</span>
                  <strong className="text-[#00236f]">+${capitalGain5Years.toLocaleString()}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#444651]">Est. Asset Value (Year 5):</span>
                  <strong className="text-[#191c1d]">${futureValue5Years.toLocaleString()}</strong>
                </div>
                <div className="flex justify-between pt-3 border-t border-[#c5c5d3]/30 text-sm">
                  <span className="font-bold text-[#191c1d]">Total 5-Year Net ROI:</span>
                  <span className="font-extrabold text-[#00236f]">+{totalRoiPercentage}%</span>
                </div>
              </div>

              <button
                onClick={onOpenConsultation}
                className="w-full bg-[#00236f] hover:bg-[#1e3a8a] text-white py-3.5 rounded-lg font-['Manrope'] text-xs font-bold uppercase tracking-widest transition-all cursor-pointer shadow-md"
              >
                Request Custom Pro-Forma Dossier
              </button>
            </div>
          </div>
        </div>

        {/* Private Wealth Advisory Banner */}
        <div className="bg-[#1e3a8a] text-white rounded-2xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white/60 shrink-0">
              <img
                src={ADVISOR_DANY_IMAGE}
                alt="Dany Mugisha"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <span className="text-[#90a8ff] text-xs font-bold uppercase tracking-wider block">
                Direct Principal Advisory
              </span>
              <h3 className="font-['Manrope'] text-xl sm:text-2xl font-bold">
                Speak directly with Dany Mugisha
              </h3>
              <p className="text-xs text-[#dce1ff] mt-1 max-w-md">
                Guiding institutional funds, diplomatic embassies, and high-net-worth diaspora through Rwandan acquisition structuring.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 shrink-0">
            <button
              onClick={onOpenConsultation}
              className="bg-white text-[#00236f] px-6 py-3 rounded-md font-['Manrope'] text-xs font-bold uppercase tracking-widest hover:bg-[#f8f9fa] transition-colors cursor-pointer"
            >
              Book Private Advisory
            </button>
            <button
              onClick={onExploreProperties}
              className="border border-white/40 text-white px-6 py-3 rounded-md font-['Manrope'] text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-colors cursor-pointer"
            >
              View Investment Assets
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
