import React, { useState, useEffect } from 'react';

// Custom debounce hook
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:8000';
const URL = `${BASE_URL}/logged/data`;

const DashboardCards = () => {
  const [logData, setLogData] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showManual, setShowManual] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    interfaceName: '',
    severity: '',
    dateFrom: '',
    dateTo: '',
  });
  const itemsPerPage = 50;
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  // Debounce search input
  const debouncedSearch = useDebounce(searchInput, 400);

  // Update filters when debounced search changes
  useEffect(() => {
    setFilters((prev) => ({ ...prev, search: debouncedSearch }));
  }, [debouncedSearch]);

  // Fetch logs when filters or page changes
  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      setError('');
      try {
        const params = new URLSearchParams(
          Object.fromEntries(
            Object.entries({
              ...filters,
              page: currentPage,
              limit: itemsPerPage,
              dateFrom: filters.dateFrom ? new Date(filters.dateFrom).toISOString() : '',
              dateTo: filters.dateTo ? new Date(filters.dateTo).toISOString() : '',
            }).filter(([_, value]) => value !== '')
          )
        );

        const response = await fetch(`${URL}?${params}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || `HTTP error ${response.status}`);
        }

        setLogData(data.data || []);
        const total = data.total || 0;
        setTotalPages(Math.ceil(total / itemsPerPage));
      } catch (err) {
        setError(err.message || 'Something went wrong.');
        setLogData([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [filters, currentPage, itemsPerPage]);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value.trim() }));
    if (name === 'search') {
      setSearchInput(value.trim());
    }
    setCurrentPage(1); // Reset to first page when filter changes
  };

  // Clear filters
  const handleClearFilters = () => {
    setFilters({ search: '', status: '', interfaceName: '', severity: '', dateFrom: '', dateTo: '' });
    setSearchInput('');
    setCurrentPage(1);
  };

  // Pagination handlers
  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Toggle advanced filters
  const toggleAdvancedFilters = () => {
    setShowAdvancedFilters((prev) => !prev);
  };

  return (
    <div className="container mx-auto p-2 sm:p-4">
      {/* Header */}
      <div className=' flex justify-between'>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center ">
          VISUALIZE LOGGED DATA
        </h1>
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6 gap-4">

          <button
            onClick={() => setShowManual(!showManual)}
            className="flex items-center gap-2 px-3 py-1 text-black bg-indigo-500 text-sm rounded-md transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label={showManual ? 'Hide user manual' : 'Show user manual'}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {showManual ? 'Hide Manual' : 'Show Manual'}
          </button>
        </div>
      </div>

      {/* Manual Dialog */}
      {showManual && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4"
          role="dialog"
          aria-labelledby="manual-title"
          aria-modal="true"
        >
          <div className="bg-white rounded-lg shadow-xl max-w-lg sm:max-w-2xl md:max-w-3xl w-full max-h-[80vh] sm:max-h-[90vh] overflow-y-auto p-4">
            <div className="sticky top-0 bg-white p-3 sm:p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 id="manual-title" className="text-lg sm:text-xl font-bold text-indigo-600">
                User Manual
              </h2>
              <button
                onClick={() => setShowManual(false)}
                className="p-2 text-black hover:bg-gray-100 rounded-full transition-colors border border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                aria-label="Close manual"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 sm:h-5 sm:w-5 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="p-3 sm:p-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="bg-indigo-50 p-3 rounded-lg shadow-sm">
                  <h3 className="font-semibold text-base sm:text-lg text-indigo-600 mb-2">
                    Quick Search
                  </h3>
                  <p className="text-gray-700 mb-2 text-sm sm:text-base leading-relaxed">
                    Use the search box to quickly find logs by:
                  </p>
                  <ul className="list-disc ml-5 text-gray-600 text-sm sm:text-base space-y-1">
                    <li>Message content</li>
                    <li>Integration Key</li>
                    <li>Interface Name</li>
                  </ul>
                </div>

                <div className="bg-green-50 p-3 rounded-lg shadow-sm">
                  <h3 className="font-semibold text-base sm:text-lg text-green-600 mb-2">
                    Status Filter
                  </h3>
                  <p className="text-gray-700 mb-2 text-sm sm:text-base leading-relaxed">
                    Filter logs by their current status:
                  </p>
                  <ul className="list-disc ml-5 text-gray-600 text-sm sm:text-base space-y-1">
                    <li className="text-green-700">Success - Completed successfully</li>
                    <li className="text-red-700">Failure - Failed to complete</li>
                    <li className="text-yellow-700">Pending - Still in progress</li>
                    <li className="text-orange-700">Warning - Completed with warnings</li>
                  </ul>
                </div>

                <div className="bg-blue-50 p-3 rounded-lg shadow-sm">
                  <h3 className="font-semibold text-base sm:text-lg text-blue-600 mb-2">
                    Advanced Filters
                  </h3>
                  <p className="text-gray-700 mb-2 text-sm sm:text-base leading-relaxed">
                    Additional filtering options include:
                  </p>
                  <ul className="list-disc ml-5 text-gray-600 text-sm sm:text-base space-y-1">
                    <li>Interface Name - Filter by specific interface</li>
                    <li>Severity Level (1-4) - Filter by importance level</li>
                    <li>Date Range - Filter logs between specific dates</li>
                  </ul>
                </div>

                <div className="bg-purple-50 p-3 rounded-lg shadow-sm">
                  <h3 className="font-semibold text-base sm:text-lg text-purple-600 mb-2">
                    Pro Tips
                  </h3>
                  <ul className="list-disc ml-5 text-gray-600 text-sm sm:text-base space-y-1">
                    <li>Combine multiple filters for precise results</li>
                    <li>Use "Clear Filters" to reset all options</li>
                    <li>50 results per page, use pagination to view more</li>
                    <li>Results are sorted by newest first</li>
                    <li>Click column headers to sort (if available)</li>
                  </ul>
                </div>
              </div>


            </div>

            <div className="sticky bottom-1 bg-gray-50 p-3 sm:p-4  border-blue-400">
              <button
                onClick={() => setShowManual(false)}
                className="w-full bg-indigo-500  text-black py-1 sm:py-2 px-3 sm:px-4 rounded-md hover:bg-indigo-600 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Close Manual
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 mb-4 sm:mb-6">
        <input
          type="text"
          name="search"
          value={searchInput}
          onChange={handleFilterChange}
          onBlur={(e) => {
            if (e.target.value.trim() !== filters.search) {
              handleFilterChange(e);
            }
          }}
          placeholder="Search by message, integrationKey, or interfaceName"
          className="flex-1 min-w-0 p-1 sm:p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
          aria-label="Search logs"
        />
        <select
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
          className="min-w-0 p-1 sm:p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
          aria-label="Filter by status"
        >
          <option value="">All Statuses</option>
          <option value="Success">Success</option>
          <option value="Failure">Failure</option>
          <option value="Pending">Pending</option>
          <option value="Warning">Warning</option>
        </select>
        <button
          onClick={toggleAdvancedFilters}
          className="px-3 sm:px-4 py-1 sm:py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
        >
          {showAdvancedFilters ? 'Hide Advanced Filters' : 'Advanced Filters'}
        </button>
        <button
          onClick={handleClearFilters}
          className="px-3 sm:px-4 py-1 sm:py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm sm:text-base"
        >
          Clear Filters
        </button>
      </div>

      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 mb-4 sm:mb-6">
          <input
            type="text"
            name="interfaceName"
            value={filters.interfaceName}
            onChange={handleFilterChange}
            onBlur={(e) => {
              if (e.target.value.trim() !== filters.interfaceName) {
                handleFilterChange(e);
              }
            }}
            placeholder="Interface Name"
            className="flex-1 min-w-0 p-1 sm:p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            aria-label="Filter by interface name"
          />
          <select
            name="severity"
            value={filters.severity}
            onChange={handleFilterChange}
            className="min-w-0 p-1 sm:p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            aria-label="Filter by severity"
          >
            <option value="">All Severities</option>
            <option value="1">1 (Low)</option>
            <option value="2">2 (Medium)</option>
            <option value="3">3 (High)</option>
            <option value="4">4 (Critical)</option>
          </select>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <label className="flex flex-col min-w-0">
              <span className="text-gray-700 mb-1 text-sm sm:text-base">Date From:</span>
              <input
                type="date"
                name="dateFrom"
                value={filters.dateFrom}
                onChange={handleFilterChange}
                onBlur={(e) => {
                  if (e.target.value !== filters.dateFrom) {
                    handleFilterChange(e);
                  }
                }}
                className="p-1 sm:p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                aria-label="Filter by start date"
              />
            </label>
            <label className="flex flex-col min-w-0">
              <span className="text-gray-700 mb-1 text-sm sm:text-base">Date To:</span>
              <input
                type="date"
                name="dateTo"
                value={filters.dateTo}
                onChange={handleFilterChange}
                onBlur={(e) => {
                  if (e.target.value !== filters.dateTo) {
                    handleFilterChange(e);
                  }
                }}
                className="p-1 sm:p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                aria-label="Filter by end date"
              />
            </label>
          </div>
        </div>
      )}

      {/* Error or Loading Message */}
      {error && (
        <div className="text-red-500 mb-4 text-center text-sm sm:text-base">
          {error}
          <button
            onClick={() => setFilters({ ...filters })}
            className="ml-2 sm:ml-4 px-2 sm:px-4 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
          >
            Retry
          </button>
        </div>
      )}
      {loading && <div className="text-center mb-4 text-gray-600 text-sm sm:text-base">Loading...</div>}

      {/* Log Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 table-auto">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-1 sm:p-2 border border-gray-200 text-left text-gray-700 text-xs sm:text-sm">S.No:</th>
              <th className="p-1 sm:p-2 border border-gray-200 text-left text-gray-700 text-xs sm:text-sm truncate">Interface Name</th>
              <th className="p-1 sm:p-2 border border-gray-200 text-left text-gray-700 text-xs sm:text-sm truncate">Integration Key</th>
              <th className="p-1 sm:p-2 border border-gray-200 text-left text-gray-700 text-xs sm:text-sm">Status</th>
              <th className="p-1 sm:p-2 border border-gray-200 text-left text-gray-700 text-xs sm:text-sm truncate">Message</th>
              <th className="p-1 sm:p-2 border border-gray-200 text-left text-gray-700 text-xs sm:text-sm">Timestamp</th>
              <th className="p-1 sm:p-2 border border-gray-200 text-left text-gray-700 text-xs sm:text-sm">Severity</th>
            </tr>
          </thead>
          <tbody>
            {logData.length > 0 ? (
              logData.map((log, index) => (
                <tr key={log._id} className="hover:bg-gray-50">
                  <td className="p-1 sm:p-2 border border-gray-200 text-xs sm:text-sm">{index + 1}</td>
                  <td className="p-1 sm:p-2 border border-gray-200 text-xs sm:text-sm truncate">{log.interfaceName}</td>
                  <td className="p-1 sm:p-2 border border-gray-200 text-xs sm:text-sm truncate">{log.integrationKey}</td>
                  <td className="p-1 sm:p-2 border border-gray-200 text-xs sm:text-sm">{log.status}</td>
                  <td className="p-1 sm:p-2 border border-gray-200 text-xs sm:text-sm truncate">{log.message}</td>
                  <td className="p-1 sm:p-2 border border-gray-200 text-xs sm:text-sm">{new Date(log.timestamp).toLocaleString()}</td>
                  <td className="p-1 sm:p-2 border border-gray-200 text-xs sm:text-sm">{log.severity}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="p-1 sm:p-2 border border-gray-200 text-center text-gray-600 text-xs sm:text-sm">
                  No matching logs found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4 mt-4 sm:mt-6">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="px-2 sm:px-4 py-1 sm:py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-300 hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
          >
            Previous
          </button>

          <div className="flex flex-wrap gap-1 sm:gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(page => {
                return (
                  page === 1 ||
                  page === totalPages ||
                  Math.abs(currentPage - page) <= 2
                );
              })
              .map((page, index, array) => {
                if (index > 0 && array[index - 1] !== page - 1) {
                  return (
                    <React.Fragment key={`ellipsis-${page}`}>
                      <span className="px-2 sm:px-3 py-1 sm:py-2 text-gray-600 text-sm sm:text-base">...</span>
                      <button
                        onClick={() => handlePageChange(page)}
                        className={`px-2 sm:px-3 py-1 rounded-md ${currentPage === page
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 hover:bg-gray-300'
                          } focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base`}
                      >
                        {page}
                      </button>
                    </React.Fragment>
                  );
                }
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-2 sm:px-3 py-1 rounded-md ${currentPage === page
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 hover:bg-gray-300'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base`}
                  >
                    {page}
                  </button>
                );
              })}
          </div>

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="px-2 sm:px-4 py-1 sm:py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-300 hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default DashboardCards;
