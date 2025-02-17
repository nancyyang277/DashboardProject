import { getAllStorages, createStorage } from "../models/storage.js";

/**
 * Get all storages from db
 * @param {*} item_id 
 * @returns return all storages info with id and name
 */
export async function getStorages(item_id) {
    try {
        let result = await getAllStorages();
        return result;
    } catch (error) {
        console.error("Error fetching all storages:", error);
        throw error;
    }
}

/**
 * Add a storage's name to storage db
 * @param {*} name 
 * @returns return the created storage id
 */
export async function addStorage(name) {
    try {
        let res = await createStorage(name);
        return res;
    } catch (error) {
        console.error("Error adding storage action:", error);
        throw error; 
    }
}