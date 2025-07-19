import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, regNo, department } = body;

    if (!name || !email || !password || !regNo || !department) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Validate email domain
    if (!email.endsWith("@jec.ac.in")) {
      return new NextResponse("Only @jec.ac.in email addresses are allowed", { status: 400 });
    }

    // Check if email exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return new NextResponse("Email already exists", { status: 400 });
    }

    // Check if registration number exists
    const existingRegNo = await prisma.user.findUnique({
      where: {
        regNo,
      },
    });

    if (existingRegNo) {
      return new NextResponse("Registration number already exists", { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "STUDENT",
        regNo,
        department,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Registration error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 