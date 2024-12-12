export const fetchPatientUsingId = async (patientId, token) => {
    try {
        const res = await fetch(`/api/patient-using-id/`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                'patient_number': "P"+patientId
            })
        })

        if(!res.ok) {
            if (res.status === 422) {
                throw new Error("Invalid")
            } else if (res.status === 404) {
                throw new Error("Not found")
            } else if (res.status === 403) {
                throw new Error("Unauthorized")
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