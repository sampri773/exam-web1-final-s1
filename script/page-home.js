/**
 * =============================================================================
 * page-home.js — Contenu dynamique UNIQUEMENT pour la page d’accueil (index.html)
 * =============================================================================
 * Utilise l’objet global `data` défini dans tokimahery.data.js
 */

/** Remplit la section « About », les stats, cours, expérience et témoignages d’aperçu. */
function renderHome() {
  var about1 = $("#aboutPart1");
  var about2 = $("#aboutPart2");
  if (about1) about1.textContent = safeText(data.aboutMe_part1);
  if (about2) about2.textContent = safeText(data.aboutMe_part2);

  var overview = $("#overviewStats");
  if (overview && Array.isArray(data.overview)) {
    overview.innerHTML = data.overview
      .map(function (o) {
        return (
          '<div class="text-center">' +
          '<div class="text-3xl md:text-4xl font-semibold text-slate-900">' +
          safeText(o.number) +
          "</div>" +
          '<div class="text-[11px] tracking-widest uppercase text-stone-500 mt-1">' +
          safeText(o.label) +
          "</div>" +
          "</div>"
        );
      })
      .join("");
  }

  var exp = $("#experienceList");
  if (exp && Array.isArray(data.experiences)) {
    exp.innerHTML = data.experiences
      .map(function (e) {
        return (
          '<div class="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-4 py-7 border-t border-stone-200/70">' +
          '<div class="text-[11px] tracking-widest uppercase text-stone-500">' +
          safeText(e.year) +
          "</div>" +
          "<div>" +
          '<div class="font-semibold text-slate-900">' +
          safeText(e.role) +
          "</div>" +
          '<div class="text-sm text-stone-600">' +
          safeText(e.org) +
          "</div>" +
          '<div class="text-sm text-stone-600 mt-3 leading-relaxed">' +
          safeText(e.desc) +
          "</div>" +
          "</div>" +
          "</div>"
        );
      })
      .join("");
  }

  var homeCourses = $("#homeCourses");
  if (homeCourses && Array.isArray(data.homeCourses)) {
    homeCourses.innerHTML = data.homeCourses
      .map(function (c) {
        return (
          '<div class="rounded-xl bg-white/80 border border-stone-200/70 p-5 shadow-sm">' +
          '<div class="text-[11px] tracking-widest uppercase text-stone-500">' +
          safeText(c.tag) +
          "</div>" +
          '<div class="font-semibold text-slate-900 mt-2">' +
          safeText(c.title) +
          "</div>" +
          '<div class="text-sm text-stone-600 mt-4 flex items-center justify-between">' +
          "<span>" +
          safeText(c.mode) +
          "</span>" +
          "<span>" +
          safeText(c.duration) +
          "</span>" +
          "</div>" +
          "</div>"
        );
      })
      .join("");
  }

  var teasers = $("#testimonialsTeaser");
  if (teasers && Array.isArray(data.testimonials)) {
    var pick = data.testimonials.slice(0, 5);
    teasers.innerHTML = pick
      .map(function (t) {
        var stars = "★".repeat(t.rating || 0);
        var authorName = safeText(t.author.split(",")[0] || t.author);
        return (
          '<div class="rounded-xl bg-white/85 border border-stone-200/70 p-5 shadow-sm">' +
          '<div class="text-red-700 text-xs tracking-widest">' +
          stars +
          "</div>" +
          '<div class="text-sm text-stone-700 mt-3 leading-relaxed">"' +
          safeText(t.description) +
          '"</div>' +
          '<div class="flex items-center gap-3 mt-5">' +
          '<img src="' +
          safeText(t.thumbnail) +
          '" alt="" class="w-9 h-9 rounded-full object-cover border border-stone-200">' +
          '<div class="leading-tight">' +
          '<div class="text-sm font-semibold text-slate-900">' +
          authorName +
          "</div>" +
          '<div class="text-[11px] tracking-widest uppercase text-stone-500">' +
          safeText(t.role) +
          "</div>" +
          "</div>" +
          "</div>" +
          "</div>"
        );
      })
      .join("");
  }
}
