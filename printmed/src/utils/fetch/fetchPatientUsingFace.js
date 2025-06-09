export const fetchPatientUsingFace = async (photo, token) => {
    const formData = new FormData();
    formData.append('photo', photo);

    try {
        const res = await fetch('http://127.0.0.1:8000/api/patient-using-face', {
            method: 'POST',
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        })

        if(!res.ok) {
            if (res.status === 404) {
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