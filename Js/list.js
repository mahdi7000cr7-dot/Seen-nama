const params =
    new URLSearchParams(location.search);

const type =
    params.get("type") || "movie";

const title =
    document.getElementById("pageTitle");

const container =
    document.getElementById("listContainer");

const loadMoreBtn =
    document.getElementById("loadMoreBtn");

let currentPage = 1;

let allTitles = [];

title.textContent =
    type === "series"
        ? "سریال های جدید"
        : "فیلم های جدید";


async function getTitles(page) {

    const cacheKey =
        `list_${type}_${page}`;

    const cached =
        localStorage.getItem(cacheKey);

    if (cached) {

        return JSON.parse(cached);

    }

    const watchType =
        type === "series"
            ? "tv_series"
            : "movie";

    const data =
        await fetchWithCache(
            `https://api.watchmode.com/v1/list-titles/?apiKey=${WATCHMODE_API_KEY}&types=${watchType}&limit=20&page=${page}`,
            cacheKey
        );

    localStorage.setItem(
        cacheKey,
        JSON.stringify(data)
    );

    return data;

}


async function getPoster(imdbID) {

    if (!imdbID)
        return "https://placehold.co/300x450";

    const data =
        await fetchWithCache(
            `https://www.omdbapi.com/?apikey=${OMDB_KEY}&i=${imdbID}`,
            `poster_${imdbID}`
        );

    return data?.Poster &&
        data.Poster !== "N/A"
            ? data.Poster
            : "https://placehold.co/300x450";

}

async function renderTitles(titles) {

    for (const movie of titles) {

        const poster =
            await getPoster(
                movie.imdb_id
            );

        const card =
            document.createElement("div");

        card.className =
            "movie-card";

        card.innerHTML = `
            <img
                src="${poster}"
                alt="${movie.title}"
            >

            <div class="movie-title">
                ${movie.title}
            </div>

            <div class="movie-year">
                ${movie.year || ""}
            </div>
        `;

        card.onclick = () => {

            location.href =
                `play.html?imdb=${movie.imdb_id}`;

        };

        container.appendChild(card);

    }

}

async function loadPage(page) {

    loadMoreBtn.disabled = true;

    loadMoreBtn.textContent =
        "Loading...";

    const data =
        await getTitles(page);

    const titles =
        data.titles || [];

    allTitles.push(...titles);

    await renderTitles(titles);

    loadMoreBtn.disabled = false;

    loadMoreBtn.textContent =
        "نمایش بیشتر";

    if (
        !titles.length ||
        page >= (data.total_pages || 1)
    ) {

        loadMoreBtn.style.display =
            "none";

    }

}


loadMoreBtn.addEventListener(
    "click",
    async () => {

        currentPage++;

        await loadPage(currentPage);

    }
);


(async () => {

    await loadPage(currentPage);

})();