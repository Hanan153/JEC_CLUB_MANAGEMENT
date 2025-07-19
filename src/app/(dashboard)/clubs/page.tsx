import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ClubsPageClient from "./clubs-client";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ClubsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  // Fetch all clubs and user's memberships in parallel
  const [clubs, managedClubs, rejectedClubs, memberships] = await Promise.all([
    // All approved clubs not created by user
    prisma.club.findMany({
      where: {
        status: "APPROVED",
        NOT: {
          creatorId: session.user.id,
        },
      },
      include: {
        creator: true,
        coordinator: {
          select: {
            name: true,
            email: true,
            department: true,
          },
        },
        _count: {
          select: {
            members: true,
            events: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
    // User's approved clubs
    prisma.club.findMany({
      where: {
        creatorId: session.user.id,
        status: "APPROVED",
      },
      include: {
        creator: true,
        coordinator: {
          select: {
            name: true,
            email: true,
            department: true,
          },
        },
        _count: {
          select: {
            members: true,
            events: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
    // User's rejected clubs
    prisma.club.findMany({
      where: {
        creatorId: session.user.id,
        status: "REJECTED",
      },
      include: {
        creator: true,
        coordinator: {
          select: {
            name: true,
            email: true,
            department: true,
          },
        },
        _count: {
          select: {
            members: true,
            events: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
    // User's approved memberships
    prisma.clubMember.findMany({
      where: {
        userId: session.user.id,
        status: "APPROVED"
      },
      select: {
        clubId: true,
      },
    }),
  ]);

  const userMemberships = memberships.map(member => member.clubId);

  return (
    <ClubsPageClient 
      clubs={clubs} 
      managedClubs={managedClubs} 
      rejectedClubs={rejectedClubs}
      userMemberships={userMemberships}
      userName={session.user.name || ""}
      userId={session.user.id}
      userRole={session.user.role}
    />
  );
} 