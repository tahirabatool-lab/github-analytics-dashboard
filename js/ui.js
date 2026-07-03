// ui.js — simple theme toggle for DevStats dashboard
// Beginner version: no localStorage, just adds/removes a class on the body.

var themeButton = document.getElementById("theme-toggle");

themeButton.addEventListener("click", function () {
  document.body.classList.toggle("dark");

  var isDark = document.body.classList.contains("dark");
  themeButton.setAttribute("aria-pressed", String(isDark));
  themeButton.setAttribute(
    "aria-label",
    isDark ? "Switch to light theme" : "Switch to dark theme"
  );
});

// Mobile menu drawer: show/hide the nav links
var menuButton = document.getElementById("menu-toggle");
var mainNav = document.getElementById("main-nav");

menuButton.addEventListener("click", function () {
  var isOpen = mainNav.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

// Tab switching: clicking a nav link shows only the matching sections
// and hides the rest, using each section's data-section attribute.
var navLinks = document.querySelectorAll(".nav-link");
var tabSections = document.querySelectorAll("[data-section]");

navLinks.forEach(function (link) {
  link.addEventListener("click", function (event) {
    event.preventDefault();

    var targetTab = link.getAttribute("data-tab");

    // Update which link looks "active"
    navLinks.forEach(function (otherLink) {
      otherLink.classList.remove("is-active");
    });
    link.classList.add("is-active");

    // Show only sections whose data-section list includes this tab
    tabSections.forEach(function (section) {
      var sectionTabs = section.getAttribute("data-section").split(" ");
      section.style.display = sectionTabs.includes(targetTab) ? "" : "none";
    });

    // On mobile, close the dropdown after picking a tab
    mainNav.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
  });
});