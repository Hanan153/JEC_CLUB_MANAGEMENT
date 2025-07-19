import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: { clubId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Check if club exists and is approved
    const club = await prisma.club.findUnique({
      where: {
        id: params.clubId,
        status: "APPROVED",
      },
    });

    if (!club) {
      return new NextResponse("Club not found or not approved", { status: 404 });
    }

    // Check if user is already a member or has a pending request
    const existingMembership = await prisma.clubMember.findUnique({
      where: {
        userId_clubId: {
          userId: session.user.id,
          clubId: params.clubId,
        },
      },
    });

    if (existingMembership) {
      if (existingMembership.status === "PENDING") {
        return new NextResponse("Join request already pending", { status: 400 });
      } else if (existingMembership.status === "APPROVED") {
        return new NextResponse("Already a member", { status: 400 });
      } else if (existingMembership.status === "REJECTED") {
        // Update the rejected membership to pending
        const updatedMembership = await prisma.clubMember.update({
          where: {
            userId_clubId: {
              userId: session.user.id,
              clubId: params.clubId,
            },
          },
          data: {
            status: "PENDING",
          },
        });
        return NextResponse.json(updatedMembership);
      }
    }

    // Check if user has reached the maximum number of clubs (5)
    const approvedMemberships = await prisma.clubMember.count({
      where: {
        userId: session.user.id,
        status: "APPROVED",
      },
    });

    if (approvedMemberships >= 5) {
      return new NextResponse("Maximum club limit reached (5 clubs)", { status: 400 });
    }

    // Create membership request
    const membership = await prisma.clubMember.create({
      data: {
        userId: session.user.id,
        clubId: params.clubId,
        status: "PENDING",
      },
    });

    return NextResponse.json(membership);
  } catch (error) {
    console.error("[CLUB_JOIN_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 