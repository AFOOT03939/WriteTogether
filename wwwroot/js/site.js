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
                            <form action="/Sign-up" method="Post" class="form">
                                <label>Name</label>
                                <input name="Name" type="text" placeholder="User...">
                                <label>E-mail</label>
                                <input name="e-mail" type="email" placeholder="user@domain.com">
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
                            <form action="/Log-in" method="Post" class="form">
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
})
