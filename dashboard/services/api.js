const BASE_URL = "http://localhost:5000"; 

export const request = async (endpoint, options = {}) => {
    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                ...(options.headers || {}), // merge custom headers if provided
            },
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        return response.json(); 
    } catch (error) {
        console.log("Request Failed:", error);
        throw error;
    }
};
