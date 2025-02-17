import { getAllUsers, createUser, getUserByEmail } from "../models/user.js";

/**
 * Get all users
 * @param {*} item_id 
 * @returns 
 */
export async function getUsers(item_id) {
    try {
        let result = await getAllUsers();
        return result;
    } catch (error) {
        console.error("Error fetching all users:", error);
        throw error; 
    }
}


/**
 * Add a user
 * @param {*} name 
 * @param {*} email 
 * @param {*} password 
 * @param {*} role 
 * @returns 
 */
export async function addUser(name, email, password, role) {
    try {
        let res = await createUser(name, email, password, role);
        return res;
    } catch (error) {
        console.error("Error adding user action:", error);
        throw error; 
    }
}

/**
 * find a user by email
 * @param {*} email 
 * @returns 
 */
export async function findUser(email) {
    try {
        let res = await getUserByEmail(email);
        return res;
    } catch (error) {
        console.error("Error finding user action:", error);
        throw error; 
    }
}