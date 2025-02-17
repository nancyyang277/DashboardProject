"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./itemsTable.module.css";
import ItemService from "@/services/items";

const ItemsTable = ({data}) => {
    const [items, setItems] = useState([]);
    const [selectedSolution, setSelectedSolution] = useState(null);
    const [loading, setLoading] = useState(true);
    const [itemName, setItemName] = useState("");
    const [itemSolution, setItemSolution] = useState("");
    const [itemLocation, setItemLocation] = useState("");
    const [error, setError] = useState("");

    const solutions = ["Asset", "WO", "Inventory"];
    const locations = ['Storage 1', 'Storage 2', 'Storage 3', 'Storage 4'];

    // rendering data
    useEffect(() => {
        if (data) {
            setItems(data.items);
        } 
        setLoading(false);
    }, [data]);

    if (loading) return <h1>Loading...</h1>;
    if (!items.length) return <h1>No Items Found</h1>;

    // store the current clicked row to help highlight the rows with the same solution
    const handleRowClick = (solution) => {
        setSelectedSolution((prev) => (prev !== solution ? solution : null));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log("here");
    
        if (!itemName || !itemSolution || !itemLocation) {
          setError("All fields are necessary.");
          return;
        }
    
        try {
            const newItem = await ItemService.addOne(itemName, itemSolution, itemLocation);
            // returned newItem format
            // {
            //     "success": "Insertion Success",
            //     "item": {
            //         "itemID": 13,
            //         "name": "Item 13",
            //         "solution": "WO",
            //         "location": "Storage 2"
            //     }
            // }
            setItems([...items, newItem.item]);
            
            // reset table entry and local stateswhen successfully addOne
            const form = e.target;
            form.reset();
            setItemName("");
            setItemSolution("");
            setItemLocation("");
        } catch (error) {
          console.log("Error during registration: ", error);
        }
      };

    return (
        <div className={styles.wrapper}>
            <h1 className={styles.title}>Item Table</h1>
            <table className={styles.keywords} cellPadding={0} cellSpacing={0}>
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Solution</th>
                        <th>Location</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item) => (
                        <tr
                            key={item.id}
                            onClick={() => handleRowClick(item.solution)}
                            className={selectedSolution === item.solution ? styles.highlighted : ""}
                        >
                            <td>{item.name}</td>
                            <td className={styles.solution}>{item.solution}</td>
                            <td>{item.location}</td>
                            <td>
                                <Link href={`/item/${item.id}`} className={styles.seeDetails} onClick={(e) => e.stopPropagation()}>
                                    See Details
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/**
             * Form for adding a new item to the item table
             */}
            <form onSubmit={handleSubmit} className={styles.container}>
                    <h3>Add a New Item</h3>
                    {error && <p style={{ color: "red" }}>{error}</p>}
                    <label>
                        <span>Name:<br/></span>
                        <input type="text" value={itemName} onChange={(e) => setItemName(e.target.value)} required />
                    </label>

                    <label>
                        Solution:<br/>
                        <select value={itemSolution} onChange={(e) => setItemSolution(e.target.value)} required>
                            <option value="">Select a Solution</option>
                            {solutions.map((solution, index) => (
                                <option key={index} value={solution}>
                                    {solution}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label>
                        <br/>Location:<br/>
                        <select value={itemLocation} onChange={(e) => setItemLocation(e.target.value)} required>
                            <option value="">Select a Location</option>
                            {locations.map((location, index) => (
                                <option key={index} value={location}>
                                    {location}
                                </option>
                            ))}
                        </select>
                    </label>
                    <br/><button type="submit">Submit</button>
                </form>
        </div>
    );
};

export default ItemsTable;
