import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: { clubId: string; requestId: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    // Check if user is the coordinator of the club
    const club = await prisma.club.findUnique({
      where: {
        id: params.clubId,
        coordinatorId: session.user.id,
      },
    });

    if (!club) {
      return new NextResponse("Not authorized to manage this club", { status: 403 });
    }

    const { status } = await req.json();

    if (!["APPROVED", "REJECTED"].includes(status)) {
      return new NextResponse("Invalid status", { status: 400 });
    }

    // Update the join request
    const updatedRequest = await prisma.clubMember.update({
      where: {
        id: params.requestId,
        clubId: params.clubId,
      },
      data: {
        status,
      },
    });

    return NextResponse.json(updatedRequest);
  } catch (error) {
    console.error("[CLUB_JOIN_REQUEST_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 