'use client';

import { useRouter } from 'next/navigation';

export default function SearchForm({searchTerm, setSearchTerm, onSearch, loading, redirectToResults = false}) {
    const router = useRouter();
    
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!searchTerm.trim()) return;
        
        if (redirectToResults) {
            // Navigate to search results page (for navbar)
            router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
        } else {
            // Call the provided onSearch function (for home page)
            onSearch();
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setSearchTerm(suggestion);
        // Automatically trigger search after setting suggestion
        if (redirectToResults) {
            router.push(`/search?q=${encodeURIComponent(suggestion)}`);
        } else if (onSearch) {
            // Need to call onSearch with the suggestion directly
            // since state update is async
            router.push(`/price-comparison?product=${encodeURIComponent(suggestion)}`);
        }
    };

    return (
        <div className="max-w-3xl mx-auto mb-16">
            <form onSubmit={handleSubmit} className="relative group">  
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
                <div className="relative bg-gray-900/90 backdrop-blur-xl rounded-2xl p-8 border border-gray-800/50">
                    <div className="flex flex-col md:flex-row gap-4">
                            <div className="relative flex-1">
                                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search for products..."
                                    className="w-full pl-12 pr-4 py-4 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading || !searchTerm.trim()}
                                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                                >
                                {loading ? (
                                    <div className="flex items-center space-x-2">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    <span>Searching...</span>
                                    </div>
                                ) : (
                                    <span>Search</span>
                                )}
                            </button>
                    </div>

                    {/* Quick suggestions */}
                    <div className="mt-6 flex flex-wrap justify-center gap-2">
                        <span className="text-sm text-gray-400 mr-2">Popular:</span>
                        {['laptop', 'phone', 'headphones', 'mouse', 'keyboard'].map((suggestion) => (
                        <button
                            key={suggestion}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="px-3 py-1 text-sm bg-gray-800/50 border border-gray-700/50 text-gray-300 rounded-full hover:bg-gray-700/50 hover:text-white transition-all duration-200 capitalize"
                            type="button"
                        >
                            {suggestion}
                        </button>
                        ))}
                    </div>
                                                
                </div>
                
            </form>
        </div>
    );
}