import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: Request,
  { params }: { params: { clubId: string; eventId: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    // Check if the club exists and user is the creator
    const club = await prisma.club.findUnique({
      where: {
        id: params.clubId,
      },
      select: {
        creatorId: true,
      },
    });

    if (!club) {
      return new NextResponse("Club not found", { status: 404 });
    }

    if (club.creatorId !== session.user.id) {
      return new NextResponse("Only club creators can delete events", { status: 403 });
    }

    // Delete the event
    await prisma.event.delete({
      where: {
        id: params.eventId,
        clubId: params.clubId,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[EVENT_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { clubId: string; eventId: string } }
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
      return new NextResponse("Not authorized or club not found", { status: 403 });
    }

    const { status } = await req.json();

    if (!["APPROVED", "REJECTED"].includes(status)) {
      return new NextResponse("Invalid status", { status: 400 });
    }

    // Update the event status
    const event = await prisma.event.update({
      where: {
        id: params.eventId,
        clubId: params.clubId,
      },
      data: {
        status,
      },
    });

    return NextResponse.json(event);
  } catch (error) {
    console.error("[EVENT_STATUS_UPDATE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 