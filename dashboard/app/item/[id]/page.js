import React from "react";
import ItemDetailClient from "../../../components/itemDetail";
import ItemService from "@/services/items";
import ActionService from "@/services/actions";

const Page = async ({params}) => { 
    const {id} = await params;
    async function processAddOne(itemId, action, solution, newStorageName, userId) {
        "use server";
        try {
            // processAddOne does the following to make API requests on the server component so any problem can be catched before rendering the client component
            // 1. add the new action to the item's solution table and return the current most recent 6 locations/actions
            // 2. update the item's current information (location, status, modified_by) and return the updated informtion
            // 3. combine all the information and return one json object
            const result = await ActionService.addOne(itemId, action, solution, newStorageName, userId);
            const updatedDetail = await ItemService.updateOne(itemId, action, userId, newStorageName);
            let updatedItem = {};
            updatedItem.location_history = result.results.locations;
            updatedItem.action_history = result.results.actions;
            updatedItem = {
                ...updatedItem, 
                ...updatedDetail.result,
            };
            return updatedItem;
        } catch (error) {
            console.error("Error processing action:", error);
            return { error: "Failed to process action" };
        }
    }

    // getting item's detail after user clicks see detail of this item (first time)
    let data;
    try {
        data = await ItemService.getOne(id);
      } catch (error) {
        console.error("Error fetching item:", error);
      } 
    console.log(data);
    const itemDetail = data.item_detail;

    return <ItemDetailClient 
            id={id} 
            data={data}
            solution={itemDetail.solution}
            status={itemDetail.status}
            name={itemDetail.name}
            location={itemDetail.location} 
            action_history={data.action_history}
            location_history={data.location_history}
            processAddOne={processAddOne}/>;
};

export default Page;