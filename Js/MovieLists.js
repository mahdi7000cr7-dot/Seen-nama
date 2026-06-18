async function renderSlider(containerId, movies) {

    const container =
        document.getElementById(containerId);

    container.innerHTML = "";
    console.log("mapping lists");
    
    movies.forEach(movie => {

        const card =
            document.createElement("li");

        card.className =
            "splide__slide slider-card";

        const poster =
            movie.poster ||
            "https://placehold.co/300x450?text=No+Image";

        card.innerHTML = `
            <div
                class="slider-poster"
                style="background-image:url('${poster}')">
            </div>

            <div class="slider-title">
                ${movie.title}
            </div>
        `;

        card.onclick = () => {

            location.href =
                `Components/play.html?imdb=${movie.imdb_id}`;

        };

        container.appendChild(card);
    });
}

function createSplide(id) {

    new Splide(`#${id}`, {
        perPage: 6,
        gap: "1rem",
        drag: true,
        pagination: false,
        direction: "rtl",

        breakpoints: {
            1200: { perPage: 5 },
            992: { perPage: 4 },
            768: { perPage: 3 },
            576: { perPage: 2 },
        },
    }).mount();

}