'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SearchForm from './SearchForm';
import { TrendingUp, Zap, Shield, Clock } from 'lucide-react';

export default function PriceComparison() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const router = useRouter();

  const handleSearch = () => {
    if (searchTerm.trim()) {
      setIsTransitioning(true);
      // Small delay for smooth transition animation
      setTimeout(() => {
        router.push(`/price-comparison?product=${encodeURIComponent(searchTerm.trim())}`);
      }, 300);
    }
  };

  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Real-Time Comparison",
      description: "Get instant price updates from all major stores"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Best Deals",
      description: "Find the lowest prices across Bangladesh"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Trusted Stores",
      description: "Compare prices from verified retailers only"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Save Time",
      description: "No need to browse multiple websites"
    }
  ];

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-950 via-gray-950 to-black relative overflow-hidden transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.15]">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(16, 185, 129, 0.1) 2px, transparent 2px), linear-gradient(90deg, rgba(16, 185, 129, 0.1) 2px, transparent 2px)',
          backgroundSize: '60px 60px'
        }}></div>
      </div>

      {/* Animated Glow Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="relative max-w-7xl mx-auto px-4 py-12 sm:py-20">
        {/* Hero Section */}
        <div className="text-center mb-12 sm:mb-16">
          {/* Logo/Brand */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-emerald-500/30">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-emerald-400 rounded-tr-lg"></div>
              <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-emerald-400 rounded-bl-lg"></div>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold">
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 bg-clip-text text-transparent">
                BDPriceGear
              </span>
            </h1>
          </div>

          <p className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4">
            Compare Save Shop Smart
          </p>
          <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto mb-12">
            Find the best prices across Bangladesh&apos;s top e-commerce stores in seconds. Save money on every purchase.
          </p>

          {/* Search Section */}
          <div className="max-w-3xl mx-auto">
            <SearchForm 
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              onSearch={handleSearch}
              loading={isTransitioning}
              redirectToResults={false}
            />
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/20"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 rounded-xl flex items-center justify-center mb-4 text-emerald-400 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-400">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 sm:p-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-2">
                  10,000+
                </div>
                <div className="text-gray-400 text-sm sm:text-base">Products Tracked</div>
              </div>
            </div>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-2">
                  7
                </div>
                <div className="text-gray-400 text-sm sm:text-base">Trusted Stores</div>
              </div>
            </div>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-2">
                  24/7
                </div>
                <div className="text-gray-400 text-sm sm:text-base">Price Monitoring</div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <p className="text-gray-500 text-sm">
            Start comparing prices now and never overpay again
          </p>
        </div>
      </div>
    </div>
  );
}