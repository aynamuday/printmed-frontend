import { showError } from "./showError";

export const fetchRegions = async () => {
    try {
        const res = await fetch('http://api.geonames.org/childrenJSON?geonameId=1694008&username=nico_183');
        const data = await res.json();

        if (!res.ok) {
            throw new Error('An error occured while getting the list of address regions.')
        }
        
        return data
    } catch (err) {
        showError(err)
    }
};