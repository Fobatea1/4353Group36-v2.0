// script.js

// Select DOM elements
const wrapper = document.querySelector('.wrapper');
const loginLink = document.querySelector('.login-link');
const registerLink = document.querySelector('.register-link');
const btnLoginPopup = document.querySelector('.btnLogin-popup');
const btnRegisterPopup = document.querySelector('.btnRegister-popup');
const registerButton = document.getElementById('registerButton');
const loginButton = document.getElementById('loginButton');

// Event listeners for UI interactions
registerLink.addEventListener('click', () => wrapper.classList.add('active'));
loginLink.addEventListener('click', () => wrapper.classList.remove('active'));
btnLoginPopup.addEventListener('click', () => {
    wrapper.classList.add('active-popup');
    wrapper.classList.remove('active');
});
// Assuming btnCloseLogin is defined in your HTML
const btnCloseLogin = document.querySelector('.close'); // Adjust the selector as necessary
btnCloseLogin.addEventListener('click', () => wrapper.classList.remove('active-popup'));
btnRegisterPopup.addEventListener('click', () => {
    wrapper.classList.add('active-popup');
    wrapper.classList.add('active');
});

// Register user function
function registerUser() {
    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;
    const userType = document.querySelector('input[name="userType"]:checked').value;
    const user = { username, password, userType };
    localStorage.setItem(username, JSON.stringify(user));
    alert('Registration Successful. You can now log in.');
    wrapper.classList.remove('active-popup');
}

// Login user function
function loginUser() {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    const user = JSON.parse(localStorage.getItem(username));
    if (user && password === user.password) {
        sessionStorage.setItem('username', username);
        sessionStorage.setItem('userType', user.userType);
        window.location.href = 'Success.html';
    } else {
        alert('Invalid Username or Password.');
    }
}

// Attach functions to window for Jest testing
window.registerUser = registerUser;
window.loginUser = loginUser;

// Load admin button if user is admin
document.addEventListener('DOMContentLoaded', () => {
    const userType = sessionStorage.getItem('userType');
    if (userType === 'Admin') {
        const adminButton = document.createElement('button');
        adminButton.textContent = 'View Admin Info';
        adminButton.onclick = () => window.location.href = 'AdminDashboard.html';
        document.body.appendChild(adminButton);
    }
});

// Logout functionality (assuming logoutButton is defined in your HTML)
const logoutButton = document.getElementById('logoutButton');
if (logoutButton) {
    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('username');
        localStorage.removeItem('password');
        logoutButton.style.display = 'none';
        window.location.href = 'index.html';
    });
}
