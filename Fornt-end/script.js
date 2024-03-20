// script.js

document.addEventListener('DOMContentLoaded', function() {
    const wrapper = document.querySelector('.wrapper');
    const loginLink = document.querySelector('.login-link');
    const registerLink = document.querySelector('.register-link');
    const btnLoginPopup = document.querySelector('.btnLogin-popup');
    const btnRegisterPopup = document.querySelector('.btnRegister-popup');
    const btnCloseLogin = document.querySelector('.icon-close'); // Assuming this is your close button selector

    // Toggle visibility for login and registration forms
    registerLink.addEventListener('click', () => wrapper.classList.add('active'));
    loginLink.addEventListener('click', () => wrapper.classList.remove('active'));
    btnLoginPopup.addEventListener('click', () => {
        wrapper.classList.add('active-popup');
        wrapper.classList.remove('active');
    });
    btnCloseLogin.addEventListener('click', () => wrapper.classList.remove('active-popup'));
    btnRegisterPopup.addEventListener('click', () => {
        wrapper.classList.add('active-popup');
        wrapper.classList.add('active');
    });

    // Event listeners for buttons, using global document in case elements are dynamically added or not present at script execution time
    document.getElementById('registerButton')?.addEventListener('click', registerUser);
    document.getElementById('loginButton')?.addEventListener('click', loginUser);
});

function loginUser() {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    const user = JSON.parse(localStorage.getItem(username));

    if (user && username === user.username && password === user.password) {
        sessionStorage.setItem('username', username);
        sessionStorage.setItem('userType', user.userType);
        alert('Login Successful!');
        window.location.href = 'Success.html?username=' + encodeURIComponent(user.username);
    } else {
        alert('Invalid Username or Password.');
    }
}

function registerUser(event) {
    event.preventDefault();
    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;
    const userType = document.querySelector('input[name="userType"]:checked').value;

    const user = { username, password, userType };
    localStorage.setItem(username, JSON.stringify(user));
    alert('Registration Successful. You can now log in.');
    const wrapper = document.querySelector('.wrapper');
    wrapper.classList.remove('active-popup');
}

// Exporting functions for Jest testing. This conditional check ensures it only tries to export when in a module context.
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { loginUser, registerUser };
}
