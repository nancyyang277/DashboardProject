import { DB } from "../sqlite.js";
import { getUserName, getCurrentTimestamp } from "../utils.js";


/**
 * Get item's details including the user's name who perform the most recent action
 * @param {*} itemId item's id
 * @returns 
 */
export const getItemWithUserName = (itemId) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM items WHERE id = ?";
        
        DB.get(sql, [itemId], (err, row) => {
            if (err) return reject(err);
            if (!row) return reject({ status: 404, message: "Item not found" });

            if (row.modified_by && Number.isInteger(row.modified_by)) {
                // convert user's id to user's name and add extra row called username to store name
                getUserName(row.modified_by)
                    .then((userName) => {
                        row.username = userName;
                        resolve(row);
                    })
                    .catch(reject);
            } else {
                resolve(row);
            }
        });
    });
};


/**
 * Get all items from db
 * @returns each item's id, name, solution, and current location
 */
export const getAllItems = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM items';

        DB.all(sql, [], (err, items) => {
            if (err) {
                console.error("Database error:", err);
                reject({ error: "Internal Server Error" });
                return;
            }

            // ensure items are formatted correctly
            const data = { items: items.map(item => ({
                id: item.id,
                name: item.name,
                solution: item.solution,
                location: item.location
            }))};

            resolve(data); 
        });
    });
};

/**
 * create a new item and insert to db
 * @param {*} item_name item's name
 * @param {*} solution item's solution
 * @param {*} current_location item's current location
 * @param {*} status item's initial state
 * @returns inserted item's id if success
 */
export const createItem = (item_name, solution, current_location, status) => {
    return new Promise((resolve, reject) => {
        if (!item_name || !solution || !current_location) {
            reject({ error: "All fields (name, solution, current_location) are required" });
            return;
        }

        const sql = `INSERT INTO items (name, solution, location) VALUES (?, ?, ?)`;

        DB.run(sql, [item_name, solution, current_location, status], function (err) {
            if (err) {
                console.error("Database Insert Error:", err);
                reject({ error: "Internal Server Error" }); 
                return;
            }

            resolve({ message: "Item added successfully", item_id: this.lastID }); 
        });
    });
};

/**
 * update the item's status
 * @param {*} id item's id
 * @param {*} value item's current status
 * @param {*} user the user who perform the most recent action to the item
 * @param {*} location item's destination location
 * @returns item's location, last modified user, and status if success
 */
export const updateItemStatus = (id, value, user, location) => {
    return new Promise((resolve, reject) => {
        // validate input fields
        if (!id || !value || !user) {
            reject({ error: "Missing required fields: id, value, or user" });
            return;
        }
        const sql = `
            UPDATE items 
            SET status = ?, timestamp = ?, modified_by = ?, location = ?
            WHERE id = ?`;

        DB.run(sql, [value, getCurrentTimestamp(), user, location, id], function (err) {
            if (err) {
                console.error("Error updating item:", err.message);
                reject({ error: "Failed to update item" });
                return;
            }
            resolve({ location: location, modified_by: parseInt(id, 10), status: value });
        });
    });
};
