import { showError } from "./showError";

export const fetchCities = async (provinceCode, isNcr) => {
    try {
        const url = isNcr ? `https://psgc.cloud/api/regions/1300000000/cities-municipalities` : `https://psgc.cloud/api/provinces/${provinceCode}/cities-municipalities`
        const res = await fetch(url);
        
        if (!res.ok) {
            throw new Error('An error occured while getting the list of cities/municipalities.')
        }

        const data = await res.json();
        return data
    } catch (err) {
        showError(err)
    }
};