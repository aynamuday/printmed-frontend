import { showError } from "./showError";

export const fetchRegions = async () => {
    try {
        const res = await fetch('https://psgc.cloud/api/regions')

        if (!res.ok) {
            throw new Error('An error occured while getting the list of address regions.')
        }
        
        const data = await res.json();
        return data
    } catch (err) {
        showError(err)
    }
};