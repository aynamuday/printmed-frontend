import { showError } from "./showError";

export const fetchProvinces = async (regionCode) => {
    try {
        const res = await fetch(`https://psgc.cloud/api/regions/${regionCode}/provinces`);
        if (!res.ok) {
            throw new Error('An error occured while getting the list of provinces')
        }
        return await res.json();
    } catch (err) {
        showError(err)
    }
};