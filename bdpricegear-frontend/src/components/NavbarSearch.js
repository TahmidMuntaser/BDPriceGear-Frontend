'use client';

import { useRouter } from 'next/navigation';

export default function NavbarSearch({searchTerm, setSearchTerm, onSearch, loading, className = ""}) {
    const router = useRouter();
    
    const handleSubmit = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            // Navigate to search results page
            router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={`group ${className}`}>  
            <div className="relative flex items-center w-full">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur opacity-20 group-hover:opacity-40 group-focus-within:opacity-60 transition duration-300"></div>
                <div className="relative flex items-center w-full bg-[#1A1F2E] rounded-xl border border-gray-700/50 group-focus-within:border-blue-500/50 transition-all duration-200">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400 group-focus-within:text-blue-400 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search for products..."
                        className="w-full bg-transparent text-white pl-12 pr-20 py-3 rounded-xl border-none outline-none placeholder-gray-400 text-sm font-medium"
                        disabled={loading}
                    />
                    <button 
                        type="submit"
                        disabled={loading || !searchTerm.trim()}
                        className="absolute inset-y-0 right-0 flex items-center pr-3"
                    >
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl">
                            {loading ? (
                                <div className="flex items-center space-x-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    <span className="text-white text-sm font-medium hidden sm:inline">Searching...</span>
                                </div>
                            ) : (
                                <span className="text-white text-sm font-medium">Search</span>
                            )}
                        </div>
                    </button>
                </div>
            </div>
        </form>
    );
}