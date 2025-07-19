import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Plus } from "lucide-react";
import DeleteEventButton from "@/components/delete-event-button";
import JoinClubButton from "@/components/join-club-button";
import LeaveClubButton from "@/components/leave-club-button";
import ManageClubMembers from "@/components/manage-club-members";

export default async function ClubPage({
  params,
}: {
  params: { clubId: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const club = await prisma.club.findUnique({
    where: {
      id: params.clubId,
      status: {
        in: ["APPROVED", "DEACTIVATED"]
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
      members: {
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
      events: {
        orderBy: {
          date: "asc",
        },
        where: {
          date: {
            gte: new Date(),
          },
        },
        include: {
          _count: {
            select: {
              registrations: true,
            },
          },
        },
      },
    },
  });

  if (!club) {
    redirect("/clubs");
  }

  // Check if user is a member
  const isMember = club.members.some((member) => member.userId === session.user.id);
  const isCreator = club.creatorId === session.user.id;
  const isCoordinator = club.coordinatorId === session.user.id;

  return (
    <div className="container mx-auto py-10">
      {club.status === "DEACTIVATED" && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800">
            This club is currently deactivated. Some features may be limited.
          </p>
        </div>
      )}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold">{club.name}</h1>
          <p className="text-gray-600">{club.description}</p>
        </div>
        <div className="flex gap-2">
          {isCreator ? (
            <>
              <Link href={`/clubs/${club.id}/edit`}>
                <Button variant="outline" className="text-blue-600">
                  Edit Club
                </Button>
              </Link>
              <Link href={`/clubs/${club.id}/events/new`}>
                <Button className="text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Event
                </Button>
              </Link>
            </>
          ) : isCoordinator ? (
            <Button variant="outline" disabled>
              You are the coordinator
            </Button>
          ) : isMember ? (
            <LeaveClubButton clubId={club.id} />
          ) : (
            <JoinClubButton clubId={club.id} />
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent>
              {club.events.length > 0 ? (
                <div className="space-y-4">
                  {club.events.map((event) => (
                    <div
                      key={event.id}
                      className="border rounded-lg p-4 hover:bg-gray-50"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{event.name}</h3>
                          <p className="text-sm text-gray-600">
                            {new Date(event.date).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-gray-600 mt-2">
                            {event.description}
                          </p>
                        </div>
                        <Badge>
                          {event._count.registrations} registered
                        </Badge>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Link href={`/events/${event.id}`}>
                          <Button variant="outline">View Details</Button>
                        </Link>
                        {isCreator && (
                          <>
                            <Link href={`/clubs/${club.id}/events/${event.id}/edit`}>
                              <Button variant="outline" className="text-blue-600">
                                Edit
                              </Button>
                            </Link>
                            <DeleteEventButton clubId={club.id} eventId={event.id} />
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No upcoming events</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Club Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Club ID</h3>
                  <p className="font-mono">{club.clubId}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Created by</h3>
                  <p>{club.creator.name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Coordinator</h3>
                  <p>{club.coordinator.name} • {club.coordinator.department}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Members</h3>
                  <p>{club.members.filter(m => m.status === "APPROVED").length} members</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {isCoordinator && (
            <ManageClubMembers clubId={club.id} members={club.members} />
          )}
        </div>
      </div>
    </div>
  );
} 