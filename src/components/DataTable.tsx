"use client";

import { colors, getYearBadgeClasses } from "@/lib/colors";
import { useState } from "react";

interface RecruitmentData {
  _id: string;
  name: string;
  email: string;
  whatsapp_number: string;
  college_id: string;
  year_of_study: string;
  branch: string;
  about: string;
  createdAt: string;
  updatedAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

interface DataTableProps {
  data: RecruitmentData[];
  loading: boolean;
  pagination: Pagination;
  onPageChange: (page: number) => void;
}

export default function DataTable({
  data,
  loading,
  pagination,
  onPageChange,
}: DataTableProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const getYearBadgeColor = (year: string) => {
    return getYearBadgeClasses(year);
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-white bg-gray-600 hover:bg-gray-700 transition ease-in-out duration-150 cursor-not-allowed">
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="p-8 text-center">
        <div style={{ color: colors.text.muted }}>
          <svg
            className="mx-auto h-12 w-12"
            style={{ color: colors.text.muted }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3
            className="mt-2 text-sm font-medium"
            style={{ color: colors.text.primary }}>
            No applications found
          </h3>
          <p className="mt-1 text-sm" style={{ color: colors.text.muted }}>
            Get started by adding some recruitment data.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      {/* Mobile list (<= sm) */}
      <div className="sm:hidden space-y-3 p-3">
        {data.map((item) => {
          const itemId = item._id.toString();
          return (
            <div key={itemId} className="rounded-lg border border-gray-700 bg-black">
              <button
                type="button"
                onClick={() => setExpanded((prev) => ({ ...prev, [itemId]: !prev[itemId] }))}
                className="w-full p-4 flex items-center text-left"
                aria-expanded={!!expanded[itemId]}
              >
                <div className="flex-shrink-0 h-10 w-10">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-lime-500 to-lime-600 flex items-center justify-center shadow-md">
                    <span className="text-sm font-semibold text-white">
                      {item.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="ml-3 min-w-0 flex-1">
                  <div className="text-sm font-semibold text-white truncate">{item.name}</div>
                  <div className="text-[11px] text-gray-400 truncate">{truncateText(item.about, 70)}</div>
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`inline-flex px-2 py-1 text-[10px] font-semibold rounded-full ${getYearBadgeColor(
                      item.year_of_study
                    )}`}
                  >
                    {item.year_of_study}
                  </span>
                  <span className={`text-xs font-medium ${expanded[itemId] ? "text-lime-400" : "text-gray-400"}`}>
                    {expanded[itemId] ? "Hide" : "Details"}
                  </span>
                  <svg
                    className={`h-4 w-4 transition-transform ${expanded[itemId] ? "rotate-180 text-lime-400" : "rotate-0 text-gray-400"}`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.939l3.71-3.71a.75.75 0 111.06 1.061l-4.24 4.24a.75.75 0 01-1.06 0L5.25 8.29a.75.75 0 01-.02-1.08z" clipRule="evenodd" />
                  </svg>
                </div>
              </button>
              {expanded[itemId] && (
                <div className="px-4 pb-4 pt-0 text-xs space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-md bg-gray-900 border border-gray-800 px-3 py-2">
                      <div className="text-gray-400">Branch</div>
                      <div className="text-white font-medium">{item.branch}</div>
                    </div>
                    <div className="rounded-md bg-gray-900 border border-gray-800 px-3 py-2">
                      <div className="text-gray-400">Applied</div>
                      <div className="text-white">{formatDate(item.createdAt)}</div>
                    </div>
                    <div className="col-span-2 rounded-md bg-gray-900 border border-gray-800 px-3 py-2">
                      <div className="text-gray-400">Email</div>
                      <div className="text-white truncate">{item.email}</div>
                    </div>
                    <div className="col-span-2 rounded-md bg-gray-900 border border-gray-800 px-3 py-2">
                      <div className="text-gray-400">WhatsApp</div>
                      <div className="text-white">{item.whatsapp_number}</div>
                    </div>
                    <div className="col-span-2 rounded-md bg-gray-900 border border-gray-800 px-3 py-2">
                      <div className="text-gray-400">College ID</div>
                      <div className="text-white truncate font-mono">{item.college_id}</div>
                    </div>
                    <div className="col-span-2 rounded-md bg-gray-900 border border-gray-800 px-3 py-2">
                      <div className="text-gray-400">About</div>
                      <div className="text-white">{item.about}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Desktop/tablet table (>= sm) */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-600">
          <thead className="bg-black">
            <tr>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Applicant
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden md:table-cell">
                Contact
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Year
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Branch
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden lg:table-cell">
                College ID
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden sm:table-cell">
                Applied
              </th>
            </tr>
          </thead>
          <tbody className="bg-black divide-y divide-gray-600">
            {data.map((item) => {
              const itemId = item._id.toString();
     return [
                <tr key={itemId} className="hover:bg-gray-800">
                  <td className="px-3 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-lime-500 to-lime-600 flex items-center justify-center shadow-lg">
                          <span className="text-xs font-medium text-white">
                            {item.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="ml-3 min-w-0 flex-1">
                        <div className="text-sm font-medium text-white truncate">
                          {item.name}
                        </div>
                        <div className="text-xs text-gray-400 truncate">
                          {truncateText(item.about, 40)}
                        </div>
                        {item.about.length > 40 && (
                            <button
                              onClick={() => setExpanded((prev) => ({ ...prev, [itemId]: !prev[itemId] }))}
                              className="text-xs text-lime-400 hover:text-lime-300 mt-1 inline-flex items-center"
                            >
                              {expanded[itemId] ? "Read less" : "Read more"}
                            </button>
                          )}
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-4 hidden md:table-cell">
                    <div className="text-sm text-white truncate">
                      {item.email}
                    </div>
                    <div className="text-xs text-gray-400">
                      {item.whatsapp_number}
                    </div>
                  </td>
                  <td className="px-3 py-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getYearBadgeColor(
                        item.year_of_study
                      )}`}>
                      {item.year_of_study}
                    </span>
                  </td>
                  <td className="px-3 py-4">
                    <span className="text-sm text-white">{item.branch}</span>
                  </td>
                  <td className="px-3 py-4 hidden lg:table-cell">
                    <div className="text-xs text-white font-mono truncate">
                      {item.college_id}
                    </div>
                    </td>
                  <td className="px-3 py-4 hidden sm:table-cell">
                    <div className="text-xs text-gray-400">
                      {formatDate(item.createdAt)}
                    </div>
                  </td>
                </tr>,
                expanded[itemId] && (
                  <tr key={`${itemId}-expanded`} className="bg-gray-900">
                    <td colSpan={6} className="px-3 py-4">
                      <div className="text-xs">
                        <div className="font-medium text-gray-400 mb-1">Full Bio:</div>
                        <div className="text-white">{item.about}</div>
                      </div>
                    </td>
                  </tr>
                ),
              ].filter(Boolean); 
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="bg-black px-4 py-3 flex items-center justify-between border-t border-gray-600 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed">
              Previous
            </button>
            <button
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-300">
                Showing{" "}
                <span className="font-medium">
                  {(pagination.page - 1) * pagination.limit + 1}
                </span>{" "}
                to{" "}
                <span className="font-medium">
                  {Math.min(
                    pagination.page * pagination.limit,
                    pagination.total
                  )}
                </span>{" "}
                of <span className="font-medium">{pagination.total}</span>{" "}
                results
              </p>
            </div>
            <div>
              <nav
                className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                aria-label="Pagination">
                <button
                  onClick={() => onPageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-600 bg-black text-sm font-medium text-gray-400 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed">
                  <span className="sr-only">Previous</span>
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                {Array.from(
                  { length: Math.min(5, pagination.pages) },
                  (_, i) => {
                    const pageNum =
                      Math.max(
                        1,
                        Math.min(pagination.pages - 4, pagination.page - 2)
                      ) + i;
                    if (pageNum > pagination.pages) return null;

                    return (
                      <button
                        key={pageNum}
                        onClick={() => onPageChange(pageNum)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          pageNum === pagination.page
                            ? "z-10 bg-lime-600 border-lime-400 text-white shadow-lg"
                            : "bg-black border-gray-600 text-gray-400 hover:bg-lime-900 hover:text-white hover:border-lime-500"
                        }`}>
                        {pageNum}
                      </button>
                    );
                  }
                )}

                <button
                  onClick={() => onPageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-600 bg-black text-sm font-medium text-gray-400 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed">
                  <span className="sr-only">Next</span>
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
