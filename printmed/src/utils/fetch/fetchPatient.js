export const fetchPatient = async (patientId, token) => {
    try {
        const res = await fetch(`/api/patients/${patientId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        if(!res.ok) {
            if (res.status === 500) {
                throw new Error("Something went wrong. Please try again later.")
            } else if (res.status === 404) {
                throw new Error("Patient not found.")
            } else if (res.status === 403) {
                throw new Error("You are not authorized to perform this action.")
            } else {
                throw new Error("Something went wrong. Please try again later.")
            }
        }

        return await res.json()
    }
    catch (err) {
      throw err
    }
}