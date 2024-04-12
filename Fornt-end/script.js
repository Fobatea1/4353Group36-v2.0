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

// Cookie is not required if session state is managed server-side
document.cookie = "wrapper-visible=true";
if (document.cookie.indexOf('wrapper-visible=true') !== -1) {
    wrapper.classList.add('active-popup');
}

function loginUser() {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username, password})
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'Login successful') {
            sessionStorage.setItem('username', username);
            sessionStorage.setItem('userType', data.userType); // Assuming userType is returned from the server
            window.location.href = 'Success.html?username=' + encodeURIComponent(username);
            alert('Login Successful!');
        } else {
            alert('Invalid Username or Password.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error logging in.');
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
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username, password, userType})
    })
    .then(response => response.text())
    .then(data => {
        alert(data);
        wrapper.classList.remove('active-popup');
    })
    .catch(error => console.error('Error:', error));
}

const registerButton = document.getElementById('registerButton');
const loginButton = document.getElementById('loginButton');

registerButton.addEventListener('click', registerUser);
loginButton.addEventListener('click', loginUser);

document.addEventListener('DOMContentLoaded', () => {
    const userType = sessionStorage.getItem('userType');
    if (location.pathname === '/Profile.html' && userType === 'Admin') {
        const adminButton = document.createElement('button');
        adminButton.textContent = 'View Admin Info';
        adminButton.onclick = () => window.location.href = 'AdminDashboard.html';
        document.body.appendChild(adminButton);
    }
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { loginUser, registerUser };
}
