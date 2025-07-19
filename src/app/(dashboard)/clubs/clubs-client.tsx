"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Plus, Filter } from "lucide-react";
import JoinClubButton from "@/components/join-club-button";

interface Creator {
  id: string;
  name: string | null;
}

interface Coordinator {
  name: string;
  email: string;
  department: string;
}

interface Club {
  id: string;
  name: string;
  description: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED" | "DEACTIVATED";
  clubId: string;
  coordinator: Coordinator;
  coordinatorId: string;
  creator: Creator;
  _count: {
    members: number;
    events: number;
  };
}

interface ClubsPageClientProps {
  clubs: Club[];
  managedClubs: Club[];
  rejectedClubs: Club[];
  userMemberships: string[];
  userName: string;
  userId: string;
  userRole: string;
}

export default function ClubsPageClient({
  clubs,
  managedClubs,
  rejectedClubs,
  userMemberships,
  userName,
  userId,
  userRole,
}: ClubsPageClientProps) {
  const [showRejected, setShowRejected] = useState(false);
  const displayedManagedClubs = showRejected ? rejectedClubs : managedClubs;

  // Function to check if user has a pending request for a club
  const hasPendingRequest = async (clubId: string) => {
    try {
      const response = await fetch(`/api/clubs/${clubId}/membership-status`);
      if (!response.ok) return false;
      const data = await response.json();
      return data.status === "PENDING";
    } catch (error) {
      console.error("Error checking membership status:", error);
      return false;
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Clubs</h1>
        {userRole === "COORDINATOR" && (
          <Link href="/clubs/new">
            <Button className="text-white">
              <Plus className="w-4 h-4 mr-2" />
              Create Club
            </Button>
          </Link>
        )}
      </div>

      {/* Clubs You Manage Section */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Clubs You Manage</h2>
          <Button
            variant="outline"
            onClick={() => setShowRejected(!showRejected)}
            className="flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            {showRejected ? "Show Approved" : "Show Rejected"}
          </Button>
        </div>
        {displayedManagedClubs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedManagedClubs.map((club) => (
              <Card key={club.id} className="relative">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl font-bold">{club.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Created by you
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Coordinator: {club.coordinator.name} • {club.coordinator.department}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 font-mono">
                        Club ID: {club.clubId}
                      </p>
                    </div>
                    <Badge 
                      variant={
                        club.status === "REJECTED" 
                          ? "destructive" 
                          : club.status === "DEACTIVATED"
                          ? "secondary"
                          : "default"
                      }
                      className="capitalize"
                    >
                      {club.status.toLowerCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">{club.description || "No description provided"}</p>
                  <div className="flex justify-between items-center text-sm text-muted-foreground mb-4">
                    <span>{club._count.members} member{club._count.members !== 1 ? "s" : ""}</span>
                    <span>{club._count.events} event{club._count.events !== 1 ? "s" : ""}</span>
                  </div>
                  {club.status !== "REJECTED" && (
                    <div className="flex justify-end">
                      <Link href={`/clubs/${club.id}`}>
                        <Button variant="outline">Manage Club</Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-6">
              <p className="text-gray-600">
                {showRejected 
                  ? "No rejected clubs to display"
                  : "You haven't created any clubs yet"
                }
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                {showRejected
                  ? "Switch to approved clubs to see your active clubs"
                  : userRole === "COORDINATOR"
                  ? "Create a club to start organizing events"
                  : "You need to be a coordinator to create clubs"
                }
              </p>
              {!showRejected && userRole === "COORDINATOR" && (
                <Link href="/clubs/new" className="mt-4 inline-block">
                  <Button className="text-white">Create Your First Club</Button>
                </Link>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* All Other Clubs Section */}
      {!showRejected && (
        <div>
          <h2 className="text-2xl font-semibold mb-6">All Clubs</h2>
          {clubs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {clubs.map((club) => (
                <Card key={club.id} className="relative">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl font-bold">{club.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Created by {club.creator.name || "Unknown"}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Coordinator: {club.coordinator.name} • {club.coordinator.department}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1 font-mono">
                          Club ID: {club.clubId}
                        </p>
                      </div>
                      {club.coordinatorId === userId ? (
                        <Badge variant="outline">Coordinator</Badge>
                      ) : userMemberships.includes(club.id) ? (
                        <Badge variant="default">Member</Badge>
                      ) : null}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">{club.description || "No description provided"}</p>
                    <div className="flex justify-between items-center text-sm text-muted-foreground mb-4">
                      <span>{club._count.members} member{club._count.members !== 1 ? "s" : ""}</span>
                      <span>{club._count.events} event{club._count.events !== 1 ? "s" : ""}</span>
                    </div>
                    <div className="flex justify-end">
                      {club.coordinatorId === userId ? (
                        <Link href={`/clubs/${club.id}`}>
                          <Button variant="outline">Manage Members</Button>
                        </Link>
                      ) : userMemberships.includes(club.id) ? (
                        <Link href={`/clubs/${club.id}`}>
                          <Button variant="outline">View Club</Button>
                        </Link>
                      ) : (
                        <JoinClubButton clubId={club.id} />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-600">No other clubs available</p>
              <p className="text-sm text-muted-foreground mt-2">
                Create a new club or check back later
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 