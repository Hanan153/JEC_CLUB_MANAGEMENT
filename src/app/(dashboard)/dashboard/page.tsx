import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  // Redirect admin users to admin dashboard
  if (session.user.role === "ADMIN") {
    redirect("/admin");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    include: {
      profile: true,
      clubMemberships: {
        where: {
          status: "APPROVED"
        },
        include: {
          club: true
        }
      },
      eventRegistrations: {
        include: {
          event: {
            include: {
              club: true
            }
          }
        }
      }
    }
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8">Welcome, {user.name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* User Info Card */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Your Information</h2>
          <div className="space-y-2">
            <p><span className="font-medium">Email:</span> {user.email}</p>
            <p><span className="font-medium">Department:</span> {user.department}</p>
            <p><span className="font-medium">Registration No:</span> {user.regNo}</p>
            <p><span className="font-medium">Role:</span> {user.role}</p>
          </div>
        </div>

        {/* Clubs Card */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Clubs You Have Joined</h2>
          {user.clubMemberships.length > 0 ? (
            <ul className="space-y-2">
              {user.clubMemberships.map((membership) => (
                <li key={membership.id} className="flex items-center justify-between">
                  <span>{membership.club.name}</span>
                  <span className="text-sm text-gray-500">
                    Joined: {new Date(membership.joinedAt).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">You haven't joined any clubs yet.</p>
          )}
        </div>

        {/* Events Card */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Your Events</h2>
          {user.eventRegistrations.length > 0 ? (
            <ul className="space-y-2">
              {user.eventRegistrations.map((registration) => (
                <li key={registration.id} className="flex items-center justify-between">
                  <span>{registration.event.name}</span>
                  <span className="text-sm text-gray-500">
                    {new Date(registration.event.date).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">You haven't registered for any events yet.</p>
          )}
        </div>
      </div>
    </div>
  );
} 