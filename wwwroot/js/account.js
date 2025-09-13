const signup = document.getElementById("sign-up")
const login = document.getElementById("log-in")
const closeBtn = document.getElementsByClassName("toggle-account")
const body = document.body

signup.addEventListener("click", () => {
  const section = document.createElement("section")
  section.innerHTML = `
        <div class="container">
            <div class="row d-flex align-items-center justify-content-center vh-100">
                <div class="col-10 col-sm-8 col-md-8 col-lg-6 col-xl-4 card">
                    <div class="register-container d-flex justify-content-center flex-column">
                        <button class="toggle-account">x</button>
                        <h1>Sign-Up</h1>
                        <div class="form-container">
                            <form action="/Sign-up" method="Post" class="d-flex flex-column">
                                <label>Name</label>
                                <input name="Name" type="text" placeholder="User...">
                                <label>E-mail</label>
                                <input name="e-mail" type="email" placeholder="user@domain.com">
                                <label>Password</label>
                                <input name="password" type="password" placeholder="********">
                                <div class="redirect-register d-flex">
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
    <section>
        <div class="container">
            <div class="row d-flex align-items-center justify-content-center vh-100">
                <div class="col-10 col-sm-8 col-md-8 col-lg-6 col-xl-4 card">
                    <div class="register-container d-flex justify-content-center flex-column">
                    <button class="toggle-account">x</button>
                        <h1>Log-in</h1>
                        <div class="form-container">
                            <form action="/Log-in" method="Post" class="d-flex flex-column">
                                <label>Name</label>
                                <input name="Name" type="text" placeholder="User...">
                                <label>Password</label>
                                <input name="password" type="password" placeholder="********">
                                <div class="redirect-register d-flex">
                                <p>Don´t have an account?</p><a>Sign-up</a>
                                </div>
                                <button id="Signup-submit" type="submit">Log-in</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    `
  body.appendChild(section)

  const closeBtn = section.querySelector(".toggle-account")
  closeBtn.addEventListener("click", () => {
    section.remove()
  })
})
