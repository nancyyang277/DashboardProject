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

            resolve();
        });
    });
};

export { DB, initDB };