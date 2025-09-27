// Get Location
export async function getLocation(): Promise<string | null> {
    console.log('starting to get location');
    try {
        const response = await fetch(`https://ipinfo.io/json?token=b6268727178610`);
        console.log('got location response');

        if (!response.ok) {
            throw new Error(response.statusText);
        }

        const jsonResponse = await response.json();
        console.log(jsonResponse);

        return jsonResponse.loc as string; // e.g. "37.3860,-122.0838"
    } catch (err: any) {
        console.warn(`location failed to update! encountered error: ${err.message}`);
        return null;
    }
}