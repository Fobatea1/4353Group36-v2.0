const wrapper = document.querySelector('.wrapper');
const loginLink = document.querySelector('.login-link');
const registerLink = document.querySelector('.register-link');
const btnLoginPopup = document.querySelector('.btnLogin-popup');
const btnRegisterPopup = document.querySelector('.btnRegister-popup');
const btnCloseLogin = document.querySelector('.icon-close');

registerLink.addEventListener('click', () => { wrapper.classList.add('active'); });
loginLink.addEventListener('click', () => { wrapper.classList.remove('active'); });
btnLoginPopup.addEventListener('click', () => { wrapper.classList.add('active-popup'); });
btnLoginPopup.addEventListener('click', () => { wrapper.classList.remove('active'); });
btnCloseLogin.addEventListener('click', () => { wrapper.classList.remove('active-popup'); });
btnRegisterPopup.addEventListener('click', () => { wrapper.classList.add('active-popup'); });
btnRegisterPopup.addEventListener('click', () => { wrapper.classList.add('active'); });

function loginUser(event) {
    event.preventDefault();
    const loginButton = document.getElementById('loginButton');
    loginButton.disabled = true;

    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok. Status: ' + response.status);
        }
        return response.json();
    })
    .then(data => {
        if (data.message === 'Login successful') {
            sessionStorage.setItem('username', username);
            sessionStorage.setItem('userType', data.userType);
            window.location.href = 'Success.html?username=' + encodeURIComponent(username);
        } else {
            alert(data.message);
        }
    })
    .catch(error => {
        console.error('Login error:', error);
        alert('Error logging in. ' + error.toString());
    })
    .finally(() => {
        loginButton.disabled = false;
    });
}

function registerUser() {
    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;
    const userType = document.querySelector('input[name="userType"]:checked').value;

    if (username === '' || password === '') {
        alert('Invalid Username or Password.');
        return;
    }

    fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, userType })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok. Status: ' + response.status);
        }
        return response.json();
    })
    .then(data => {
        alert(data.message);
        if (data.message === 'User registered successfully') {
            wrapper.classList.remove('active-popup');
        }
    })
    .catch(error => {
        console.error('Registration error:', error);
        alert('Error registering. ' + error.toString());
    });
}

const registerButton = document.getElementById('registerButton');
const loginButton = document.getElementById('loginButton');

registerButton.addEventListener('click', registerUser);
loginButton.addEventListener('click', loginUser);

document.addEventListener('DOMContentLoaded', () => {
    const userType = sessionStorage.getItem('userType');
    if (location.pathname.endsWith('/Profile.html') && userType === 'Admin') {
        const adminButton = document.createElement('button');
        adminButton.textContent = 'View Admin Info';
        adminButton.onclick = () => window.location.href = 'AdminDashboard.html';
        document.body.appendChild(adminButton);
    }
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { loginUser, registerUser };
}
