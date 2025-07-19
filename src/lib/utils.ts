import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export function formatTime(time: string) {
  return new Date(`1970-01-01T${time}`).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function generateCertificateNumber() {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
  return `CERT-${timestamp}-${random}`;
}

export function generateClubId() {
  // Generate a 6-character alphanumeric code
  // Format: 2 letters followed by 4 numbers (e.g., AB1234)
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  
  let id = '';
  
  // Add 2 random letters
  for (let i = 0; i < 2; i++) {
    id += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  
  // Add 4 random numbers
  for (let i = 0; i < 4; i++) {
    id += numbers.charAt(Math.floor(Math.random() * numbers.length));
  }
  
  return id;
} 