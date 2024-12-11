export const fetchDepartments = async (token) => {
  try {
    const res = await fetch ("/api/departments", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    const data = await res.json()

    if(!res.ok) {
      if (res.status == 401 && data.message == "Unauthenticated.") {
        throw new Error("Unauthenticated")
      } else {
        throw new Error("Something went wrong. Please try again later.")
      }
    }

    return data
  } catch (error) {
    throw error
  }
}