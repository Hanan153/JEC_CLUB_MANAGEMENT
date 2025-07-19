import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const clubs = await prisma.club.findMany({
      include: {
        creator: true,
        coordinator: {
          select: {
            name: true,
            email: true,
            department: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(clubs);
  } catch (error) {
    console.error("[CLUBS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 