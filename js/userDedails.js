document.addEventListener("DOMContentLoaded", function () {
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const currentPasswordInput = document.getElementById("current-password");
  const newPasswordInput = document.getElementById("new-password");
  const confirmPasswordInput = document.getElementById("confirm-password");
  const userDetailsForm = document.getElementById("userDetailsForm");

  const nameRegex = /^[a-zA-Z\s]{3,}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

  function validateField(input, regex) {
    if (regex.test(input.value.trim())) {
      input.style.borderColor = "green";
      return true;
    } else {
      input.style.borderColor = "red";
      return false;
    }
  }

  function showMatch(input1, input2) {
    if (input1.value === input2.value && input1.value !== "") {
      input2.style.borderColor = "green";
      return true;
    } else {
      input2.style.borderColor = "red";
      return false;
    }
  }

  nameInput.addEventListener("blur", () => validateField(nameInput, nameRegex));
  emailInput.addEventListener("blur", () =>
    validateField(emailInput, emailRegex)
  );
  newPasswordInput.addEventListener("blur", () => {
    if (newPasswordInput.value !== "")
      validateField(newPasswordInput, passwordRegex);
    else newPasswordInput.style.borderColor = "#ccc";
  });
  confirmPasswordInput.addEventListener("blur", () => {
    if (newPasswordInput.value !== "")
      showMatch(newPasswordInput, confirmPasswordInput);
    else confirmPasswordInput.style.borderColor = "#ccc";
  });

  function getUserFromLocalStorage() {
    const storedUser = localStorage.getItem("currentUser");
    if (!storedUser) {
      alert("You are not logged in.");
      window.location.href = "login.html";
      return null;
    }
    return JSON.parse(storedUser);
  }

  function updateLocalStorage(updatedUser) {
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
  }

  const currentUser = getUserFromLocalStorage();
  if (currentUser) {
    nameInput.value = currentUser.name;
    emailInput.value = currentUser.email;
  } else {
    return;
  }

  userDetailsForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const nameValid = validateField(nameInput, nameRegex);
    const emailValid = validateField(emailInput, emailRegex);
    let passwordValid = true;

    const currentPassword = currentPasswordInput.value;
    const newPassword = newPasswordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    if (!currentPassword) {
      alert("Please enter your current password.");
      passwordValid = false;
    }

    if (newPassword || confirmPassword) {
      passwordValid =
        passwordRegex.test(newPassword) && newPassword === confirmPassword;
      validateField(newPasswordInput, passwordRegex);
      showMatch(newPasswordInput, confirmPasswordInput);
    }

    if (!nameValid || !emailValid || !passwordValid) {
      alert("Please fix validation errors before saving.");
      return;
    }

    const updatedData = {
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
    };

    if (newPassword) {
      updatedData.password = newPassword;
    }

    fetch(`http://localhost:3000/users/${currentUser.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to save.");
        return res.json();
      })
      .then((data) => {
        // alert("Changes saved successfully!");

        document.getElementById("success-message").classList.remove("hidden");
        setTimeout(() => {
          document.getElementById("success-message").classList.add("hidden");
        }, 3000);

        updateLocalStorage({
          ...currentUser,
          name: data.name,
          email: data.email,
          //   password: data.password,
        });
        // window.location.href = "index.html";
      })
      .catch((err) => {
        alert("Error saving changes.");
        console.error(err);
      });
  });
});
