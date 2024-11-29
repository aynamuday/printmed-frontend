export const fetchPatientUsingQr = async (qrCode, token) => {
    try {
        const res = await fetch(`/api/patient-using-qr/`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                'qr_code': qrCode
            })
        })

        if(!res.ok) {
            if (res.status === 500) {
                throw new Error("Something went wrong. Please try again later.")
            } else if (res.status === 404) {
                throw new Error("The QR code is either deactivated, expired, or does not exists.")
            } else if (res.status === 403) {
                throw new Error("You are not authorized to access this patient. Make sure you are an assigned physician.")
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