'use client';

import SearchForm from './SearchForm';
import { useProductSearch } from '../hooks/useProductSearch';

export default function PriceComparison() {
    const {
        searchTerm,
        loading,
        setSearchTerm,
        handleSearch,
    } = useProductSearch();

    return (
        <div>
            <SearchForm 
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                onSearch={handleSearch}
                loading={loading}
            />
        </div>
    );
}