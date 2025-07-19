import { UserRole } from "@prisma/client";

export type User = {
  id: string;
  name: string | null;
  email: string | null;
  role: UserRole;
};

export type Club = {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Event = {
  id: string;
  name: string;
  description: string;
  date: Date;
  time: string;
  clubId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Profile = {
  id: string;
  regNo: string;
  department: string;
};

export type EventRegistration = {
  id: string;
  eventId: string;
  userId: string;
  status: "REGISTERED" | "ATTENDED" | "CANCELLED";
  createdAt: Date;
};

export type Feedback = {
  id: string;
  eventId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: Date;
};

export type Certificate = {
  id: string;
  eventId: string;
  userId: string;
  issuedAt: Date;
}; 