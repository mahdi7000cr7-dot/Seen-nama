const searchBtn =
    document.getElementById(
        "searchBtn"
    );

const searchModal =
    document.getElementById(
        "searchModal"
    );

const searchInput =
    document.getElementById(
        "searchInput"
    );

const searchResults =
    document.getElementById(
        "searchResults"
    );


async function searchTitles(
    query,
    searchResults
) {

    searchResults.innerHTML =
        "<div class='search-item'>Searching...</div>";

    try {

        const data =
            await fetchWithCache(
                `https://api.watchmode.com/v1/autocomplete-search/?apiKey=${WATCHMODE_API_KEY}&search_value=${encodeURIComponent(query)}`,
                `search_${query}`
            );

        const results =
            data.results || [];

        searchResults.innerHTML =
            "";

        for (const item of results.slice(0, 10)) {
        
            let poster =
                "https://placehold.co/80x120?text=No+Image";
        
            if (item.imdb_id) {
            
                try {
                
                    const omdb =
                        await fetchWithCache(
                        
                            `https://www.omdbapi.com/?apikey=${OMDB_KEY}&i=${item.imdb_id}`,
                        
                            `search_poster_${item.imdb_id}`
                        );
                    
                    if (
                        omdb?.Poster &&
                        omdb.Poster !== "N/A"
                    ) {
                    
                        poster =
                            omdb.Poster;
                    
                    }
                
                }
                catch (error) {
                
                    console.error(
                        "Poster fetch failed:",
                        error
                    );
                
                }
            
            }
        
            const div =
                document.createElement(
                    "div"
                );
            
            div.className =
                "search-item";
            
            div.innerHTML = `
                <img
                    class="search-poster"
                    src="${poster}"
                    alt="${item.name}"
                >
            
                <div class="search-info">
            
                    <div class="search-title">
                        ${item.name}
                    </div>
            
                    <div class="search-type">
                        ${item.type || ""}
                    </div>
            
                </div>
            `;
            
            div.addEventListener(
                "click",
                () => {
                
                    if (
                        item.imdb_id
                    ) {
                    
                        location.href =
                            `${getRootReverse("play.html")}?imdb=${item.imdb_id}`;
                    
                    }
                
                }
            );
        
            searchResults.appendChild(
                div
            );
        
        }

    }
    catch (error) {

        console.error(error);

        searchResults.innerHTML =
            "<div class='search-item'>Error loading results</div>";

    }

}

function initSearch() {

    const searchBtn =
        document.getElementById(
            "searchBtn"
        );

    const searchModal =
        document.getElementById(
            "searchModal"
        );

    const searchInput =
        document.getElementById(
            "searchInput"
        );

    const searchResults =
        document.getElementById(
            "searchResults"
        );

    const closeSearchBtn =
        document.getElementById(
            "closeSearchBtn"
        );
    
    closeSearchBtn?.addEventListener(
        "click",
        () => {
        
            searchModal.classList.remove(
                "show"
            );
        
        }
    );

    if (
        !searchBtn ||
        !searchModal ||
        !searchInput ||
        !searchResults
    ) {
        return;
    }

    searchBtn.addEventListener(
        "click",
        () => {

            searchModal.classList.add(
                "show"
            );

            searchInput.focus();

        }
    );

    searchModal.addEventListener(
        "click",
        e => {

            if (
                e.target === searchModal
            ) {

                searchModal.classList.remove(
                    "show"
                );

            }

        }
    );

    let searchTimeout;

    searchInput.addEventListener(
        "input",
        () => {

            clearTimeout(
                searchTimeout
            );

            const query =
                searchInput.value.trim();

            if (
                query.length < 2
            ) {

                searchResults.innerHTML =
                    "";

                return;

            }

            searchTimeout =
                setTimeout(
                    () =>
                        searchTitles(
                            query,
                            searchResults
                        ),
                    400
                );

        }
    );

}