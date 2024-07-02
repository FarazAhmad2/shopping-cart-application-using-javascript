document.addEventListener("DOMContentLoaded", () => {
  const fname = document.getElementById("fname");
  const lname = document.getElementById("lname");
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  const confirmPassword = document.getElementById("confirm-password");

  const error = document.getElementById("error");
  error.style.color = "red";

  const success = document.getElementById("success");
  success.style.color = "green";

  document.getElementById("signup").addEventListener("click", (e) => {
    e.preventDefault();
    if (
      fname.value == "" ||
      lname.value == "" ||
      email.value == "" ||
      password.value == "" ||
      confirmPassword.value == ""
    ) {
      error.textContent = "Please enter all required fields!";
      success.textContent = "";
    } else if (password.value == confirmPassword.value) {
      let users = JSON.parse(localStorage.getItem("users") ?? "[]");
      let filteredUser = users.filter((user) => user.email == email.value);
      if (filteredUser.length > 0) {
        error.textContent = "User already exists";
        success.textContent = "";
      } else {
        users.push({
          fname: fname.value,
          lname: lname.value,
          email: email.value,
          password: password.value,
          createdAt: new Date(),
        });

        success.textContent = "Signup successfully!";

        users = localStorage.setItem("users", JSON.stringify(users));
        error.textContent = "";
        fname.value = "";
        lname.value = "";
        email.value = "";
        password.value = "";
        confirmPassword.value = "";
      }
    } else {
      error.textContent = "Please make sure password and confirm password are same!!";
      success.textContent = "";
    }
  });
});
