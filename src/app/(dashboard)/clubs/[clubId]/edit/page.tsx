import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EditClubForm from "./edit-club-form";

export default async function EditClubPage({
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
    },
    select: {
      id: true,
      name: true,
      description: true,
      coordinator: true,
      creatorId: true,
    },
  });

  if (!club) {
    redirect("/clubs");
  }

  // Only allow the creator to edit the club
  if (club.creatorId !== session.user.id) {
    redirect("/clubs");
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Edit Club</CardTitle>
        </CardHeader>
        <CardContent>
          <EditClubForm club={club} />
        </CardContent>
      </Card>
    </div>
  );
} 