"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Users, 
  Club, 
  Clock,
  LogOut,
  Menu,
  X
} from "lucide-react";
import { signOut } from "next-auth/react";

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/coordinator",
    icon: Users,
  },
  {
    title: "My Clubs",
    href: "/coordinator/clubs",
    icon: Club,
  },
  {
    title: "Join Requests",
    href: "/coordinator/requests",
    icon: Clock,
  },
];

export default function CoordinatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();

  return (
    <div className="min-h-screen">
      {/* Mobile sidebar toggle */}
      <button
        className="fixed p-4 bg-white md:hidden"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Menu className="w-6 h-6" />
        )}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 bg-white w-64 transform transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col border-r">
          <div className="p-6">
            <Link href="/coordinator" className="text-2xl font-bold">
              Coordinator
            </Link>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.title}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t">
            <button
              onClick={() => signOut()}
              className="flex items-center space-x-2 px-4 py-2 w-full text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main
        className={`min-h-screen transition-all duration-200 ease-in-out ${
          isSidebarOpen ? "md:pl-64" : ""
        }`}
      >
        <div className="container mx-auto p-6">{children}</div>
      </main>
    </div>
  );
} 