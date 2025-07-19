import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users2, Clock } from "lucide-react";

export default async function CoordinatorDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || session.user.role !== "COORDINATOR") {
    redirect("/login");
  }

  // Fetch statistics
  const [totalClubs, pendingRequests] = await Promise.all([
    prisma.club.count({
      where: {
        coordinatorId: session.user.id,
      },
    }),
    prisma.clubMember.count({
      where: {
        club: {
          coordinatorId: session.user.id,
        },
        status: "PENDING",
      },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome back, {session.user.name}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Clubs
            </CardTitle>
            <Users2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClubs}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Join Requests
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingRequests}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 