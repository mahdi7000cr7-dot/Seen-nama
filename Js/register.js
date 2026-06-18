document
    .getElementById("registerForm")
    .addEventListener("submit", (e) => {

        e.preventDefault();

        const username =
            document.getElementById("username").value.trim();

        const password =
            document.getElementById("password").value.trim();

        if (!username || !password) {
            alert("همه جا های خالی را پر كنيد.");
            return;
        }

        if (username.length < 3) {
            alert("نام كاربري كوتاه است(حداقل 3 واژه)");
            return;
        }

        if (password.length < 6) {
            alert("رمز عبور نامعتبر است.");
            return;
        }

        const ok = register(username, password);

        if (ok) {
            location.href = "index.html";
        }
    });
    