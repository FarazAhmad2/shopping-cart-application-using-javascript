document.addEventListener("DOMContentLoaded", () => {
  const success = document.getElementById("success");
  success.style.color = "green";

  const success2 = document.getElementById("success-2");
  success2.style.color = "green";

  const error = document.getElementById("error");
  error.style.color = "red";

  let currUser = JSON.parse(localStorage.getItem("currUser"));
  if (currUser) {
    let users = JSON.parse(localStorage.getItem("users"));

    document.getElementById("save-info").addEventListener("click", (e) => {
      e.preventDefault();
      const fname = document.getElementById("fname");
      const lname = document.getElementById("lname");

      const index = users.findIndex((user) => user.email == currUser.email);

      if (fname.value) {
        users[index].fname = fname.value;
      }

      if (lname.value) {
        users[index].lname = lname.value;
      }
      localStorage.setItem("users", JSON.stringify(users));
      fname.value = "";
      lname.value = "";
      success.textContent = "Name changed successfully!";
    });

    document.getElementById("change-pass").addEventListener("click", (e) => {
      e.preventDefault();
      const oldPassword = document.getElementById("old-pass");
      const newPassword = document.getElementById("new-pass");
      const confirmPassword = document.getElementById("confirm-pass");

      const index = users.findIndex((user) => user.email == currUser.email);

      if (oldPassword.value != users[index].password) {
        error.textContent = "Incorrect old password!";
        success2.textContent = "";
        return;
      }

      if (newPassword.value != confirmPassword.value) {
        error.textContent =
          "Please make sure New Password and Confirm Password are same!";
        success2.textContent = "";
      } else {
        users[index].password = newPassword.value;
        success2.textContent = "Password changed successfully!";
        oldPassword.value = "";
        newPassword.value = "";
        confirmPassword.value = "";
        error.textContent = "";
        localStorage.setItem("users", JSON.stringify(users));
      }
    });

    document.getElementById("logout").addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = "/";
      localStorage.removeItem("currUser");
    });
  } else {
    window.location.href = "/signup/login.html";
  }
});
