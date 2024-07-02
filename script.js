document.addEventListener("DOMContentLoaded", () => {
 
  document.getElementById('signup-btn').addEventListener('click', () => {
    window.location.href = '/signup/index.html';
  });

  document.getElementById('login-btn').addEventListener('click', () => {
    window.location.href = '/signup/login.html';
  });

  if (localStorage.getItem("currUser")) {
    window.location.href = "/shop/index.html";
  }

});
