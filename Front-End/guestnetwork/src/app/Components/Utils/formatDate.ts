import { format, parseISO } from "date-fns"

export const formatDate = (date?: Date | string | null): string => {
  if (!date) return "N/A" // or your preferred fallback
  try {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date
    return format(parsedDate, "dd MMMM yyyy")
  } catch (e) {
    return "Invalid Date"
  }
}

export const formatDateInput = (date?: Date | string | null): string => {
  if (!date) return "";
  try {
    const parsedDate = typeof date === "string" ? parseISO(date) : date;
    return format(parsedDate, "yyyy-MM-dd"); // <- Correct for input[type="date"]
  } catch (e) {
    return "";
  }
};

