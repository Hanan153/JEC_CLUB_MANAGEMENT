import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { name, email, password, regNo, department } = await req.json();

    // Validate email domain
    if (!email.endsWith("@jec.ac.in")) {
      return new NextResponse("Only @jec.ac.in email addresses are allowed", { status: 400 });
    }

    // Check if user with email already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return new NextResponse("User with this email already exists", { status: 400 });
    }

    // Check if user with regNo already exists
    const existingRegNo = await prisma.user.findUnique({
      where: {
        regNo,
      },
    });

    if (existingRegNo) {
      return new NextResponse("User with this registration number already exists", { status: 400 });
    }

    // Hash password
    const hashedPassword = await hash(password, 10);

    // Create coordinator
    const coordinator = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        regNo,
        department,
        role: "COORDINATOR",
      },
    });

    return NextResponse.json(coordinator);
  } catch (error) {
    console.error("[COORDINATOR_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 