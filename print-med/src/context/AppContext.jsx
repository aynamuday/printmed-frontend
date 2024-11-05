import React, { createContext, useEffect, useState } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null)

  // for Admin
  const [fetchedForDashboard, setFetchedForDashboard] = useState(false)
  const [usersCount, setUsersCount] = useState([])
  const [audits, setAudits] = useState([])

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

  useEffect(()=> {
    if (token) {
        getUser();
    } else {
      setLoading(false)
    } 
  }, [token]);

  return (
    <AppContext.Provider value={{ token, setToken, 
                                  user, setUser, 
                                  loading, 
                                  fetchedForDashboard, setFetchedForDashboard,
                                  usersCount, setUsersCount, 
                                  audits, setAudits 
    }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
