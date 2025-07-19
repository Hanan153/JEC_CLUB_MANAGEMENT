"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface RejectClubButtonProps {
  clubId: string;
}

export default function RejectClubButton({ clubId }: RejectClubButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleReject = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(`/api/admin/clubs/${clubId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "REJECTED" }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Failed to reject club");
      }

      toast({
        title: "Success",
        description: "Club has been rejected",
      });
      
      router.refresh();
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to reject club",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleReject}
      disabled={isLoading}
      variant="outline"
      className="text-red-600"
    >
      {isLoading ? "Rejecting..." : "Reject"}
    </Button>
  );
} 