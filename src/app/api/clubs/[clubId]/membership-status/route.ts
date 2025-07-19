import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { clubId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Check if user has a membership request for this club
    const membership = await prisma.clubMember.findUnique({
      where: {
        userId_clubId: {
          userId: session.user.id,
          clubId: params.clubId,
        },
      },
      select: {
        status: true,
      },
    });

    if (!membership) {
      return NextResponse.json({ status: null });
    }

    return NextResponse.json({ status: membership.status });
  } catch (error) {
    console.error("[MEMBERSHIP_STATUS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 