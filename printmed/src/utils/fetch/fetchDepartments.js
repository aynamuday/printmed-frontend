export const fetchDepartments = async (token) => {
    const res = await fetch ("/api/departments", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    const data = await res.json()
    return data
}