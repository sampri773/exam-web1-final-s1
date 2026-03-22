/**
 * =============================================================================
 * page-testimonials.js — Grille des témoignages (testimonials.html)
 * =============================================================================
 */

function renderTestimonials() {
  var grid = $("#testimonialsGrid");
  if (!grid || !Array.isArray(data.testimonials)) return;
  grid.innerHTML = data.testimonials
    .map(function (t) {
      var stars = "★".repeat(t.rating || 0);
      return (
        '<div class="rounded-xl bg-white/85 border border-stone-200/70 p-6 shadow-sm">' +
        '<div class="flex items-start justify-between gap-4">' +
        '<div class="text-red-700 text-xs tracking-widest">' +
        stars +
        "</div>" +
        '<div class="text-[11px] tracking-widest uppercase text-stone-500">' +
        safeText(t.role) +
        "</div>" +
        "</div>" +
        '<div class="text-sm text-stone-700 mt-4 leading-relaxed">"' +
        safeText(t.description) +
        '"</div>' +
        '<div class="flex items-center gap-3 mt-6">' +
        '<img src="' +
        safeText(t.thumbnail) +
        '" alt="" class="w-10 h-10 rounded-full object-cover border border-stone-200">' +
        '<div class="leading-tight">' +
        '<div class="text-sm font-semibold text-slate-900">' +
        safeText(t.author) +
        "</div>" +
        "</div>" +
        "</div>" +
        "</div>"
      );
    })
    .join("");
}
