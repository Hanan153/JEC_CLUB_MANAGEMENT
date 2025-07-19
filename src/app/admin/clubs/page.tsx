"use client";

import { useEffect, useState } from "react";
import { Club, User } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

type ClubWithCreator = Club & {
  creator: User;
  coordinator: {
    name: string;
    email: string;
    department: string;
  };
};

export default function ClubsPage() {
  const [clubs, setClubs] = useState<ClubWithCreator[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClubs();
  }, []);

  const fetchClubs = async () => {
    try {
      const response = await fetch("/api/admin/clubs");
      const data = await response.json();
      setClubs(data);
    } catch (error) {
      console.error("Error fetching clubs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (clubId: string, status: "APPROVED" | "REJECTED" | "DEACTIVATED") => {
    try {
      const response = await fetch(`/api/admin/clubs/${clubId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error("Failed to update club status");
      }

      toast({
        title: "Success",
        description: `Club ${status.toLowerCase()} successfully`,
      });

      fetchClubs();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update club status",
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Clubs</h2>
        <p className="text-muted-foreground">
          Manage and approve club requests
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Clubs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {clubs.map((club) => (
              <div
                key={club.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="space-y-1">
                  <h3 className="font-medium">{club.name}</h3>
                  <p className="text-sm text-gray-500">{club.description}</p>
                  <p className="text-sm text-gray-500">
                    Created by {club.creator.name} • {club.creator.department}
                  </p>
                  <p className="text-sm text-gray-500">
                    Coordinator: {club.coordinator.name} • {club.coordinator.department}
                  </p>
                  <p className="text-xs font-mono text-gray-500">
                    Club ID: {club.clubId}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Badge
                    variant={
                      club.status === "APPROVED"
                        ? "default"
                        : club.status === "REJECTED"
                        ? "destructive"
                        : club.status === "DEACTIVATED"
                        ? "secondary"
                        : "secondary"
                    }
                  >
                    {club.status}
                  </Badge>
                  {club.status === "PENDING" && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleStatusUpdate(club.id, "APPROVED")}
                        variant="default"
                        className="text-white"
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleStatusUpdate(club.id, "REJECTED")}
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                  {club.status === "APPROVED" && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleStatusUpdate(club.id, "DEACTIVATED")}
                    >
                      Deactivate
                    </Button>
                  )}
                  {club.status === "DEACTIVATED" && (
                    <Button
                      size="sm"
                      variant="default"
                      className="text-white"
                      onClick={() => handleStatusUpdate(club.id, "APPROVED")}
                    >
                      Reactivate
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 