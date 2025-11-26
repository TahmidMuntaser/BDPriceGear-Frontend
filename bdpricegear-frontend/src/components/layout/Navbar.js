'use client';

import { useState } from 'react';
import { useProductSearch } from '../../hooks/useProductSearch';
import NavbarSearch from '../NavbarSearch';
import Link from 'next/link';
import { 
  Search, 
  ShoppingCart, 
  Heart, 
  BarChart3, 
  User, 
  Menu, 
  X,
  ChevronDown
} from 'lucide-react';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  
  const { searchTerm, setSearchTerm, handleSearch, loading } = useProductSearch();
  
  const [cartCount] = useState(0);
  const [wishlistCount] = useState(0);
  const [compareCount] = useState(2);

  const categories = [
    { name: 'SSD', href: '/categories/ssd' },
    { name: 'HDD', href: '/categories/hdd' },
    { name: 'Mouse', href: '/categories/mouse' },
    { name: 'Keyboard', href: '/categories/keyboard' },
    { name: 'Monitor', href: '/categories/monitor' },
    { name: 'RAM', href: '/categories/ram' },
    { name: 'Webcam', href: '/categories/webcam' },
    { name: 'Speaker', href: '/categories/speaker' },
    { name: 'Microphone', href: '/categories/microphone' },
    { name: 'Laptop', href: '/categories/laptop' },
    { name: 'Headphone', href: '/categories/headphone' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-gray-900 border-b border-gray-800">
      {/* Main Navbar */}
      <div className="bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <Link href="/" className="flex items-center gap-0 flex-shrink-0 group">
              <div className="font-bold text-2xl tracking-widest leading-none">
                <span className="text-blue-500">BD</span>
                <span className="text-white">PriceGear</span>
              </div>
            </Link>

            {/* Desktop Search Bar */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-8">
              <NavbarSearch 
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                onSearch={handleSearch}
                loading={loading}
                className="w-full"
              />
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              
              {/* Desktop Icons */}
              <div className="hidden md:flex items-center gap-4">
                <Link 
                  href="/compare" 
                  className="relative p-2 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <BarChart3 className="w-6 h-6 text-gray-400 hover:text-blue-500" />
                  {compareCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
                      {compareCount}
                    </span>
                  )}
                </Link>

                <Link 
                  href="/wishlist" 
                  className="relative p-2 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <Heart className="w-6 h-6 text-gray-400 hover:text-red-500" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
                      {wishlistCount}
                    </span>
                  )}
                </Link>

                <Link 
                  href="/cart" 
                  className="relative p-2 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <ShoppingCart className="w-6 h-6 text-gray-400 hover:text-green-500" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>

                <Link 
                  href="/account"
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <User className="w-6 h-6 text-gray-400 hover:text-gray-200" />
                </Link>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 hover:bg-gray-800 rounded-lg transition-colors"
                aria-label="Menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6 text-gray-400" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="md:hidden pb-4">
            <NavbarSearch 
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              onSearch={handleSearch}
              loading={loading}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Categories Bar - Desktop */}
      <div className="hidden md:block bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-1 py-3">
            {/* Categories Dropdown */}
            <div className="relative">
              <button
                onMouseEnter={() => setIsCategoriesOpen(true)}
                onMouseLeave={() => setIsCategoriesOpen(false)}
                className="flex items-center gap-2 px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors border border-gray-700"
              >
                <Menu className="w-4 h-4" />
                <span className="font-medium">Categories</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isCategoriesOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isCategoriesOpen && (
                <div
                  onMouseEnter={() => setIsCategoriesOpen(true)}
                  onMouseLeave={() => setIsCategoriesOpen(false)}
                  className="absolute top-full left-0 mt-2 w-60 bg-gray-800 border border-gray-700 rounded-lg shadow-2xl z-50 overflow-hidden"
                >
                  {categories.map((category, index) => (
                    <Link
                      key={index}
                      href={category.href}
                      className="block px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors first:pt-3 last:pb-3"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Links */}
            <div className="flex items-center gap-1 flex-1 overflow-x-auto">
              <Link 
                href="/products" 
                className="px-4 py-2.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors whitespace-nowrap"
              >
                All Products
              </Link>
              <Link 
                href="/shops" 
                className="px-4 py-2.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors whitespace-nowrap"
              >
                Shops
              </Link>
              
              {categories.slice(0, 5).map((category, index) => (
                <Link
                  key={index}
                  href={category.href}
                  className="px-4 py-2.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors whitespace-nowrap"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-850 border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-4 py-4">
            {/* Mobile Icons Row */}
            <div className="flex items-center justify-around pb-4 mb-4 border-b border-gray-800">
              <Link 
                href="/compare" 
                className="flex flex-col items-center gap-1"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="relative">
                  <BarChart3 className="w-6 h-6 text-gray-400" />
                  {compareCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs font-semibold rounded-full w-4 h-4 flex items-center justify-center">
                      {compareCount}
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-400">Compare</span>
              </Link>

              <Link 
                href="/wishlist" 
                className="flex flex-col items-center gap-1"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="relative">
                  <Heart className="w-6 h-6 text-gray-400" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-semibold rounded-full w-4 h-4 flex items-center justify-center">
                      {wishlistCount}
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-400">Wishlist</span>
              </Link>

              <Link 
                href="/cart" 
                className="flex flex-col items-center gap-1"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="relative">
                  <ShoppingCart className="w-6 h-6 text-gray-400" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-semibold rounded-full w-4 h-4 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-400">Cart</span>
              </Link>

              <Link 
                href="/account" 
                className="flex flex-col items-center gap-1"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <User className="w-6 h-6 text-gray-400" />
                <span className="text-xs text-gray-400">Account</span>
              </Link>
            </div>

            {/* Navigation Links */}
            <div className="space-y-1">
              <Link
                href="/products"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-3 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
              >
                All Products
              </Link>
              <Link
                href="/shops"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-3 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
              >
                All Shops
              </Link>
              
              <div className="pt-2 mt-2 border-t border-gray-800">
                <div className="text-xs text-gray-500 px-4 py-2">Categories</div>
                {categories.map((category, index) => (
                  <Link
                    key={index}
                    href={category.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-2 text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg transition-colors"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}