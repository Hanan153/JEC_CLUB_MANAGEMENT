import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import RequestActions from "./request-actions";

export default async function JoinRequestsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || session.user.role !== "COORDINATOR") {
    redirect("/login");
  }

  const requests = await prisma.clubMember.findMany({
    where: {
      club: {
        coordinatorId: session.user.id,
      },
      status: "PENDING",
    },
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
      club: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      joinedAt: "desc",
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Join Requests</h2>
        <p className="text-muted-foreground">
          Manage club join requests
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pending Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {requests.map((request) => (
              <div
                key={request.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{request.user.name}</h3>
                    <Badge>{request.user.department}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {request.user.email}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Reg No: {request.user.regNo}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Club: {request.club.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Requested: {new Date(request.joinedAt).toLocaleDateString()}
                  </p>
                </div>
                <RequestActions
                  requestId={request.id}
                  clubId={request.club.id}
                  userId={request.user.id}
                />
              </div>
            ))}
            {requests.length === 0 && (
              <p className="text-center text-muted-foreground py-4">
                No pending join requests
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 