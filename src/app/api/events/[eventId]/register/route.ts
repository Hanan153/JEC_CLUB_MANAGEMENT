import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: { eventId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const eventId = params.eventId;

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get event details
    const event = await prisma.event.findUnique({
      where: {
        id: eventId,
      },
      include: {
        _count: {
          select: {
            registrations: true,
          },
        },
      },
    });

    if (!event) {
      return new NextResponse("Event not found", { status: 404 });
    }

    // Check if event has ended
    if (new Date(event.date) < new Date()) {
      return new NextResponse("Event has already ended", { status: 400 });
    }

    // Check if event is full
    if (
      event.maxParticipants &&
      event._count.registrations >= event.maxParticipants
    ) {
      return new NextResponse("Event is full", { status: 400 });
    }

    // Check if user is already registered
    const existingRegistration = await prisma.eventRegistration.findUnique({
      where: {
        eventId_userId: {
          eventId,
          userId: session.user.id,
        },
      },
    });

    if (existingRegistration) {
      return new NextResponse("Already registered for this event", { status: 400 });
    }

    // Create registration
    const registration = await prisma.eventRegistration.create({
      data: {
        eventId,
        userId: session.user.id,
      },
    });

    return NextResponse.json(registration);
  } catch (error) {
    console.error("[EVENT_REGISTER]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 