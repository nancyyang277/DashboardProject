import express from 'express';
const router = express.Router();
import {getDetails, updateItem, addItem, getItems} from '../services/itemDetails.js';
import { getTopSixActionsAndLocations } from '../services/actions.js';


const solutionMapping = {
    'asset': 'asset_history',
    'inventory': 'inventory_history',
    'work order': 'workorder_history' 
};

/**
 * Get all items info from db
 */
router.get('/items', async (req, res) => {
    res.set('content-type', 'application/json');
    try {
        const response = await getItems(); 
        res.status(200).json(response); 
    } catch (e) {
        console.error("Error fetching items in router phase", e);
        res.status(500).json({ error: "Internal Server Error" }); 
    }
});

/**
 * Get item's detail according to id
 */
router.get('/items/item-detail/:itemId', async (req, res) => {
    res.set('content-type', 'application/json');
    try {
        const itemId = req.params.itemId;
        if (!itemId) {
            return res.status(400).json({ error: 'Item ID is required' });
        }

        // return in this example format
        /* {
            id: 1,
            name: 'Item 1',
            solution: 'Asset',
            location: 'Storage 1',
            status: 'Moved',
            timestamp: '2025-02-16 05:06:20',
            modified_by: 4,
            username: 'Curtis Trak'
          }*/
        const item = await getDetails(itemId);
        console.log(item, "aa");

        // returns in this format 
        // {actions:[{modified_by: userId, username: user's name, timestamp: performed action's time, action: performed action}, ...],
        //   locations: [{ location: item's location, timestamp: performed action's time }, ...]
        const result = await getTopSixActionsAndLocations(itemId);
        
        res.status(201).json({ message: "Fetch Successful" , item_detail: item, action_history: result.actions, location_history: result.locations});

    } catch (error) {
        if (error.status) {
            return res.status(error.status).json({ error: error.message });
        }
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
});

/**
 * add an item to items db
 */
router.post('/items', async (req, res) => {
    res.set('content-type', 'application/json');
    const { name, solution, current_location } = req.body;

    if (!name || !solution || !current_location) {
        return res.status(400).json({ error: "All fields (name, solution, current_location) are required" });
    }

    try {
        const item = await addItem(name, solution, current_location);
        return res.status(201).json({ success: "Insertion Success", item: {id: item.item_id, name: name, solution: solution, location: current_location} });
    } catch (error) {
        console.error("Error adding item status in router phase", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});


/**
 * Update an item's status
 */
router.post("/update-item-status", async (req, res) => {
    res.set('content-type', 'application/json');
    const { id, value, user, location } = req.body;
    if (!id || !value || !user || !location) {
        return res.status(400).json({ error: "Missing required fields: id, value, or user" });
    }

    try {
        // returns in this format { location: item's location, modified_by: user id, status: item's status }
        const result = await updateItem(id, value, user, location);
        return res.status(201).json({ result });
    } catch (e) {
        console.error("Error updating item status in router phase", e);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});


export default router;
