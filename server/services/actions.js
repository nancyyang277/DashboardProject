import {insertItemActionToDB, getTopActions, getTopLocations} from '../models/actions.js';
import { updateItemStatus } from '../models/item.js';

const solutionMapping = {
    'Asset': 'asset_history',
    'Inventory': 'inventory_history',
    'WO': 'workorder_history' 
};

/**
 * Insert an item's action into corresponding solution history db and return the item's
 * @param {*} action 
 * @returns { location: String, modified_by: INTEGER, status: String }
 */
export async function insertItemAction(action) {
    try {
        const solutionTable = solutionMapping[action.solution];
        action['solutionTable'] = solutionTable;

        await insertItemActionToDB(action);

        let UpdateResponse = await updateItemStatus(action.item_id, action.action, action.modified_by, action.dest_location);
        console.log(UpdateResponse, 'aahd');
        return UpdateResponse; 
    } catch (error) {
        console.error("Error inserting action in service phase:", error);
        throw error;
    }
}

/**
 * Get most recent 6 location and action histories
 * @param {*} item_id item's id
 * @returns { actions: Array, locations: Array, status: String }
 */
export async function getTopSixActionsAndLocations(item_id) {
    try {
        const [actions, locations] = await Promise.all([
            getTopActions(item_id),
            getTopLocations(item_id)
        ]);
        return {actions: actions, locations: locations};
    } catch (error) {
        console.error("Error fetching item action:", error);
        throw error;
    }
}


