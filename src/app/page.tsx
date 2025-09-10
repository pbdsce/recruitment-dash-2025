"use client";

import { useState, useEffect, useCallback } from "react";
// import StatsCard from "@/components/StatsCard";
import DataTable from "@/components/DataTable";
import AnalyticsChart from "@/components/AnalyticsChart";
import SearchAndFilters from "@/components/SearchAndFilters";
import { colors } from "@/lib/colors";

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

interface AnalyticsData {
  totalApplications: number;
  applicationsByYear: Array<{ _id: string; count: number }>;
  applicationsByBranch: Array<{ _id: string; count: number }>;
  applicationsByDay: Array<{ _id: string; count: number }>;
  recentApplications: Array<{
    _id: string;
    name: string;
    email: string;
    year_of_study: string;
    branch: string;
    createdAt: string;
  }>;
  trends: {
    weeklyChange: number;
    monthlyChange: number;
    topBranchChange: number;
    thisWeekCount: number;
    thisMonthCount: number;
    topBranchName: string;
  };
}

export default function Dashboard() {
  const [recruitmentData, setRecruitmentData] = useState<RecruitmentData[]>([]);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [filters, setFilters] = useState({
    search: "",
    year: "",
    branch: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...filters,
      });

      const [dataResponse, analyticsResponse] = await Promise.all([
        fetch(`/api/recruitment?${params}`),
        fetch("/api/recruitment/analytics"),
      ]);

      const dataResult = await dataResponse.json();
      const analyticsResult = await analyticsResponse.json();

      if (dataResult.success) {
        setRecruitmentData(dataResult.data);
        setPagination(dataResult.pagination);
      }

      if (analyticsResult.success) {
        setAnalyticsData(analyticsResult.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, filters]);

  useEffect(() => {
    fetchData();
  }, [pagination.page, filters, fetchData]);

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: colors.background.main }}>
      {/* Main Content */}
      <div className="flex flex-col">
        {/* Header */}
        <header
          className="border-b px-6 py-4"
          style={{
            backgroundColor: colors.background.main,
            borderColor: colors.border.default,
          }}>
          <div className="flex justify-between items-center">
            <div>
              <h1
                className="text-2xl font-bold"
                style={{ color: colors.text.accent }}>
                Admin Dashboard
              </h1>
              <p style={{ color: colors.text.muted }}>
                Recruitment Management System
              </p>
            </div>
          </div>
        </header>

        <main
          className="flex-1 p-6"
          style={{ backgroundColor: colors.background.main }}>
          {/* Top Row - Large Cards */}
          {analyticsData && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-blue-900 rounded-lg p-6 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white text-lg font-semibold mb-2">
                      Total Applications
                    </h3>
                    <p className="text-blue-200 text-sm mb-4">
                      {analyticsData.trends?.monthlyChange >= 0 ? "+" : ""}
                      {analyticsData.trends?.monthlyChange || 0}% vs last month
                    </p>
                    <div className="text-4xl font-bold text-blue-300">
                      {analyticsData.totalApplications}
                    </div>
                  </div>
                  <div className="text-6xl text-blue-400/20">
                    <svg
                      className="w-16 h-16"
                      fill="currentColor"
                      viewBox="0 0 20 20">
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-lime-900 rounded-lg p-6 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white text-lg font-semibold mb-2">
                      This Week
                    </h3>
                    <p className="text-lime-200 text-sm mb-4">
                      {analyticsData.trends?.weeklyChange >= 0 ? "+" : ""}
                      {analyticsData.trends?.weeklyChange || 0}% vs last week
                    </p>
                    <div className="text-4xl font-bold text-lime-300">
                      {analyticsData.trends?.thisWeekCount || 0}
                    </div>
                  </div>
                  <div className="text-6xl text-lime-400/20">
                    <svg
                      className="w-16 h-16"
                      fill="currentColor"
                      viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-purple-900 rounded-lg p-6 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white text-lg font-semibold mb-2">
                      Top Branch
                    </h3>
                    <p className="text-purple-200 text-sm mb-4">
                      {analyticsData.trends?.topBranchChange >= 0 ? "+" : ""}
                      {analyticsData.trends?.topBranchChange || 0}% vs last week
                    </p>
                    <div className="text-4xl font-bold text-purple-300">
                      {analyticsData.applicationsByBranch[0]?.count || 0}
                    </div>
                    <div className="text-sm text-purple-200 mt-2">
                      {analyticsData.trends?.topBranchName || "N/A"}
                    </div>
                  </div>
                  <div className="text-6xl text-purple-400/20">
                    <svg
                      className="w-16 h-16"
                      fill="currentColor"
                      viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Middle Row - Smaller Cards */}
          {analyticsData && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-blue-800 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white text-lg font-semibold">
                      This Month
                    </h3>
                    <div className="text-3xl font-bold text-blue-300 mt-2">
                      {analyticsData.trends?.thisMonthCount || 0}
                    </div>
                    <div className="text-sm text-blue-200 mt-1">
                      {analyticsData.trends?.monthlyChange >= 0 ? "+" : ""}
                      {analyticsData.trends?.monthlyChange || 0}% vs last month
                    </div>
                  </div>
                  <div className="text-4xl text-blue-400">
                    <svg
                      className="w-10 h-10"
                      fill="currentColor"
                      viewBox="0 0 20 20">
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-lime-800 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white text-lg font-semibold">
                      This Week
                    </h3>
                    <div className="text-3xl font-bold text-lime-300 mt-2">
                      {analyticsData.trends?.thisWeekCount || 0}
                    </div>
                    <div className="text-sm text-lime-200 mt-1">
                      {analyticsData.trends?.weeklyChange >= 0 ? "+" : ""}
                      {analyticsData.trends?.weeklyChange || 0}% vs last week
                    </div>
                  </div>
                  <div className="text-4xl text-lime-400">
                    <svg
                      className="w-10 h-10"
                      fill="currentColor"
                      viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-800 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white text-lg font-semibold">
                      Recent Apps
                    </h3>
                    <div className="text-3xl font-bold text-yellow-300 mt-2">
                      {analyticsData.recentApplications.length}
                    </div>
                    <div className="text-sm text-yellow-200 mt-1">
                      Last 5 applications
                    </div>
                  </div>
                  <div className="text-4xl text-yellow-400">
                    <svg
                      className="w-10 h-10"
                      fill="currentColor"
                      viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-purple-800 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white text-lg font-semibold">
                      Top Branch
                    </h3>
                    <div className="text-3xl font-bold text-purple-300 mt-2">
                      {analyticsData.applicationsByBranch[0]?.count || 0}
                    </div>
                    <div className="text-sm text-purple-200 mt-1">
                      {analyticsData.trends?.topBranchChange >= 0 ? "+" : ""}
                      {analyticsData.trends?.topBranchChange || 0}% vs last week
                    </div>
                  </div>
                  <div className="text-4xl text-purple-400">
                    <svg
                      className="w-10 h-10"
                      fill="currentColor"
                      viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Charts */}
          {analyticsData && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <AnalyticsChart
                title="Applications by Year of Study"
                data={analyticsData.applicationsByYear}
                type="bar"
              />
              <AnalyticsChart
                title="Applications by Branch (Top 10)"
                data={analyticsData.applicationsByBranch}
                type="doughnut"
              />
            </div>
          )}

          {/* Quick Overview Section */}
          <div
            className="border rounded-lg p-6 mb-8"
            style={{
              backgroundColor: colors.background.card,
              borderColor: colors.border.default,
            }}>
            <h2
              className="text-xl font-bold mb-6"
              style={{ color: colors.text.accent }}>
              Quick Overview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3
                  className="font-semibold mb-4"
                  style={{ color: colors.text.primary }}>
                  Application Status
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span style={{ color: colors.text.secondary }}>
                      Total Applications:
                    </span>
                    <span
                      className="font-bold"
                      style={{ color: colors.cards.blue.accent }}>
                      {analyticsData?.totalApplications || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: colors.text.secondary }}>
                      This Month:
                    </span>
                    <span
                      className="font-bold"
                      style={{ color: colors.text.accent }}>
                      {analyticsData?.trends?.thisMonthCount || 0}
                      <span className="text-xs ml-2">
                        (
                        {analyticsData?.trends?.monthlyChange &&
                        analyticsData?.trends?.monthlyChange >= 0
                          ? "+"
                          : ""}
                        {analyticsData?.trends?.monthlyChange || 0}%)
                      </span>
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">This Week:</span>
                    <span className="text-lime-400 font-bold">
                      {analyticsData?.trends?.thisWeekCount || 0}
                      <span className="text-xs ml-2">
                        (
                        {analyticsData?.trends?.weeklyChange &&
                        analyticsData?.trends?.weeklyChange >= 0
                          ? "+"
                          : ""}
                        {analyticsData?.trends?.weeklyChange || 0}%)
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-4">
                  Branch Distribution
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Top Branch:</span>
                    <span className="text-yellow-400 font-bold">
                      {analyticsData?.applicationsByBranch[0]?.count || 0}
                      <span className="text-xs ml-2">
                        (
                        {analyticsData?.trends?.topBranchChange &&
                        analyticsData?.trends?.topBranchChange >= 0
                          ? "+"
                          : ""}
                        {analyticsData?.trends?.topBranchChange || 0}%)
                      </span>
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Branch Name:</span>
                    <span className="text-yellow-400 font-bold text-xs">
                      {analyticsData?.trends?.topBranchName || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Active Branches:</span>
                    <span className="text-yellow-400 font-bold">
                      {analyticsData?.applicationsByBranch.filter(
                        (b) => b.count > 0
                      ).length || 0}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-4">
                  Year Distribution
                </h3>
                <div className="space-y-3">
                  {analyticsData?.applicationsByYear.map((year) => (
                    <div key={year._id} className="flex justify-between">
                      <span className="text-gray-300">{year._id}:</span>
                      <span className="text-purple-400 font-bold">
                        {year.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="mb-8">
            <SearchAndFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              onRefresh={fetchData}
            />
          </div>

          {/* Data Table */}
          <div className="bg-black border border-gray-600 shadow-lg rounded-lg">
            <div className="px-6 py-4 border-b border-gray-600">
              <h2 className="text-lg font-semibold text-white">
                Recruitment Applications
              </h2>
              <p className="text-sm text-gray-400">
                {pagination.total} total applications
              </p>
            </div>
            <DataTable
              data={recruitmentData}
              loading={loading}
              pagination={pagination}
              onPageChange={handlePageChange}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
