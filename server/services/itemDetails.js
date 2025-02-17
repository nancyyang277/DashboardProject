import {getItemWithUserName, getAllItems, createItem, updateItemStatus} from '../models/item.js';

/**
 * Get item's details from db
 * @param {*} item_id 
 * @returns 
 */
export async function getDetails(item_id) {
    try {
        // Call insertItemActionToDB and await the result
        let result = await getItemWithUserName(item_id);
        return result; // Return the result if needed
    } catch (error) {
        console.error("Error fetching one item action:", error);
        throw error; // Rethrow for further handling
    }
}

/**
 * Get all items
 * @returns 
 */
export async function getItems() {
    try {
        let result = await getAllItems();
        return result;
    } catch (error) {
        console.error("Error fetching All item action:", error);
        throw error; 
    }
}

/**
 * Add an item to item's db
 * @param {*} item_name 
 * @param {*} solution 
 * @param {*} current_location 
 * @param {*} status 
 * @returns 
 */
export async function addItem(item_name, solution, current_location, status) {
    try {
        let res = await createItem(item_name, solution, current_location, status);
        return res;
    } catch (error) {
        console.error("Error adding item action:", error);
        throw error; 
    }
}

/**
 * Update item's status by id value, user and location
 * @param {*} id 
 * @param {*} value 
 * @param {*} user 
 * @param {*} location 
 */
export async function updateItem(id, value, user, location) {
    try {
        // await updateItemStatus(
        //     id, value, user, location
        // );
        let UpdateResponse = await updateItemStatus(id, value, user, location);
        return UpdateResponse;
    } catch (updateError) {
        console.error("Error updating item status:", updateError);
    }
}