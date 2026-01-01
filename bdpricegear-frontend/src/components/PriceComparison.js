'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SearchForm from './SearchForm';

export default function PriceComparison() {
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const handleSearch = () => {
    if (searchTerm.trim()) {
      router.push(`/price-comparison?product=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black pt-8">
      
      {/* Geometric Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, #3b82f6 1px, transparent 1px),
                           radial-gradient(circle at 80% 20%, #8b5cf6 1px, transparent 1px),
                           radial-gradient(circle at 40% 80%, #06b6d4 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-12">
        {/* Search */}
        <SearchForm 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onSearch={handleSearch}
          loading={false}
          redirectToResults={false}
        />

        {/* Initial State */}
        <div className="text-center py-20">
          <div className="relative inline-block mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
              <span className="text-4xl">🛍️</span>
            </div>
            <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl blur-xl opacity-20 animate-pulse"></div>
          </div>
          <h3 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-6">
            Ready to find amazing deals?
          </h3>
          <p className="text-gray-300 text-xl max-w-2xl mx-auto leading-relaxed">
            Search for any product and compare prices across Bangladesh&apos;s top e-commerce stores in real-time
          </p>
        </div>
      </div>
    </div>
  );
}