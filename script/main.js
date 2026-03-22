/**
 * =============================================================================
 * main.js — Point d’entrée : lance le code commun puis la page courante
 * =============================================================================
 * Chaque fichier HTML a un attribut data-page sur <body> (ex. data-page="home").
 * On appelle la fonction qui correspond à cette page, si elle existe.
 */

document.addEventListener("DOMContentLoaded", function () {
  initCommon();

  var page = document.body.getAttribute("data-page");

  if (page === "home" && typeof renderHome === "function") {
    renderHome();
  }
  if (page === "blog" && typeof renderBlog === "function") {
    renderBlog();
  }
  if (page === "courses" && typeof renderCourses === "function") {
    renderCourses();
  }
  if (page === "testimonials" && typeof renderTestimonials === "function") {
    renderTestimonials();
  }
  if (page === "research" && typeof renderResearch === "function") {
    renderResearch();
  }
  if (page === "contact" && typeof initContactPage === "function") {
    initContactPage();
  }
});
