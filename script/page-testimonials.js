/**
 * =============================================================================
 * page-testimonials.js — Grille des témoignages (testimonials.html)
 * =============================================================================
 */

function renderTestimonials() {
  let grid = $("#testimonialsGrid");
  if (!grid || !Array.isArray(data.testimonials)) return;

  clearElement(grid);

  for (let i = 0; i < data.testimonials.length; i++) {
    let t = data.testimonials[i];
    let card = document.createElement("div");
    card.className =
      "rounded-xl bg-white/85 border border-stone-200/70 p-6 shadow-sm";

    let top = document.createElement("div");
    top.className = "flex items-start justify-between gap-4";

    let stars = document.createElement("div");
    stars.className = "text-red-700 text-xs tracking-widest";
    stars.textContent = "★".repeat(t.rating || 0);

    let role = document.createElement("div");
    role.className =
      "text-[11px] tracking-widest uppercase text-stone-500";
    role.textContent = safeText(t.role);

    top.appendChild(stars);
    top.appendChild(role);

    let desc = document.createElement("div");
    desc.className = "text-sm text-stone-700 mt-4 leading-relaxed";
    desc.textContent = '"' + safeText(t.description) + '"';

    let authorRow = document.createElement("div");
    authorRow.className = "flex items-center gap-3 mt-6";

    let img = document.createElement("img");
    img.src = safeText(t.thumbnail);
    img.alt = "";
    img.className =
      "w-10 h-10 rounded-full object-cover border border-stone-200";

    let authorName = document.createElement("div");
    authorName.className = "text-sm font-semibold text-slate-900";
    authorName.textContent = safeText(t.author);

    authorRow.appendChild(img);
    authorRow.appendChild(authorName);

    card.appendChild(top);
    card.appendChild(desc);
    card.appendChild(authorRow);
    grid.appendChild(card);
  }
}
