export function formatTimestamp(dateString = new Date()) {
    const date = new Date(dateString); // ✅ Convert input to Date object

    // ✅ Format time in 12-hour format (e.g., "11:11 PM")
    const timeOptions = { hour: 'numeric', minute: 'numeric', hour12: true };
    const formattedTime = date.toLocaleTimeString('en-US', timeOptions);

    // ✅ Format date as "Feb 11"
    const dateOptions = { month: 'short', day: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-US', dateOptions);

    return `${formattedTime} ${formattedDate}`;
}

export function returnEndStatusValue(solution) {
    if (solution === "Asset") {
        return "Missing";
    } else if (solution === "Inventory") {
        return "Consumed";
    } else {
        return "Completed";
    }
}

export function returnEndActionValue(solution) {
    if (solution === "Asset") {
        return "Missing";
    } else if (solution === "Inventory") {
        return "Consume";
    } else {
        return "Complete";
    }
}

export function returnActionValue(solution) {
    if (solution === "Asset") {
        return "Move to";
    } else if (solution === "Inventory") {
        return "Scan at";
    } else {
        return "Received";
    }
}

export function convertActionToStatus(action) {
    if (action === "Move to") {
        return "Moved";
    } else if (action === "Scan at") {
        return "Scanned";
    } else {
        return "Received";
    }
}