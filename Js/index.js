// Gets List Of Movies/Series From api.js
async function getList(typeQuery, cacheKey, type) {
    
    let key = type ? WATCHMODE_API_KEY : WATCHMODE_API_KEY_2;
        
    const url =
        `https://api.watchmode.com/v1/list-titles/?apiKey=${key}&${typeQuery}&limit=10`;

    const res = await fetchWithCache(url, cacheKey);

    return res.titles || [];
}

// Adds Posters From OMDB To Data Received From WatchMode
async function enrichWithPosters(list) {

    return Promise.all(
        list.map(async (item) => {

            const imdb = item.imdb_id;

            if (!imdb) {
                return {
                    ...item,
                    poster: null
                };
            }

            const omdbUrl =
                `https://www.omdbapi.com/?i=${imdb}&apikey=${OMDB_KEY}`;

            const data =
                await fetchWithCache(omdbUrl, `omdb_${imdb}`);

            return {
                ...item,
                poster:
                    data?.Poster && data.Poster !== "N/A"
                        ? data.Poster
                        : null
            };
        })
    );
}

async function getMovies() {
    const list = await getList("types=movie", "movies", true);

    return enrichWithPosters(list);
}

async function getSeries() {
    const list = await getList("types=tv_series", "series", false);

    return enrichWithPosters(list);
}

// >>Execute
(async () => {

    const [movies, series] =
        await Promise.all([
            getMovies(),
            getSeries()
        ]);

    renderSlider("newMoviesSlider", movies);
    renderSlider("newSeriesSlider", series);

    createSplide("newMoviesSplide");
    createSplide("newSeriesSplide");

})();