"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
    <motion.div 
      className="bg-gray-900 border border-gray-700 rounded-xl p-6 shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Search Bar */}
      <motion.div 
        className="flex flex-col lg:flex-row gap-4 mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <div className="flex-1">
          <motion.div 
            className="relative group"
            whileFocus={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <motion.svg
                className="h-5 w-5 text-gray-400 group-focus-within:text-green-500 transition-colors"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                animate={{ rotate: showFilters ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </motion.svg>
            </div>
            <input
              type="text"
              placeholder="Search by name, email, college ID, or phone number..."
              value={filters.search}
              onChange={handleSearch}
              className="block w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-sm"
            />
            <AnimatePresence>
              {filters.search && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onFilterChange({ search: "" })}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        <div className="flex gap-3">
          <motion.button
            onClick={() => setShowFilters(!showFilters)}
            className={`inline-flex items-center px-6 py-3 bg-gray-800 border border-gray-600 rounded-lg text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 ${
              showFilters ? "ring-2 ring-green-500 bg-gray-700" : ""
            }`}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <motion.svg
              className="h-4 w-4 mr-2"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              animate={{ rotate: showFilters ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z"
              />
            </motion.svg>
            Filters
            <AnimatePresence>
              {hasActiveFilters && (
                <motion.span 
                  className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-500 text-white"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {[filters.search, filters.year, filters.branch].filter(Boolean).length}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          <motion.button
            onClick={onRefresh}
            className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 border border-green-600 rounded-lg text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <motion.svg
              className="h-4 w-4 mr-2"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              animate={{ rotate: 360 }}
              transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </motion.svg>
            Refresh
          </motion.button>
        </div>
      </motion.div>

      {/* Advanced Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div 
            className="border-t border-gray-700 pt-6"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
            {/* Year Filter */}
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <label
                htmlFor="year-filter"
                className="block text-sm font-medium text-white">
                Year of Study
              </label>
              <div className="relative">
                <select
                  id="year-filter"
                  value={filters.year}
                  onChange={handleYearChange}
                  className="block w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 appearance-none cursor-pointer">
                  <option value="">All Years</option>
                  {YEARS.map((year) => (
                    <option key={year} value={year} className="bg-gray-800 text-white">
                      {year}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </motion.div>

            {/* Branch Filter */}
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <label
                htmlFor="branch-filter"
                className="block text-sm font-medium text-white">
                Branch
              </label>
              <div className="relative">
                <select
                  id="branch-filter"
                  value={filters.branch}
                  onChange={handleBranchChange}
                  className="block w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 appearance-none cursor-pointer">
                  <option value="">All Branches</option>
                  {BRANCHES.map((branch) => (
                    <option key={branch} value={branch} className="bg-gray-800 text-white">
                      {branch}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </motion.div>

            {/* Sort By */}
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <label
                htmlFor="sort-by"
                className="block text-sm font-medium text-white">
                Sort By
              </label>
              <div className="relative">
                <select
                  id="sort-by"
                  value={filters.sortBy}
                  onChange={handleSortByChange}
                  className="block w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 appearance-none cursor-pointer">
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value} className="bg-gray-800 text-white">
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </motion.div>

            {/* Sort Order */}
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.5 }}
            >
              <label
                htmlFor="sort-order"
                className="block text-sm font-medium text-white">
                Order
              </label>
              <div className="relative">
                <select
                  id="sort-order"
                  value={filters.sortOrder}
                  onChange={handleSortOrderChange}
                  className="block w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 appearance-none cursor-pointer">
                  <option value="desc" className="bg-gray-800 text-white">Newest First</option>
                  <option value="asc" className="bg-gray-800 text-white">Oldest First</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </motion.div>
            </motion.div>

            {/* Clear Filters */}
            <AnimatePresence>
              {hasActiveFilters && (
                <motion.div 
                  className="mt-6 flex justify-end"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: 0.6 }}
                >
                  <motion.button
                    onClick={clearFilters}
                    className="inline-flex items-center px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
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
                    Clear All Filters
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}