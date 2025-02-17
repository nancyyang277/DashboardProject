"use client"; 

import { createContext, useState, useEffect, useContext } from "react";
import StorageService from "@/services/storages";
const StorageContext = createContext();

export const StorageProvider = ({ children }) => {
  const [storageData, setStorageData] = useState(null);
  const [loadingStorage, setLoadingStorage] = useState(true);

  // fetch storage-related data from an API when the component mounts
  useEffect(() => {
    const fetchStorageData = async () => {
      try {
        const res = await StorageService.getAll(); 
        setStorageData(res); 
      } catch (error) {
        console.error("Error fetching storage data:", error);
      } finally {
        setLoadingStorage(false);
      }
    };
    fetchStorageData();
  }, []);

  return (
    <StorageContext.Provider value={{ storageData, setStorageData, loadingStorage }}>
      {children}
    </StorageContext.Provider>
  );
};
export const useStorage = () => useContext(StorageContext);

