'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { UserCircle, Mail, Calendar, ShoppingBag, Heart, BarChart3, Settings, LogOut } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const { isLoggedIn, user, logout, openLoginModal } = useAuth();

  useEffect(() => {
    // If not logged in, show login modal and redirect to home
    if (!isLoggedIn) {
      openLoginModal();
      router.push('/');
    }
  }, [isLoggedIn, openLoginModal, router]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  // Don't render if not logged in
  if (!isLoggedIn || !user) {
    return null;
  }

  const stats = [
    { icon: <ShoppingBag className="w-6 h-6" />, label: 'Orders', value: '0', color: 'from-teal-500 to-emerald-500' },
    { icon: <Heart className="w-6 h-6" />, label: 'Wishlist', value: '0', color: 'from-red-500 to-pink-500' },
    { icon: <BarChart3 className="w-6 h-6" />, label: 'Compared', value: '2', color: 'from-emerald-500 to-teal-500' },
  ];

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl mb-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/50">
              <UserCircle className="w-16 h-16 text-white" />
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-white mb-2">{user.name}</h1>
              <div className="flex items-center justify-center md:justify-start gap-2 text-gray-400 mb-4">
                <Mail className="w-4 h-4" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-2 text-gray-400">
                <Calendar className="w-4 h-4" />
                <span>Member since {new Date().toLocaleDateString()}</span>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-all duration-200 border border-red-500/20 hover:border-red-500/40"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-xl hover:shadow-2xl hover:border-emerald-400/30 transition-all duration-300"
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg mb-4 shadow-lg`}>
                {stat.icon}
              </div>
              <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-white">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Settings className="w-6 h-6 text-emerald-400" />
            Quick Actions
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button className="flex items-center gap-3 px-4 py-3 bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 hover:text-emerald-400 rounded-lg transition-all duration-200 border border-gray-700/50 hover:border-emerald-500/30">
              <ShoppingBag className="w-5 h-5" />
              <span>Order History</span>
            </button>

            <button className="flex items-center gap-3 px-4 py-3 bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 hover:text-emerald-400 rounded-lg transition-all duration-200 border border-gray-700/50 hover:border-emerald-500/30">
              <Heart className="w-5 h-5" />
              <span>My Wishlist</span>
            </button>

            <button className="flex items-center gap-3 px-4 py-3 bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 hover:text-emerald-400 rounded-lg transition-all duration-200 border border-gray-700/50 hover:border-emerald-500/30">
              <BarChart3 className="w-5 h-5" />
              <span>Price Comparisons</span>
            </button>

            <button className="flex items-center gap-3 px-4 py-3 bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 hover:text-emerald-400 rounded-lg transition-all duration-200 border border-gray-700/50 hover:border-emerald-500/30">
              <Settings className="w-5 h-5" />
              <span>Account Settings</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
