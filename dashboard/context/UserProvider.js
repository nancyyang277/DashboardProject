"use client";

import { createContext, useState, useEffect, useContext } from "react";
import UserService from "../services/users";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await UserService.getAll();
        if (Array.isArray(data.users)) {
          setUserData(data.users);

          // check if a user was previously selected
          const storedUser = localStorage.getItem("selectedUser");
          if (storedUser) {
            setSelectedUser(JSON.parse(storedUser));
          } else {
            setSelectedUser(data.users[0]); 
          }
        } else {
          console.error("API did not return an array for users:", data);
          setUserData([]);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoadingUser(false);
      }
    };

    fetchData();
  }, []);

  // function to update selected user and persist in localStorage
  const updateSelectedUser = (user) => {
    setSelectedUser(user);
    localStorage.setItem("selectedUser", JSON.stringify(user)); 
  };

  return (
    <UserContext.Provider value={{ userData, selectedUser, updateSelectedUser, loadingUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

