import React, { useState, useRef, useEffect } from 'react';

interface FilterDropdownProps {
    label: string;
    options: any[] | string[];
    selectedValues: string[];
    onChange: (value: string) => void;
}

export default function FilterDropdown({
    label,
    options,
    selectedValues,
    onChange,
}: FilterDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Handle dropdown toggle
    const toggleDropdown = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsOpen(!isOpen);
    };

    // Handle checkbox change
    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, optionId: string) => {
        e.stopPropagation();
        onChange(optionId);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) && isOpen) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div className="relative inline-block text-left" ref={dropdownRef}>
            <button
                type="button"
                className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg flex items-center gap-2"
                onClick={toggleDropdown}
            >
                {label}
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <div
                    className="origin-top-right absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 z-50 max-h-60 overflow-y-auto"
                >
                    <div className="py-1" role="menu" aria-orientation="vertical">
                        {options && options.length > 0 ? (
                            options.map((option) => {
                                // Handle different option formats
                                const optionId = typeof option === 'string' ? option : option.id;
                                const optionName = typeof option === 'string' ? option : option.name;

                                if (!optionId) return null;

                                return (
                                    <div
                                        key={optionId}
                                        className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <label className="flex items-center space-x-2 cursor-pointer w-full">
                                            <input
                                                type="checkbox"
                                                checked={selectedValues.includes(optionId)}
                                                onChange={(e) => handleCheckboxChange(e, optionId)}
                                                className="rounded text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-800"
                                            />
                                            <span className="select-none text-white">{optionName}</span>
                                        </label>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="px-4 py-2 text-gray-400">Loading options...</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
