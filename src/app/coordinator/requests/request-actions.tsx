"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface RequestActionsProps {
  requestId: string;
  clubId: string;
  userId: string;
}

export default function RequestActions({
  requestId,
  clubId,
  userId,
}: RequestActionsProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleAction(action: "approve" | "reject") {
    setIsLoading(true);

    try {
      const response = await fetch(`/api/clubs/${clubId}/join/${requestId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: action === "approve" ? "APPROVED" : "REJECTED",
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${action} request`);
      }

      toast({
        title: "Success",
        description: `Request ${action}d successfully`,
      });
      router.refresh();
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : `Failed to ${action} request`,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleAction("approve")}
        disabled={isLoading}
      >
        Approve
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleAction("reject")}
        disabled={isLoading}
        className="text-red-600 hover:text-red-700"
      >
        Reject
      </Button>
    </div>
  );
} 