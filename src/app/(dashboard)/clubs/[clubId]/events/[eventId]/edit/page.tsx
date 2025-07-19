import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EditEventForm from "./edit-event-form";

export default async function EditEventPage({
  params,
}: {
  params: { clubId: string; eventId: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  // Check if user is the club creator and get event details
  const [club, event] = await Promise.all([
    prisma.club.findUnique({
      where: {
        id: params.clubId,
        status: "APPROVED",
      },
      select: {
        id: true,
        name: true,
        creatorId: true,
      },
    }),
    prisma.event.findUnique({
      where: {
        id: params.eventId,
        clubId: params.clubId,
      },
    }),
  ]);

  if (!club || !event) {
    redirect("/clubs");
  }

  if (club.creatorId !== session.user.id) {
    redirect(`/clubs/${club.id}`);
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Edit Event - {event.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <EditEventForm clubId={club.id} event={event} />
        </CardContent>
      </Card>
    </div>
  );
} 