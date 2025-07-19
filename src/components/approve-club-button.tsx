"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface ApproveClubButtonProps {
  clubId: string;
}

export default function ApproveClubButton({ clubId }: ApproveClubButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleApprove = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(`/api/admin/clubs/${clubId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "APPROVED" }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Failed to approve club");
      }

      toast({
        title: "Success",
        description: "Club has been approved",
      });
      
      router.refresh();
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to approve club",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleApprove}
      disabled={isLoading}
      className="text-white"
    >
      {isLoading ? "Approving..." : "Approve"}
    </Button>
  );
} 