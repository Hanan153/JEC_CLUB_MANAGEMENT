"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { User } from "@prisma/client";

interface UpdateProfileFormProps {
  user: User;
}

export default function UpdateProfileForm({ user }: UpdateProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(event.currentTarget);
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.get("name"),
          department: formData.get("department"),
          regNo: formData.get("regNo"),
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Failed to update profile");
      }

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update profile",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">
            Full Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            defaultValue={user.name}
            required
            className="w-full p-2 border rounded-md"
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={user.email}
            disabled
            className="w-full p-2 border rounded-md bg-gray-50"
          />
          <p className="text-xs text-gray-500">Email cannot be changed</p>
        </div>

        <div className="space-y-2">
          <label htmlFor="regNo" className="text-sm font-medium">
            Registration Number
          </label>
          <input
            id="regNo"
            name="regNo"
            type="text"
            defaultValue={user.regNo}
            required
            className="w-full p-2 border rounded-md"
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="department" className="text-sm font-medium">
            Department
          </label>
          <input
            id="department"
            name="department"
            type="text"
            defaultValue={user.department}
            required
            className="w-full p-2 border rounded-md"
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" className="text-white" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
} 