const wrapper = document.querySelector('.wrapper');
const loginLink = document.querySelector('.login-link');
const registerLink = document.querySelector('.register-link');
const btnLoginPopup = document.querySelector('.btnLogin-popup');
const btnRegisterPopup = document.querySelector('.btnRegister-popup');
const btnCloseLogin = document.querySelector('.icon-close'); /*query selector is the element that is responsible for the action*/

registerLink.addEventListener('click', ()=> {wrapper.classList.add('active');});
loginLink.addEventListener('click', ()=> {wrapper.classList.remove('active');});

btnLoginPopup.addEventListener('click', ()=> {wrapper.classList.add('active-popup');});
btnLoginPopup.addEventListener('click', ()=> {wrapper.classList.remove('active');});
btnCloseLogin.addEventListener('click', ()=> {wrapper.classList.remove('active-popup');});

btnRegisterPopup.addEventListener('click', ()=> {wrapper.classList.add('active-popup');});
btnRegisterPopup.addEventListener('click', ()=> {wrapper.classList.add('active');});

//check if button works

document.cookie = "wrapper-visible=true";

if (document.cookie.indexOf('wrapper-visible=true') !== -1) {
    wrapper.classList.add('active-popup');
  }

btnRegisterPopup.addEventListener('click', ()=> {
    wrapper.classList.add('active-popup');
    // Set the "wrapper-visible" cookie to "true" when the wrapper element is shown
    document.cookie = "wrapper-visible=true";
  });

function loginUser(){

    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    const user = JSON.parse(localStorage.getItem(username));

    if (username === user.username && password === user.password) {
        sessionStorage.setItem('username', username);
        sessionStorage.setItem('userType', user.userType);
        window.location.href = 'Success.html?username=' + encodeURIComponent(user.username);
        alert('Login Successful!');
        
        // Redirect or display login success message here 
    } else {
        alert('Invalid Username or Password.');
    }

    
}

function registerUser() {
  const username = document.getElementById('registerUsername').value;
  const password = document.getElementById('registerPassword').value;
  const userType = document.querySelector('input[name="userType"]:checked').value;

  const user = {
      username,
      password,
      userType
  };

  localStorage.setItem(username, JSON.stringify(user));
  alert('Registration Successful. You can now log in.');
  wrapper.classList.remove('active-popup');
}

const registerButton = document.getElementById('registerButton');
const loginButton = document.getElementById('loginButton');

registerButton.addEventListener('click', registerUser);
loginButton.addEventListener('click', loginUser);

document.addEventListener('DOMContentLoaded', () => {
    const userType = sessionStorage.getItem('userType');
    if (page === '/Profile.html' && userType === 'Admin') {
        const adminButton = document.createElement('button');
        adminButton.textContent = 'View Admin Info';
        adminButton.onclick = () => window.location.href = 'AdminDashboard.html';
        document.body.appendChild(adminButton);
    }
});