document.getElementById("loginForm").addEventListener("submit", (e) => {

    e.preventDefault();

    const username =
        document.getElementById("username").value.trim();

    const password =
        document.getElementById("password").value.trim();

    if (!username || !password) {
        alert("همه جا هاي خالي را پر كنيد.");
        return;
    }

    const users =
        JSON.parse(localStorage.getItem("users")) || [];

    const user = users.find(
        u =>
            u.username === username &&
            u.password === password
    );

    if (!user) {
        alert("نام كاربري يا رمز عبور اشتباه است.");
        return;
    }

    localStorage.setItem(
        "currentUser",
        JSON.stringify({ username })
    );

    location.href = "index.html";
});