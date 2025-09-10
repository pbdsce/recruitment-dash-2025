"use client";

import { useState } from "react";
import { colors } from "@/lib/colors";

interface Filters {
  search: string;
  year: string;
  branch: string;
  sortBy: string;
  sortOrder: string;
}

interface SearchAndFiltersProps {
  filters: Filters;
  onFilterChange: (filters: Partial<Filters>) => void;
  onRefresh: () => void;
}

const YEARS = ["1st year", "2nd year", "3rd year", "4th year"];

const BRANCHES = [
  "Artificial Intelligence and Machine Learning",
  "Aeronautical Engineering",
  "Automobile Engineering",
  "Biotechnology",
  "Computer Science and Engineering",
  "Computer Science and Business Systems",
  "Computer Science & Engineering (Cyber Security)",
  "Computer Science & Engineering (Data Science)",
  "Computer Science & Engineering (Internet of Things and Cyber Security Including Block Chain Technology)",
  "Computer Science and Design",
  "Chemical Engineering",
  "Civil Engineering",
  "Electrical & Electronics Engineering",
  "Electronics & Communication Engineering",
  "Electronics and Instrumentation Engineering",
  "Electronics and Telecommunication Engineering",
  "Information Science and Engineering",
  "Mechanical Engineering",
  "Medical Electronics Engineering",
  "Robotics and Artificial Intelligence",
];

const SORT_OPTIONS = [
  { value: "createdAt", label: "Application Date" },
  { value: "name", label: "Name" },
  { value: "year_of_study", label: "Year of Study" },
  { value: "branch", label: "Branch" },
];

export default function SearchAndFilters({
  filters,
  onFilterChange,
  onRefresh,
}: SearchAndFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ search: e.target.value });
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ year: e.target.value });
  };

  const handleBranchChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ branch: e.target.value });
  };

  const handleSortByChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ sortBy: e.target.value });
  };

  const handleSortOrderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ sortOrder: e.target.value });
  };

  const clearFilters = () => {
    onFilterChange({
      search: "",
      year: "",
      branch: "",
      sortBy: "createdAt",
      sortOrder: "desc",
    });
  };

  const hasActiveFilters = filters.search || filters.year || filters.branch;

  return (
    <div
      className="shadow-sm rounded-lg border"
      style={{
        backgroundColor: colors.background.card,
        borderColor: colors.border.default,
      }}>
      <div className="p-6">
        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search by name, email, college ID, or phone number..."
                value={filters.search}
                onChange={handleSearch}
                className="block w-full pl-10 pr-3 py-2 border border-gray-600 rounded-md leading-5 bg-black placeholder-gray-400 focus:outline-none focus:placeholder-gray-500 focus:ring-1 focus:ring-lime-400 focus:border-lime-400 text-sm text-white"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center px-4 py-2 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-400 ${
                showFilters ? "ring-2 ring-lime-400" : ""
              }`}>
              <svg
                className="h-4 w-4 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z"
                />
              </svg>
              Filters
              {hasActiveFilters && (
                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-lime-900 text-lime-300">
                  Active
                </span>
              )}
            </button>

            <button
              onClick={onRefresh}
              className="inline-flex items-center px-4 py-2 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-400">
              <svg
                className="h-4 w-4 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Refresh
            </button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-6 pt-6 border-t border-gray-600">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Year Filter */}
              <div>
                <label
                  htmlFor="year-filter"
                  className="block text-sm font-medium text-white mb-2">
                  Year of Study
                </label>
                <select
                  id="year-filter"
                  value={filters.year}
                  onChange={handleYearChange}
                  className="block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-lime-400 focus:border-lime-400 bg-black text-white text-sm">
                  <option value="">All Years</option>
                  {YEARS.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              {/* Branch Filter */}
              <div>
                <label
                  htmlFor="branch-filter"
                  className="block text-sm font-medium text-white mb-2">
                  Branch
                </label>
                <select
                  id="branch-filter"
                  value={filters.branch}
                  onChange={handleBranchChange}
                  className="block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-lime-400 focus:border-lime-400 bg-black text-white text-sm">
                  <option value="">All Branches</option>
                  {BRANCHES.map((branch) => (
                    <option key={branch} value={branch}>
                      {branch}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort By */}
              <div>
                <label
                  htmlFor="sort-by"
                  className="block text-sm font-medium text-white mb-2">
                  Sort By
                </label>
                <select
                  id="sort-by"
                  value={filters.sortBy}
                  onChange={handleSortByChange}
                  className="block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-lime-400 focus:border-lime-400 bg-black text-white text-sm">
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort Order */}
              <div>
                <label
                  htmlFor="sort-order"
                  className="block text-sm font-medium text-white mb-2">
                  Order
                </label>
                <select
                  id="sort-order"
                  value={filters.sortOrder}
                  onChange={handleSortOrderChange}
                  className="block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-lime-400 focus:border-lime-400 bg-black text-white text-sm">
                  <option value="desc">Newest First</option>
                  <option value="asc">Oldest First</option>
                </select>
              </div>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <div className="mt-4 flex justify-end">
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center px-3 py-2 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-400">
                  <svg
                    className="h-4 w-4 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
