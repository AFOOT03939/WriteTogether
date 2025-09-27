const logout = document.getElementById("log-out");

logout.addEventListener("click", async function (e) {
    e.preventDefault();

    try {
        const response = await fetch("/Users/Logout", {
            method: "POST",
        });
        window.location.reload()

    } catch (err) {
        console.error(err);
    }
});