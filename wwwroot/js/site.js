const signup = document.getElementById("sign-up")
const login = document.getElementById("log-in")
const closeBtn = document.getElementsByClassName("toggle-account")
const body = document.body

const section = document.createElement("section")
section.innerHTML = `
        <div class="modal-container">
            <div class="modal-content">
                <div class="popup-container">
                    <h1 id="popup-welcome">¡¡Welcome!!</h1>
                    <p id="popup-text">Get an account to acces the editor</p>
                    <a id="popup-signup">Sign-up</a>
                    <button class="toggle-account">x</button>
                </div>
            </div>
        </div>
    `
body.appendChild(section);
const closeBtns = section.querySelectorAll(".toggle-account")

closeBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        section.remove()
    })
})

const signupopup = document.getElementById("popup-signup")

signupopup.addEventListener("click", () => {
    section.remove();
    signup.click();
})

signup.addEventListener("click", () => {
    const section = document.createElement("section")
    section.innerHTML = `
        <div class="modal-container">
            <div class="modal-content">
                <div class="card">
                    <div class="register-container">
                        <button class="toggle-account">x</button>
                        <h1>Sign-Up</h1>
                        <div class="form-container">
                            <form id="signup-form" class="form">
                                <label>Name</label>
                                <input name="Name" type="text" placeholder="User...">
                                <label>E-mail</label>
                                <input name="email" type="email" placeholder="user@domain.com">
                                <label>Password</label>
                                <input name="password" type="password" placeholder="********">
                                <div class="redirect-register">
                                    <p>Have already an account?</p><a>Log-in</a>
                                </div>
                                <button id="Signup-submit" type="submit">Sign-up</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
    body.appendChild(section)

    const closeBtn = section.querySelector(".toggle-account")
    closeBtn.addEventListener("click", () => {
        section.remove()
    })

    let signupBtn = document.getElementById("signup-form");
    signupBtn.addEventListener("submit", async function (e) {
        e.preventDefault();

        let formData = new FormData(this);
        let data = Object.fromEntries(formData.entries());
        const userData = {
            NameUs: data.Name,
            EmailUs: data.email,
            PasswordUs: data.password,
            DateUs: new Date().toISOString()
        }

        try {
            const response = await fetch("/Users/Create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData)
            });

            const result = await response.json();
            alert(result.message);
            section.remove();

        } catch (err) {
            console.error(err);
        }

    });
})

login.addEventListener("click", () => {
    const section = document.createElement("section")
    section.innerHTML = `
    <div class="modal-container">
            <div class="modal-content">
                <div class="card">
                    <div class="register-container">
                        <button class="toggle-account">x</button>
                        <h1>Log-in</h1>
                        <div class="form-container">
                            <form id="login-form" class="form">
                                <label>Name</label>
                                <input name="name" type="text" placeholder="User...">
                                <label>Password</label>
                                <input name="password" type="password" placeholder="********">
                                <div class="redirect-register">
                                    <p>Don't have an account?</p><a>Sign-up</a>
                                </div>
                                <button id="Login-submit" type="submit">Log-in</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
    body.appendChild(section)

    const closeBtn = section.querySelector(".toggle-account")
    closeBtn.addEventListener("click", () => {
        section.remove()
    })

    let LoginBtn = document.getElementById("login-form");
    LoginBtn.addEventListener("submit", async function (e) {
        e.preventDefault();

        let formData = new FormData(this);
        let data = Object.fromEntries(formData.entries());
        const userData = {
            NameUs: data.name,
            PasswordUs: data.password,
        }

        try {
            const response = await fetch("/Users/Login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData)
            });

            const result = await response.json();
            alert(result.message);
            section.remove();

        } catch (err) {
            console.error(err);
        }
    })
})

let slideIndex = 0;
showSlides();

function showSlides() {
    let i;
    let slides = document.getElementsByClassName("mySlides");
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    slideIndex++;
    if (slideIndex > slides.length) { slideIndex = 1 }
    slides[slideIndex - 1].style.display = "block";
    setTimeout(showSlides, 2000); // Change image every 2 seconds
}