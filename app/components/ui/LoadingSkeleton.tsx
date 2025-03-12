import React from 'react';

export default function LoadingSkeleton() {
    return (
        <div className="bg-gray-800 rounded-lg overflow-hidden">
            <div className="h-48 bg-gray-700 animate-pulse"></div>
            <div className="p-4">
                <div className="h-4 bg-gray-700 rounded animate-pulse mb-2"></div>
                <div className="h-4 bg-gray-700 rounded animate-pulse w-3/4 mb-4"></div>
                <div className="flex justify-between mb-2">
                    <div className="h-4 bg-gray-700 rounded animate-pulse w-1/4"></div>
                    <div className="h-4 bg-gray-700 rounded animate-pulse w-1/4"></div>
                </div>
                <div className="h-8 bg-gray-700 rounded animate-pulse mt-2"></div>
            </div>
        </div>
    );
}
