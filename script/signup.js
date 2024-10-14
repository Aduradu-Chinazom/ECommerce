const myForm = document.getElementById("myForm");
let emailRegex = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;
let passRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/;
let oldData = localStorage.getItem('info');
let newData = oldData ? JSON.parse(oldData) : [];

myForm.addEventListener("submit", function (e) {
  e.preventDefault();
  let isValid = true;

  let username_err = document.getElementById("username_err");
  let email_err = document.getElementById("email_err");
  let password_err = document.getElementById("password_err");
  let confirm_password_err = document.getElementById("confirm_password_err");
  
  let confirm_password = document.getElementById("confirm_password").value;
  let username = document.getElementById("username").value;
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;

  if (username === "") {
    username_err.textContent = "Please enter a username";
    isValid = false;
  } else {
    username_err.textContent = "";
  }
  if (email === "") {
    email_err.textContent = "Please enter an email address";
    isValid = false;
  } else if (!emailRegex.test(email)) {
    email_err.textContent = "Please enter a valid email address";
    isValid = false;
  } else {
    email_err.textContent = "";
  }
  if (password === "") {
    password_err.textContent = "Please enter a password";
    isValid = false;
  } else if (!passRegex.test(password)) {
    password_err.textContent = "Password must contain 1-9, A-Z, a-z, and a special character";
    isValid = false;
  } else {
    password_err.textContent = "";
  }
  if (confirm_password !== password) {
    confirm_password_err.textContent = "Passwords don't match";
    isValid = false;
  } else if (confirm_password === "") {
    confirm_password_err.textContent = "Please fill in this field";
    isValid = false;
  } else {
    confirm_password_err.textContent = "";
  }

  if (!isValid) {
    console.log("Error in connection");
  } else {
    let userData = {
      username: username,
      password: password,
      email: email,
    };

    newData.push(userData);
    localStorage.setItem('info', JSON.stringify(newData));

    window.location.href = "index.html";
  }
});

let eye_icon = document.getElementById('eyeicon');
let eye_icon2 = document.getElementById('eyeicon2');
let passwordField = document.getElementById('password');
let confirm_passwordField = document.getElementById('confirm_password');

eye_icon.onclick = function () {
  if (passwordField.type === 'password') {
    passwordField.type = "text";
    eye_icon.classList.toggle('fa-eye-slash');
    eye_icon.classList.toggle('fa-eye');
  } else {
    passwordField.type = 'password';
    eye_icon.classList.toggle('fa-eye');
    eye_icon.classList.toggle('fa-eye-slash');
  }
};

eye_icon2.onclick = function () {
  if (confirm_passwordField.type === 'password') {
    confirm_passwordField.type = "text";
    eye_icon2.classList.toggle('fa-eye-slash');
    eye_icon2.classList.toggle('fa-eye');
  } else {
    confirm_passwordField.type = 'password';
    eye_icon2.classList.toggle('fa-eye');
    eye_icon2.classList.toggle('fa-eye-slash');
  }
};
