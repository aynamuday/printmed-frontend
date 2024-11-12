import React, { createContext, useEffect, useState } from 'react';

const AppContext = createContext();

export const AppProvider = ({children}) => {
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null)
  const [departments, setDepartments] = useState(null)

  async function getUser() {
    const res = await fetch("/api/user", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }); 
    const data = await res.json();

    if (res.ok) {
      setUser(data);
    } else {
      localStorage.removeItem('token')
      setToken(null)
      setUser(null)
    }

    setLoading(false)
  }

  const getDepartments = async () => {
    const res = await fetch ("/api/departments", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    const data = await res.json()

    setDepartments(data)
  }

  useEffect(()=> {
    if (token) {
        getUser()
        getDepartments()
    } else {
      setLoading(false)
    } 
  }, [token]);

  return (
    <AppContext.Provider value={{ loading, token, setToken, user, setUser, departments, setDepartments }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
