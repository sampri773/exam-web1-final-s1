/**
 * =============================================================================
 * page-testimonials.js — Grille des témoignages (testimonials.html)
 * =============================================================================
 */

function renderTestimonials() {
  let sectionsRoot = $("#testimonialsSections");
  if (!sectionsRoot || !Array.isArray(data.testimonials)) return;

  clearElement(sectionsRoot);

  let roleConfig = [
    { key: "student", title: "STUDENTS", columnsClass: "testimonials-grid--students" },
    { key: "collaborator", title: "COLLABORATORS", columnsClass: "testimonials-grid--collaborators" },
    { key: "customer", title: "CUSTOMERS", columnsClass: "testimonials-grid--customers" }
  ];

  for (let i = 0; i < roleConfig.length; i++) {
    let role = roleConfig[i];
    let items = data.testimonials.filter(function (t) {
      return safeText(t.role).toLowerCase() === role.key;
    });
    if (items.length === 0) continue;

    let section = document.createElement("section");
    section.className = "testimonial-role-block";

    let heading = document.createElement("h2");
    heading.className = "testimonial-role-title";
    heading.textContent = role.title;
    section.appendChild(heading);

    let grid = document.createElement("div");
    grid.className = "testimonials-grid " + role.columnsClass;

    for (let j = 0; j < items.length; j++) {
      let t = items[j];
      let card = document.createElement("article");
      card.className = "testimonial-card testimonial-card--" + role.key;

      let quote = document.createElement("p");
      quote.className = "testimonial-quote";
      quote.textContent = safeText(t.description);

      let authorRow = document.createElement("div");
      authorRow.className = "testimonial-author-row";

      let img = document.createElement("img");
      img.src = safeText(t.thumbnail);
      img.alt = "";
      img.className = "testimonial-avatar";

      let authorCol = document.createElement("div");
      authorCol.className = "testimonial-author-col";

      let authorName = document.createElement("p");
      authorName.className = "testimonial-author-name";
      authorName.textContent = safeText(t.author);

      let roleText = document.createElement("p");
      roleText.className = "testimonial-author-role";
      roleText.textContent = role.key;

      authorCol.appendChild(authorName);
      authorCol.appendChild(roleText);
      authorRow.appendChild(img);
      authorRow.appendChild(authorCol);

      card.appendChild(quote);
      card.appendChild(authorRow);

      if (role.key === "student") {
        let stars = document.createElement("div");
        stars.className = "testimonial-stars";
        stars.textContent = "★".repeat(Number(t.rating) || 0);
        card.appendChild(stars);
      }

      grid.appendChild(card);
    }

    section.appendChild(grid);
    sectionsRoot.appendChild(section);
  }
}
