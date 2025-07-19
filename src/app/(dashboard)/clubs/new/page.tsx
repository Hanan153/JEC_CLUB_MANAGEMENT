import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CreateClubForm from "./create-club-form";

export default async function CreateClubPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Create New Club</CardTitle>
        </CardHeader>
        <CardContent>
          <CreateClubForm />
        </CardContent>
      </Card>
    </div>
  );
} 