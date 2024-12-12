import { showWarning } from "./showWarning"

export const fetchPatient = async (patientId, token) => {
    try {
        const res = await fetch(`/api/patients/${patientId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        const data = await res.json()

        if(!res.ok) {
            if (res.status == 401 && data.message == "Unauthenticated.") {
                throw new Error("Unauthenticated")
            } else if (res.status === 404) {
                throw new Error("Not found")
            } else if (res.status === 403) {
                throw new Error("Unauthorized")
            } else {
                throw new Error("Something went wrong. Please try again later.")
            }
        }

        return data
    }
    catch (err) {
      throw err
    }
}