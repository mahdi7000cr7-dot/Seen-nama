function getQueryParam(name) {

    return new URLSearchParams(
        window.location.search
    ).get(name);

}

const imdb =
    getQueryParam("imdb");

const season =
    getQueryParam("season");

const episode =
    getQueryParam("episode");

const iframe =
    document.getElementById("player");

function buildStreamUrl() {

    if (
        season &&
        episode
    ) {

        return `https://multiembed.mov/?video_id=${imdb}&s=${season}&e=${episode}`;

    }

    return `https://multiembed.mov/?video_id=${imdb}`;

}

if (imdb) {

    iframe.src =
        buildStreamUrl();

} else {

    document.body.innerHTML =
        "<h2>No video selected</h2>";

}