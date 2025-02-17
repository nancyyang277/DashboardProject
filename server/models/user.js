import { DB } from '../sqlite.js';

/**
 * Get all users from db
 * @returns all user's info
 */
export const getAllUsers = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM users';

        DB.all(sql, [], (err, rows) => {
            if (err) {
                console.error("Database error:", err);
                reject({ error: "Internal Server Error" });
                return;
            }
            
            if (!rows || rows.length === 0) {
                reject({ message: "No users found" });
                return;
            }

            resolve({ users: rows });
        });
    });
};


/**
 * create a new user 
 * @param {*} name 
 * @param {*} email 
 * @param {*} password 
 * @param {*} role 
 * @returns user's id
 */
export const createUser = (name, email, password, role) => {
    return new Promise((resolve, reject) => {
        if (!name || !email || !password || !role) {
            reject({ error: "All fields (name, email, password, role) are required" });
            return;
        }

        const sql = 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)';

        DB.run(sql, [name, email, password, role], function (err) {
            if (err) {
                console.error("Database Insert Error:", err);
                reject({ error: "Internal Server Error" });
                return;
            }

            resolve({ message: "User created successfully", user_id: this.lastID });
        });
    });
};


/**
 * Get user's info (name, email, id, password, role) by user's email
 * @param {*} email 
 * @returns user's info
 */
export const getUserByEmail = (email) => {
    return new Promise((resolve, reject) => {
        if (!email) {
            reject({ error: "Email is required" });
            return;
        }

        const sql = "SELECT * FROM users WHERE email = ? LIMIT 1";

        DB.get(sql, [email], (err, row) => {
            if (err) {
                console.error("Database Query Error:", err);
                reject({ error: "Internal Server Error" });
                return;
            }

            if (row) {
                resolve({ exists: true, user: row }); 
            } else {
                resolve({ exists: false, user: null });
            }
        });
    });
};

