"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

interface Member {
  id: string;
  user: {
    name: string | null;
    email: string;
    department: string;
  };
  status: "PENDING" | "APPROVED" | "REJECTED";
  joinedAt: Date;
}

interface ManageClubMembersProps {
  clubId: string;
  members: Member[];
}

export default function ManageClubMembers({ clubId, members }: ManageClubMembersProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleStatusUpdate = async (memberId: string, status: "APPROVED" | "REJECTED") => {
    setIsLoading(memberId);
    try {
      const response = await fetch(`/api/clubs/${clubId}/members/${memberId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error("Failed to update member status");
      }

      toast({
        title: "Success",
        description: `Member ${status.toLowerCase()} successfully`,
      });

      // Refresh the page to show updated data
      window.location.reload();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update member status",
      });
    } finally {
      setIsLoading(null);
    }
  };

  const pendingMembers = members.filter(member => member.status === "PENDING");
  const approvedMembers = members.filter(member => member.status === "APPROVED");

  return (
    <div className="space-y-6">
      {/* Pending Members */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Join Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {pendingMembers.length > 0 ? (
            <div className="space-y-4">
              {pendingMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{member.user.name}</p>
                    <p className="text-sm text-muted-foreground">{member.user.email}</p>
                    <p className="text-sm text-muted-foreground">{member.user.department}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleStatusUpdate(member.id, "APPROVED")}
                      disabled={isLoading === member.id}
                      className="text-white"
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleStatusUpdate(member.id, "REJECTED")}
                      disabled={isLoading === member.id}
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No pending join requests</p>
          )}
        </CardContent>
      </Card>

      {/* Approved Members */}
      <Card>
        <CardHeader>
          <CardTitle>Club Members</CardTitle>
        </CardHeader>
        <CardContent>
          {approvedMembers.length > 0 ? (
            <div className="space-y-4">
              {approvedMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{member.user.name}</p>
                    <p className="text-sm text-muted-foreground">{member.user.email}</p>
                    <p className="text-sm text-muted-foreground">{member.user.department}</p>
                  </div>
                  <Badge>Member</Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No members yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 