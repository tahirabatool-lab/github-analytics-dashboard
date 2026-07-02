// ui.js — simple theme toggle for DevStats dashboard
// Beginner version: no localStorage, just adds/removes a class on the body.

var themeButton = document.getElementById("theme-toggle");

themeButton.addEventListener("click", function () {
  document.body.classList.toggle("dark");
});

// Mobile menu drawer: show/hide the nav links
var menuButton = document.getElementById("menu-toggle");
var mainNav = document.getElementById("main-nav");

menuButton.addEventListener("click", function () {
  mainNav.classList.toggle("open");
});