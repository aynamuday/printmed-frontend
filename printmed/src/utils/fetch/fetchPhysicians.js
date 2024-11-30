export const fetchPhysicians = async (token) => {
    try {
        const res = await fetch('/api/physicians', {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        });

        if(!res.ok) {
            throw new Error("An error occured while fetching the physicians. Please try again later.")
        }

        return await res.json()
    }
    catch (err) {
      throw err
    }
};