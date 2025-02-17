"use client"; 

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { formatTimestamp, returnActionValue, returnEndStatusValue, convertActionToStatus, returnEndActionValue } from "@/utils";
import styles from './itemDetail.module.css';
import { useStorage } from "@/context/StorageProvider";

const ItemDetailClient = ({ id, name, solution, action_history, location_history, location, status, processAddOne }) => {
    // fetch storage data from StorageProvider
    const { storageData } = useStorage();

    // local state of an item
    const [actionHistory, setActionHistory] = useState([]);
    const [locationHistory, setLocationHistory] = useState([]);
    const [action, setAction] = useState("");
    const [currentLocation, setCurrentLocation] = useState("");
    const [currentStatus, setCurrentStatus] = useState("");

    // store the highlighted users/locations in the table
    const [selectedUserId, setSelectedUserId] = useState(null); 
    const [selectedLocationId, setSelectedLocationId] = useState(null); 

    const [loading, setLoading] = useState(true);
    const dropdownRef = useRef(null);
    const [storageMenuOn, setStorageMenuOn] = useState(false);

    // set items detail when first rendering
    useEffect(() => {
        if (!id) return;
        setAction(returnActionValue(solution));
        setActionHistory(action_history); 
        setLocationHistory(location_history);
        setCurrentLocation(location);
        setCurrentStatus(status);
        setLoading(false);
    }, []);

    // if the storage dropdown is on, click on white space or other places other than the dropdown menu will close the dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target) && storageMenuOn) {
                toggleSelection();
                setStorageMenuOn(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [storageMenuOn]);


    // when user clicks on an end action (missing, completed, consumed)
    const handleComplete = (e) => {
        e.preventDefault();
        if (currentStatus === returnEndStatusValue(solution)) {
            alert(
                `This item is already in ${currentStatus} status. Check if the current operation is valid.`
            );
            return;
        }
        updateItem(returnEndStatusValue(solution), currentLocation);
    }

    // when user click on an action with location change
    const handleChange = (newStorageId) => {
        toggleSelection();
        const currentAction = returnActionValue(solution);
        
        const selectedOption = storageData.find(option => option.id === newStorageId);
        if (selectedOption) {
            updateItem(convertActionToStatus(currentAction),  selectedOption.name);
        }
    };

    // helper function for calling processAddOne (API request processed in server component) for either regular action/end action 
    const updateItem = async (status, newStorageName) => {
        const userId = JSON.parse(localStorage.getItem("selectedUser")).id;

        try {
            const updatedItem = await processAddOne(id, status, solution, newStorageName, userId);
            setCurrentStatus(updatedItem.status);
            setCurrentLocation(updatedItem.location);
            setActionHistory(updatedItem.action_history); 
            setLocationHistory(updatedItem.location_history);
        } catch (error) {
            console.error("Error submitting action:", error);
        }
    };

    // when user clicks on any row of action table, we highlight the rows with the same user
    function handleRowClickUser (userId) {
        if (selectedUserId !== userId) {
            setSelectedUserId(userId); 
        } else {
            setSelectedUserId(null);
        }
    };

    // when user clicks on any row of location table, we highlight the rows with the same location
    function handleRowClickStorage (locationId) {
        if (selectedLocationId !== locationId) {
            setSelectedLocationId(locationId); 
        } else {
            setSelectedLocationId(null); 
        }
    }

    // when user clicks on the action, the dropdown menu will be displayed     
    function toggleSelection() {
        const dropdown = document.getElementById("myDropdown");

        if (dropdown.style.display === "none" || dropdown.style.display === "") {
            setStorageMenuOn(true);
            dropdown.style.display = "block"; 
        } else {
            setStorageMenuOn(false);
            dropdown.style.display = "none"; 
        }
    }
    
    // wait for data rendering and will show loading 
    if (loading) return <h1>Loading...</h1>;

    return (
    <div className={styles.wrapper}>
        <Link href="/board">
            <button type="button">⬅ Back to List</button>
        </Link>

        <div className={styles.container}>
        <div className={styles.itemDetail}>
            <p>Item Name</p>
            
            <p><strong>{name}</strong> </p>
            <button onClick={handleComplete} className={styles.endActionButton}>
                {returnEndActionValue(solution)} 
            </button>
            <p className={styles.subTitle}>Solution:</p>
            <p className={styles.detail}>{solution}</p>
            <p className={styles.subTitle}>Current Location:</p>
            <p className={styles.detail}>{currentLocation}</p>
            <div className={styles.dropdown}>
                <div className={styles.actionButton} ref={dropdownRef}>
                    <button onClick={toggleSelection}  className={styles.text} >
                        <span>
                            {returnActionValue(solution)}
                        </span>
                        <span className={styles.arrow}>▼</span>
                    </button>
                    <div id="myDropdown" className={styles.dropdownContent} >
                            {storageData && storageData.length > 0 && (
                                storageData.map((storage) => (
                                    <option key={storage.id} onClick={() => handleChange(storage.id)}>
                                        {storage.name}
                                    </option>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        
            <div className={styles.tableContainer}>
                <div className={styles.table}>
                    <div className={styles.tableHeader}>
                        <h2 className={styles.tableTitle}>Location History</h2>
                        <p>Last 6 Locations</p>
                    </div>
                    <table border="1" className={styles.tableGeneral}>
                        <thead>
                        <tr>
                            <th>Location</th>
                            <th>Timestamp</th>
                        </tr>
                        </thead>
                        <tbody className={styles.tableBody}>
                        {locationHistory && locationHistory.length > 0 && (locationHistory.map((action, index) => (
                            <tr key={index+"location"}
                            id={`${action.location}`}
                                    onClick={() => handleRowClickStorage(action.location)}
                                    className={
                                        selectedLocationId === action.location
                                            ? styles.highlighted
                                            : ""
                                    }>
                                <td className={styles.underline}>{action.location}</td>
                                <td className={styles.lastCol}>{formatTimestamp(action.timestamp)}</td>
                            </tr>
                        )))}
                        </tbody>
                    </table>
                </div>
                
                <div>
                    <div className={styles.tableHeader}>
                        <h2 className={styles.tableTitle}>Action History</h2>
                        <p>Last 6 Actions</p>
                    </div>
                    <table border="1" className={styles.tableGeneral}>
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Action</th>
                                <th className={styles.lastTimeStamp}>Timestamp</th>
                            </tr>
                        </thead>

                        <tbody className={styles.tableBody}>
                            {actionHistory && actionHistory.length > 0 && (actionHistory.map((action, index, array) => (
                                <tr
                                    key={index + "action"}
                                    id={`${action.modified_by}`}
                                    onClick={() => handleRowClickUser(action.modified_by)}
                                    className={
                                        selectedUserId === action.modified_by
                                            ? styles.highlighted
                                            : ""
                                    }>
                                    <td className={styles.underline}>{action.username}</td>
                                    <td>{action.action}</td>
                                    <td ><div className={styles.timeStamp}>{formatTimestamp(action.timestamp)}</div></td>
                                </tr>
                            )))}
                        </tbody>
                    </table>
                </div>
            </div>     
        </div>
    </div>
  );
};

export default ItemDetailClient;
