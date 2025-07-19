"use client";

import { useEffect } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Users2Icon, TrendingUpIcon, ActivityIcon } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Colors for the pie chart
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  // Fetch user's clubs and related data
  const [userClubs, upcomingEvents, recentActivities] = await Promise.all([
    prisma.club.findMany({
      where: {
        AND: [
          {
            OR: [
              { creatorId: session.user.id },
              {
                members: {
                  some: {
                    userId: session.user.id,
                  },
                },
              },
            ],
          },
          { status: "APPROVED" },
        ],
      },
      include: {
        creator: true,
        _count: {
          select: {
            members: true,
            events: true,
          },
        },
        events: {
          where: {
            date: {
              gte: new Date(),
            },
          },
          orderBy: {
            date: "asc",
          },
          take: 3,
          include: {
            _count: {
              select: {
                registrations: true,
              },
            },
          },
        },
      },
    }),
    // Fetch upcoming events across all clubs user is part of
    prisma.event.findMany({
      where: {
        date: {
          gte: new Date(),
        },
        club: {
          OR: [
            { creatorId: session.user.id },
            {
              members: {
                some: {
                  userId: session.user.id,
                },
              },
            },
          ],
        },
      },
      include: {
        club: true,
        _count: {
          select: {
            registrations: true,
          },
        },
      },
      orderBy: {
        date: "asc",
      },
      take: 5,
    }),
    // Fetch recent activities (registrations, club joins, etc.)
    prisma.eventRegistration.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        event: {
          include: {
            club: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    }),
  ]);

  // Prepare data for club activity chart
  const clubActivityData = userClubs.map(club => ({
    name: club.name,
    members: club._count.members,
    events: club._count.events,
  }));

  // Prepare data for event distribution pie chart
  const eventDistribution = [
    { name: 'Upcoming', value: upcomingEvents.length },
    { name: 'Registered', value: recentActivities.length },
  ];

  // Separate clubs into created and joined
  const createdClubs = userClubs.filter(club => club.creatorId === session.user.id);
  const joinedClubs = userClubs.filter(club => club.creatorId !== session.user.id);

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold">Welcome back, {session.user.name}!</h1>
          <p className="text-gray-600 mt-2">Here's what's happening with your clubs</p>
        </div>
        <Link href="/clubs">
          <Button className="text-white">View All Clubs</Button>
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Your Clubs</CardTitle>
            <Users2Icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userClubs.length}</div>
            <p className="text-xs text-muted-foreground">
              {createdClubs.length} created • {joinedClubs.length} joined
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingEvents.length}</div>
            <p className="text-xs text-muted-foreground">
              Events in your clubs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userClubs.reduce((sum, club) => sum + club._count.members, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all your clubs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
            <ActivityIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentActivities.length}</div>
            <p className="text-xs text-muted-foreground">
              New registrations
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Club Activity Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Club Activity Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={clubActivityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="members" fill="#8884d8" name="Members" />
                  <Bar dataKey="events" fill="#82ca9d" name="Events" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Event Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Event Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={eventDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {eventDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity and Upcoming Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{event.name}</p>
                    <p className="text-sm text-gray-500">
                      {event.club.name} • {new Date(event.date).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge>
                    {event._count.registrations} registered
                  </Badge>
                </div>
              ))}
              {upcomingEvents.length === 0 && (
                <p className="text-sm text-gray-500">No upcoming events</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Registered for {activity.event.name}</p>
                    <p className="text-sm text-gray-500">
                      {activity.event.club.name} • {new Date(activity.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant="outline">
                    {activity.status}
                  </Badge>
                </div>
              ))}
              {recentActivities.length === 0 && (
                <p className="text-sm text-gray-500">No recent activity</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 