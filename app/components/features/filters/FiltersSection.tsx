import React from 'react';
import FilterDropdown from './FilterDropdown';
import { FilterOptions } from '@/types/pokemon';

interface FiltersSectionProps {
    filterOptions: FilterOptions;
    selectedFilters: {
        types: string[];
        rarities: string[];
        sets: string[];
    };
    onFilterChange: (filterType: 'types' | 'rarities' | 'sets', value: string) => void;
}

export default function FiltersSection({
    filterOptions,
    selectedFilters,
    onFilterChange,
}: FiltersSectionProps) {
    return (
        <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Choose Card</h2>

                <div className="flex gap-3">
                    <FilterDropdown
                        label="Set"
                        options={filterOptions.sets}
                        selectedValues={selectedFilters.sets}
                        onChange={(value) => onFilterChange('sets', value)}
                    />

                    <FilterDropdown
                        label="Rarity"
                        options={filterOptions.rarities}
                        selectedValues={selectedFilters.rarities}
                        onChange={(value) => onFilterChange('rarities', value)}
                    />

                    <FilterDropdown
                        label="Type"
                        options={filterOptions.types}
                        selectedValues={selectedFilters.types}
                        onChange={(value) => onFilterChange('types', value)}
                    />
                </div>
            </div>
        </div>
    );
}
