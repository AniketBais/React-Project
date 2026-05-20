import { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentBalance, setCurrentBalance] = useState(0)

  // Load user from localStorage when app starts
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser) {
      setUser(savedUser);
    }
    setLoading(false);
  }, []);

  // Logout function (global)
  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };
  
  return (
    <UserContext.Provider value={{ user, setUser, logout, loading, currentBalance, setCurrentBalance }}>
      {children}
    </UserContext.Provider>
  );
};