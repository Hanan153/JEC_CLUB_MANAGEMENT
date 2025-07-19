import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  context: { params: { clubId: string } }
) {
  const session = await getServerSession(authOptions);
  const params = await context.params;
  const clubId = params.clubId;

  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    // Check if user is either the coordinator or the creator of the club
    const club = await prisma.club.findUnique({
      where: {
        id: clubId,
      },
      select: {
        coordinatorId: true,
        creatorId: true,
      },
    });

    if (!club) {
      return new NextResponse("Club not found", { status: 404 });
    }

    const isCoordinator = club.coordinatorId === session.user.id;
    const isCreator = club.creatorId === session.user.id;

    if (!isCoordinator && !isCreator) {
      return new NextResponse("Not authorized to create events", { status: 403 });
    }

    const { name, description, date, time, location, maxParticipants } = await req.json();

    if (!name || !description || !date || !time || !location) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // If coordinator creates event, it's automatically approved
    // If club creator creates event, it needs coordinator approval
    const event = await prisma.event.create({
      data: {
        name,
        description,
        date: new Date(date),
        time,
        location,
        maxParticipants: maxParticipants ? parseInt(maxParticipants) : null,
        clubId,
        status: isCoordinator ? "APPROVED" : "PENDING",
        createdBy: session.user.id,
      },
    });

    return NextResponse.json(event);
  } catch (error) {
    console.error("[EVENT_CREATE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// Get all events for a club
export async function GET(
  req: Request,
  context: { params: { clubId: string } }
) {
  const session = await getServerSession(authOptions);
  const params = await context.params;
  const clubId = params.clubId;

  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const events = await prisma.event.findMany({
      where: {
        clubId,
        OR: [
          { status: "APPROVED" },
          // Show pending events to coordinator and creator
          {
            AND: [
              { status: "PENDING" },
              {
                club: {
                  OR: [
                    { coordinatorId: session.user.id },
                    { creatorId: session.user.id },
                  ],
                },
              },
            ],
          },
        ],
      },
      orderBy: {
        date: "asc",
      },
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error("[EVENTS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 