const myForm = document.getElementById("myForm");

myForm.addEventListener("submit", function (e) {
  e.preventDefault();
  let isValid = true;

  let username_err = document.getElementById("username_err");
  let password_err = document.getElementById("password_err");

  let username = document.getElementById("username").value;
  let password = document.getElementById("password").value;

  // Retrieve stored user data from localStorage
  let storedData = localStorage.getItem("info");
  let users = storedData ? JSON.parse(storedData) : [];

  // Check if username exists in the stored users
  let user = users.find(user => user.username === username);

  if (username === "") {
    username_err.textContent = "Please enter a username";
    isValid = false;
  } else if (!user) {
    username_err.textContent = "Username not found";
    isValid = false;
  } else {
    username_err.textContent = "";
  }

  if (password === "") {
    password_err.textContent = "Please enter a password";
    isValid = false;
  } else if (user && user.password !== password) {
    password_err.textContent = "Incorrect password";
    isValid = false;
  } else {
    password_err.textContent = "";
  }

  if (isValid) {
    localStorage.setItem("Logged_in_user", username);
    window.location.href = "home.html";
  }
});

let eye_icon = document.getElementById('eyeicon');
let passwordField = document.getElementById('password');

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
