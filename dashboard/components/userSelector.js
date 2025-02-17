"use client"; 

import { useUser } from "@/context/UserProvider";
import styles from "./userSelector.module.css";
import { useState, useRef, useEffect } from "react";

const UserSelector = () => {
  const { userData, selectedUser, updateSelectedUser, loadingUser } = useUser();
  const [userMenuOn, setUserMenuOn] = useState(false);
  const userDropdownRef = useRef(null);
  
  
  useEffect(() => {
    // if the user menu dropdown is on, click on white space or other places other than the dropdown menu will close the dropdown
    const handleClickOutside = (event) => {
        if (userDropdownRef.current && !userDropdownRef.current.contains(event.target) && userMenuOn) {
            toggleSelection();
            setUserMenuOn(false);
        }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
        document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userMenuOn]);

  if (loadingUser) return <p>Loading users...</p>;
  if (!userData || userData.length === 0) return <p>No users found</p>;

  // update the current selected user so that the new user will show up in the upper right corner
  function handleChange(userId) {
    const selected = userData.find((user) => user.id === userId);
    updateSelectedUser(selected);
    toggleSelection();
  }

  // when user clicks on changing the user, the dropdown menu will be displayed   
  function toggleSelection() {
    const dropdown = document.getElementById("userDropdown");

    if (dropdown.style.display === "none" || dropdown.style.display === "") {
        setUserMenuOn(true);
        dropdown.style.display = "block"; 
    } else {
      setUserMenuOn(false);
        dropdown.style.display = "none"; 
    }
  }

  return (
    <div className={styles.userDropdown}>
      <div className={styles.dropdown}>
          <div className={styles.buttonContainer}>
          <button onClick={toggleSelection}  className={styles.buttonDivider} >
            <div className={styles.alignText}><span className={styles.name}>{selectedUser.name}<br/></span>
            <span className={styles.role}>{selectedUser.role}</span></div>
            <span className={styles.arrow}>▼</span>

            </button>
          </div>
            <div id="userDropdown" className={styles.dropdownContent} ref={userDropdownRef}>
              {userData
                .filter((user) => user.id !== selectedUser?.id) // Exclude selected user
                .map((user) => (
                  <option key={user.id} onClick={() => handleChange(user.id)}>
                    {user.name}
                  </option>
                ))}
            </div>
            </div>
    </div>
    
  );
};

export default UserSelector;

