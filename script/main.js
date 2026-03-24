document.addEventListener("DOMContentLoaded", function () {
  initCommon();

  let page = document.body.getAttribute("data-page");

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
    renderResearch(data.papers);
  }
  if (page === "contact" && typeof initContactPage === "function") {
    initContactPage();
  }
});
