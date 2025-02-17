import { request } from "./api";

const StorageService = {
  getAll: async function () {
    return request("/storages", { method: "GET" })
      .then((res) => {
        return res; 
      })
      .catch((error) => {
        console.error("Error fetching storages:", error);
        throw error;
      });
  },
};

export default StorageService;
