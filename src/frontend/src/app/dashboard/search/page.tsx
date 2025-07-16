'use client';

import React, { useState } from 'react';
import SearchBar from '../../../components/search/SearchBar';

// Sample content data for search
const sampleContent = [
  {
    id: 'content-1',
    title: 'Marketing Campaign Plan',
    type: 'note',
    excerpt: 'Comprehensive marketing campaign strategy for Q3 2025. Includes social media, email, and content marketing tactics.',
    tags: ['Marketing', 'Strategy', 'Q3'],
    url: '/dashboard/editor',
    createdAt: '2025-07-10T10:30:00Z',
    createdBy: {
      id: 'user-1',
      name: 'John Doe',
    },
  },
  {
    id: 'content-2',
    title: 'Homepage Redesign',
    type: 'task',
    excerpt: 'Redesign the company homepage to improve user experience and conversion rates. Focus on mobile responsiveness.',
    tags: ['Design', 'Urgent', 'Website'],
    url: '/dashboard/tasks',
    createdAt: '2025-07-12T14:20:00Z',
    createdBy: {
      id: 'user-2',
      name: 'Jane Smith',
    },
  },
  {
    id: 'content-3',
    title: 'API Documentation',
    type: 'note',
    excerpt: 'Technical documentation for the REST API endpoints. Includes authentication, rate limits, and example requests.',
    tags: ['Development', 'Documentation'],
    url: '/dashboard/editor',
    createdAt: '2025-07-08T09:15:00Z',
    createdBy: {
      id: 'user-3',
      name: 'Mike Johnson',
    },
  },
  {
    id: 'content-4',
    title: 'Fix Login Issue',
    type: 'task',
    excerpt: 'Investigate and fix the login issue affecting some users on mobile devices. Priority: High.',
    tags: ['Development', 'Bug', 'Urgent'],
    url: '/dashboard/tasks',
    createdAt: '2025-07-15T11:45:00Z',
    createdBy: {
      id: 'user-3',
      name: 'Mike Johnson',
    },
  },
  {
    id: 'content-5',
    title: 'User Flow Diagram',
    type: 'mindmap',
    excerpt: 'Visual diagram of user flows through the application. Includes onboarding, core features, and account management.',
    tags: ['Design', 'Documentation'],
    url: '/dashboard/mindmap',
    createdAt: '2025-07-11T16:30:00Z',
    createdBy: {
      id: 'user-2',
      name: 'Jane Smith',
    },
  },
  {
    id: 'content-6',
    title: 'Add Payment Integration',
    type: 'task',
    excerpt: 'Integrate Stripe payment gateway for subscription billing. Implement webhooks for payment events.',
    tags: ['Development', 'Feature'],
    url: '/dashboard/tasks',
    createdAt: '2025-07-14T13:20:00Z',
    createdBy: {
      id: 'user-3',
      name: 'Mike Johnson',
    },
  },
  {
    id: 'content-7',
    title: 'Q3 Financial Report',
    type: 'file',
    excerpt: 'Quarterly financial report with revenue analysis, expense breakdown, and projections for Q4.',
    tags: ['Finance', 'Report', 'Q3'],
    url: '/dashboard/files',
    createdAt: '2025-07-13T09:45:00Z',
    createdBy: {
      id: 'user-1',
      name: 'John Doe',
    },
  },
  {
    id: 'content-8',
    title: 'Product Roadmap 2025',
    type: 'mindmap',
    excerpt: 'Strategic product roadmap for 2025. Outlines key features, milestones, and release schedule.',
    tags: ['Product', 'Strategy'],
    url: '/dashboard/mindmap',
    createdAt: '2025-07-09T15:20:00Z',
    createdBy: {
      id: 'user-1',
      name: 'John Doe',
    },
  },
  {
    id: 'content-9',
    title: 'Team Meeting Notes',
    type: 'note',
    excerpt: 'Notes from the weekly team meeting. Includes action items, decisions, and upcoming deadlines.',
    tags: ['Meeting', 'Team'],
    url: '/dashboard/editor',
    createdAt: '2025-07-16T10:00:00Z',
    createdBy: {
      id: 'user-2',
      name: 'Jane Smith',
    },
  },
  {
    id: 'content-10',
    title: 'Customer Feedback Analysis',
    type: 'note',
    excerpt: 'Analysis of customer feedback from Q2 surveys. Identifies key trends, pain points, and improvement opportunities.',
    tags: ['Customer', 'Analysis', 'Q2'],
    url: '/dashboard/editor',
    createdAt: '2025-07-07T14:30:00Z',
    createdBy: {
      id: 'user-1',
      name: 'John Doe',
    },
  },
  {
    id: 'content-11',
    title: 'Marketing Budget Spreadsheet',
    type: 'file',
    excerpt: 'Detailed marketing budget allocation for 2025. Includes campaign costs, ROI projections, and monthly breakdown.',
    tags: ['Marketing', 'Finance'],
    url: '/dashboard/files',
    createdAt: '2025-07-05T11:15:00Z',
    createdBy: {
      id: 'user-2',
      name: 'Jane Smith',
    },
  },
  {
    id: 'content-12',
    title: 'Competitor Analysis Report',
    type: 'note',
    excerpt: 'In-depth analysis of key competitors. Covers market positioning, strengths, weaknesses, and strategic opportunities.',
    tags: ['Marketing', 'Analysis', 'Strategy'],
    url: '/dashboard/editor',
    createdAt: '2025-07-04T16:45:00Z',
    createdBy: {
      id: 'user-1',
      name: 'John Doe',
    },
  },
];

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<typeof sampleContent>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'marketing campaign',
    'api documentation',
    'budget',
    'user flow',
  ]);
  const [searchFilters, setSearchFilters] = useState({
    types: [] as string[],
    tags: [] as string[],
    dateRange: 'all' as 'all' | 'today' | 'week' | 'month',
    users: [] as string[],
  });

  // Perform search
  const handleSearch = async (query: string): Promise<any[]> => {
    // In a real app, this would be an API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simple search implementation
        const results = sampleContent.filter((item) => {
          const matchesQuery =
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            (item.excerpt && item.excerpt.toLowerCase().includes(query.toLowerCase())) ||
            (item.tags && item.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase())));

          // Apply filters
          const matchesType =
            searchFilters.types.length === 0 ||
            searchFilters.types.includes(item.type);

          const matchesTags =
            searchFilters.tags.length === 0 ||
            (item.tags &&
              searchFilters.tags.some((filterTag) =>
                item.tags.some((itemTag) => itemTag.toLowerCase() === filterTag.toLowerCase())
              ));

          const matchesUser =
            searchFilters.users.length === 0 ||
            (item.createdBy &&
              searchFilters.users.includes(item.createdBy.id));

          // Date filter
          let matchesDate = true;
          if (searchFilters.dateRange !== 'all') {
            const itemDate = new Date(item.createdAt);
            const now = new Date();
            
            if (searchFilters.dateRange === 'today') {
              matchesDate =
                itemDate.getDate() === now.getDate() &&
                itemDate.getMonth() === now.getMonth() &&
                itemDate.getFullYear() === now.getFullYear();
            } else if (searchFilters.dateRange === 'week') {
              const oneWeekAgo = new Date();
              oneWeekAgo.setDate(now.getDate() - 7);
              matchesDate = itemDate >= oneWeekAgo;
            } else if (searchFilters.dateRange === 'month') {
              const oneMonthAgo = new Date();
              oneMonthAgo.setMonth(now.getMonth() - 1);
              matchesDate = itemDate >= oneMonthAgo;
            }
          }

          return matchesQuery && matchesType && matchesTags && matchesUser && matchesDate;
        });

        resolve(results);
      }, 300);
    });
  };

  // Handle search submission
  const handleSearchSubmit = async (query: string) => {
    if (!query.trim()) return;
    
    setSearchQuery(query);
    const results = await handleSearch(query);
    setSearchResults(results);
    
    // Add to recent searches if not already present
    if (!recentSearches.includes(query)) {
      setRecentSearches((prev) => [query, ...prev.slice(0, 4)]);
    }
  };

  // Toggle type filter
  const toggleTypeFilter = (type: string) => {
    setSearchFilters((prev) => {
      const types = prev.types.includes(type)
        ? prev.types.filter((t) => t !== type)
        : [...prev.types, type];
      return { ...prev, types };
    });
  };

  // Toggle tag filter
  const toggleTagFilter = (tag: string) => {
    setSearchFilters((prev) => {
      const tags = prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag];
      return { ...prev, tags };
    });
  };

  // Toggle user filter
  const toggleUserFilter = (userId: string) => {
    setSearchFilters((prev) => {
      const users = prev.users.includes(userId)
        ? prev.users.filter((u) => u !== userId)
        : [...prev.users, userId];
      return { ...prev, users };
    });
  };

  // Set date range filter
  const setDateRangeFilter = (range: 'all' | 'today' | 'week' | 'month') => {
    setSearchFilters((prev) => ({ ...prev, dateRange: range }));
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchFilters({
      types: [],
      tags: [],
      dateRange: 'all',
      users: [],
    });
  };

  // Extract all unique tags from content
  const allTags = Array.from(
    new Set(
      sampleContent.flatMap((item) => (item.tags ? item.tags : []))
    )
  ).sort();

  // Extract all unique users from content
  const allUsers = Array.from(
    new Set(
      sampleContent
        .filter((item) => item.createdBy)
        .map((item) => JSON.stringify(item.createdBy))
    )
  )
    .map((user) => JSON.parse(user))
    .sort((a, b) => a.name.localeCompare(b.name));

  // Format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Get content type icon
  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'note':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-blue-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
        );
      case 'task':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-green-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
            />
          </svg>
        );
      case 'mindmap':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-purple-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
            />
          </svg>
        );
      case 'file':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-yellow-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
        );
      default:
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
            />
          </svg>
        );
    }
  };

  return (
    <div className="container mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Search</h1>
        <p className="text-gray-600">
          Search across all your content, tasks, and files.
        </p>
      </div>

      <div className="mb-6">
        <SearchBar
          onSearch={handleSearch}
          placeholder="Search for content, tasks, files..."
          className="max-w-4xl"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Filters</h2>
              <button
                onClick={clearFilters}
                className="text-sm text-blue-500 hover:text-blue-700"
              >
                Clear All
              </button>
            </div>

            {/* Content Type Filter */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Content Type</h3>
              <div className="space-y-2">
                {['note', 'task', 'mindmap', 'file'].map((type) => (
                  <div key={type} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`type-${type}`}
                      checked={searchFilters.types.includes(type)}
                      onChange={() => toggleTypeFilter(type)}
                      className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <label
                      htmlFor={`type-${type}`}
                      className="ml-2 text-sm text-gray-700 capitalize"
                    >
                      {type}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Tags Filter */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTagFilter(tag)}
                    className={`px-2 py-1 text-xs rounded-full ${
                      searchFilters.tags.includes(tag)
                        ? 'bg-blue-100 text-blue-800 border border-blue-200'
                        : 'bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Date Range Filter */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Date Range</h3>
              <div className="space-y-2">
                {[
                  { value: 'all', label: 'All Time' },
                  { value: 'today', label: 'Today' },
                  { value: 'week', label: 'Past Week' },
                  { value: 'month', label: 'Past Month' },
                ].map((range) => (
                  <div key={range.value} className="flex items-center">
                    <input
                      type="radio"
                      id={`date-${range.value}`}
                      checked={searchFilters.dateRange === range.value}
                      onChange={() => setDateRangeFilter(range.value as any)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <label
                      htmlFor={`date-${range.value}`}
                      className="ml-2 text-sm text-gray-700"
                    >
                      {range.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Created By Filter */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Created By</h3>
              <div className="space-y-2">
                {allUsers.map((user) => (
                  <div key={user.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`user-${user.id}`}
                      checked={searchFilters.users.includes(user.id)}
                      onChange={() => toggleUserFilter(user.id)}
                      className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <label
                      htmlFor={`user-${user.id}`}
                      className="ml-2 text-sm text-gray-700"
                    >
                      {user.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Searches */}
          <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
            <h2 className="text-lg font-semibold mb-4">Recent Searches</h2>
            <div className="space-y-2">
              {recentSearches.map((search, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                >
                  <button
                    onClick={() => handleSearchSubmit(search)}
                    className="text-sm text-gray-700 hover:text-blue-500"
                  >
                    {search}
                  </button>
                  <button
                    onClick={() => {
                      setRecentSearches((prev) =>
                        prev.filter((_, i) => i !== index)
                      );
                    }}
                    className="text-gray-400 hover:text-gray-600"
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
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))}
              {recentSearches.length === 0 && (
                <div className="text-sm text-gray-500 py-2">
                  No recent searches
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Search Results */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">
              {searchQuery ? `Results for "${searchQuery}"` : 'All Content'}
            </h2>

            {/* Results count and sort */}
            {searchResults.length > 0 && (
              <div className="flex justify-between items-center mb-4">
                <div className="text-sm text-gray-500">
                  {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'} found
                </div>
                <div className="flex items-center">
                  <span className="text-sm text-gray-500 mr-2">Sort by:</span>
                  <select className="text-sm border rounded-md px-2 py-1">
                    <option value="relevance">Relevance</option>
                    <option value="date-desc">Newest</option>
                    <option value="date-asc">Oldest</option>
                    <option value="name-asc">Name (A-Z)</option>
                    <option value="name-desc">Name (Z-A)</option>
                  </select>
                </div>
              </div>
            )}

            {/* Results list */}
            <div className="space-y-4">
              {searchResults.length > 0 ? (
                searchResults.map((result) => (
                  <div
                    key={result.id}
                    className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        {getContentTypeIcon(result.type)}
                        <a
                          href={result.url}
                          className="text-lg font-medium ml-2 text-blue-600 hover:underline"
                        >
                          {result.title}
                        </a>
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatDate(result.createdAt)}
                      </div>
                    </div>
                    
                    {result.excerpt && (
                      <p className="text-sm text-gray-600 mb-3">{result.excerpt}</p>
                    )}
                    
                    <div className="flex justify-between items-center">
                      <div className="flex flex-wrap gap-2">
                        {result.tags &&
                          result.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                      </div>
                      
                      {result.createdBy && (
                        <div className="flex items-center text-sm text-gray-500">
                          <span className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600 mr-1">
                            {result.createdBy.name.charAt(0)}
                          </span>
                          {result.createdBy.name}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : searchQuery ? (
                <div className="text-center py-8">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-gray-400 mx-auto mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <p className="text-gray-500">No results found for "{searchQuery}"</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Try adjusting your search or filters to find what you're looking for.
                  </p>
                </div>
              ) : (
                <div className="text-center py-8">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-gray-400 mx-auto mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <p className="text-gray-500">Enter a search term to find content</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Search across notes, tasks, mind maps, and files
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Search Tips */}
          <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
            <h2 className="text-lg font-semibold mb-4">Search Tips</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-medium text-gray-800 mb-2">Advanced Search</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>Use quotes for exact phrases: "marketing campaign"</li>
                  <li>Use + to require words: +urgent +bug</li>
                  <li>Use - to exclude words: marketing -email</li>
                  <li>Use OR for alternatives: design OR development</li>
                </ul>
              </div>
              <div className="border rounded-lg p-4">
                <h3 className="font-medium text-gray-800 mb-2">Filter Combinations</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>Combine content types with tags for precision</li>
                  <li>Filter by date range to find recent content</li>
                  <li>Filter by creator to find team member's content</li>
                  <li>Use multiple filters to narrow down results</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}