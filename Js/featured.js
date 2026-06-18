const featuredPoster =
    document.getElementById(
        "featuredPoster"
    );

const featuredTitle =
    document.getElementById(
        "featuredTitle"
    );

const featuredPlayBtn =
    document.getElementById(
        "featuredPlayBtn"
    );

const featuredSlider =
    document.getElementById(
        "featuredSlider"
    );

let featuredMovies = [];
let currentMovie = null;
let featuredSplide = null; // Add this to store Splide instance

async function getFeaturedList() {

    const response =
        await fetch(
            "featuredDB.json"
        );

    const data =
        await response.json();

    return data.items || [];

}

function getFeaturedImage(movie) {

    return window.innerWidth <= 768
        ? movie.poster
        : movie.hero;

}

function renderFeatured(movie) {

    currentMovie =
        movie;

    if (!movie)
        return;

    const image =
        getFeaturedImage(
            movie
        );

    if (featuredPoster.tagName === "IMG") {

        featuredPoster.src =
            image;

    }
    else {

        featuredPoster.style.backgroundImage =
            `url('${image}')`;

    }

    if (featuredTitle) {

        featuredTitle.textContent =
            movie.title;

    }

}

function renderFeaturedSlider() {

    if (!featuredSlider)
        return;

    featuredSlider.innerHTML =
        "";

    featuredMovies.forEach(
        movie => {

            const item =
                document.createElement(
                    "li"
                );

            // Add both classes - splide__slide and a specific featured-slide class
            item.className =
                "splide__slide featured-slide";

            item.innerHTML = `
                <div class="featured-card">
                    <img 
                        src="${movie.poster}" 
                        alt="${movie.title}"
                    >
                </div>
            `;

            item.addEventListener(
                "click",
                () => {

                    renderFeatured(
                        movie
                    );

                    // Add active class styling
                    document.querySelectorAll('#featuredSlider .splide__slide').forEach(slide => {
                        slide.classList.remove('active');
                    });
                    item.classList.add('active');
                }
            );

            featuredSlider.appendChild(
                item
            );

        }
    );

    // Destroy existing Splide instance if it exists
    if (featuredSplide) {
        featuredSplide.destroy();
    }

    // Initialize Splide for featured slider
    const featuredSplideElement = document.querySelector('#featured-content');
    if (featuredSplideElement && featuredMovies.length > 0) {
        featuredSplide = new Splide(featuredSplideElement, {
            type: 'slide',
            perPage: 5,
            perMove: 1,
            gap: '0.8rem',  // Reduced gap for smaller cards
            pagination: false,
            arrows: true,
            breakpoints: {
                1200: {
                    perPage: 5,
                    gap: '0.7rem',
                },
                992: {
                    perPage: 4,
                    gap: '0.6rem',
                },
                768: {
                    perPage: 3,
                    gap: '0.5rem',
                },
                576: {
                    perPage: 2,
                    gap: '0.5rem',
                },
                480: {
                    perPage: 2,
                    gap: '0.4rem',
                }
            }
        });
        
        featuredSplide.mount();
    }

}

window.addEventListener(
    "resize",
    () => {

        if (
            currentMovie
        ) {

            renderFeatured(
                currentMovie
            );

        }

        // Refresh Splide on resize
        if (featuredSplide) {
            featuredSplide.refresh();
        }

    }
);

featuredPlayBtn?.addEventListener(
    "click",
    () => {

        if (
            !currentMovie
        )
            return;

        location.href =
            `Components/play.html?imdb=${currentMovie.imdb_id}`;

    }
);

(async function initFeatured() {

    try {

        featuredMovies =
            await getFeaturedList();

        renderFeaturedSlider();

        if (
            featuredMovies.length > 0
        ) {

            renderFeatured(
                featuredMovies[0]
            );

            // Add active class to first slide
            setTimeout(() => {
                const firstSlide = document.querySelector('#featuredSlider .splide__slide');
                if (firstSlide) {
                    firstSlide.classList.add('active');
                }
            }, 100);

        }

    }
    catch(error) {

        console.error(
            "Featured section failed:",
            error
        );

    }

})();