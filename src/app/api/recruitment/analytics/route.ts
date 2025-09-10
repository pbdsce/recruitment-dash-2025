import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/dbConnect";
import RecruitmentModel from "@/models/Recruitment";

export async function GET() {
  try {
    await connectMongoDB();

    // Get total count
    const totalApplications = await RecruitmentModel.countDocuments();

    // Get applications by year of study
    const applicationsByYear = await RecruitmentModel.aggregate([
      {
        $group: {
          _id: "$year_of_study",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // Get applications by branch
    const applicationsByBranch = await RecruitmentModel.aggregate([
      {
        $group: {
          _id: "$branch",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 10,
      },
    ]);

    // Get applications by day (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const applicationsByDay = await RecruitmentModel.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // Get recent applications (last 5)
    const recentApplications = await RecruitmentModel.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name email year_of_study branch createdAt")
      .lean();

    // Calculate trends
    const now = new Date();
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const lastMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Applications this week vs last week
    const thisWeekCount = await RecruitmentModel.countDocuments({
      createdAt: { $gte: lastWeek },
    });
    const lastWeekCount = await RecruitmentModel.countDocuments({
      createdAt: { 
        $gte: new Date(lastWeek.getTime() - 7 * 24 * 60 * 60 * 1000),
        $lt: lastWeek 
      },
    });

    // Applications this month vs last month
    const thisMonthCount = await RecruitmentModel.countDocuments({
      createdAt: { $gte: lastMonth },
    });
    const lastMonthCount = await RecruitmentModel.countDocuments({
      createdAt: { 
        $gte: new Date(lastMonth.getTime() - 30 * 24 * 60 * 60 * 1000),
        $lt: lastMonth 
      },
    });

    // Calculate percentage changes
    const weeklyTrend = lastWeekCount > 0 
      ? ((thisWeekCount - lastWeekCount) / lastWeekCount * 100).toFixed(1)
      : thisWeekCount > 0 ? "100" : "0";
    
    const monthlyTrend = lastMonthCount > 0 
      ? ((thisMonthCount - lastMonthCount) / lastMonthCount * 100).toFixed(1)
      : thisMonthCount > 0 ? "100" : "0";

    // Top performing branch trend
    const topBranch = applicationsByBranch[0];
    const topBranchLastWeek = await RecruitmentModel.aggregate([
      {
        $match: {
          branch: topBranch?._id,
          createdAt: { 
            $gte: new Date(lastWeek.getTime() - 7 * 24 * 60 * 60 * 1000),
            $lt: lastWeek 
          },
        },
      },
      {
        $count: "count",
      },
    ]);
    
    const topBranchThisWeek = await RecruitmentModel.aggregate([
      {
        $match: {
          branch: topBranch?._id,
          createdAt: { $gte: lastWeek },
        },
      },
      {
        $count: "count",
      },
    ]);

    const topBranchTrend = topBranchLastWeek[0]?.count > 0 
      ? ((topBranchThisWeek[0]?.count || 0) - topBranchLastWeek[0].count) / topBranchLastWeek[0].count * 100
      : (topBranchThisWeek[0]?.count || 0) > 0 ? 100 : 0;

    return NextResponse.json({
      success: true,
      data: {
        totalApplications,
        applicationsByYear,
        applicationsByBranch,
        applicationsByDay,
        recentApplications,
        trends: {
          weeklyChange: parseFloat(weeklyTrend),
          monthlyChange: parseFloat(monthlyTrend),
          topBranchChange: parseFloat(topBranchTrend.toFixed(1)),
          thisWeekCount,
          thisMonthCount,
          topBranchName: topBranch?._id || "N/A",
        },
      },
    });
  } catch (error) {
    console.error("Error fetching analytics data:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch analytics data" },
      { status: 500 }
    );
  }
}
