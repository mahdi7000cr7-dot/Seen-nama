async function loadComponent(id, file) {
    try {
        const response = await fetch(file);

        if (!response.ok) {
            throw new Error(`Failed to load ${file}`);
        }

        const html = await response.text();

        document.getElementById(id).innerHTML = html;
    }
    catch (error) {
        console.error(error);
    }
}

document.addEventListener("DOMContentLoaded", async () => {

    const basePath =
        window.location.pathname.includes("/Components/")
            ? "../Components/"
            : "Components/";

    await loadComponent(
        "header-container",
        `${basePath}header.html`
    );

    await loadComponent(
        "footer-container",
        `${basePath}footer.html`
    );

    initAuth();
    initSearch();

});
