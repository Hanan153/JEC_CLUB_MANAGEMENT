import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: { clubId: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    // Check if user is a member of the club
    const membership = await prisma.clubMember.findUnique({
      where: {
        userId_clubId: {
          userId: session.user.id,
          clubId: params.clubId,
        },
      },
    });

    if (!membership) {
      return new NextResponse("Not a member of this club", { status: 404 });
    }

    // Delete the membership
    await prisma.clubMember.delete({
      where: {
        userId_clubId: {
          userId: session.user.id,
          clubId: params.clubId,
        },
      },
    });

    return new NextResponse("Successfully left the club", { status: 200 });
  } catch (error) {
    console.error("[CLUB_LEAVE_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 