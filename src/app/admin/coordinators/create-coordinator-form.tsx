"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

export default function CreateCoordinatorForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      regNo: formData.get("regNo") as string,
      department: formData.get("department") as string,
    };

    try {
      const response = await fetch("/api/admin/coordinators", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to create coordinator");
      }

      toast({
        title: "Success",
        description: "Coordinator created successfully",
      });

      // Reset form using the ref
      formRef.current?.reset();
      router.refresh();
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create coordinator",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          type="text"
          required
          disabled={loading}
        />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          disabled={loading}
        />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          disabled={loading}
        />
      </div>
      <div>
        <Label htmlFor="regNo">Registration Number</Label>
        <Input
          id="regNo"
          name="regNo"
          type="text"
          required
          disabled={loading}
        />
      </div>
      <div>
        <Label htmlFor="department">Department</Label>
        <Input
          id="department"
          name="department"
          type="text"
          required
          disabled={loading}
        />
      </div>
      <Button type="submit" disabled={loading} className="text-white">
        {loading ? "Creating..." : "Create Coordinator"}
      </Button>
    </form>
  );
} 