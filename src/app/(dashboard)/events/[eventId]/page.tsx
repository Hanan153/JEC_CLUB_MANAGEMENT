import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { CalendarIcon, MapPinIcon, Users2Icon, ClockIcon } from "lucide-react";
import RegisterEventButton from "@/components/register-event-button";

export default async function EventPage({
  params,
}: {
  params: { eventId: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const event = await prisma.event.findUnique({
    where: {
      id: params.eventId,
    },
    include: {
      club: {
        include: {
          creator: true,
        },
      },
      registrations: {
        include: {
          user: true,
        },
      },
      _count: {
        select: {
          registrations: true,
        },
      },
    },
  });

  if (!event) {
    redirect("/events");
  }

  // Check if user is registered
  const isRegistered = event.registrations.some(
    (registration) => registration.userId === session.user.id
  );

  // Check if event is full
  const isFull = event.maxParticipants 
    ? event._count.registrations >= event.maxParticipants 
    : false;

  // Check if event date has passed
  const hasEnded = new Date(event.date) < new Date();

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <Link href="/events">
          <Button variant="outline">← Back to Events</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-3xl font-bold">{event.name}</CardTitle>
                  <p className="text-lg text-muted-foreground mt-2">
                    Organized by {event.club.name}
                  </p>
                </div>
                <Badge className="text-white">
                  {event._count.registrations} registered
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <p className="text-gray-600 whitespace-pre-wrap">{event.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Date</p>
                    <p className="text-muted-foreground">
                      {new Date(event.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <ClockIcon className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Time</p>
                    <p className="text-muted-foreground">{event.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MapPinIcon className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-muted-foreground">{event.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users2Icon className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Capacity</p>
                    <p className="text-muted-foreground">
                      {event.maxParticipants 
                        ? `${event._count.registrations} / ${event.maxParticipants}`
                        : "Unlimited"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Event Organizer</h3>
                <div className="flex items-center gap-4">
                  {event.club.creator.image && (
                    <img
                      src={event.club.creator.image}
                      alt={event.club.creator.name || ""}
                      className="w-12 h-12 rounded-full"
                    />
                  )}
                  <div>
                    <p className="font-medium">{event.club.creator.name}</p>
                    <p className="text-sm text-muted-foreground">Club Creator</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Registration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {hasEnded ? (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground">This event has ended</p>
                  </div>
                ) : isRegistered ? (
                  <div className="text-center py-4">
                    <Badge variant="outline" className="text-green-600">
                      You are registered for this event
                    </Badge>
                    <p className="text-sm text-muted-foreground mt-2">
                      We look forward to seeing you there!
                    </p>
                  </div>
                ) : isFull ? (
                  <div className="text-center py-4">
                    <Badge variant="outline" className="text-red-600">
                      Event is full
                    </Badge>
                    <p className="text-sm text-muted-foreground mt-2">
                      Maximum participants reached
                    </p>
                  </div>
                ) : (
                  <RegisterEventButton eventId={event.id} />
                )}

                {event.club.creatorId === session.user.id && (
                  <Link href={`/events/${event.id}/registrations`}>
                    <Button variant="outline" className="w-full">
                      View Registrations
                    </Button>
                  </Link>
                )}

                <div className="border-t pt-4 mt-4">
                  <h4 className="font-medium mb-2">Recent Registrations</h4>
                  <div className="space-y-2">
                    {event.registrations.slice(0, 5).map((registration) => (
                      <div key={registration.id} className="text-sm">
                        {registration.user.name}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 