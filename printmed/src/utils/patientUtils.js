export const getFollowUpDateStatus = (dateStamp) => {
    const followUpDate = new Date(dateStamp)
    const today = new Date()

    if (followUpDate == today) {
        return "Today"
    } else if (followUpDate < today) {
        return "Missed"
    }

    return ""
};