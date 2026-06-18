const WATCHMODE_API_KEY = "ETql0PmOls46PHjCwmXNPNsOlxwNQHNPfTXVCBbR"; //8 -> Movie List
const WATCHMODE_API_KEY_2 = "tLkM5Pq2rkvxygM43jbikuD0L7ejCctZYDij83d2"; //iam -> Series List
const WATCHMODE_API_KEY_3 = "uBu8QocUOXI4czamc3swCZCuWiZUWrBOrse7bEMm"; //atomic -> Featured
const OMDB_KEY = "a3d3c727";

// Get Data Either From CachedData(if cached and valid) OR From The URL.
async function fetchWithCache(url, cacheKey) {

    const cached =
        localStorage.getItem(cacheKey);

    if (cached) {

        const data = JSON.parse(cached);

        const age =
            Date.now() - data.timestamp;

        const oneDay =
            24 * 60 * 60 * 1000;

        if (age < oneDay && isValidData(data.value))
        {
            // console.log("returning cashed data for " + cacheKey);
            
            return data.value;
        }
    }

    const response =
        await fetch(url);

    const value =
        await response.json();

    if(isValidData(value)){
        localStorage.setItem(
            cacheKey,
            JSON.stringify({
                timestamp: Date.now(),
                value
            })
        );
    }
    else {
        console.log("ERROR: value is not valid for : " + cacheKey);
        
    }

    // console.log("returning new data for " + cacheKey);

    return value;
}

function isValidData(value) {

    if (value == null)
        return false;

    if (Array.isArray(value))
        return value.length > 0;

    if (typeof value === "object")
        return Object.keys(value).length > 0;

    return true;
}