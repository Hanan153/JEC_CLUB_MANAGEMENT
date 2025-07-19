"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

interface JoinClubButtonProps {
  clubId: string;
}

export default function JoinClubButton({ clubId }: JoinClubButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [membershipStatus, setMembershipStatus] = useState<"PENDING" | "APPROVED" | "REJECTED" | null>(null);

  useEffect(() => {
    async function checkMembershipStatus() {
      try {
        const response = await fetch(`/api/clubs/${clubId}/membership-status`);
        if (response.ok) {
          const data = await response.json();
          setMembershipStatus(data.status);
        }
      } catch (error) {
        console.error("Error checking membership status:", error);
      }
    }

    checkMembershipStatus();
  }, [clubId]);

  async function handleJoin() {
    setIsLoading(true);

    try {
      const response = await fetch(`/api/clubs/${clubId}/join`, {
        method: "POST",
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Failed to join club");
      }

      toast({
        title: "Success",
        description: "Join request sent successfully. Waiting for coordinator approval.",
      });
      setMembershipStatus("PENDING");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to join club",
      });
    } finally {
      setIsLoading(false);
    }
  }

  if (membershipStatus === "PENDING") {
    return (
      <Button
        variant="outline"
        disabled
        className="text-yellow-600"
      >
        Request Pending
      </Button>
    );
  }

  if (membershipStatus === "REJECTED") {
    return (
      <Button
        variant="outline"
        onClick={handleJoin}
        disabled={isLoading}
        className="text-red-600"
      >
        {isLoading ? "Sending Request..." : "Request Again to Join"}
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      onClick={handleJoin}
      disabled={isLoading}
      className="text-blue-600"
    >
      {isLoading ? "Sending Request..." : "Request to Join"}
    </Button>
  );
} 