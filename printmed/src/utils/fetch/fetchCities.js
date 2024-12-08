import { showError } from "./showError";

export const fetchCities = async (provinceCode) => {
    try {
        const res = await fetch(`http://api.geonames.org/childrenJSON?geonameId=${provinceCode}&username=nico_183`);
        const data = await res.json();
        if (!res.ok) {
            throw new Error('An error occured while getting the list of cities/municipalities.')
        }

        return data
    } catch (err) {
        showError(err)
    }
};