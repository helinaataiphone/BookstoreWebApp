import React, { createContext, useContext, useState } from "react";

// Create a context to hold the user data
const UserAdminContext = createContext();

// Export a custom hook to use the context more easily
export const useUser = () => useContext(UserAdminContext);

// Provider component to wrap around the app
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({ isAdmin: false, username: "JohnDoe" });

  return (
    <UserAdminContext.Provider value={{ user, setUser }}>
      {children}
    </UserAdminContext.Provider>
  );
};
