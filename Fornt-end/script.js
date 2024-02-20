const wrapper = document.querySelector('.wrapper');
const loginLink = document.querySelector('.login-link');
const registerLink = document.querySelector('.register-link');
const btnLoginPopup = document.querySelector('.btnLogin-popup');
const btnCloseLogin = document.querySelector('.icon-close'); /*query selector is the element that is responsible for the action*/

registerLink.addEventListener('click', ()=> {wrapper.classList.add('active');});
loginLink.addEventListener('click', ()=> {wrapper.classList.remove('active');});

btnLoginPopup.addEventListener('click', ()=> {wrapper.classList.add('active-popup');});
btnCloseLogin.addEventListener('click', ()=> {wrapper.classList.remove('active-popup');});


//check if button works


function loginUser(){

    const storedUsername = localStorage.getItem('username');
    const storedPassword = localStorage.getItem('password');
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    if (username === storedUsername && password === storedPassword) {
        window.location.href = 'Success.html?username=' + encodeURIComponent(username);
        alert('Login Successful!');
        
        wrapper.classList.remove('active-popup'); //closes the form
        // Redirect or display login success message here

        

    } else {
        alert('Invalid Username or Password.');
    }

    

    
}

function registerUser(){

    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;
    localStorage.setItem('username', username);
    localStorage.setItem('password', password);
    alert('Registration Successful. You can now log in.');
    wrapper.classList.add('active-popup');
}

