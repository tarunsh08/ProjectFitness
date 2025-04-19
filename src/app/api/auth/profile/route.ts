import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import userProfile from "@/models/UserProfile";
import supabase from "@/lib/supabase";

export async function GET(req: Request) {
  try {
    await dbConnect();

    const { data: { session }, error: authError } = await supabase.auth.getSession();
    if (authError || !session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    if (session.user.id !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const profile = await userProfile.findOne({ userId });

    return NextResponse.json(profile || { 
      name: "",
      bio: "",
      avatarUrl: "" 
    });
  } catch (err) {
    console.error("GET Error:", err);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();

    const { data: { session }, error: authError } = await supabase.auth.getSession();
    if (authError || !session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId, name, bio, avatarUrl } = await req.json();

    if (!userId || !name) {
      return NextResponse.json(
        { error: "userId and name are required" },
        { status: 400 }
      );
    }

    if (session.user.id !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updatedProfile = await userProfile.findOneAndUpdate(
      { userId },
      { 
        name: name.trim(),
        bio: bio?.trim(),
        avatarUrl 
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({
      success: true,
      profile: updatedProfile
    });
  } catch (err) {
    console.error("POST Error:", err);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}