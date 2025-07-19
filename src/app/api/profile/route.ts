import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, department, regNo } = body;

    if (!name || !department || !regNo) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Check if registration number is already taken by another user
    const existingUser = await prisma.user.findFirst({
      where: {
        regNo,
        NOT: {
          id: session.user.id,
        },
      },
    });

    if (existingUser) {
      return new NextResponse("Registration number already taken", { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        name,
        department,
        regNo,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("[PROFILE_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 