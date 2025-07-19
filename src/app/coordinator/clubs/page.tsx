import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function CoordinatorClubsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || session.user.role !== "COORDINATOR") {
    redirect("/login");
  }

  const clubs = await prisma.club.findMany({
    where: {
      coordinatorId: session.user.id,
    },
    include: {
      _count: {
        select: {
          members: {
            where: {
              status: "APPROVED",
            },
          },
          events: true,
        },
      },
      members: {
        where: {
          status: "APPROVED",
        },
        include: {
          user: {
            select: {
              name: true,
              email: true,
              department: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">My Clubs</h2>
        <p className="text-muted-foreground">
          Manage your coordinated clubs
        </p>
      </div>

      <div className="grid gap-4">
        {clubs.map((club) => (
          <Card key={club.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{club.name}</CardTitle>
                <Badge variant={club.status === "APPROVED" ? "default" : "secondary"}>
                  {club.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">{club.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Members</p>
                    <p className="text-2xl font-bold">{club._count.members}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Events</p>
                    <p className="text-2xl font-bold">{club._count.events}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Club Members</p>
                  <div className="space-y-2">
                    {club.members.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{member.user.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {member.user.email}
                          </p>
                        </div>
                        <Badge>{member.user.department}</Badge>
                      </div>
                    ))}
                    {club.members.length === 0 && (
                      <p className="text-sm text-muted-foreground">
                        No members yet
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {clubs.length === 0 && (
          <Card>
            <CardContent className="py-8">
              <p className="text-center text-muted-foreground">
                You are not coordinating any clubs yet
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
} 