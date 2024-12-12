export const fetchPhysicians = async (token) => {
    try {
        const res = await fetch('/api/physicians', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await res.json()

        if(!res.ok) {
            if (res.status == 401 && data.message == "Unauthenticated.") {
                throw new Error("Unauthenticated")
            } else {
                throw new Error("An error occured while fetching the physicians. You may refresh to try again.")
            }
        }

        return data
    }
    catch (err) {
      throw err
    }
};