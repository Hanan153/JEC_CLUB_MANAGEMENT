import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default async function EventRegistrationsPage({
  params,
}: {
  params: { eventId: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  // Fetch event with club and registrations
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
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              department: true,
              regNo: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
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

  // Check if user is the club creator
  if (event.club.creatorId !== session.user.id) {
    redirect(`/events/${params.eventId}`);
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <Link href={`/events/${params.eventId}`}>
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Event
          </Button>
        </Link>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-3xl font-bold">{event.name}</CardTitle>
              <p className="text-muted-foreground mt-2">
                {event._count.registrations} registrations
              </p>
            </div>
            <Badge className="text-white">
              {event.maxParticipants 
                ? `${event._count.registrations} / ${event.maxParticipants}`
                : "Unlimited"}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Registered Participants</h2>
        
        {event.registrations.length > 0 ? (
          <div className="grid gap-4">
            {event.registrations.map((registration) => (
              <Card key={registration.id}>
                <CardContent className="flex items-center justify-between p-6">
                  <div>
                    <h3 className="font-semibold">{registration.user.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {registration.user.email}
                    </p>
                    <div className="mt-2 text-sm text-muted-foreground">
                      <p>Department: {registration.user.department}</p>
                      <p>Registration No: {registration.user.regNo}</p>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Registered on {new Date(registration.createdAt).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-600">No registrations yet</p>
            <p className="text-sm text-muted-foreground mt-2">
              Share your event to get participants
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 