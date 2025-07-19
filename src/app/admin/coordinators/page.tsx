import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CreateCoordinatorForm from "./create-coordinator-form";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

async function deleteCoordinator(coordinatorId: string) {
  "use server";
  
  try {
    const response = await fetch(`/api/admin/coordinators/${coordinatorId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    toast({
      title: "Success",
      description: "Coordinator deleted successfully",
    });
  } catch (error) {
    toast({
      variant: "destructive",
      title: "Error",
      description: error instanceof Error ? error.message : "Failed to delete coordinator",
    });
  }
}

export default async function CoordinatorsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  const coordinators = await prisma.user.findMany({
    where: {
      role: "COORDINATOR",
    },
    include: {
      coordinatedClubs: true,
    },
  });

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Manage Coordinators</h1>
        <p className="text-muted-foreground">Create and manage club coordinators</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Create New Coordinator</CardTitle>
          </CardHeader>
          <CardContent>
            <CreateCoordinatorForm />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Existing Coordinators</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y">
              {coordinators.map((coordinator) => (
                <div key={coordinator.id} className="py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{coordinator.name}</h3>
                      <p className="text-sm text-muted-foreground">{coordinator.email}</p>
                      <p className="text-sm text-muted-foreground">
                        Coordinating {coordinator.coordinatedClubs.length} club(s)
                      </p>
                    </div>
                    <form action={deleteCoordinator.bind(null, coordinator.id)}>
                      <Button
                        type="submit"
                        variant="destructive"
                        size="icon"
                        disabled={coordinator.coordinatedClubs.length > 0}
                        title={coordinator.coordinatedClubs.length > 0 ? "Cannot delete coordinator with active clubs" : "Delete coordinator"}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </form>
                  </div>
                </div>
              ))}
              {coordinators.length === 0 && (
                <p className="text-muted-foreground">No coordinators found</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 