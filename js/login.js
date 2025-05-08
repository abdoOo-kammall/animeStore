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


        /////////////خزن نسخه في local storage//////////////
      const currentUser = {
        id: matchedUser.id,
        name: matchedUser.username,
        email: matchedUser.email,
        role: matchedUser.role
      };
      localStorage.setItem("currentUser", JSON.stringify(currentUser));


      const redirectPage = (role === "admin" || role === "seller") ? "admin.html" : "index.html";
      window.location.href = redirectPage;
    } else {
      window.location.href = "index.html";
    }
  })
  .catch((error) => {
    console.error("Error fetching users:", error);
    alert("There was an error. Please try again later.");
  });
  });
});