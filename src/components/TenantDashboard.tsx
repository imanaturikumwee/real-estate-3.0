import React, { useState } from 'react';
import { Property, ActiveScreen } from '../types';
import { useAuth } from '../context/AuthContext';
import { PropertySearchExplorer } from './PropertySearchExplorer';
import { PROPERTIES } from '../data/properties';

interface TenantDashboardProps {
  properties: Property[];
  onSelectProperty: (property: Property) => void;
  onBookTour: (property: Property) => void;
  onOpenConsultation: () => void;
  onNavigate: (screen: ActiveScreen) => void;
}

interface Inquiry {
  id: string;
  propertyTitle: string;
  propertyImage: string;
  agentName: string;
  agentRole: string;
  agentColor: string;
  lastUpdate: string;
  status: 'In Review' | 'Scheduled' | 'Approved' | 'Completed';
  statusColor: string;
  date: string;
  notes: string;
}

export const TenantDashboard: React.FC<TenantDashboardProps> = ({
  properties,
  onSelectProperty,
  onBookTour,
  onOpenConsultation,
  onNavigate,
}) => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'search' | 'saved' | 'messages' | 'insights' | 'documents'
  >('dashboard');

  const [searchBarQuery, setSearchBarQuery] = useState('');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Message thread state
  const [activeChatAgent, setActiveChatAgent] = useState<'david' | 'sandra'>('david');
  const [chatMessages, setChatMessages] = useState<{ sender: 'user' | 'agent'; text: string; time: string }[]>([
    {
      sender: 'agent',
      text: 'Hello Emma, I have reviewed your private viewing inquiry for Kigali View Heights. Saturday at 2:00 PM is reserved for you with our diplomatic chauffeur service.',
      time: '10:30 AM',
    },
    {
      sender: 'user',
      text: 'Thank you David! Could you please ensure the floor plan blueprints and land registry documents are ready?',
      time: '10:45 AM',
    },
    {
      sender: 'agent',
      text: 'Certainly. Everything is verified with the Rwanda Land Management and Environment Authority.',
      time: '11:02 AM',
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const displayName = user?.fullName || 'Emma Umutoni';
  const displayRole = user?.role === 'buyer' ? 'Buyer Portal' : 'Tenant Portal';
  const avatarUrl =
    user?.avatar ||
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCuwfyf7F7HsxkNkcELAVeyT6T3F9kSFkvXuAA4OcL__An-IWrRG5Egd2epVBDVFtXr8PNM14uRqb57iC2xn3P5lFiS7oVGkqpcJrYMVRRftbSjtyxz9tSLogEoQgzorV85YAo91LrUscToEJkRlNgR1KYJHID6CYUvZTfXRcVUZkIa4_XVYOXluYa1ZCAM3dLgICUC3q4ZJIwOYE48DDFMlHc1Rz7Dz3UqCNZ5jvV3WlnFD3KjxXwdVFtC1zJJpqM2u7TvfKAFZzQX';

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    const newMsg = { sender: 'user' as const, text: inputMessage.trim(), time: 'Just now' };
    setChatMessages((prev) => [...prev, newMsg]);
    setInputMessage('');
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'agent' as const,
          text: 'Thank you for your update. Our senior concierge has noted this on your VIP dossier.',
          time: 'Just now',
        },
      ]);
    }, 1000);
  };

  // Recommended estates for the tenant/buyer
  const recommendedEstates = [
    {
      id: 'kigali-view-heights',
      title: 'Kigali View Heights',
      category: 'Residential • Luxury',
      location: 'Nyarutarama, Gasabo',
      price: '$450,000',
      specs: '4 beds • 3 baths',
      aiScore: '98/100',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDxXtRXCeM7yJjlUpkCMS6PmV7yPQoVVwxBWQuy2zccG30V6H2LYXCjMg066TQ707HjxdRHCrJMQVah5tZKkzIrc_Q6RsSIzejHNwrrMXrX5ADkNvmpFHJUuTcMHjcal7hlPO-oqXdIdQYfgfD2EszOJQEQCGU1zZgPSYoBCSoTSPUp8GsuGdlTVVXQotqv-8FaMxqRKDsKMyp4YTBgv7lhRVjfiy82sxx98OOPmU51rg_LP26fg0va25_Mj4uJaAl5z8avC5fvC3Qi',
      propertyObj: properties[0] || PROPERTIES[0],
    },
    {
      id: 'the-hub-apartments',
      title: 'The Hub Apartments',
      category: 'Investment • Commercial',
      location: 'Kicukiro District',
      price: '$280,000',
      specs: 'Yield: 8.2%',
      aiScore: '94/100',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCGGBSEI_gmOrmBmbORG_C2nEM-GUyxCi-132RFPUTpZtPku_la-yK0nuOF1q4xHNRZ7opKZ6qFlATogkeDAXVB1DivZ9rO5F97MTbTfszjYqLyOrCeWuqSDRz1xVYfxWRpMu-q9vADJNCzIr4k4laQlG4sWwsIxODyyu4QPL1PGvu9FtqTMo_0ynyQU9RY816bT2BOPcp_WeBSJ_gVHlju9WifNEQ7PNG7V2BM4UboJfWGs9Q-wSfwzbIpLfOYJT1YfV2cOX8toGPE',
      propertyObj: properties[1] || PROPERTIES[1],
    },
    {
      id: 'horizon-residence',
      title: 'The Horizon Residence',
      category: 'Contemporary Villa',
      location: 'Nyarutarama, Kigali',
      price: '$850,000',
      specs: '4 beds • 3 baths • 3,450 sqft',
      aiScore: '96/100',
      image: properties[0]?.image || PROPERTIES[0]?.image,
      propertyObj: properties[0] || PROPERTIES[0],
    },
  ];

  // Active inquiries
  const inquiries: Inquiry[] = [
    {
      id: 'inq-1',
      propertyTitle: 'Kigali View Heights',
      propertyImage:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCIlvg_yQjgjSgvW9VAlfM_qs_qodZEGVsFdSU028RBMfxLur2-00pLjcv3AypOg3dBYqPblQUeP88rHoF-cJRKN7obqZ0hEt6frXP6bGQvzubMcgf6Z5x1H_14h9l9sJ3FNldNa0iECgz_p97pNtYn4AHc2VGOCbBIy6E3bFSi2KuxOsy4kj5mPsXkTn82uts8CKr_TaRwaGvTmPFmOhn6pM1widHWvTwdWgi8HXaGpUCtZlOK1OW0Tnk3brFl5sxnYjj1QDrD7PDi',
      agentName: 'David Rugamba',
      agentRole: 'Senior Architectural Advisor',
      agentColor: 'bg-[#b6c4ff]',
      lastUpdate: '2 hours ago',
      status: 'In Review',
      statusColor: 'bg-blue-50 text-blue-700',
      date: 'Oct 14, 2026',
      notes: 'Viewing scheduled for Saturday 2:00 PM. Diplomatic transport confirmed.',
    },
    {
      id: 'inq-2',
      propertyTitle: 'Vision City Phase 2',
      propertyImage:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBBh1pz6FFsRFmvPfVqQU1gIsVHjSDC4gGWwYraBAWvM8MefW3fMSZPz0Z4NeGTTY15M9cN8q7thhfYqzjaouToVU9GtdNdKAiGxvQOHyDZ5h5l8UeahNZ5QAP9w_XmWipLaf_sUHsKi574_FJv0sdAeu75rrAS0s7oUDhRkKRAA6u3h7wPixDhvdldqbnIt3Zr23giamr2HShqOLFN_D5XaL4V22lEpRSrzBxirVkuaPGIdw3izOTDzYEAqwuXEW-Kc7p9Pal5QRVx',
      agentName: 'Sandra Umutoni',
      agentRole: 'Prime Estate Specialist',
      agentColor: 'bg-[#ffdcc1]',
      lastUpdate: 'Yesterday',
      status: 'Scheduled',
      statusColor: 'bg-green-50 text-green-700',
      date: 'Oct 15, 2026',
      notes: 'Private architectural inspection with site engineer confirmed.',
    },
    {
      id: 'inq-3',
      propertyTitle: 'Golf Course Villa',
      propertyImage:
        properties[2]?.image || PROPERTIES[2]?.image || properties[0]?.image,
      agentName: 'Dany Mugisha',
      agentRole: 'Lead Architect & Partner',
      agentColor: 'bg-[#dce1ff]',
      lastUpdate: '3 days ago',
      status: 'Approved',
      statusColor: 'bg-purple-50 text-purple-700',
      date: 'Oct 11, 2026',
      notes: 'Buyer background check and proof of funds verified by legal team.',
    },
  ];

  // Verified documents
  const documents = [
    {
      title: 'Verified Proof of Funds',
      issuer: 'Bank of Kigali / Diplomatic Trust',
      date: 'Verified Oct 10, 2026',
      status: 'Verified',
      type: 'Financial',
      size: '1.8 MB',
    },
    {
      title: 'Identification Dossier (Passport & National ID)',
      issuer: 'Republic of Rwanda Civil Registry',
      date: 'Verified Oct 08, 2026',
      status: 'Verified',
      type: 'Identity',
      size: '2.4 MB',
    },
    {
      title: 'Standard VIP Tenancy Agreement Template',
      issuer: 'Emma & Dany Legal Chambers',
      date: 'Updated Oct 2026',
      status: 'Ready',
      type: 'Legal',
      size: '850 KB',
    },
    {
      title: 'Kigali Master Plan Zoning Compliance Certificate',
      issuer: 'City of Kigali Urban Planning',
      date: 'Issued Sep 2026',
      status: 'Certified',
      type: 'Zoning',
      size: '3.1 MB',
    },
  ];

  const handleTopSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveTab('search');
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#191c1d] font-['Inter'] flex">
      {/* -------------------------------------------------------------
          SideNavBar (Fixed Left for Desktop / Drawer for Mobile)
          ------------------------------------------------------------- */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-slate-50 border-r border-[#c5c5d3]/20 flex flex-col justify-between p-6 z-40 transition-transform duration-300 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Top Brand Logo */}
          <div className="mb-8 flex items-center justify-between">
            <button
              onClick={() => {
                setActiveTab('dashboard');
                setMobileSidebarOpen(false);
              }}
              className="text-left group cursor-pointer focus:outline-none"
            >
              <span className="text-lg font-black text-blue-900 tracking-tight group-hover:opacity-80 transition-opacity">
                The Digital Estate
              </span>
              <span className="block text-[9px] uppercase tracking-[0.25em] text-slate-500 font-semibold -mt-0.5">
                Emma &amp; Dany · Rwanda
              </span>
            </button>
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="md:hidden text-slate-500 hover:text-blue-900 p-1"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>

          {/* User Profile Card */}
          <div className="mb-6 flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200/60 shadow-xs">
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-200 shrink-0 border border-slate-300/40">
              <img
                src={avatarUrl}
                alt={displayName}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <p className="font-bold text-xs text-blue-900 truncate">{displayName}</p>
              <p className="text-[10px] text-blue-700 font-semibold uppercase tracking-wider">
                {displayRole}
              </p>
              <p className="text-[9px] text-slate-400 uppercase tracking-widest font-medium">
                Premium Member
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 font-['Manrope'] text-sm font-medium">
            {/* Dashboard */}
            <button
              onClick={() => {
                setActiveTab('dashboard');
                setMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-white text-blue-900 font-bold shadow-sm scale-[0.99] border border-blue-900/10'
                  : 'text-slate-600 hover:text-blue-900 hover:bg-white/60'
              }`}
            >
              <span className="material-symbols-outlined text-lg">dashboard</span>
              <span>Dashboard</span>
            </button>

            {/* Search Estates (User request: add the search page as it is on the properties) */}
            <button
              onClick={() => {
                setActiveTab('search');
                setMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-all cursor-pointer ${
                activeTab === 'search'
                  ? 'bg-white text-blue-900 font-bold shadow-sm scale-[0.99] border border-blue-900/10'
                  : 'text-slate-600 hover:text-blue-900 hover:bg-white/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-lg">travel_explore</span>
                <span>Search Estates</span>
              </div>
              <span className="text-[9px] uppercase px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-900 font-bold">
                Map
              </span>
            </button>

            {/* Saved Estates */}
            <button
              onClick={() => {
                setActiveTab('saved');
                setMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-all cursor-pointer ${
                activeTab === 'saved'
                  ? 'bg-white text-blue-900 font-bold shadow-sm scale-[0.99] border border-blue-900/10'
                  : 'text-slate-600 hover:text-blue-900 hover:bg-white/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-lg">bookmark</span>
                <span>Saved Estates</span>
              </div>
              <span className="text-xs font-bold text-slate-400">12</span>
            </button>

            {/* Messages */}
            <button
              onClick={() => {
                setActiveTab('messages');
                setMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-all cursor-pointer ${
                activeTab === 'messages'
                  ? 'bg-white text-blue-900 font-bold shadow-sm scale-[0.99] border border-blue-900/10'
                  : 'text-slate-600 hover:text-blue-900 hover:bg-white/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-lg">mail</span>
                <span>Messages</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
            </button>

            {/* Investment Insights */}
            <button
              onClick={() => {
                setActiveTab('insights');
                setMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all cursor-pointer ${
                activeTab === 'insights'
                  ? 'bg-white text-blue-900 font-bold shadow-sm scale-[0.99] border border-blue-900/10'
                  : 'text-slate-600 hover:text-blue-900 hover:bg-white/60'
              }`}
            >
              <span className="material-symbols-outlined text-lg">trending_up</span>
              <span>Investment Insights</span>
            </button>

            {/* My Documents */}
            <button
              onClick={() => {
                setActiveTab('documents');
                setMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all cursor-pointer ${
                activeTab === 'documents'
                  ? 'bg-white text-blue-900 font-bold shadow-sm scale-[0.99] border border-blue-900/10'
                  : 'text-slate-600 hover:text-blue-900 hover:bg-white/60'
              }`}
            >
              <span className="material-symbols-outlined text-lg">description</span>
              <span>My Documents</span>
            </button>
          </nav>
        </div>

        {/* Bottom Actions: Contact Advisor + Exit to Public Site */}
        <div className="space-y-2 pt-4 border-t border-slate-200/60">
          <button
            onClick={() => {
              onOpenConsultation();
              setMobileSidebarOpen(false);
            }}
            className="w-full py-3 bg-[#00236f] text-white rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-[#001c55] active:scale-98 transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-base">support_agent</span>
            <span>Contact Advisor</span>
          </button>

          <button
            onClick={() => onNavigate('home')}
            className="w-full py-2 text-slate-500 hover:text-[#00236f] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            <span>Back to Public Site</span>
          </button>
        </div>
      </aside>

      {/* Mobile backdrop */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-30 md:hidden animate-in fade-in duration-200"
        />
      )}

      {/* -------------------------------------------------------------
          MAIN CONTAINER (with TopNavBar)
          ------------------------------------------------------------- */}
      <div className="flex-1 flex flex-col min-w-0 md:pl-64">
        {/* TopNavBar */}
        <header className="fixed top-0 right-0 left-0 md:left-64 z-30 flex justify-between items-center px-4 sm:px-8 py-3.5 bg-white/80 backdrop-blur-md border-b border-[#c5c5d3]/20 font-['Manrope']">
          <div className="flex items-center gap-3 flex-1">
            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="md:hidden p-2 text-slate-700 hover:text-blue-900 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Open portal navigation"
            >
              <span className="material-symbols-outlined text-xl">menu</span>
            </button>

            {/* Quick Search Bar */}
            <form onSubmit={handleTopSearchSubmit} className="relative w-full max-w-md">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
                search
              </span>
              <input
                type="text"
                value={searchBarQuery}
                onChange={(e) => setSearchBarQuery(e.target.value)}
                placeholder="Search estates, areas or documents..."
                className="w-full bg-slate-100 border-none rounded-xl py-2 pl-10 pr-4 text-xs md:text-sm text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-[#00236f]/30 focus:bg-white transition-all outline-none"
              />
            </form>
          </div>

          <div className="flex items-center gap-4 sm:gap-6 relative">
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="text-slate-500 hover:text-blue-900 transition-colors relative p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
                title="Notifications"
              >
                <span className="material-symbols-outlined text-xl">notifications</span>
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-600 rounded-full border-2 border-white"></span>
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50 text-xs animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <span className="font-bold text-slate-900">Notifications</span>
                    <span className="text-[10px] text-blue-900 font-semibold uppercase">3 New</span>
                  </div>
                  <div className="space-y-3 mt-3">
                    <div className="p-2.5 rounded-xl bg-blue-50/70 border border-blue-100">
                      <p className="font-bold text-blue-900 text-[11px]">Private Tour Confirmed</p>
                      <p className="text-slate-600 text-[11px] mt-0.5">
                        Kigali View Heights viewing confirmed for Saturday 2:00 PM.
                      </p>
                      <span className="text-[9px] text-slate-400 mt-1 block">2 hours ago</span>
                    </div>
                    <div className="p-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                      <p className="font-bold text-slate-800 text-[11px]">Price Drop: Palm Grove</p>
                      <p className="text-slate-600 text-[11px] mt-0.5">
                        Property dropped by $15,000 in Nyarutarama.
                      </p>
                      <span className="text-[9px] text-slate-400 mt-1 block">14 mins ago</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Account Circle Menu */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 text-slate-700 hover:text-blue-900 transition-colors p-1 rounded-xl hover:bg-slate-100 cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-200 border border-slate-300">
                  <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
                </div>
                <span className="hidden sm:inline font-bold text-xs text-slate-800">
                  {displayName.split(' ')[0]}
                </span>
                <span className="material-symbols-outlined text-sm text-slate-400">expand_more</span>
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 text-xs animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-2.5 border-b border-slate-100">
                    <p className="font-bold text-slate-900 truncate">{displayName}</p>
                    <p className="text-slate-400 text-[10px] truncate">{user?.email || 'emma@estate.rw'}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-blue-100 text-blue-900">
                      {displayRole}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setActiveTab('dashboard');
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                  >
                    <span className="material-symbols-outlined text-sm">dashboard</span>
                    Dashboard
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('search');
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                  >
                    <span className="material-symbols-outlined text-sm">travel_explore</span>
                    Search Properties
                  </button>
                  <button
                    onClick={() => {
                      onOpenConsultation();
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                  >
                    <span className="material-symbols-outlined text-sm">calendar_month</span>
                    Book Consultation
                  </button>
                  <button
                    onClick={() => {
                      onNavigate('home');
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                  >
                    <span className="material-symbols-outlined text-sm">home</span>
                    Public Website
                  </button>

                  <div className="border-t border-slate-100 my-1"></div>

                  <button
                    onClick={async () => {
                      await logout();
                      setUserDropdownOpen(false);
                      onNavigate('home');
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 flex items-center gap-2 font-semibold"
                  >
                    <span className="material-symbols-outlined text-sm">logout</span>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* -------------------------------------------------------------
            TAB 1: ATTACHED TENANT & BUYER DASHBOARD PAGE
            ------------------------------------------------------------- */}
        {activeTab === 'dashboard' && (
          <main className="pt-20 px-4 sm:px-8 pb-16 min-h-screen">
            {/* Welcome Header */}
            <section className="mb-8 md:mb-12">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#191c1d] tracking-tight mb-2">
                Welcome Back, {displayName.split(' ')[0]}
              </h1>
              <p className="text-[#444651] font-['Inter'] text-sm sm:text-base">
                You have{' '}
                <button
                  onClick={() => setActiveTab('search')}
                  className="text-[#00236f] font-semibold underline hover:opacity-80 cursor-pointer"
                >
                  2 new property matches
                </button>{' '}
                found in Gasabo today.
              </p>
            </section>

            {/* Quick Stats Bento Grid */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 md:mb-16">
              {/* Stat 1: Saved Estates */}
              <div
                onClick={() => setActiveTab('saved')}
                className="bg-white p-6 rounded-2xl flex items-center justify-between group hover:bg-[#00236f] transition-all duration-300 border border-[#c5c5d3]/20 shadow-xs cursor-pointer"
              >
                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-500 group-hover:text-blue-200 transition-colors font-bold font-['Inter']">
                    Saved Estates
                  </p>
                  <p className="text-3xl font-bold mt-1 text-[#191c1d] group-hover:text-white font-['Manrope']">
                    12
                  </p>
                </div>
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center group-hover:bg-white/20 transition-colors">
                  <span className="material-symbols-outlined text-[#00236f] group-hover:text-white text-2xl">
                    bookmark
                  </span>
                </div>
              </div>

              {/* Stat 2: Active Inquiries */}
              <div
                onClick={() => {
                  const tableElem = document.getElementById('active-inquiries-section');
                  tableElem?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-white p-6 rounded-2xl flex items-center justify-between group hover:bg-[#00236f] transition-all duration-300 border border-[#c5c5d3]/20 shadow-xs cursor-pointer"
              >
                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-500 group-hover:text-blue-200 transition-colors font-bold font-['Inter']">
                    Active Inquiries
                  </p>
                  <p className="text-3xl font-bold mt-1 text-[#191c1d] group-hover:text-white font-['Manrope']">
                    04
                  </p>
                </div>
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center group-hover:bg-white/20 transition-colors">
                  <span className="material-symbols-outlined text-[#00236f] group-hover:text-white text-2xl">
                    chat
                  </span>
                </div>
              </div>

              {/* Stat 3: Portfolio Value */}
              <div
                onClick={() => setActiveTab('insights')}
                className="bg-white p-6 rounded-2xl flex items-center justify-between group hover:bg-[#00236f] transition-all duration-300 border border-[#c5c5d3]/20 shadow-xs cursor-pointer"
              >
                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-500 group-hover:text-blue-200 transition-colors font-bold font-['Inter']">
                    Portfolio Value
                  </p>
                  <p className="text-3xl font-bold mt-1 text-[#191c1d] group-hover:text-white font-['Manrope']">
                    $1.2M
                  </p>
                </div>
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center group-hover:bg-white/20 transition-colors">
                  <span className="material-symbols-outlined text-[#00236f] group-hover:text-white text-2xl">
                    account_balance_wallet
                  </span>
                </div>
              </div>
            </section>

            {/* Recommended & Investment Split */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              {/* Left Column: Recommended & Active Inquiries (8 cols) */}
              <div className="lg:col-span-8 space-y-12">
                {/* Recommended for You */}
                <div>
                  <div className="flex justify-between items-end mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-[#191c1d] font-['Manrope']">
                        Recommended for You
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Curated specifically based on your tenant &amp; investment profile
                      </p>
                    </div>
                    {/* View all matches button switches directly to the search page as requested */}
                    <button
                      onClick={() => setActiveTab('search')}
                      className="text-[#00236f] text-sm font-semibold flex items-center gap-1 hover:underline cursor-pointer group"
                    >
                      <span>View all matches</span>
                      <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">
                        arrow_forward
                      </span>
                    </button>
                  </div>

                  {/* Horizontal snap cards */}
                  <div className="flex overflow-x-auto gap-6 pb-4 custom-scrollbar snap-x">
                    {recommendedEstates.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => {
                          if (item.propertyObj) {
                            onSelectProperty(item.propertyObj);
                          }
                        }}
                        className="min-w-[320px] max-w-[340px] bg-white rounded-2xl overflow-hidden snap-start group cursor-pointer border border-[#c5c5d3]/20 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                      >
                        <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute top-4 right-4 bg-[#432200]/90 text-white px-3 py-1 rounded-md text-xs font-bold backdrop-blur-sm shadow-xs">
                            AI Score: {item.aiScore}
                          </div>
                        </div>

                        <div className="p-5 flex-1 flex flex-col justify-between">
                          <div>
                            <p className="text-[11px] font-bold uppercase text-[#733e0d] tracking-widest mb-1 font-['Inter']">
                              {item.category}
                            </p>
                            <h3 className="text-lg font-bold text-[#191c1d] group-hover:text-[#00236f] transition-colors mb-1 font-['Manrope']">
                              {item.title}
                            </h3>
                            <p className="text-slate-500 text-xs flex items-center gap-1 mb-4">
                              <span className="material-symbols-outlined text-sm text-slate-400">
                                location_on
                              </span>
                              {item.location}
                            </p>
                          </div>

                          <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                            <span className="text-[#00236f] font-bold text-lg font-['Manrope']">
                              {item.price}
                            </span>
                            <span className="text-xs text-slate-400 font-medium">
                              {item.specs}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Active Inquiries Table */}
                <div id="active-inquiries-section">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-[#191c1d] font-['Manrope']">
                      Active Inquiries
                    </h2>
                    <button
                      onClick={() => onOpenConsultation()}
                      className="text-xs font-bold text-[#00236f] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">add</span>
                      New Inquiry
                    </button>
                  </div>

                  <div className="bg-white rounded-2xl overflow-hidden border border-[#c5c5d3]/20 shadow-xs">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead className="bg-[#f3f4f5] text-xs uppercase text-slate-500 tracking-wider font-semibold border-b border-[#c5c5d3]/15">
                          <tr>
                            <th className="px-6 py-4">Property</th>
                            <th className="px-6 py-4">Agent</th>
                            <th className="px-6 py-4">Last Update</th>
                            <th className="px-6 py-4">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                          {inquiries.map((inq) => (
                            <tr
                              key={inq.id}
                              onClick={() => setSelectedInquiry(inq)}
                              className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                            >
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                                    <img
                                      src={inq.propertyImage}
                                      alt={inq.propertyTitle}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <span className="font-semibold text-sm text-[#191c1d] group-hover:text-[#00236f] transition-colors">
                                    {inq.propertyTitle}
                                  </span>
                                </div>
                              </td>

                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2.5">
                                  <div
                                    className={`w-6 h-6 rounded-full ${inq.agentColor} shrink-0 flex items-center justify-center font-bold text-[10px] text-slate-700`}
                                  >
                                    {inq.agentName.charAt(0)}
                                  </div>
                                  <span className="text-sm text-slate-800 font-medium">
                                    {inq.agentName}
                                  </span>
                                </div>
                              </td>

                              <td className="px-6 py-4 text-xs text-slate-500 italic">
                                {inq.lastUpdate}
                              </td>

                              <td className="px-6 py-4">
                                <span
                                  className={`px-3 py-1 text-[10px] font-bold uppercase rounded-full tracking-wider ${inq.statusColor}`}
                                >
                                  {inq.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Insights & Activity (4 cols) */}
              <div className="lg:col-span-4 space-y-10">
                {/* Investment Insights Widget */}
                <div className="bg-[#f3f4f5] p-8 rounded-2xl relative overflow-hidden border border-[#c5c5d3]/20 shadow-xs">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#00236f]/5 rounded-full -mr-16 -mt-16 blur-3xl pointer-events-none"></div>

                  <h2 className="text-xl font-bold mb-1 text-[#191c1d] font-['Manrope']">
                    Market Trends
                  </h2>
                  <p className="text-xs text-slate-500 mb-8 font-medium">
                    Quarterly appreciation in Gasabo
                  </p>

                  <div className="space-y-6">
                    {/* Kicukiro */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-700">Kicukiro</span>
                      <div className="flex items-center gap-3">
                        <div className="w-24 sm:w-28 h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div className="w-[75%] h-full bg-[#00236f] rounded-full"></div>
                        </div>
                        <span className="text-xs font-bold text-[#00236f] w-12 text-right">
                          +12.4%
                        </span>
                      </div>
                    </div>

                    {/* Gasabo */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-700">Gasabo</span>
                      <div className="flex items-center gap-3">
                        <div className="w-24 sm:w-28 h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div className="w-[85%] h-full bg-[#00236f] rounded-full"></div>
                        </div>
                        <span className="text-xs font-bold text-[#00236f] w-12 text-right">
                          +15.2%
                        </span>
                      </div>
                    </div>

                    {/* Nyarugenge */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-700">Nyarugenge</span>
                      <div className="flex items-center gap-3">
                        <div className="w-24 sm:w-28 h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div className="w-[60%] h-full bg-[#00236f] rounded-full"></div>
                        </div>
                        <span className="text-xs font-bold text-[#00236f] w-12 text-right">
                          +8.9%
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => showToast('Full Q3/Q4 Kigali Market Report downloaded to your device.')}
                    className="mt-8 w-full py-3 border border-[#00236f]/30 text-[#00236f] bg-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#00236f] hover:text-white transition-all cursor-pointer shadow-xs active:scale-98"
                  >
                    Download Full Report
                  </button>
                </div>

                {/* Recent Activity */}
                <div>
                  <h2 className="text-xl font-bold mb-6 text-[#191c1d] font-['Manrope']">
                    Recent Activity
                  </h2>

                  <div className="space-y-6">
                    {/* Item 1 */}
                    <div className="flex gap-4 items-start">
                      <div className="w-10 h-10 rounded-full bg-[#ffdcc1] flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[#432200] text-lg">
                          trending_down
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#191c1d]">Price Drop Alert</p>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          The property &apos;Palm Grove&apos; just dropped by $15,000.
                        </p>
                        <p className="text-[10px] text-slate-400 mt-1 font-semibold">14 mins ago</p>
                      </div>
                    </div>

                    {/* Item 2 */}
                    <div className="flex gap-4 items-start">
                      <div className="w-10 h-10 rounded-full bg-[#dce1ff] flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[#00236f] text-lg">
                          visibility
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#191c1d]">New View</p>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          Sandra Umutoni viewed your shared portfolio link.
                        </p>
                        <p className="text-[10px] text-slate-400 mt-1 font-semibold">2 hours ago</p>
                      </div>
                    </div>

                    {/* Item 3 */}
                    <div className="flex gap-4 items-start">
                      <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-slate-600 text-lg">
                          verified
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#191c1d]">Document Verified</p>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          Your &apos;Proof of Funds&apos; was verified by the admin team.
                        </p>
                        <p className="text-[10px] text-slate-400 mt-1 font-semibold">5 hours ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        )}

        {/* -------------------------------------------------------------
            TAB 2: SEARCH PAGE AS IT IS ON PROPERTIES (Exact Full Map & Explorer)
            ------------------------------------------------------------- */}
        {activeTab === 'search' && (
          <div className="pt-16 min-h-screen">
            <div className="bg-white border-b border-[#c5c5d3]/20 px-6 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className="text-xs text-slate-500 hover:text-blue-900 flex items-center gap-1 font-semibold"
                >
                  <span className="material-symbols-outlined text-sm">arrow_back</span>
                  Back to Dashboard
                </button>
                <span className="text-slate-300">|</span>
                <span className="text-xs font-bold text-blue-900">
                  Interactive Kigali Map &amp; Estate Explorer
                </span>
              </div>
            </div>

            <PropertySearchExplorer
              initialDistrict="All Districts"
              initialType="All Types"
              initialPriceRange="All Price Ranges"
              onSelectProperty={onSelectProperty}
              onBookTour={onBookTour}
              onNavigate={onNavigate}
              onOpenConsultation={onOpenConsultation}
            />
          </div>
        )}

        {/* -------------------------------------------------------------
            TAB 3: SAVED ESTATES
            ------------------------------------------------------------- */}
        {activeTab === 'saved' && (
          <main className="pt-24 px-4 sm:px-8 pb-16 min-h-screen">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-extrabold text-[#191c1d]">Saved Estates (12)</h1>
                <p className="text-xs text-slate-500 mt-1">
                  Your bookmarked luxury properties, private villas, and investment lots
                </p>
              </div>
              <button
                onClick={() => setActiveTab('search')}
                className="px-4 py-2 bg-[#00236f] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm hover:bg-[#001c55]"
              >
                <span className="material-symbols-outlined text-sm">travel_explore</span>
                Browse More on Map
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.slice(0, 6).map((prop) => (
                <div
                  key={prop.id}
                  onClick={() => onSelectProperty(prop)}
                  className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                    <img
                      src={prop.image}
                      alt={prop.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs p-1.5 rounded-full text-red-600 shadow-xs">
                      <span className="material-symbols-outlined text-base">bookmark</span>
                    </div>
                    <div className="absolute bottom-3 left-3 bg-black/60 text-white text-[11px] px-2.5 py-1 rounded-md backdrop-blur-xs font-bold">
                      {prop.priceDisplay}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-sm text-slate-900 group-hover:text-blue-900 transition-colors">
                      {prop.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">location_on</span>
                      {prop.location}
                    </p>
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] text-slate-500">
                        {prop.beds} Beds • {prop.baths} Baths
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onBookTour(prop);
                        }}
                        className="px-2.5 py-1 bg-blue-50 text-blue-900 text-xs font-bold rounded-lg hover:bg-blue-900 hover:text-white transition-colors"
                      >
                        Book Tour
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </main>
        )}

        {/* -------------------------------------------------------------
            TAB 4: MESSAGES (Advisory Chat)
            ------------------------------------------------------------- */}
        {activeTab === 'messages' && (
          <main className="pt-24 px-4 sm:px-8 pb-16 min-h-screen">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[700px]">
              {/* Chat Header */}
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#00236f] text-white flex items-center justify-center font-bold text-sm">
                    {activeChatAgent === 'david' ? 'DR' : 'SU'}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">
                      {activeChatAgent === 'david' ? 'David Rugamba' : 'Sandra Umutoni'}
                    </h3>
                    <p className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      Online · Dedicated VIP Concierge
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveChatAgent('david')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                      activeChatAgent === 'david'
                        ? 'bg-[#00236f] text-white'
                        : 'bg-white text-slate-600 border border-slate-200'
                    }`}
                  >
                    David Rugamba
                  </button>
                  <button
                    onClick={() => setActiveChatAgent('sandra')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                      activeChatAgent === 'sandra'
                        ? 'bg-[#00236f] text-white'
                        : 'bg-white text-slate-600 border border-slate-200'
                    }`}
                  >
                    Sandra Umutoni
                  </button>
                </div>
              </div>

              {/* Chat Message List */}
              <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/50">
                {chatMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-md rounded-2xl p-4 text-xs leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-[#00236f] text-white rounded-br-none shadow-sm'
                          : 'bg-white text-slate-800 rounded-bl-none border border-slate-200 shadow-xs'
                      }`}
                    >
                      <p>{msg.text}</p>
                      <span
                        className={`text-[9px] mt-1 block text-right ${
                          msg.sender === 'user' ? 'text-blue-200' : 'text-slate-400'
                        }`}
                      >
                        {msg.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input Box */}
              <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-200 flex gap-3">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Type your message to the private advisor..."
                  className="flex-1 bg-slate-100 border-none rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#00236f]/30 transition-all outline-none"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#00236f] text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#001c55] transition-colors cursor-pointer flex items-center gap-1 shadow-xs"
                >
                  <span>Send</span>
                  <span className="material-symbols-outlined text-sm">send</span>
                </button>
              </form>
            </div>
          </main>
        )}

        {/* -------------------------------------------------------------
            TAB 5: INVESTMENT INSIGHTS
            ------------------------------------------------------------- */}
        {activeTab === 'insights' && (
          <main className="pt-24 px-4 sm:px-8 pb-16 min-h-screen">
            <h1 className="text-3xl font-extrabold text-[#191c1d] mb-2 font-['Manrope']">
              Investment Insights &amp; Market Intelligence
            </h1>
            <p className="text-xs text-slate-500 mb-8">
              Kigali urban corridor developments, rental yield trends, and master plan forecasts
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
                <p className="text-xs font-bold uppercase text-slate-500">Average Annual Appreciation</p>
                <p className="text-3xl font-extrabold text-[#00236f] mt-1">+14.2%</p>
                <p className="text-[11px] text-emerald-600 mt-2 font-semibold">
                  +3.1% higher than regional average
                </p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
                <p className="text-xs font-bold uppercase text-slate-500">Nyarutarama Median Rent</p>
                <p className="text-3xl font-extrabold text-[#00236f] mt-1">$3,800/mo</p>
                <p className="text-[11px] text-slate-500 mt-2 font-semibold">
                  98% occupancy among diplomatic tenants
                </p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
                <p className="text-xs font-bold uppercase text-slate-500">Infrastructure Impact</p>
                <p className="text-3xl font-extrabold text-[#00236f] mt-1">Bugesera Corridor</p>
                <p className="text-[11px] text-blue-700 mt-2 font-semibold">
                  New international airport expressway completed
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <h3 className="font-bold text-base text-slate-900 mb-4">
                District Rental Yield Heatmap (2026)
              </h3>
              <div className="space-y-4">
                {[
                  { district: 'Nyarutarama (Gasabo)', yield: '10.8%', type: 'Prime Diplomatic Villa', trend: 'Strongly Up' },
                  { district: 'Kacyiru (Gasabo)', yield: '9.4%', type: 'Executive Residences', trend: 'Up' },
                  { district: 'Gacuriro (Gasabo)', yield: '10.1%', type: 'Modern Gated Estates', trend: 'Strongly Up' },
                  { district: 'Kicukiro Heights', yield: '8.9%', type: 'Commercial Apartments', trend: 'Stable' },
                  { district: 'Kiyovu (Nyarugenge)', yield: '9.8%', type: 'Heritage & Modern Luxury', trend: 'Up' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                    <div>
                      <p className="font-bold text-xs text-slate-900">{item.district}</p>
                      <p className="text-[10px] text-slate-500">{item.type}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-extrabold text-sm text-[#00236f]">{item.yield}</span>
                      <span className="block text-[10px] text-emerald-600 font-semibold">{item.trend}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>
        )}

        {/* -------------------------------------------------------------
            TAB 6: MY DOCUMENTS
            ------------------------------------------------------------- */}
        {activeTab === 'documents' && (
          <main className="pt-24 px-4 sm:px-8 pb-16 min-h-screen">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-extrabold text-[#191c1d]">My Documents</h1>
                <p className="text-xs text-slate-500 mt-1">
                  Verified certificates, tenant identity verification, and lease dossier
                </p>
              </div>
              <button
                onClick={() => showToast('Uploaded document submitted for admin verification.')}
                className="px-4 py-2 bg-[#00236f] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm hover:bg-[#001c55]"
              >
                <span className="material-symbols-outlined text-sm">upload_file</span>
                Upload Document
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {documents.map((doc, idx) => (
                <div
                  key={idx}
                  className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#00236f] flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-2xl">description</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-900">{doc.title}</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">{doc.issuer}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[9px] font-bold uppercase">
                          {doc.status}
                        </span>
                        <span className="text-[9px] text-slate-400">{doc.size}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => showToast(`Downloading ${doc.title}...`)}
                    className="p-2 text-slate-400 hover:text-[#00236f] hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
                    title="Download document"
                  >
                    <span className="material-symbols-outlined text-lg">download</span>
                  </button>
                </div>
              ))}
            </div>
          </main>
        )}
      </div>

      {/* Inquiry Detail Modal */}
      {selectedInquiry && (
        <div
          onClick={() => setSelectedInquiry(null)}
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-blue-900 tracking-wider">
                  Inquiry Dossier
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                  {selectedInquiry.propertyTitle}
                </h3>
              </div>
              <button
                onClick={() => setSelectedInquiry(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-800"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="aspect-video rounded-xl overflow-hidden bg-slate-100">
                <img
                  src={selectedInquiry.propertyImage}
                  alt={selectedInquiry.propertyTitle}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl">
                <div>
                  <span className="text-slate-400 text-[10px] block">Assigned Advisor</span>
                  <span className="font-bold text-slate-800">{selectedInquiry.agentName}</span>
                  <span className="text-slate-500 text-[10px] block">{selectedInquiry.agentRole}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Current Status</span>
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${selectedInquiry.statusColor}`}>
                    {selectedInquiry.status}
                  </span>
                  <span className="text-slate-500 text-[10px] block mt-1">Date: {selectedInquiry.date}</span>
                </div>
              </div>

              <div>
                <span className="text-slate-400 text-[10px] font-bold uppercase block mb-1">
                  Advisor Notes &amp; Logistics
                </span>
                <p className="text-slate-700 bg-blue-50/50 p-3 rounded-xl border border-blue-100/50 leading-relaxed">
                  {selectedInquiry.notes}
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    setSelectedInquiry(null);
                    setActiveTab('messages');
                  }}
                  className="flex-1 py-2.5 bg-[#00236f] text-white rounded-xl font-bold text-xs hover:bg-[#001c55] transition-colors"
                >
                  Message Advisor
                </button>
                <button
                  onClick={() => {
                    setSelectedInquiry(null);
                    onOpenConsultation();
                  }}
                  className="px-4 py-2.5 border border-slate-300 text-slate-700 rounded-xl font-bold text-xs hover:bg-slate-50 transition-colors"
                >
                  Reschedule
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#00236f] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-bold animate-in slide-in-from-bottom-5">
          <span className="material-symbols-outlined text-base text-emerald-400">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
