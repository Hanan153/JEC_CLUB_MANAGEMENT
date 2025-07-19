import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Users, Users2, Calendar, Building2 } from "lucide-react";

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  // Fetch statistics
  const [totalUsers, totalClubs, pendingClubs, totalEvents] = await Promise.all([
    prisma.user.count(),
    prisma.club.count(),
    prisma.club.count({
      where: {
        status: "PENDING",
      },
    }),
    prisma.event.count(),
  ]);

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Admin Dashboard</h1>
        <div className="flex gap-4">
          <Link href="/admin/users">
            <Button className="text-white">Manage Users</Button>
          </Link>
          <Link href="/admin/clubs">
            <Button className="text-white">Manage Clubs</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Users Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              Registered users in the system
            </p>
          </CardContent>
        </Card>

        {/* Total Clubs Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clubs</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClubs}</div>
            <p className="text-xs text-muted-foreground">
              Active clubs in the system
            </p>
          </CardContent>
        </Card>

        {/* Pending Clubs Card */}
        <Link href="/admin/pending">
          <Card className="hover:bg-gray-50 transition-colors cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Clubs</CardTitle>
              <Users2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingClubs}</div>
              <p className="text-xs text-muted-foreground">
                Clubs awaiting approval
              </p>
            </CardContent>
          </Card>
        </Link>

        {/* Total Events Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEvents}</div>
            <p className="text-xs text-muted-foreground">
              Events across all clubs
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* You can add recent activity items here */}
              <p className="text-sm text-muted-foreground">
                No recent activity to display
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 