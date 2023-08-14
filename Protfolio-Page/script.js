//navbar//
const toggleButton = document.getElementsByClassName("toggle-button")[0];
const navbarLinks = document.getElementsByClassName("navbar-links")[0];
toggleButton.addEventListener("click", (e) => {
  navbarLinks.classList.toggle("active");
  e.preventDefault();
});
const navLinks = document.querySelectorAll(".nav-link");
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.forEach((link) => {
      link.classList.remove("active");
    });
    link.classList.add("active");
  });
});

//form validation//
const btnForm = document.querySelector(".btn-form");
const inputFiled = document.querySelectorAll(".inputF");
btnForm.addEventListener("click", (e) => {
  let isEmpty = false;
  inputFiled.forEach((inputField) => {
    if (inputField.value === "") {
      isEmpty = true;
      e.preventDefault();
    }
  });

  if (isEmpty) {
    alert("Please fill up all the fields");
  } else {
    alert("Message sent!");
  }
});
