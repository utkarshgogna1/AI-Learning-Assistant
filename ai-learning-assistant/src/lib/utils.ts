import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class names or class name functions into a single string.
 * Useful for conditionally applying classes and merging Tailwind classes.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format date in a readable format
export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

// Calculate score percentage
export function calculateScorePercentage(score: number, total: number): number {
  if (!total) return 0;
  const percentage = (score / total) * 100;
  return Math.round(percentage);
}

// Generate a random ID
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

// Debounce function
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return function(...args: Parameters<T>): void {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Truncate a string
export function truncate(str: string, num: number): string {
  if (str.length <= num) {
    return str;
  }
  return str.slice(0, num) + "...";
}

// Sort array by date
export function sortByDate<T extends { created_at: string | Date }>(
  arr: T[],
  direction: "asc" | "desc" = "desc"
): T[] {
  return [...arr].sort((a, b) => {
    const dateA = new Date(a.created_at).getTime();
    const dateB = new Date(b.created_at).getTime();
    return direction === "asc" ? dateA - dateB : dateB - dateA;
  });
}

// Group array by property
export function groupBy<T>(
  arr: T[],
  property: keyof T
): Record<string, T[]> {
  return arr.reduce((acc, item) => {
    const key = String(item[property]);
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);
    return acc;
  }, {} as Record<string, T[]>);
}