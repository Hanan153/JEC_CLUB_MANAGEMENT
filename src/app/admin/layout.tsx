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
    href: "/admin",
    icon: Users,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Coordinators",
    href: "/admin/coordinators",
    icon: Users,
  },
  {
    title: "Clubs",
    href: "/admin/clubs",
    icon: Club,
  },
  {
    title: "Pending Requests",
    href: "/admin/pending",
    icon: Clock,
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-md bg-white shadow-md"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-primary">Admin Panel</h1>
          </div>
          <nav className="flex-1 px-4 space-y-1">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? "bg-primary text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.title}
                </Link>
              );
            })}
          </nav>
          <div className="p-4 border-t">
            <button
              onClick={() => signOut()}
              className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-md"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
} 