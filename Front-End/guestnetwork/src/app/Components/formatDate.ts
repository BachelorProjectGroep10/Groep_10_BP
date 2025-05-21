import { format, parseISO } from "date-fns"

const formatDate = (date?: Date | string | null): string => {
  if (!date) return "N/A" // or your preferred fallback
  try {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date
    return format(parsedDate, "dd MMMM yyyy")
  } catch (e) {
    return "Invalid Date"
  }
}

export default formatDate
