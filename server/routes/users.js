import express from 'express';
import { addUser, getUsers, findUser } from '../services/user.js';
const router = express.Router();

// get all users from db
router.get('/users', async (req, res) => {
    try {
        const response = await getUsers(); 
        res.status(200).json(response); 
    } catch (e) {
        console.error("Error fetching users in router phase", e);
        res.status(500).json({ error: "Internal Server Error" }); 
    }
});


// Create a new user
router.post('/users', async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        const response = await addUser(name, email, password, role); 
        res.status(200).json(response);
    } catch (e) {
        console.error("Error adding users in router phase", e);
        res.status(500).json({ error: "Internal Server Error" }); 
    }
});

// check whether a user has already registered
router.get('/validate-user/:email', async (req, res) => {
    const email = req.params.email; 
    
    if (!email) {
        return res.status(400).json({ error: "Email is required" }); 
    }

    try {
        const response = await findUser(email); 
        res.status(200).json(response);
    } catch (e) {
        console.error("Error finding users in router phase", e);
        return res.status(500).json({ error: "Internal Server Error" }); 
    }
});


export default router;

