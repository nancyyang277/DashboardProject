import express from 'express';
const router = express.Router();
import {insertItemAction, getTopSixActionsAndLocations} from '../services/actions.js';

/**
 * perform an action to an item 
 */
router.post('/actions', async (req, res) => {
    try {
        const action = req.body; // Get request body

        // Validate input (Ensure required fields are provided)
        if (!action.solution || !action.modified_by || !action.action || !action.dest_location || !action.item_id) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        // returns in this format { location: item's location, modified_by: user id, status: item's status }
        insertItemAction(action);

        // returns in this format actions:[{modified_by: userId, username: user's name, timestamp: performed action's time, action: performed action}]
        const topSixResults = await getTopSixActionsAndLocations(action.item_id);

        res.status(201).json({ message: "Insert Successful", results: topSixResults, });
    } catch (error) {
        console.error("Insert Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


export default router;