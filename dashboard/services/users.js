import { request } from "./api";

const UserService = {
  getAll: async function () {
    return request("/users", { method: "GET" })
      .then((res) => {
        return res; 
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        throw error;
      });
  },

  addOne: async function (name, email, password, role) {
    return request("/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role }),
    })
      .then((res) => res)
      .catch((error) => {
        console.error("Error adding user:", error);
        throw error;
      });
  },

  checkOneExist: async function (email) {
    return request(`/validate-user/${email}`, {
      method: "GET"
    })
      .then((res) => res)
      .catch((error) => {
        console.error("Error checking user existence:", error);
        throw error;
      });
  },
};

export default UserService;
