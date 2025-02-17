import { DB } from './sqlite.js';
const solutionMapping = {
    'Asset': 'asset_history',
    'Inventory': 'inventory_history',
    'WO': 'workorder_history' 
};

export const getCurrentTimestamp = () =>  {
    // Format the timestamp correctly
    let now = new Date();
    let month = String(now.getMonth() + 1).padStart(2, '0');
    let day = String(now.getDate()).padStart(2, '0');
    let hours = String(now.getHours()).padStart(2, '0');
    let minutes = String(now.getMinutes()).padStart(2, '0');
    let seconds = String(now.getSeconds()).padStart(2, '0');

    let sqlTimestamp = `${now.getFullYear()}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    return sqlTimestamp;
}

export const getTableLocation = (solution) => {
    return solutionMapping[solution]; 
}

export const getUserName = (userId) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT name FROM users WHERE id = ?";
        
        DB.get(sql, [userId], (err, row) => {
            if (err) return reject(err);
            if (!row) return reject({ status: 404, message: "User not found" });
            resolve(row.name);
        });
    });
};

export function returnEndActionValue(solution) {
    if (solution === "Asset") {
        return "Missing";
    } else if (solution === "Inventory") {
        return "Consumed";
    } else {
        return "Completed";
    }
}

/**
 * get solution name based on item's id
 * @param {*} item_id item's id
 * @returns 
 */
export async function getSolutionById(item_id) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT solution FROM items WHERE id = ?'; 

        DB.get(sql, [item_id], (err, asset) => {
            if (err) return reject(err);
            if (!asset) return resolve(null);

            resolve(asset.solution);
        });
    });
}