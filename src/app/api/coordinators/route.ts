import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const coordinators = await prisma.user.findMany({
      where: {
        role: "COORDINATOR",
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return NextResponse.json(coordinators);
  } catch (error) {
    console.error("[COORDINATORS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 