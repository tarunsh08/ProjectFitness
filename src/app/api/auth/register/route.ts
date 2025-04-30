import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import dbConnect from "@/lib/db";
import User from "@/models/user.models";
import { z } from "zod";

// Schema definition
const registerSchema = z.object({
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name too long"),
  email: z.string()
    .email("Invalid email format")
    .transform(val => val.toLowerCase().trim()),
  password: z.string()
    .min(8, "Password must be 8+ characters")
    .regex(/[A-Z]/, "Password needs 1 uppercase letter")
    .regex(/[0-9]/, "Password needs 1 number")
});

export async function POST(req: Request) {
  await dbConnect();

  try {
    // Validate request body
    const result = registerSchema.safeParse(await req.json());
    
    if (!result.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: result.error.issues[0].message 
        },
        { status: 400 }
      );
    }

    const { name, email, password } = result.data;

    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Email already registered" 
        },
        { status: 409 }
      );
    }

    // Hash password (12 salt rounds)
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const newUser = await User.create({
      name: name.trim(),
      email,
      password: hashedPassword
    });

    // Return sanitized user data (no password)
    const userResponse = {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      createdAt: newUser.createdAt
    };

    return NextResponse.json(
      {
        success: true,
        message: "Registration successful",
        user: userResponse
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Registration failed",
        ...(process.env.NODE_ENV === "development" && {
          details: error instanceof Error ? error.message : "Unknown error"
        })
      },
      { status: 500 }
    );
  }
}