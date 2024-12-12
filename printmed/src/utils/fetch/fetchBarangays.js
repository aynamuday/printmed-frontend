import { showError } from "./showError";

export const fetchBarangays = async (cityCode) => {
    try {
        const res = await fetch(`https://psgc.cloud/api/cities-municipalities/${cityCode}/barangays`)
        
        if (!res.ok) {
            throw new Error('An error occured while getting the list of barangays.')
        }
        
        return await res.json();
    } catch (err) {
        showError(err)
    }
};