import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-primary">
                JEC Clubs
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative isolate">
        <div className="mx-auto max-w-4xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Welcome to{" "}
              <span className="text-primary">Jyothi Engineering College</span>
              <br />
              Club Management System
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Discover, join, and manage college clubs with ease. Connect with like-minded students and make the most of your college experience.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/register"
                className="bg-primary hover:bg-primary-light text-white px-6 py-3 rounded-md text-base font-semibold shadow-sm"
              >
                Get Started
              </Link>
              <Link
                href="/login"
                className="bg-accent hover:bg-accent-dark text-gray-900 px-6 py-3 rounded-md text-base font-semibold"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-accent py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Everything you need to manage your clubs
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Our platform provides all the tools you need to manage and participate in college clubs effectively.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <div className="grid grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-3">
              {/* Feature 1 */}
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900">Join Clubs</h3>
                <p className="mt-4 text-gray-600">
                  Discover and join various clubs based on your interests. Connect with like-minded students and expand your network.
                </p>
              </div>
              {/* Feature 2 */}
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900">Manage Events</h3>
                <p className="mt-4 text-gray-600">
                  Create and participate in club events and activities. Keep track of upcoming events and manage attendance.
                </p>
              </div>
              {/* Feature 3 */}
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900">Track Progress</h3>
                <p className="mt-4 text-gray-600">
                  Monitor your participation and achievements in clubs. Get recognition for your contributions and leadership.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Ready to get started?
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Join our community of students and start managing your club activities today.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
