document.addEventListener("DOMContentLoaded", () => {
  const email = document.getElementById("email");
  const password = document.getElementById("password");

  const error = document.getElementById("error");
  error.style.color = "red";

  function generateToken() {
    return Math.random(0, 100000).toString();
  }

  document.getElementById("login").addEventListener("click", (e) => {
    e.preventDefault();
    if (email.value == "" || password.value == "") {
      error.textContent = "Please make sure email and password are not empty";
    } else {
      let users = JSON.parse(localStorage.getItem("users") ?? "[]");
      if (users.length > 0) {
        let user = users.filter((user) => user.email == email.value);
        if (user.length > 0) {
          let obj = user[0];
          if (obj.password == password.value) {
            localStorage.setItem(
              "currUser",
              JSON.stringify({
                email: email.value,
                password: password.value,
                token: generateToken(),
              })
            );
            window.location.href = "/shop/index.html";
          } else {
            error.textContent = "Incorrect Password!";
          }
        } else {
          error.textContent = "User does not exist!";
        }
      } else {
        error.textContent = "User does not exist!";
      }
    }
  });
});
