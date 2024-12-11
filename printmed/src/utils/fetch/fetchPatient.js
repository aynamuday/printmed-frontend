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
                showWarning("Patient not found.")
                return
            } else if (res.status === 403) {
                showWarning("You are not authorized to perform this action.")
                return
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