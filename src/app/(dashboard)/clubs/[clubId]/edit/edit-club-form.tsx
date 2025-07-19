"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

interface EditClubFormProps {
  club: {
    id: string;
    name: string;
    description: string;
    coordinator: string;
  };
}

export default function EditClubForm({ club }: EditClubFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(event.currentTarget);
      const response = await fetch(`/api/clubs/${club.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.get("name"),
          description: formData.get("description"),
          coordinator: formData.get("coordinator"),
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Failed to update club");
      }

      toast({
        title: "Success",
        description: "Club updated successfully",
      });
      router.push(`/clubs/${club.id}`);
      router.refresh();
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update club",
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
          Club Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          className="w-full p-2 border rounded-md"
          placeholder="Enter club name"
          defaultValue={club.name}
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
          rows={4}
          className="w-full p-2 border rounded-md"
          placeholder="Describe your club"
          defaultValue={club.description}
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="coordinator" className="text-sm font-medium">
          Coordinator
        </label>
        <input
          type="text"
          id="coordinator"
          name="coordinator"
          required
          className="w-full p-2 border rounded-md"
          placeholder="Enter coordinator name"
          defaultValue={club.coordinator}
          disabled={isLoading}
        />
      </div>

      <div className="flex justify-end gap-4">
        <Link href={`/clubs/${club.id}`}>
          <Button variant="outline" type="button" disabled={isLoading}>
            Cancel
          </Button>
        </Link>
        <Button type="submit" className="text-white" disabled={isLoading}>
          {isLoading ? "Updating..." : "Update Club"}
        </Button>
      </div>
    </form>
  );
} 