window.addEventListener("load", function () {
  const loginEmailInput = document.getElementById("loginEmail");
  const loginPasswordInput = document.getElementById("loginPassword");

  const loginEmailError = document.getElementById("loginEmailError");
  const loginPasswordError = document.getElementById("loginPasswordError");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

  function setValidationStyle(input, isValid, errorSpan, message) {
    input.classList.remove("error-border", "success-border");
    input.classList.add(isValid ? "success-border" : "error-border");
    errorSpan.textContent = isValid ? "" : message;
  }

  document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const emailValid = emailRegex.test(loginEmailInput.value.trim());
    const passwordValid = passwordRegex.test(loginPasswordInput.value.trim());

    setValidationStyle(
      loginEmailInput,
      emailValid,
      loginEmailError,
      "Invalid email address."
    );
    setValidationStyle(
      loginPasswordInput,
      passwordValid,
      loginPasswordError,
      "Password is incorrect."
    );

    if (!emailValid || !passwordValid) return;

    fetch("http://localhost:3000/users")
      .then((response) => response.json())
      .then((users) => {
        const matchedUser = users.find(
          (user) =>
            user.email === loginEmailInput.value.trim() &&
            user.password === loginPasswordInput.value.trim()
        );

        if (matchedUser) {
          const currentUser = {
            id: matchedUser.id,
            name: matchedUser.name,
            email: matchedUser.email,
            role: matchedUser.role,
          };
          localStorage.setItem("currentUser", JSON.stringify(currentUser));

          if (matchedUser.role === "admin" || matchedUser.role === "seller") {
            window.location.href = "admin.html";
          } else if (matchedUser.role === "seller") {
            window.location.href = "admin.html";
          }
          if (matchedUser.role === "customer") {
            window.location.href = "index.html";
          }
        } else {
          window.location.href = "index.html";
        }
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        alert("There was an error. Please try again later.");
      });
  });

  function updateHeader() {
    const loginLink = document.querySelector(
      '.main-nav-list a[href="login.html"]'
    );
    const signupLink = document.querySelector(
      '.main-nav-list a[href="signup.html"]'
    );
    const userIcon = document.querySelector("#user-icon");

    if (localStorage.getItem("currentUser")) {
      loginLink.style.display = "none";
      signupLink.style.display = "none";
      userIcon.style.display = "inline-block";
    } else {
      loginLink.style.display = "inline-block";
      signupLink.style.display = "inline-block";
      userIcon.style.display = "none";
    }
  }

  updateHeader();
});
