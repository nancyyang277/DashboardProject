import { DB } from '../sqlite.js';
import {getCurrentTimestamp, getTableLocation, returnEndActionValue, getSolutionById} from '../utils.js';

/**
 * Insert an action performed on a item to solution's corresponding action database
 * @param {*} action a json object contains item's id, destination storage location, current timestamp, user who perfomed the action, and action name
 */
export async function insertItemActionToDB(action) {
    return new Promise((resolve, reject) => {
        try {
            let sqlTimestamp = getCurrentTimestamp();
            let query = `INSERT INTO ${action.solutionTable} (item_id, dest_location, timestamp, modified_by, action) VALUES (?, ?, ?, ?,?)`;

            DB.run(query, [action.item_id, action.dest_location, sqlTimestamp, action.modified_by, action.action], async function (err) {
                resolve();

            });

        } catch (error) {
            reject(error);
        }
    });
}

/**
 * Get last 6 actions from actions db
 * @param {*} item_id item's id
 * @returns 
 */
export async function getTopActions(item_id) {
    const solution = await getSolutionById(item_id);

    const table = getTableLocation(solution);
    const query = `
        SELECT actions.modified_by, users.name AS username, actions.timestamp, actions.action
        FROM ${table} AS actions
        LEFT JOIN users ON actions.modified_by = users.id
        WHERE actions.item_id = ?
        ORDER BY actions.timestamp DESC
        LIMIT 6;
    `;

    return new Promise((resolve, reject) => {
        DB.all(query, [item_id], (err, actions) => {
            if (err) {
                console.error("Error fetching actions:", err);
                return reject(err);
            }
            resolve(actions); // Return only top 6 actions
        });
    });
}

// Fetch top 6 locations where action != inputAction
/**
 * Get last 6 action's locations their timestamp where the action is not in a end action status (missing, complete, consumed)
 * @param {*} item_id item's id
 * @returns 
 */
export async function getTopLocations(item_id) {
    
    // get the item's solution name and find its corresponding end action's name
    const solution = await getSolutionById(item_id);
    const inputAction = returnEndActionValue(solution);

    const table = getTableLocation(solution);
    const query = `
        SELECT actions.dest_location AS location, actions.timestamp
        FROM ${table} AS actions
        WHERE actions.item_id = ? AND actions.action != ?
        ORDER BY actions.timestamp DESC
        LIMIT 6;
    `;

    return new Promise((resolve, reject) => {
        DB.all(query, [item_id, inputAction], (err, locations) => {
            if (err) {
                console.error("Error fetching locations:", err);
                return reject(err);
            }
            resolve(locations); 
        });
    });
}
