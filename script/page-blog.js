/**
 * =============================================================================
 * page-blog.js — Liste des articles, archives et vidéos YouTube (blog.html)
 * =============================================================================
 */

function renderBlog() {
  var list = $("#postsList");
  if (list && Array.isArray(data.posts)) {
    var posts = data.posts.slice().sort(function (a, b) {
      return new Date(b.creationDate) - new Date(a.creationDate);
    });
    list.innerHTML = posts
      .map(function (p) {
        var date = p.creationDate
          ? new Date(p.creationDate).toLocaleDateString("fr-FR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          : "";
        var tags = (p.tags || [])
          .slice(0, 4)
          .map(function (t) {
            return (
              '<span class="pill rounded-full px-3 py-1 text-[10px] tracking-widest uppercase text-stone-600">' +
              safeText(t) +
              "</span>"
            );
          })
          .join("");
        return (
          '<article class="rounded-xl bg-white/85 border border-stone-200/70 shadow-sm overflow-hidden">' +
          '<div class="grid grid-cols-1 md:grid-cols-[220px_1fr]">' +
          '<img src="' +
          safeText(p.thumbnail) +
          '" alt="" class="w-full h-44 md:h-full object-cover">' +
          '<div class="p-6">' +
          '<div class="text-[11px] tracking-widest uppercase text-stone-500">' +
          safeText(date) +
          "</div>" +
          '<h2 class="mt-2 text-xl md:text-2xl font-semibold font-serif text-slate-900">' +
          safeText(p.title) +
          "</h2>" +
          '<div class="mt-3 text-sm text-stone-700 leading-relaxed">' +
          safeText(p.description) +
          "</div>" +
          '<div class="mt-5 flex flex-wrap gap-2">' +
          tags +
          "</div>" +
          "</div>" +
          "</div>" +
          "</article>"
        );
      })
      .join("");
  }

  var archives = $("#archivesList");
  if (archives && Array.isArray(data.archives)) {
    archives.innerHTML = data.archives
      .map(function (a) {
        return (
          '<div class="flex items-center justify-between text-sm py-2">' +
          '<span class="text-stone-700">' +
          safeText(a.label) +
          "</span>" +
          '<span class="text-stone-500">' +
          safeText(a.count) +
          "</span>" +
          "</div>"
        );
      })
      .join("");
  }

  var yt = $("#youtubeList");
  if (yt && Array.isArray(data.youtubeVideos)) {
    yt.innerHTML = data.youtubeVideos
      .map(function (v) {
        return (
          '<a class="block rounded-lg overflow-hidden border border-stone-200/70 bg-white/80 hover:shadow-sm transition" href="https://www.youtube.com/watch?v=' +
          safeText(v.id) +
          '" target="_blank" rel="noreferrer">' +
          '<div class="aspect-video bg-stone-100">' +
          '<img class="w-full h-full object-cover" alt="" src="https://img.youtube.com/vi/' +
          safeText(v.id) +
          '/hqdefault.jpg">' +
          "</div>" +
          '<div class="p-3 text-sm font-semibold text-slate-900">' +
          safeText(v.title) +
          "</div>" +
          "</a>"
        );
      })
      .join("");
  }
}
