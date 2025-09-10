import { NextRequest, NextResponse } from "next/server";
import connectMongoDB from "@/lib/dbConnect";
import RecruitmentModel, { RecruitmentDoc } from "@/models/Recruitment";
import { FilterQuery } from "mongoose";

export async function GET(request: NextRequest) {
  try {
    await connectMongoDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const year = searchParams.get("year") || "";
    const branch = searchParams.get("branch") || "";
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    // Build filter object
    const filter: FilterQuery<RecruitmentDoc> = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { college_id: { $regex: search, $options: "i" } },
        { whatsapp_number: { $regex: search, $options: "i" } },
      ];
    }

    if (year) {
      filter.year_of_study = year;
    }

    if (branch) {
      filter.branch = branch;
    }

    // Build sort object
    const sort: Record<string, 1 | -1> = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const total = await RecruitmentModel.countDocuments(filter);

    // Fetch data with pagination
    const data = await RecruitmentModel.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    return NextResponse.json({
      success: true,
      data,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching recruitment data:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch recruitment data" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectMongoDB();

    const body = await request.json();
    const newRecruitment = new RecruitmentModel(body);
    const savedRecruitment = await newRecruitment.save();

    return NextResponse.json(
      {
        success: true,
        data: savedRecruitment,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating recruitment entry:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create recruitment entry" },
      { status: 500 }
    );
  }
}
