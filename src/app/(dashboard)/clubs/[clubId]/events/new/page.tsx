import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CreateEventForm from "./create-event-form";

export default async function CreateEventPage({
  params,
}: {
  params: { clubId: string };
}) {
  const session = await getServerSession(authOptions);
  const clubId = params.clubId;

  if (!session?.user?.id) {
    redirect("/login");
  }

  const club = await prisma.club.findUnique({
    where: {
      id: clubId,
      status: "APPROVED",
    },
    select: {
      id: true,
      name: true,
      creatorId: true,
      coordinatorId: true,
    },
  });

  if (!club) {
    redirect("/clubs");
  }

  // Check if user is either the coordinator or the creator
  const isCoordinator = club.coordinatorId === session.user.id;
  const isCreator = club.creatorId === session.user.id;

  if (!isCoordinator && !isCreator) {
    redirect("/clubs");
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Create New Event</h1>
        <p className="text-muted-foreground">Create a new event for {club.name}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Event Details</CardTitle>
        </CardHeader>
        <CardContent>
          <CreateEventForm clubId={clubId} />
        </CardContent>
      </Card>
    </div>
  );
} 