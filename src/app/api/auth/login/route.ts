import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/user.models";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { email, password } = await req.json();

    // Validate input more thoroughly
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Find user and handle case sensitivity
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      // Generic message for security (don't reveal if email exists)
      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Password validation
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Create token with more user data if needed
    const token = jwt.sign(
      { 
        id: user._id,
        email: user.email,
        role: user.role // Include if you have roles
      },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    // Secure cookie settings
    const response = NextResponse.json(
      { 
        success: true,
        user: {
          id: user._id,
          email: user.email,
          name: user.name // Include other safe user data
        }
      },
      { status: 200 }
    );

    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax", // More compatible than 'strict'
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;

  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}