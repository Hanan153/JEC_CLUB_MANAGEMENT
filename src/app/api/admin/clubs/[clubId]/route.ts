import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ClubStatus } from "@prisma/client";

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
    const { status } = body;

    if (!status) {
      return new NextResponse("Missing status", { status: 400 });
    }

    // Validate status is a valid ClubStatus
    if (!Object.values(ClubStatus).includes(status)) {
      return new NextResponse("Invalid status", { status: 400 });
    }

    // Check if the club exists
    const existingClub = await prisma.club.findUnique({
      where: {
        id: params.clubId,
      },
    });

    if (!existingClub) {
      return new NextResponse("Club not found", { status: 404 });
    }

    // Update the club status
    const updatedClub = await prisma.club.update({
      where: {
        id: params.clubId,
      },
      data: {
        status: status as ClubStatus,
      },
    });

    return NextResponse.json(updatedClub);
  } catch (error) {
    console.error("[CLUB_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 