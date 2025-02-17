import { DB } from '../sqlite.js';

/**
 * Get all storages from db
 * @returns all the storage id and their names
 */
export const getAllStorages = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM storages';

        DB.all(sql, [], (err, rows) => {
            if (err) {
                console.error("Database error:", err);
                reject({ error: "Internal Server Error" }); 
                return;
            }

            resolve(rows || []); 
        });
    });
};

/**
 * create a new storage
 * @param {*} name storage's name
 * @returns created storage's id if success
 */
export const createStorage = (name) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO storages (name) VALUES(?)';

        DB.run(sql, [name], function (err) {
            if (err) {
                console.error("Database error:", err);
                reject({ error: "Internal Server Error" }); 
                return;
            }

            resolve({ message: 'Storage created', id: this.lastID });
        });
    });
};
