"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Event } from "@prisma/client";

interface EditEventFormProps {
  clubId: string;
  event: Event;
}

export default function EditEventForm({ clubId, event }: EditEventFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const dateValue = formData.get("date") as string;
      const eventDate = new Date(dateValue);

      const response = await fetch(`/api/clubs/${clubId}/events/${event.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.get("name"),
          description: formData.get("description"),
          date: eventDate.toISOString(),
          time: eventDate.toLocaleTimeString(),
          location: formData.get("location"),
          maxParticipants: parseInt(formData.get("maxParticipants") as string) || null,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Failed to update event");
      }

      toast({
        title: "Success",
        description: "Event updated successfully",
      });
      router.push(`/clubs/${clubId}`);
      router.refresh();
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update event",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">
          Event Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          defaultValue={event.name}
          className="w-full p-2 border rounded-md"
          placeholder="Enter event name"
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          required
          defaultValue={event.description}
          rows={4}
          className="w-full p-2 border rounded-md"
          placeholder="Describe your event"
          disabled={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="date" className="text-sm font-medium">
            Date and Time
          </label>
          <input
            type="datetime-local"
            id="date"
            name="date"
            required
            defaultValue={event.date.toISOString().slice(0, 16)}
            className="w-full p-2 border rounded-md"
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="location" className="text-sm font-medium">
            Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            required
            defaultValue={event.location}
            className="w-full p-2 border rounded-md"
            placeholder="Event location"
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="maxParticipants" className="text-sm font-medium">
          Maximum Participants (Optional)
        </label>
        <input
          type="number"
          id="maxParticipants"
          name="maxParticipants"
          min="1"
          defaultValue={event.maxParticipants || ""}
          className="w-full p-2 border rounded-md"
          placeholder="Leave empty for unlimited"
          disabled={isLoading}
        />
      </div>

      <div className="flex justify-end gap-4">
        <Link href={`/clubs/${clubId}`}>
          <Button variant="outline" type="button" disabled={isLoading}>
            Cancel
          </Button>
        </Link>
        <Button type="submit" className="text-white" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
} 