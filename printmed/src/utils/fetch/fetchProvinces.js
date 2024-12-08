import { showError } from "./showError";

export const fetchProvinces = async (regionCode) => {
    try {
        const res = await fetch(`http://api.geonames.org/childrenJSON?geonameId=${regionCode}&username=nico_183`);
        if (!res.ok) {
            throw new Error('An error occured while getting the list of provinces')
        }
        return await res.json();
    } catch (err) {
        showError(err)
    }
}