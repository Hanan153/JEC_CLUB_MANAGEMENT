import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import ApproveClubButton from "@/components/approve-club-button";
import RejectClubButton from "@/components/reject-club-button";

export default async function PendingClubsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  // Check if user is admin
  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      role: true,
    },
  });

  if (user?.role !== "ADMIN") {
    redirect("/");
  }

  // Fetch all pending clubs
  const pendingClubs = await prisma.club.findMany({
    where: {
      status: "PENDING",
    },
    include: {
      creator: true,
      _count: {
        select: {
          members: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Pending Clubs</h1>
      </div>

      {pendingClubs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pendingClubs.map((club) => (
            <Card key={club.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl font-bold">{club.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Created by {club.creator.name}
                    </p>
                  </div>
                  <Badge variant="secondary">PENDING</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">{club.description}</p>
                <div className="flex justify-between items-center text-sm text-muted-foreground mb-4">
                  <span>Created {new Date(club.createdAt).toLocaleDateString()}</span>
                  <span>{club._count.members} members</span>
                </div>
                <div className="flex justify-end gap-2">
                  <RejectClubButton clubId={club.id} />
                  <ApproveClubButton clubId={club.id} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-600">No pending clubs to review</p>
          <p className="text-sm text-muted-foreground mt-2">
            All club requests have been processed
          </p>
        </div>
      )}
    </div>
  );
} 