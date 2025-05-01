window.addEventListener('load',function(){

    const usernameInput = document.getElementById('username');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const userTypeInput = document.getElementById("userType");


    const usernameError = document.getElementById('usernameError');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    const confirmError = document.getElementById('confirmError');
    const userTypeError = document.getElementById('userTypeError');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;


    function validateUsername() {
    if (usernameInput.value.trim().length < 3) {
        usernameError.textContent = 'Username must be at least 3 characters.';
        return false;
    }
    usernameError.textContent = '';
    return true;
    }

    function validateEmail() {
    if (!emailRegex.test(emailInput.value.trim())) {
        emailError.textContent = 'Please enter a valid email address.';
        return false;
    }
    emailError.textContent = '';
    return true;
    }

    function validatePassword() {
    if (!passwordRegex.test(passwordInput.value.trim())) {
        passwordError.textContent = 'Password must be 8+ chars, include uppercase, lowercase, number & special char.';
        return false;
    }
    passwordError.textContent = '';
    return true;
    }

    function validateConfirmPassword() {
    if (passwordInput.value.trim() !== confirmPasswordInput.value.trim()) {
        confirmError.textContent = 'Passwords do not match.';
        return false;
    }
    confirmError.textContent = '';
    return true;
    }

    ///////////////////
    function validateUserType() {
    if (userTypeInput.value === "")
    {
            userTypeError.textContent='Please select a user type';
        return false;
      }
      userTypeError.textContent='';
      return true;
    }
    ////////////////


    usernameInput.addEventListener('blur', validateUsername);
    emailInput.addEventListener('blur', validateEmail);
    passwordInput.addEventListener('blur', validatePassword);
    confirmPasswordInput.addEventListener('blur', validateConfirmPassword);
//////////
    userTypeInput.addEventListener('blur', validateUserType);
/////////////


    document.getElementById('signupForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const isUsernameValid = validateUsername();
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();
    const isConfirmValid = validateConfirmPassword();
    ////////
    const isUserTypeValid = validateUserType();
    /////////

//////
    if (isUsernameValid && isEmailValid && isPasswordValid && isConfirmValid && isUserTypeValid) {
//////
        const userData = {
        username: usernameInput.value.trim(),
        email: emailInput.value.trim(),
        password: passwordInput.value.trim(),
        ////
        userType: userTypeInput.value
        ////
        };
    
        localStorage.setItem('animeUser', JSON.stringify(userData));
    
        alert('Sign-up successful!');
        window.location.href = './login.html';
    }


    })
})

