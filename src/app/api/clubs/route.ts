import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateClubId } from "@/lib/utils";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, description, coordinatorId } = body;

    if (!name || !description || !coordinatorId) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Check if coordinator exists and is a coordinator
    const coordinator = await prisma.user.findUnique({
      where: {
        id: coordinatorId,
        role: "COORDINATOR",
      },
    });

    if (!coordinator) {
      return new NextResponse("Invalid coordinator", { status: 400 });
    }

    // Generate a unique clubId
    let clubId;
    let isUnique = false;
    
    while (!isUnique) {
      clubId = generateClubId();
      // Check if clubId already exists
      const existingClub = await prisma.club.findUnique({
        where: { clubId },
      });
      if (!existingClub) {
        isUnique = true;
      }
    }

    const club = await prisma.club.create({
      data: {
        clubId,
        name,
        description,
        coordinatorId,
        status: "PENDING", // All new clubs start as pending
        creatorId: session.user.id,
      },
    });

    return NextResponse.json(club);
  } catch (error) {
    console.error("[CLUBS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 