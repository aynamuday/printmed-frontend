import { showError } from "./showError"
import { showWarning } from "./showWarning"

export const isPatientFaceVerified = async (photo, patientId, token) => {
    try {
        const formData = new FormData()
        formData.append('photo', photo)
        formData.append('patient_id', patientId)

        const res = await fetch('http://127.0.0.1:8000/api/verify-patient-face', {
            method: 'POST',
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        })

        if(!res.ok) {
            const result = await res.json()
            
            if (res.status === 400 && result.message == "Invalid image") {
                return false
            } else if (res.status === 400) {
                showWarning("Patient's photo not available.")
                return
            } else {
                throw new Error("Something went wrong. Please try again later.")
            }
        }

        const result = await res.json()
        return result.success
    } catch (error) {
        showError(error)
    }
}