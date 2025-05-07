window.addEventListener("load", function () {
  const signupForm = document.querySelector("#signupForm");

  const usernameInput = document.getElementById("username");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const confirmPasswordInput = document.getElementById("confirmPassword");

  const usernameError = document.getElementById("usernameError");
  const emailError = document.getElementById("emailError");
  const passwordError = document.getElementById("passwordError");
  const confirmError = document.getElementById("confirmError");

  const roleInputs = document.getElementsByName("role");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%?&])[A-Za-z\d@$!%?&]{8,}$/;

  function validateUsername() {
    const value = usernameInput.value.trim();
    if (value.length < 3) {
      usernameError.textContent = "Username must be at least 3 characters.";
      usernameInput.classList.add("error-border");
      usernameInput.classList.remove("success-border");
      return false;
    }
    usernameError.textContent = "";
    usernameInput.classList.remove("error-border");
    usernameInput.classList.add("success-border");
    return true;
  }

  function validateEmail() {
    const value = emailInput.value.trim();
    if (!emailRegex.test(value)) {
      emailError.textContent = "Please enter a valid email address.";
      emailInput.classList.add("error-border");
      emailInput.classList.remove("success-border");
      return false;
    }
    emailError.textContent = "";
    emailInput.classList.remove("error-border");
    emailInput.classList.add("success-border");
    return true;
  }

  function validatePassword() {
    const value = passwordInput.value.trim();
    if (!passwordRegex.test(value)) {
      passwordError.textContent =
        "Password must be 8+ chars, include uppercase, lowercase, number & special char.";
      passwordInput.classList.add("error-border");
      passwordInput.classList.remove("success-border");
      return false;
    }
    passwordError.textContent = "";
    passwordInput.classList.remove("error-border");
    passwordInput.classList.add("success-border");
    return true;
  }

  function validateConfirmPassword() {
    if (
      passwordInput.value.trim() !== confirmPasswordInput.value.trim() ||
      confirmPasswordInput.value.trim() === ""
    ) {
      confirmError.textContent = "Passwords do not match.";
      confirmPasswordInput.classList.add("error-border");
      confirmPasswordInput.classList.remove("success-border");
      return false;
    }
    confirmError.textContent = "";
    confirmPasswordInput.classList.remove("error-border");
    confirmPasswordInput.classList.add("success-border");
    return true;
  }

  // التحقق عند الانتقال بين الحقول
  usernameInput.addEventListener("blur", validateUsername);
  emailInput.addEventListener("blur", validateEmail);
  passwordInput.addEventListener("blur", validatePassword);
  confirmPasswordInput.addEventListener("blur", validateConfirmPassword);

  // التحقق عند الكتابة داخل الحقل
  usernameInput.addEventListener("input", validateUsername);
  emailInput.addEventListener("input", validateEmail);
  passwordInput.addEventListener("input", validatePassword);
  confirmPasswordInput.addEventListener("input", validateConfirmPassword);

  signupForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const isUsernameValid = validateUsername();
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();
    const isConfirmValid = validateConfirmPassword();

    let selectedRole = "";
    for (const input of roleInputs) {
      if (input.checked) {
        selectedRole = input.value;
        break;
      }
    }

    if (
      isUsernameValid &&
      isEmailValid &&
      isPasswordValid &&
      isConfirmValid &&
      selectedRole
    ) {
      const users = JSON.parse(localStorage.getItem("animeUsers")) || [];

      const existingUser = users.find(
        (user) =>
          user.email === emailInput.value.trim() ||
          user.username === usernameInput.value.trim()
      );

      if (existingUser) {
        alert("Email or username already exists!");
        return;
      }

      const userData = {
        username: usernameInput.value.trim(),
        email: emailInput.value.trim(),
        password: passwordInput.value.trim(),
        role: selectedRole,
      };

      users.push(userData);
      localStorage.setItem("animeUsers", JSON.stringify(users));

      alert("Sign-up successful!");
      window.location.href = "login.html";
    } else if (!selectedRole) {
      alert("Please select a role (Customer or Seller).");
    }
  });
});
