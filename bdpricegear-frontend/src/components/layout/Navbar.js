'use client';

import { useState } from 'react';

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock data for badges
  const [cartCount] = useState(0);
  const [wishlistCount] = useState(0);
  const [compareCount] = useState(0);

  const categories = [
    'All Category',
    'Laptop',
    'Desktop',
    'Components',
    'Accessories',
    'Smartphone',
    'Monitor',
    'Gaming',
    'Audio',
    'Storage'
  ];

  const navLinks = [
    'Laptop',
    'Desktop', 
    'Components',
    'Accessories',
    'Smartphone',
    'Monitor',
    'Gaming',
    'Audio',
    'Storage',
    'Networking'
  ];

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-[#0C0F17] to-[#1A1D25] shadow-lg">
      {/* Main Navbar */}
      <div className="h-[70px] px-4 lg:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-full">
          
          {/* Logo Section */}
          <div className="flex items-center space-x-4 lg:space-x-8">
            <div className="text-white text-xl lg:text-2xl font-mono tracking-wider">
              <span className="font-extrabold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">BDPRICE</span>
              <span className="font-light text-gray-300">GEAR</span>
            </div>
            
            {/* Category Dropdown - Hidden on mobile */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="bg-[#1E222B] text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-[#252A35] transition-colors duration-200"
              >
                <span>All Category</span>
                <svg 
                  className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              
              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 bg-[#1E222B] rounded-lg shadow-xl min-w-[200px] py-2 z-50">
                  {categories.map((category, index) => (
                    <button
                      key={index}
                      className="w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-[#252A35] transition-colors duration-150"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        // Handle category selection
                      }}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Search Bar - Hidden on small mobile, shown on tablet and up */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur opacity-20 group-hover:opacity-40 group-focus-within:opacity-60 transition duration-300"></div>
              <div className="relative flex items-center w-full bg-[#1A1F2E] rounded-xl border border-gray-700/50 group-focus-within:border-blue-500/50 transition-all duration-200">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400 group-focus-within:text-blue-400 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search for products..."
                  className="w-full bg-transparent text-white pl-12 pr-16 py-4 rounded-xl border-none outline-none placeholder-gray-400 text-sm font-medium"
                />
                <button className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl">
                    <span className="text-white text-sm font-medium">Search</span>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-2 lg:space-x-6">
            {/* Offers Button - Hidden on small screens */}
            <button className="hidden sm:flex bg-[#1E222B] hover:bg-[#252A35] text-white px-4 py-2 rounded-lg items-center space-x-2 shadow-md hover:shadow-lg transition-all duration-200">
              <span className="text-orange-500">🔥</span>
              <span className="hidden md:inline">Offers</span>
            </button>

            {/* Action Icons */}
            <div className="flex items-center space-x-2 lg:space-x-4">
              {/* Cart */}
              <button className="relative p-2 text-gray-300 hover:text-white transition-colors duration-200">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6.5M7 13l-4.5-1M20 13v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Wishlist */}
              <button className="relative p-2 text-gray-300 hover:text-white transition-colors duration-200">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </button>

              {/* Compare */}
              <button className="relative p-2 text-gray-300 hover:text-white transition-colors duration-200">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                {compareCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {compareCount}
                  </span>
                )}
              </button>

              {/* Profile - Hidden on mobile */}
              <button className="hidden sm:block p-2 text-gray-300 hover:text-white transition-colors duration-200">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>

              {/* Mobile Menu Button */}
              <button 
                className="lg:hidden p-2 text-gray-300 hover:text-white transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Search Section - Only visible on small screens */}
      <div className="md:hidden bg-[#151922] border-t border-gray-700/30">
        <div className="px-4 py-4">
          <div className="relative w-full group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur opacity-20 group-hover:opacity-40 group-focus-within:opacity-60 transition duration-300"></div>
            <div className="relative flex items-center w-full bg-[#1A1F2E] rounded-xl border border-gray-700/50 group-focus-within:border-blue-500/50 transition-all duration-200">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400 group-focus-within:text-blue-400 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for products..."
                className="w-full bg-transparent text-white pl-12 pr-20 py-4 rounded-xl border-none outline-none placeholder-gray-400 text-sm font-medium"
              />
              <button className="absolute inset-y-0 right-0 flex items-center pr-3">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl">
                  <span className="text-white text-sm font-medium">Search</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#151922] border-t border-gray-700/30">
          <div className="px-4 py-4 space-y-4">
            {/* Mobile Category Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full bg-[#1E222B] text-white px-4 py-3 rounded-lg flex items-center justify-between hover:bg-[#252A35] transition-colors duration-200"
              >
                <span>All Category</span>
                <svg 
                  className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              
              {isDropdownOpen && (
                <div className="mt-2 bg-[#1E222B] rounded-lg shadow-xl py-2">
                  {categories.map((category, index) => (
                    <button
                      key={index}
                      className="w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-[#252A35] transition-colors duration-150"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        // Handle category selection
                      }}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Navigation Links */}
            <div className="grid grid-cols-2 gap-2">
              {navLinks.map((link, index) => (
                <button
                  key={index}
                  className="text-gray-300 hover:text-white text-sm font-medium py-2 px-3 rounded hover:bg-[#1E222B] transition-colors duration-200"
                >
                  {link}
                </button>
              ))}
            </div>

            {/* Mobile Profile Button */}
            <button className="w-full bg-[#1E222B] hover:bg-[#252A35] text-white px-4 py-3 rounded-lg flex items-center space-x-2 transition-colors duration-200">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>Profile</span>
            </button>
          </div>
        </div>
      )}

      {/* Secondary Navigation - Desktop only */}
      <div className="hidden lg:block bg-[#151922] border-t border-gray-700/30">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center space-x-8 overflow-x-auto">
            {navLinks.map((link, index) => (
              <button
                key={index}
                className="text-gray-300 hover:text-white hover:underline underline-offset-4 whitespace-nowrap text-sm font-medium transition-colors duration-200"
              >
                {link}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Dropdown backdrop */}
      {(isDropdownOpen || isMobileMenuOpen) && (
        <div 
          className="fixed inset-0 bg-transparent z-40"
          onClick={() => {
            setIsDropdownOpen(false);
            setIsMobileMenuOpen(false);
          }}
        />
      )}
    </nav>
  );
}