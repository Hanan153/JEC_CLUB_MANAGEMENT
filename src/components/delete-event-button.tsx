"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface DeleteEventButtonProps {
  clubId: string;
  eventId: string;
}

export default function DeleteEventButton({ clubId, eventId }: DeleteEventButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this event? This action cannot be undone.")) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/api/clubs/${clubId}/events/${eventId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Failed to delete event");
      }

      toast({
        title: "Success",
        description: "Event deleted successfully",
      });
      
      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete event",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      className="text-red-600"
      onClick={handleDelete}
      disabled={isLoading}
    >
      {isLoading ? "Deleting..." : "Delete"}
    </Button>
  );
} 