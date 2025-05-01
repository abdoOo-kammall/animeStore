window.addEventListener('load',function(){
        
    const loginEmailInput = document.getElementById('loginEmail');
    const loginPasswordInput = document.getElementById('loginPassword');

    const loginEmailError = document.getElementById('loginEmailError');
    const loginPasswordError = document.getElementById('loginPasswordError');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    function setValidationStyle(input, isValid, errorSpan, message) {
    input.classList.remove('error-border', 'success-border');
    input.classList.add(isValid ? 'success-border' : 'error-border');
    errorSpan.textContent = isValid ? '' : message;
    }

    loginEmailInput.addEventListener('blur', () => {
    const valid = emailRegex.test(loginEmailInput.value.trim());
    setValidationStyle(loginEmailInput, valid, loginEmailError, 'Invalid email address.');
    });

    loginPasswordInput.addEventListener('blur', () => {
    const valid = passwordRegex.test(loginPasswordInput.value.trim());
    setValidationStyle(loginPasswordInput, valid, loginPasswordError, 'Password is incorrect or too weak.');
    });


    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
    
        const emailValid = emailRegex.test(loginEmailInput.value.trim());
        const passwordValid = passwordRegex.test(loginPasswordInput.value.trim());
    
        setValidationStyle(loginEmailInput, emailValid, loginEmailError, 'Invalid email address.');
        setValidationStyle(loginPasswordInput, passwordValid, loginPasswordError, 'Password is incorrect or too weak.');
    
        if (!emailValid || !passwordValid) return;
    
        const storedUser = JSON.parse(localStorage.getItem('animeUser'));
    
        if (!storedUser) {
        alert("No user found. Please sign up first.");
        return;
        }
    
        if (
        loginEmailInput.value.trim() === storedUser.email &&
        loginPasswordInput.value.trim() === storedUser.password
        ) {
        alert(`Welcome back, ${storedUser.username}!`);
        window.location.href = 'index.html';
        
        } else {
        alert('Incorrect email or password.');
        }
    });

})
