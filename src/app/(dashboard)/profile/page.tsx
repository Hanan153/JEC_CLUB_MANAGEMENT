import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import UpdateProfileForm from "./update-profile-form";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    include: {
      clubMemberships: {
        include: {
          club: true,
        },
      },
      eventRegistrations: {
        include: {
          event: {
            include: {
              club: true,
            },
          },
        },
      },
    },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8">Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent>
            <UpdateProfileForm user={user} />
          </CardContent>
        </Card>

        {/* Stats and Activity */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Role</p>
                  <Badge className="mt-1">{user.role}</Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Member Since</p>
                  <p className="mt-1">{new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Clubs Joined</p>
                  <p className="mt-1">{user.clubMemberships.length} clubs</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Events Registered</p>
                  <p className="mt-1">{user.eventRegistrations.length} events</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {user.clubMemberships.slice(0, 3).map((membership) => (
                  <div key={membership.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{membership.club.name}</p>
                      <p className="text-sm text-gray-500">
                        Joined {new Date(membership.joinedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
                {user.eventRegistrations.slice(0, 3).map((registration) => (
                  <div key={registration.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{registration.event.name}</p>
                      <p className="text-sm text-gray-500">
                        {registration.event.club.name} • {new Date(registration.event.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
                {user.clubMemberships.length === 0 && user.eventRegistrations.length === 0 && (
                  <p className="text-sm text-gray-500">No recent activity</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 