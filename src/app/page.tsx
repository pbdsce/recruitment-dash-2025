"use client";

import { useState, useEffect, useCallback } from "react";
import DataTable from "@/components/DataTable";
import AnalyticsChart from "@/components/AnalyticsChart";
import SearchAndFilters from "@/components/SearchAndFilters";

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
    <div className="min-h-screen bg-black relative">
      {/* Global Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p className="text-white text-lg">Loading Dashboard...</p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-col">
        {/* Header */}
        <header className="bg-black border-b border-gray-800 px-6 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-white">
                Admin Dashboard
              </h1>
              <p className="text-gray-400 text-lg mt-2">
                Recruitment Management System
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-400 text-sm">Live</span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 bg-black">
          {/* Show content only when not loading and data is available */}
          {!loading && analyticsData && (
            <>
              {/* Top Row - Stats Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              
              {/* Total Applications Card */}
              <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 hover:border-green-500 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-white text-lg font-semibold mb-2">
                      Total Applications
                    </h3>
                    <p className="text-gray-400 text-sm">
                      {analyticsData.trends?.monthlyChange >= 0 ? "+" : ""}
                      {analyticsData.trends?.monthlyChange || 0}% vs last month
                    </p>
                  </div>
                  <div className="text-4xl text-green-500">
                    <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                    </svg>
                  </div>
                </div>
                <div className="text-4xl font-bold text-white mb-4">
                  {analyticsData.totalApplications}
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: "100%" }}></div>
                </div>
              </div>

              {/* This Week Card */}
              <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 hover:border-green-500 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-white text-lg font-semibold mb-2">
                      This Week
                    </h3>
                    <p className="text-gray-400 text-sm">
                      {analyticsData.trends?.weeklyChange >= 0 ? "+" : ""}
                      {analyticsData.trends?.weeklyChange || 0}% vs last week
                    </p>
                  </div>
                  <div className="text-4xl text-green-500">
                    <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="text-4xl font-bold text-white mb-4">
                  {analyticsData.trends?.thisWeekCount || 0}
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: `${Math.min((analyticsData.trends?.thisWeekCount || 0) / 10 * 100, 100)}%` }}></div>
                </div>
              </div>

              {/* Top Branch Card */}
              <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 hover:border-green-500 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-white text-lg font-semibold mb-2">
                      Top Branch
                    </h3>
                    <p className="text-gray-400 text-sm">
                      {analyticsData.trends?.topBranchChange >= 0 ? "+" : ""}
                      {analyticsData.trends?.topBranchChange || 0}% vs last week
                    </p>
                  </div>
                  <div className="text-4xl text-green-500">
                    <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="text-4xl font-bold text-white mb-2">
                  {analyticsData.applicationsByBranch[0]?.count || 0}
                </div>
                <div className="text-sm text-gray-400 mb-4">
                  {analyticsData.trends?.topBranchName || "N/A"}
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: `${Math.min((analyticsData.applicationsByBranch[0]?.count || 0) / 20 * 100, 100)}%` }}></div>
                </div>
              </div>
              </div>

              {/* Middle Row - Compact Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                
                <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 hover:border-green-500 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white text-sm font-medium mb-1">
                        This Month
                      </h3>
                      <div className="text-2xl font-bold text-green-500">
                        {analyticsData.trends?.thisMonthCount || 0}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {analyticsData.trends?.monthlyChange >= 0 ? "+" : ""}
                        {analyticsData.trends?.monthlyChange || 0}% vs last month
                      </div>
                    </div>
                    <div className="text-3xl text-green-500">
                      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 hover:border-green-500 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white text-sm font-medium mb-1">
                        This Week
                      </h3>
                      <div className="text-2xl font-bold text-green-500">
                        {analyticsData.trends?.thisWeekCount || 0}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {analyticsData.trends?.weeklyChange >= 0 ? "+" : ""}
                        {analyticsData.trends?.weeklyChange || 0}% vs last week
                      </div>
                    </div>
                    <div className="text-3xl text-green-500">
                      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 hover:border-green-500 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white text-sm font-medium mb-1">
                        Recent Apps
                      </h3>
                      <div className="text-2xl font-bold text-green-500">
                        {analyticsData.recentApplications.length}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        Last 5 applications
                      </div>
                    </div>
                    <div className="text-3xl text-green-500">
                      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 hover:border-green-500 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white text-sm font-medium mb-1">
                        Top Branch
                      </h3>
                      <div className="text-2xl font-bold text-green-500">
                        {analyticsData.applicationsByBranch[0]?.count || 0}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {analyticsData.trends?.topBranchChange >= 0 ? "+" : ""}
                        {analyticsData.trends?.topBranchChange || 0}% vs last week
                      </div>
                    </div>
                    <div className="text-3xl text-green-500">
                      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                
                <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                    <div className="w-1 h-6 bg-green-500 rounded-full mr-3"></div>
                    Applications by Year of Study
                  </h3>
                  <AnalyticsChart
                    data={analyticsData.applicationsByYear}
                    type="bar"
                  />
                </div>

                <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                    <div className="w-1 h-6 bg-green-500 rounded-full mr-3"></div>
                    Applications by Branch (Top 10)
                  </h3>
                  <AnalyticsChart
                    data={analyticsData.applicationsByBranch}
                    type="doughnut"
                  />
                </div>
              </div>

              {/* Quick Overview Section */}
              <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 mb-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <div className="w-1 h-6 bg-green-500 rounded-full mr-3"></div>
                  Quick Overview
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      Application Status
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-gray-800 rounded-lg border border-gray-600">
                        <span className="text-gray-300">Total Applications:</span>
                        <span className="text-xl font-bold text-green-500">
                          {analyticsData?.totalApplications || 0}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-800 rounded-lg border border-gray-600">
                        <span className="text-gray-300">This Month:</span>
                        <div className="text-right">
                          <span className="text-lg font-bold text-white">
                            {analyticsData?.trends?.thisMonthCount || 0}
                          </span>
                          <span className="text-sm text-green-400 ml-2">
                            {(analyticsData?.trends?.monthlyChange ?? 0) >= 0 ? "+" : ""}
                            {analyticsData?.trends?.monthlyChange ?? 0}%
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-800 rounded-lg border border-gray-600">
                        <span className="text-gray-300">This Week:</span>
                        <div className="text-right">
                          <span className="text-lg font-bold text-green-500">
                            {analyticsData?.trends?.thisWeekCount || 0}
                          </span>
                          <span className="text-sm text-green-400 ml-2">
                            {(analyticsData?.trends?.weeklyChange ?? 0) >= 0 ? "+" : ""}
                            {analyticsData?.trends?.weeklyChange ?? 0}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      Branch Distribution
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-gray-800 rounded-lg border border-gray-600">
                        <span className="text-gray-300">Top Branch:</span>
                        <div className="text-right">
                          <span className="text-lg font-bold text-green-500">
                            {analyticsData?.applicationsByBranch[0]?.count || 0}
                          </span>
                          <span className="text-sm text-green-400 ml-2">
                            {(analyticsData?.trends?.topBranchChange ?? 0) >= 0 ? "+" : ""}
                            {analyticsData?.trends?.topBranchChange ?? 0}%
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-800 rounded-lg border border-gray-600">
                        <span className="text-gray-300">Branch Name:</span>
                        <span className="text-green-500 font-semibold text-sm">
                          {analyticsData?.trends?.topBranchName || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-800 rounded-lg border border-gray-600">
                        <span className="text-gray-300">Active Branches:</span>
                        <span className="text-lg font-bold text-green-500">
                          {analyticsData?.applicationsByBranch.filter(
                            (b) => b.count > 0
                          ).length || 0}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      Year Distribution
                    </h3>
                    <div className="space-y-2">
                      {analyticsData?.applicationsByYear.map((year) => (
                        <div key={year._id} className="flex justify-between items-center p-2 bg-gray-800 rounded border border-gray-600">
                          <span className="text-gray-300">{year._id}:</span>
                          <span className="text-green-500 font-bold">
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
              <div className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-white flex items-center">
                        <div className="w-1 h-6 bg-green-500 rounded-full mr-3"></div>
                        Recruitment Applications
                      </h2>
                      <p className="text-gray-400 mt-1">
                        {pagination.total} total applications
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-green-500 text-sm font-medium">Live Data</span>
                    </div>
                  </div>
                </div>
                <DataTable
                  data={recruitmentData}
                  loading={false}
                  pagination={pagination}
                  onPageChange={handlePageChange}
                />
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
