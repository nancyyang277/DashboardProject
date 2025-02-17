import { request } from "./api"; 

const ItemService = {
  getAll: async function () {
    return request("/items", { method: "GET" })
      .then((res) => res)
      .catch((error) => {
        console.error("Error fetching items:", error);
        throw error;
      });
  },

  // update item's status using itemId, action, userId, newStorageName
  updateOne: async function (id, value, selectedUserId, location_name) {
    if (!id || !value || !selectedUserId || !location_name) {
        console.error("Missing parameters in updateOne");
        return { error: "Invalid input parameters" };
    }

    return request("/update-item-status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        value,
        user: selectedUserId,
        location: location_name
      }),
    });
},


  getOne: async function (id) {
    return request(`/items/item-detail/${id}`, { method: "GET" })
      .then((res) => res)
      .catch((error) => {
        console.error(`Error fetching item with ID ${id}:`, error);
        throw error;
      });
  },


  addOne: async function (name, solution, current_location) { 
    return request("/items", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, solution, current_location }),
  })
    .then((res) => res)
    .catch((error) => {
      console.error("Error adding item:", error);
      throw error;
    });
},
};

export default ItemService;
