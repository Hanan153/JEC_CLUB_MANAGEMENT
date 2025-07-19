import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CalendarIcon, ClockIcon, MapPinIcon, Users2Icon } from "lucide-react";

export default async function EventsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  // Fetch registered events
  const registeredEvents = await prisma.event.findMany({
    where: {
      registrations: {
        some: {
          userId: session.user.id,
        },
      },
      date: {
        gte: new Date(),
      },
    },
    include: {
      club: true,
      _count: {
        select: {
          registrations: true,
        },
      },
    },
    orderBy: [
      {
        date: "asc",
      },
      {
        time: "asc",
      },
    ],
  });

  // Fetch club events (from clubs you're a member of, excluding registered events)
  const clubEvents = await prisma.event.findMany({
    where: {
      club: {
        OR: [
          { creatorId: session.user.id },
          {
            members: {
              some: {
                userId: session.user.id,
              },
            },
          },
        ],
      },
      date: {
        gte: new Date(),
      },
      NOT: {
        registrations: {
          some: {
            userId: session.user.id,
          },
        },
      },
    },
    include: {
      club: true,
      _count: {
        select: {
          registrations: true,
        },
      },
    },
    orderBy: [
      {
        date: "asc",
      },
      {
        time: "asc",
      },
    ],
  });

  interface EventCardProps {
    event: {
      id: string;
      name: string;
      date: Date;
      time: string;
      location: string;
      maxParticipants: number | null;
      club: {
        name: string;
        creatorId: string;
      };
      _count: {
        registrations: number;
      };
    };
    showRegisterBadge?: boolean;
  }

  const EventCard = ({ event, showRegisterBadge = false }: EventCardProps) => (
    <Card key={event.id}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-bold">{event.name}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              By {event.club.name}
            </p>
          </div>
          {showRegisterBadge ? (
            <Badge variant="outline" className="text-green-600">Registered</Badge>
          ) : (
            event.club.creatorId === session.user.id && (
              <Badge>Organizer</Badge>
            )
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarIcon className="w-4 h-4" />
            <span>{new Date(event.date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ClockIcon className="w-4 h-4" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPinIcon className="w-4 h-4" />
            <span>{event.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users2Icon className="w-4 h-4" />
            <span>
              {event._count.registrations}
              {event.maxParticipants
                ? ` / ${event.maxParticipants}`
                : " registered"}
            </span>
          </div>
        </div>
        <Link href={`/events/${event.id}`}>
          <Button className="w-full text-white">View Details</Button>
        </Link>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8">Your Events</h1>

      {/* Registered Events Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Events You're Attending</h2>
        {registeredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {registeredEvents.map((event) => (
              <EventCard key={event.id} event={event} showRegisterBadge={true} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-6">
              <p className="text-gray-600">You haven't registered for any events yet</p>
              <p className="text-sm text-muted-foreground mt-2">
                Browse your club events and register for ones you'd like to attend
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Club Events Section */}
      <div>
        <h2 className="text-2xl font-semibold mb-6">Club Events</h2>
        {clubEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clubEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-6">
              <p className="text-gray-600">No upcoming events from your clubs</p>
              <p className="text-sm text-muted-foreground mt-2">
                Join more clubs to see their events here
              </p>
              <Link href="/clubs" className="mt-4 inline-block text-white">
                <Button>Browse Clubs</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
} 