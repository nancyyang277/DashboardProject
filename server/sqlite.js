import sqlite3 from 'sqlite3';
import bcrypt from 'bcryptjs';

const sql3 = sqlite3.verbose();
const DB = new sql3.Database('./dashboard.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error('Database connection error:', err.message);
    } else {
        console.log('Connected to SQLite database');
    }
});

const storages = [{"name": "Storage 1", "name": "Storage 2", "name": "Storage 3", "name": "Storage 4"}];
const users = [{
    "name": "Tabitha Ryne",
    "email": "tabithaRyne@gmail.com",
    "password": "securepassword",
    "role": "Xemelgo Administrator"
}, {
    "name": "Claire Stroup",
    "email": "claireStroup@gmail.com",
    "password": "securepassword1",
    "role": "Shop Manager"
}, {
    "name": "Curtis Trak",
    "email": "curtisTrak@gmail.com",
    "password": "securepassword2",
    "role": "Shop Manager"
}, {
    "name": "Jacob Eld",
    "email": "jacobEld@gmail.com",
    "password": "securepassword3",
    "role": "Shop Manager"
}];

// function to create tables
const initDB = async () => {
    return new Promise((resolve, reject) => {
        DB.serialize(() => {
            // just put it there, so could be null
            const createTablesSql = [
                `CREATE TABLE IF NOT EXISTS items (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    solution TEXT NOT NULL,
                    location TEXT NOT NULL,
                    status TEXT,
                    timestamp TIMESTAMP,
                    modified_by INTEGER
            )`,
                `CREATE TABLE IF NOT EXISTS inventory_history (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    item_id INTEGER NOT NULL,
                    dest_location TEXT,
                    timestamp TIMESTAMP,
                    modified_by INTEGER NOT NULL,
                    action TEXT NOT NULL
                )`,
                `CREATE TABLE IF NOT EXISTS asset_history (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    item_id INTEGER NOT NULL,
                    dest_location TEXT,
                    timestamp TIMESTAMP,
                    modified_by INTEGER NOT NULL,
                    action TEXT NOT NULL
                )`,
                `CREATE TABLE IF NOT EXISTS workorder_history (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    item_id INTEGER NOT NULL,
                    dest_location TEXT,
                    timestamp TIMESTAMP,
                    modified_by INTEGER NOT NULL,
                    action TEXT NOT NULL
                )`,
                `CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    email TEXT UNIQUE NOT NULL,
                    password TEXT NOT NULL,
                    role TEXT NOT NULL
                )`,
                `CREATE TABLE IF NOT EXISTS storages (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL
                )`
            ];

            createTablesSql.forEach((query) => {
                DB.run(query, (err) => {
                    if (err) {
                        console.error('Error creating table:', err.message);
                        reject(err);
                    } else {
                        console.log('Table created successfully.');
                    }
                });
            });

            // Insert default storages, can comment this out if re-start server
            storages.forEach(storage => {
                DB.run(
                    `INSERT INTO storages (name) VALUES (?)`,
                    [storage.name],
                    (err) => {
                        if (err) {
                            console.log("Storage already exists or insert failed.");
                        } else {
                            console.log("Storage inserted:", storage.name);
                        }
                    }
                );
            });

            // Insert default users with hashed passwords, can comment this out if re-start server
            users.forEach(async (user) => {
                const hashedPassword = await bcrypt.hash(user.password, 10);
                DB.run(
                    `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`,
                    [user.name, user.email, hashedPassword, user.role],
                    (err) => {
                        if (err) {
                            console.log(`User ${user.email} already exists or insert failed.`);
                        } else {
                            console.log(`User inserted: ${user.name}`);
                        }
                    }
                );
            });

            resolve();
        });
    });
};

export { DB, initDB };