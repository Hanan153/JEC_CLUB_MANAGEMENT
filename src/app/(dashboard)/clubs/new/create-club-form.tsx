"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface Coordinator {
  id: string;
  name: string;
  email: string;
}

export default function CreateClubForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [coordinators, setCoordinators] = useState<Coordinator[]>([]);

  useEffect(() => {
    async function fetchCoordinators() {
      try {
        const response = await fetch("/api/coordinators");
        if (!response.ok) {
          throw new Error("Failed to fetch coordinators");
        }
        const data = await response.json();
        setCoordinators(data);
      } catch (error) {
        console.error(error);
        toast({
          title: "Error",
          description: "Failed to load coordinators",
          variant: "destructive",
        });
      }
    }

    fetchCoordinators();
  }, []);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(event.currentTarget);
      const response = await fetch("/api/clubs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.get("name"),
          description: formData.get("description"),
          coordinatorId: formData.get("coordinatorId"),
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Failed to create club");
      }

      toast({
        title: "Success",
        description: "Club created successfully. Waiting for admin approval.",
      });
      router.push("/clubs");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create club",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Club Name</Label>
        <Input
          type="text"
          id="name"
          name="name"
          required
          placeholder="Enter club name"
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          required
          rows={4}
          placeholder="Describe your club"
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="coordinatorId">Coordinator</Label>
        <Select name="coordinatorId" required disabled={isLoading}>
          <SelectTrigger>
            <SelectValue placeholder="Select a coordinator" />
          </SelectTrigger>
          <SelectContent>
            {coordinators.map((coordinator) => (
              <SelectItem key={coordinator.id} value={coordinator.id}>
                {coordinator.name} ({coordinator.email})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end gap-4">
        <Link href="/clubs">
          <Button variant="outline" type="button" disabled={isLoading}>
            Cancel
          </Button>
        </Link>
        <Button type="submit" className="text-white" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create Club"}
        </Button>
      </div>
    </form>
  );
} 