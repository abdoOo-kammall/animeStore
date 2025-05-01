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

    const storedUsers = JSON.parse(localStorage.getItem("animeUsers")) || [];

    const matchedUser = storedUsers.find(
      (user) =>
        user.email === loginEmailInput.value.trim() &&
        user.password === loginPasswordInput.value.trim()
    );

    if (matchedUser) {
      alert("Login successful!");
      window.location.href = "index.html";
    } else {
      alert("Incorrect email or password.");
    }
  });
});
