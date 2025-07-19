import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: { clubId: string; memberId: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const body = await req.json();
    const { status } = body;

    if (!status || !["APPROVED", "REJECTED"].includes(status)) {
      return new NextResponse("Invalid status", { status: 400 });
    }

    // Check if club exists and user is the coordinator
    const club = await prisma.club.findUnique({
      where: {
        id: params.clubId,
        coordinatorId: session.user.id,
      },
    });

    if (!club) {
      return new NextResponse("Club not found or unauthorized", { status: 404 });
    }

    // Check if member exists
    const member = await prisma.clubMember.findUnique({
      where: {
        id: params.memberId,
      },
    });

    if (!member) {
      return new NextResponse("Member not found", { status: 404 });
    }

    // Update member status
    const updatedMember = await prisma.clubMember.update({
      where: {
        id: params.memberId,
      },
      data: {
        status,
      },
    });

    return NextResponse.json(updatedMember);
  } catch (error) {
    console.error("[MEMBER_STATUS_UPDATE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 