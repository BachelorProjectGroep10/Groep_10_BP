import { format, parseISO } from "date-fns"

const formatDate = (date: Date) => {
    const parsedDate = parseISO(date.toString())
    return format(parsedDate,"dd MMMM yyyy")
}

export default formatDate