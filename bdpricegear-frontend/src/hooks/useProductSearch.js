'use client';

import { useState } from 'react';
import { priceComparisonAPI } from '../services/api';

export function useProductSearch() {
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSearch = async () => {
        if (!searchTerm.trim()) return;

        // console.log('Starting search:', searchTerm);
        setLoading(true);

        try{
            const data = await priceComparisonAPI.searchProducts(searchTerm);
            // console.log('Search completed successfully:', data);
        }
        catch(err){
            // console.error('Search failed:', err);
        }
        finally{ setLoading(false);}
    }


    return{
        searchTerm,
        setSearchTerm,
        handleSearch,
        loading
    };

}


