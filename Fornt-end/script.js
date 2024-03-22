// script.js

document.addEventListener('DOMContentLoaded', function() {
    const wrapper = document.querySelector('.wrapper');
    const loginLink = document.querySelector('.login-link');
    const registerLink = document.querySelector('.register-link');
    const btnLoginPopup = document.querySelector('.btnLogin-popup');
    const btnRegisterPopup = document.querySelector('.btnRegister-popup');
    const btnCloseLogin = document.querySelector('.icon-close');

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

    document.getElementById('registerButton')?.addEventListener('click', window.registerUser);
    document.getElementById('loginButton')?.addEventListener('click', window.loginUser);
});

window.loginUser = function() {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    const user = JSON.parse(localStorage.getItem(username));

    if (user && username === user.username && password === user.password) {
        sessionStorage.setItem('username', username);
        sessionStorage.setItem('userType', user.userType);
        alert('Login Successful!');
        window.redirectTo('Success.html?username=' + encodeURIComponent(username));
    } else {
        alert('Invalid Username or Password.');
    }
};

window.registerUser = function(event) {
    event.preventDefault();
    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;
    const userType = document.querySelector('input[name="userType"]:checked').value;

    const user = { username, password, userType };
    localStorage.setItem(username, JSON.stringify(user));
    alert('Registration Successful. You can now log in.');
    const wrapper = document.querySelector('.wrapper');
    wrapper.classList.remove('active-popup');
};

window.redirectTo = function(url) {
    window.location.href = url;
};

// Exporting functions for Jest testing, only if module.exports is available
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { loginUser: window.loginUser, registerUser: window.registerUser, redirectTo: window.redirectTo };
}
