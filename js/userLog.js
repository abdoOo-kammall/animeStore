window.addEventListener("load", () => {
  function updateHeader() {
    const loginLink = document.querySelector(
      '.main-nav-list a[href="login.html"]'
    );
    const signupLink = document.querySelector(
      '.main-nav-list a[href="signup.html"]'
    );
    const userIcon = document.querySelector("#user-icon");
    const logOut = document.querySelector(".log-out");
    const cartIcon = document.querySelector(".cart-info");

    if (localStorage.getItem("currentUser")) {
      loginLink.style.display = "none";
      signupLink.style.display = "none";
      userIcon.style.display = "inline-block";
      logOut.style.display = "inline-block";
      cartIcon.style.display = "inline-block";
    } else {
      loginLink.style.display = "inline-block";
      signupLink.style.display = "inline-block";
      userIcon.style.display = "none";
      cartIcon.style.display = "none";
      logOut.style.display = "none";
    }
  }

  updateHeader();
  let logOut = document.querySelector(".log-out");
  logOut.addEventListener("click", () => {
    localStorage.removeItem("currentUser");
    updateHeader();
    window.location.href = "index.html";
  });
});
