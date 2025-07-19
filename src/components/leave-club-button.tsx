"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

interface LeaveClubButtonProps {
  clubId: string;
}

export default function LeaveClubButton({ clubId }: LeaveClubButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLeave = async () => {
    if (!confirm("Are you sure you want to leave this club?")) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/clubs/${clubId}/leave`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Failed to leave club");
      }

      toast({
        title: "Success",
        description: "You have successfully left the club",
      });

      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to leave club",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleLeave}
      disabled={isLoading}
      variant="outline"
      className="text-red-600"
    >
      {isLoading ? "Leaving..." : "Leave Club"}
    </Button>
  );
} 