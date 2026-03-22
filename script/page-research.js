/**
 * =============================================================================
 * page-research.js — Liste des publications (research.html)
 * =============================================================================
 */

function renderResearch() {
  var list = $("#papersList");
  if (!list || !Array.isArray(data.papers)) return;
  list.innerHTML = data.papers
    .map(function (p) {
      var date = p.publishedDate
        ? new Date(p.publishedDate).toLocaleDateString("fr-FR", { year: "numeric", month: "long" })
        : "";
      var tags = (p.tags || [])
        .map(function (t) {
          return (
            '<span class="pill rounded-full px-3 py-1 text-[11px] tracking-widest uppercase text-stone-600">' +
            safeText(t) +
            "</span>"
          );
        })
        .join("");
      var authors = (p.authors || []).join(", ");
      var pdfHref = safeText(p.pdfUrl || p.url);
      return (
        '<article class="py-10 border-t border-stone-200/70">' +
        '<div class="flex flex-wrap items-center gap-3 text-[11px] tracking-widest uppercase text-stone-500">' +
        "<span>" +
        safeText(p.journal) +
        "</span>" +
        '<span class="opacity-40">•</span>' +
        "<span>" +
        safeText(date) +
        "</span>" +
        "</div>" +
        '<h2 class="mt-3 text-2xl md:text-3xl font-semibold font-serif text-slate-900">' +
        safeText(p.title) +
        "</h2>" +
        '<div class="mt-4 text-sm text-stone-700 leading-relaxed">' +
        safeText(p.abstract) +
        "</div>" +
        '<div class="mt-5 text-sm text-stone-600"><span class="font-semibold text-slate-900">Authors:</span> ' +
        safeText(authors) +
        "</div>" +
        '<div class="mt-6 flex flex-wrap gap-2">' +
        tags +
        "</div>" +
        '<div class="mt-6">' +
        '<a class="inline-flex items-center gap-2 text-red-800 font-semibold text-sm tracking-wide hover:underline" href="' +
        pdfHref +
        '" target="_blank" rel="noreferrer">READ PDF <span aria-hidden="true">→</span></a>' +
        "</div>" +
        "</article>"
      );
    })
    .join("");
}
