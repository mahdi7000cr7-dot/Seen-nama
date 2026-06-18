function getCurrentUser() {
    return JSON.parse(localStorage.getItem("currentUser"));
}

function logout() {
    localStorage.removeItem("currentUser");
    location.href = "index.html";
}

document.addEventListener("DOMContentLoaded", () => {

    const user = getCurrentUser();

    // redirect if not logged in
    if (!user) {
        location.href = "login.html";
        return;
    }

    // show username
    document.getElementById("profileName").textContent =
        user.username;

    // logout
    document.getElementById("logoutBtn").addEventListener("click", logout);
});