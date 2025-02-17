import express from 'express';
import { getStorages, addStorage } from '../services/storage.js';
const router = express.Router();

router.get('/storages', async (req, res) => {
    try {
        const response = await getStorages();
        res.status(200).json(response);
    } catch (e) {
        console.error("Error fetching storages in router phase", e);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


router.post('/storages', async (req, res) => {
    const { name } = req.body;
    try {
        const response = await addStorage(name);
        res.status(200).json(response); 
    } catch (e) {
        console.error("Error adding storages in router phase", e);
        res.status(500).json({ error: "Internal Server Error" });
    }
});



export default router;
