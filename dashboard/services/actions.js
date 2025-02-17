import { request } from "./api";

const ActionService = {
    addOne: async function (item_id, action, solution, location, user_id) {
      return request("/actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          item_id: item_id,
          action: action,
          solution: solution,
          dest_location: location, 
          modified_by: user_id, 
        }),
      });
    },
  
    getTopActions: async function (id) {
      return request(`/actions/${id}`, { method: "GET" })
        .then((res) => res)
        .catch((error) => {
          console.error(`Error fetching actions for item ID ${id}:`, error);
          throw error;
        });
    },
}
export default ActionService;