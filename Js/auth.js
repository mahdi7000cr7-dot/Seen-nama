// ----------------------------
// User Registering
// ----------------------------

function getUsers() {
    return JSON.parse(localStorage.getItem("users")) || [];
}

function saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
}

function getCurrentUser() {

    return JSON.parse(
        localStorage.getItem(
            "currentUser"
        )
    );

}

function register(username, password) {

    const users = getUsers();

    // check duplicate
    const exists = users.find(u => u.username === username);

    if (exists) {
        alert("این نام کاربری قبلا استفاده شده");
        return false;
    }

    // create user
    users.push({
        username,
        password
    });

    saveUsers(users);

    // auto login after register
    localStorage.setItem(
        "currentUser",
        JSON.stringify({ username })
    );

    // send a fake welcome notification
    const notifications =
    getNotifications();

    notifications.unshift({
        id: Date.now(),
        title: "🎉 خوش آمدید",
        message: `سلام ${username}! از تماشای فیلم ها و سریال ها لذت ببر.`,
        date: new Date().toLocaleDateString(),
        read: false
    });

    saveNotifications(notifications);

    return true;
}

function logout() {

    localStorage.removeItem(
        "currentUser"
    );

    location.reload();

}

// --------------------------
// UI
//---------------------------

function renderProfileMenu() {

    const dropdown =
        document.getElementById(
            "profileDropdown"
        );

    if (!dropdown)
        return;

    const user =
        getCurrentUser();

    if (!user) {

        dropdown.innerHTML = `
            <a href="${rootPath("login.html")}">
                ورود
            </a>

            <a href="${rootPath("register.html")}">
                ثبت نام
            </a>
        `;

        return;

    }

    // href="${rootPath("profile.html")}"
    dropdown.innerHTML = `
        <a >
            ${user.username}
        </a>

        <button id="logoutBtn">
            خروج
        </button>
    `;

    document
        .getElementById(
            "logoutBtn"
        )
        ?.addEventListener(
            "click",
            logout
        );

}

document.addEventListener(
    "click",
    e => {

        const btn =
            document.getElementById(
                "profileBtn"
            );

        const menu =
            document.getElementById(
                "profileDropdown"
            );

        if (!btn || !menu)
            return;

        if (
            btn.contains(e.target)
        ) {

            menu.classList.toggle(
                "show"
            );

            return;

        }

        if (
            !menu.contains(e.target)
        ) {

            menu.classList.remove(
                "show"
            );

        }

    }
);

document.addEventListener(
    "click",
    e => {

        const btn =
            document.getElementById(
                "notificationBtn"
            );

        const menu =
            document.getElementById(
                "notificationDropdown"
            );

        if (!btn || !menu)
            return;

        if (
            btn.contains(e.target)
        ) {

            menu.classList.toggle(
                "show"
            );

            return;
        }

        if (
            !menu.contains(e.target)
        ) {

            menu.classList.remove(
                "show"
            );

        }

    }
);

//--------------------------
// Link Channelling
//--------------------------

function rootPath(page) {

    const inComponents =
        window.location.pathname
            .toLowerCase()
            .includes("/components/");

    return inComponents
        ? `../${page}`
        : page;

}

function getRootReverse(page) {

    const isInComponents =
        window.location.pathname
            .toLowerCase()
            .includes("/components/");

    return isInComponents
        ? page
        : `Components/${page}`;

}

function fixHeaderLinks() {

    const logo =
        document.querySelector(".logo");

    if (logo) {
        logo.setAttribute(
            "href",
            rootPath("index.html")
        );
    }

    const homeBTN = 
    document.querySelector("#homeBTN");
    
    if(homeBTN){
        homeBTN.setAttribute(
            "href",
            rootPath("index.html")
        );
    }

    const movieList = 
    document.querySelector(".movieList");
    
    if(movieList){
        movieList.setAttribute(
            "href",
            `${getRootReverse("list.html")}?type=movie`
        );
    }

    const seriesList = 
    document.querySelector(".seriesList");
    
    if(seriesList){
        seriesList.setAttribute(
            "href",
            `${getRootReverse("list.html")}?type=series`
        );
    }

    const inComponents =
        window.location.pathname
            .toLowerCase()
            .includes("/components/")

            document.querySelector("#homeBTN").style.display = inComponents ? "block" : "none";
            document.querySelector(".movieList").style.display = inComponents ? "block" : "none";
            document.querySelector(".seriesList").style.display = inComponents ? "block" : "none";
}

function initAuth() {

    renderProfileMenu();

    renderNotifications();

    fixHeaderLinks();
}

// __________________________
// Notification
// _________________________

function getNotifications() {

    return JSON.parse(
        localStorage.getItem(
            "notifications"
        )
    ) || [];

}

function saveNotifications(data) {

    localStorage.setItem(
        "notifications",
        JSON.stringify(data)
    );

}

function renderNotifications() {

    const dropdown =
        document.getElementById(
            "notificationDropdown"
        );

    const badge =
        document.getElementById(
            "notificationBadge"
        );

    if (!dropdown)
        return;

    const notifications =
        getNotifications();

    const unread =
        notifications.filter(
            n => !n.read
        ).length;

    badge.style.background =
    unread > 0
        ? "#e50914"
        : "transparent";

    badge.textContent =
        unread > 0
            ? unread
            : "";
            

    dropdown.innerHTML = "";

    if (!notifications.length) {

        dropdown.innerHTML =
            `<div class="notification-empty">
                پیام جدیدی یافت نشد.
            </div>`;

        return;
    }

    notifications.forEach(n => {

        dropdown.innerHTML += `
            <div
                class="notification-item
                ${n.read ? "" : "unread"}"
            >
                <strong>
                    ${n.title}
                </strong>

                <p>
                    ${n.message}
                </p>

                <small>
                    ${n.date}
                </small>

                <button
                    class="remove-notification"
                    data-id="${n.id}"
                >
                    حذف
                </button>
            </div>
        `;
    });

    document
    .querySelectorAll(
        ".remove-notification"
    )
    .forEach(btn => {

        btn.addEventListener(
            "click",
            () => {

                removeNotification(
                    Number(
                        btn.dataset.id
                    )
                );

            }
        );

    });
}

function removeNotification(id) {

    const notifications =
        getNotifications().filter(
            n => n.id !== id
        );

    saveNotifications(
        notifications
    );

    renderNotifications();

}