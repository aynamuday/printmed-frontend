import { showError } from "./showError";

export const fetchRegions = async () => {
    try {
        const res = await fetch('https://psgc.cloud/api/regions');
        const data = await res.json();

        if (!res.ok) {
            throw new Error('An error occured while getting the list of address regions.')
        }
        
        return data
    } catch (err) {
        showError(err)
    }
};