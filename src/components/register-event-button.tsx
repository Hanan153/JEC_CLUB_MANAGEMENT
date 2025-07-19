"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface RegisterEventButtonProps {
  eventId: string;
}

export default function RegisterEventButton({ eventId }: RegisterEventButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(`/api/events/${eventId}/register`, {
        method: "POST",
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Failed to register for event");
      }

      toast({
        title: "Success",
        description: "You have successfully registered for this event",
      });
      
      router.refresh();
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to register for event",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleRegister}
      disabled={isLoading}
      className="w-full text-white"
    >
      {isLoading ? "Registering..." : "Register for Event"}
    </Button>
  );
} 