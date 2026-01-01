'use client';

import { useState, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
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
  const [searchTerm, setSearchTerm] = useState('');
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Clear search term when navigating away from products page or when search query is cleared
  useEffect(() => {
    const query = searchParams.get('q');
    if (pathname !== '/products' || !query) {
      setSearchTerm('');
    }
  }, [pathname, searchParams]);
  
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
    <nav className="sticky top-0 z-50 bg-gray-900 border-b border-emerald-900/20 shadow-lg shadow-emerald-950/10">
      {/* Main Navbar */}
      <div className="bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <Link href="/" className="flex items-center gap-0 flex-shrink-0 group">
              <div className="font-bold text-2xl tracking-widest leading-none">
                <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent font-bold">
                  BDPRICE
                </span>
                <span className="bg-gradient-to-r from-emerald-500 to-teal-400 bg-clip-text text-transparent font-bold drop-shadow-[0_0_10px_rgba(16,185,129,0.4)]">
                  GEAR
                </span>
              </div>
            </Link>

            {/* Desktop Search Bar */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-8">
              <NavbarSearch 
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                className="w-full"
              />
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              
              {/* Desktop Icons */}
              <div className="hidden md:flex items-center gap-4">
                <Link 
                  href="/compare" 
                  className="relative p-2 hover:bg-gray-800/50 rounded-lg transition-all duration-200 group"
                >
                  <BarChart3 className="w-6 h-6 text-gray-400 group-hover:text-emerald-400 transition-colors" />
                  {compareCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center shadow-lg shadow-emerald-500/50">
                      {compareCount}
                    </span>
                  )}
                </Link>

                <Link 
                  href="/wishlist" 
                  className="relative p-2 hover:bg-gray-800/50 rounded-lg transition-all duration-200 group"
                >
                  <Heart className="w-6 h-6 text-gray-400 group-hover:text-red-400 transition-colors" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center shadow-lg shadow-red-500/50">
                      {wishlistCount}
                    </span>
                  )}
                </Link>

                <Link 
                  href="/cart" 
                  className="relative p-2 hover:bg-gray-800/50 rounded-lg transition-all duration-200 group"
                >
                  <ShoppingCart className="w-6 h-6 text-gray-400 group-hover:text-teal-400 transition-colors" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-teal-500 to-emerald-500 text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center shadow-lg shadow-teal-500/50">
                      {cartCount}
                    </span>
                  )}
                </Link>

                <Link 
                  href="/account"
                  className="p-2 hover:bg-gray-800/50 rounded-lg transition-all duration-200 group"
                >
                  <User className="w-6 h-6 text-gray-400 group-hover:text-emerald-400 transition-colors" />
                </Link>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 hover:bg-gray-800/50 rounded-lg transition-colors"
                aria-label="Menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6 text-emerald-400" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-400 hover:text-emerald-400 transition-colors" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="md:hidden pb-4">
            <NavbarSearch 
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Categories Bar - Desktop */}
      <div className="hidden md:block bg-gray-800/30 backdrop-blur-sm border-t border-emerald-900/10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-1 py-3">
            {/* Categories Dropdown */}
            <div className="relative">
              <button
                onMouseEnter={() => setIsCategoriesOpen(true)}
                onMouseLeave={() => setIsCategoriesOpen(false)}
                className="flex items-center gap-2 px-4 py-2.5 bg-gray-800/80 hover:bg-gray-700/80 text-gray-300 hover:text-emerald-400 rounded-lg transition-all duration-200 border border-gray-700/50 hover:border-emerald-500/30 shadow-sm hover:shadow-emerald-500/20"
              >
                <Menu className="w-4 h-4" />
                <span className="font-medium">Categories</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isCategoriesOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isCategoriesOpen && (
                <div
                  onMouseEnter={() => setIsCategoriesOpen(true)}
                  onMouseLeave={() => setIsCategoriesOpen(false)}
                  className="absolute top-full left-0 mt-2 w-60 bg-gray-800/95 backdrop-blur-md border border-emerald-500/20 rounded-lg shadow-2xl shadow-emerald-950/50 z-50 overflow-hidden"
                >
                  {categories.map((category, index) => (
                    <Link
                      key={index}
                      href={category.href}
                      className="block px-4 py-3 text-gray-300 hover:bg-gray-700/50 hover:text-emerald-400 transition-all duration-200 first:pt-3 last:pb-3 border-l-2 border-transparent hover:border-emerald-500"
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
                className="px-4 py-2.5 text-gray-400 hover:text-emerald-400 hover:bg-gray-800/50 rounded-lg transition-all duration-200 whitespace-nowrap"
              >
                All Products
              </Link>
              <Link 
                href="/shops" 
                className="px-4 py-2.5 text-gray-400 hover:text-emerald-400 hover:bg-gray-800/50 rounded-lg transition-all duration-200 whitespace-nowrap"
              >
                Shops
              </Link>
              
              {categories.slice(0, 5).map((category, index) => (
                <Link
                  key={index}
                  href={category.href}
                  className="px-4 py-2.5 text-gray-400 hover:text-emerald-400 hover:bg-gray-800/50 rounded-lg transition-all duration-200 whitespace-nowrap"
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
        <div className="md:hidden bg-gray-850 border-t border-emerald-900/20">
          <div className="max-w-7xl mx-auto px-4 py-4">
            {/* Mobile Icons Row */}
            <div className="flex items-center justify-around pb-4 mb-4 border-b border-emerald-900/20">
              <Link 
                href="/compare" 
                className="flex flex-col items-center gap-1 group"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="relative">
                  <BarChart3 className="w-6 h-6 text-gray-400 group-hover:text-emerald-400 transition-colors" />
                  {compareCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-semibold rounded-full w-4 h-4 flex items-center justify-center shadow-lg shadow-emerald-500/50">
                      {compareCount}
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-400 group-hover:text-emerald-400 transition-colors">Compare</span>
              </Link>

              <Link 
                href="/wishlist" 
                className="flex flex-col items-center gap-1 group"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="relative">
                  <Heart className="w-6 h-6 text-gray-400 group-hover:text-red-400 transition-colors" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-semibold rounded-full w-4 h-4 flex items-center justify-center shadow-lg shadow-red-500/50">
                      {wishlistCount}
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-400 group-hover:text-red-400 transition-colors">Wishlist</span>
              </Link>

              <Link 
                href="/cart" 
                className="flex flex-col items-center gap-1 group"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="relative">
                  <ShoppingCart className="w-6 h-6 text-gray-400 group-hover:text-teal-400 transition-colors" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white text-xs font-semibold rounded-full w-4 h-4 flex items-center justify-center shadow-lg shadow-teal-500/50">
                      {cartCount}
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-400 group-hover:text-teal-400 transition-colors">Cart</span>
              </Link>

              <Link 
                href="/account" 
                className="flex flex-col items-center gap-1 group"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <User className="w-6 h-6 text-gray-400 group-hover:text-emerald-400 transition-colors" />
                <span className="text-xs text-gray-400 group-hover:text-emerald-400 transition-colors">Account</span>
              </Link>
            </div>

            {/* Navigation Links */}
            <div className="space-y-1">
              <Link
                href="/products"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-3 text-gray-300 hover:text-emerald-400 hover:bg-gray-800/50 rounded-lg transition-all duration-200 border-l-2 border-transparent hover:border-emerald-500"
              >
                All Products
              </Link>
              <Link
                href="/shops"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-3 text-gray-300 hover:text-emerald-400 hover:bg-gray-800/50 rounded-lg transition-all duration-200 border-l-2 border-transparent hover:border-emerald-500"
              >
                All Shops
              </Link>
              
              <div className="pt-2 mt-2 border-t border-emerald-900/20">
                <div className="text-xs text-emerald-500/60 px-4 py-2 font-medium">Categories</div>
                {categories.map((category, index) => (
                  <Link
                    key={index}
                    href={category.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-2 text-gray-400 hover:text-emerald-400 hover:bg-gray-800/50 rounded-lg transition-all duration-200 border-l-2 border-transparent hover:border-emerald-500"
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