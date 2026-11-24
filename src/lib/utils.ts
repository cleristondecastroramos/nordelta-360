import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateTenure(dateString: string | null | undefined): string {
  if (!dateString) return "-";

  // Normalize string for Date parsing if it comes in dd/mm/yyyy format (not standard ISO)
  // Assuming the DB returns YYYY-MM-DD or standard ISO strings, but just in case:
  let safeDateString = dateString;
  if (dateString.includes("/") && dateString.split("/")[0].length === 2) {
    const parts = dateString.split("/");
    safeDateString = `${parts[2]}-${parts[1]}-${parts[0]}`;
  }

  const start = new Date(safeDateString);
  const now = new Date();

  if (isNaN(start.getTime())) return "-";

  let years = now.getFullYear() - start.getFullYear();
  let months = now.getMonth() - start.getMonth();
  let days = now.getDate() - start.getDate();

  if (days < 0) {
    months--;
    const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    days += prevMonth.getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  const parts = [];
  if (years > 0) parts.push(`${years} ${years === 1 ? "ano" : "anos"}`);
  if (months > 0) parts.push(`${months} ${months === 1 ? "mês" : "meses"}`);
  if (days > 0) parts.push(`${days} ${days === 1 ? "dia" : "dias"}`);

  return parts.length > 0 ? parts.join(", ") : "Menos de 1 dia";
}
