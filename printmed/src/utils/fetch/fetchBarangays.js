export const fetchBarangays = async (cityCode) => {
    try {
        const res = await fetch(`http://api.geonames.org/childrenJSON?geonameId=${cityCode}&username=nico_183`);
        if (!res.ok) {
            throw new Error('An error occured while getting the list of barangays.')
        }
        return await res.json();
    } catch (err) {
        showError(err)
    }
}