// ui.js — simple theme toggle for DevStats dashboard

var themeButton = document.getElementById("theme-toggle");

themeButton.addEventListener("click", function () {
  document.body.classList.toggle("dark");
});