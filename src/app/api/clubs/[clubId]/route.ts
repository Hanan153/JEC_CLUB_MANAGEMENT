import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: { clubId: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, description, coordinator } = body;

    if (!name || !description || !coordinator) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Check if the club exists and if the user is the creator
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
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Update the club
    const updatedClub = await prisma.club.update({
      where: {
        id: params.clubId,
      },
      data: {
        name,
        description,
        coordinator,
      },
    });

    return NextResponse.json(updatedClub);
  } catch (error) {
    console.error("[CLUB_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 