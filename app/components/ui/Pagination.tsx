'use client';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({
    currentPage,
    totalPages,
    onPageChange
}: PaginationProps) {
    // Generate array of page numbers to display
    const getPageNumbers = () => {
        const pages = [];
        const maxPagesToShow = 5;

        if (totalPages <= maxPagesToShow) {
            // Show all pages if total is less than or equal to max
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Always include first and last page
            if (currentPage <= 3) {
                // If near the start, show first 4 pages and last page
                for (let i = 1; i <= 4; i++) {
                    pages.push(i);
                }
                pages.push(null); // Ellipsis
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                // If near the end, show first page and last 4 pages
                pages.push(1);
                pages.push(null); // Ellipsis
                for (let i = totalPages - 3; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                // If in the middle, show first page, current page and neighbors, and last page
                pages.push(1);
                pages.push(null); // Ellipsis
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pages.push(i);
                }
                pages.push(null); // Ellipsis
                pages.push(totalPages);
            }
        }

        return pages;
    };

    const pageNumbers = getPageNumbers();

    return (
        <nav className="flex justify-center items-center">
            <ul className="flex items-center space-x-1">
                {/* Previous Button */}
                <li>
                    <button
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`px-3 py-2 rounded-md ${currentPage === 1
                            ? 'text-gray-500 cursor-not-allowed'
                            : 'text-gray-300 hover:bg-gray-700'
                            }`}
                        aria-label="Previous page"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    </button>
                </li>

                {/* Page Numbers */}
                {pageNumbers.map((pageNumber, index) => (
                    <li key={index}>
                        {pageNumber === null ? (
                            <span className="px-3 py-2 text-gray-500">...</span>
                        ) : (
                            <button
                                onClick={() => onPageChange(pageNumber as number)}
                                className={`px-3 py-2 rounded-md ${currentPage === pageNumber
                                    ? 'bg-orange-400 text-white'
                                    : 'text-gray-300 hover:bg-gray-700'
                                    }`}
                                aria-current={currentPage === pageNumber ? 'page' : undefined}
                            >
                                {pageNumber}
                            </button>
                        )}
                    </li>
                ))}

                {/* Next Button */}
                <li>
                    <button
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`px-3 py-2 rounded-md ${currentPage === totalPages
                            ? 'text-gray-500 cursor-not-allowed'
                            : 'text-gray-300 hover:bg-gray-700'
                            }`}
                        aria-label="Next page"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                    </button>
                </li>
            </ul>
        </nav>
    );
}
