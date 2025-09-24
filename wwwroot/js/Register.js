let signupBtn = document.getElementById("signup-form");
let loginBtn = document.getElementById("Login-submit");

signupBtn.addEventListener("submit", async function (e) {
    e.preventDefault();

    let formData = new FormData(this);
    let data = Object.fromEntries(formData.entries());

    try {
        const response = await fetch("/Users/Create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.success) {
            alert("Usuario creado con éxito");
            document.getElementById("signupModal").style.display = "none";
        } else {
            alert("Error: " + (result.message || "Verifique los datos"));
            console.log(result.errors);
        }

    } catch(err) {
        console.error(err);
    }

});


login.addEventListener("submit", async function (e) {
    e.preventDefault();
});