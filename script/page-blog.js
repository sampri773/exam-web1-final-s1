/**
 * =============================================================================
 * page-blog.js — Liste des articles, archives et vidéos YouTube (blog.html)
 * =============================================================================
 */

function renderBlog() {
  let list = $("#postsList");
  if (list && Array.isArray(data.posts)) {
    let posts = data.posts.slice().sort(function (a, b) {
      return new Date(b.creationDate) - new Date(a.creationDate);
    });

    clearElement(list);

    for (let i = 0; i < posts.length; i++) {
      let p = posts[i];
      let article = document.createElement("article");
      article.className =
        "rounded-xl bg-white/85 border border-stone-200/70 shadow-sm overflow-hidden";

      let grid = document.createElement("div");
      grid.className = "grid grid-cols-1 md:grid-cols-[220px_1fr]";

      let img = document.createElement("img");
      img.src = safeText(p.thumbnail);
      img.alt = "";
      img.className = "w-full h-44 md:h-full object-cover";

      let body = document.createElement("div");
      body.className = "p-6";

      let dateStr = "";
      if (p.creationDate) {
        dateStr = new Date(p.creationDate).toLocaleDateString("fr-FR", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      }

      let dateEl = document.createElement("div");
      dateEl.className =
        "text-[11px] tracking-widest uppercase text-stone-500";
      dateEl.textContent = safeText(dateStr);

      let h2 = document.createElement("h2");
      h2.className =
        "mt-2 text-xl md:text-2xl font-semibold font-serif text-slate-900";
      h2.textContent = safeText(p.title);

      let desc = document.createElement("div");
      desc.className = "mt-3 text-sm text-stone-700 leading-relaxed";
      desc.textContent = safeText(p.description);

      let tagsRow = document.createElement("div");
      tagsRow.className = "mt-5 flex flex-wrap gap-2";
      let tagList = (p.tags || []).slice(0, 4);
      for (let j = 0; j < tagList.length; j++) {
        let span = document.createElement("span");
        span.className =
          "pill rounded-full px-3 py-1 text-[10px] tracking-widest uppercase text-stone-600";
        span.textContent = safeText(tagList[j]);
        tagsRow.appendChild(span);
      }

      body.appendChild(dateEl);
      body.appendChild(h2);
      body.appendChild(desc);
      body.appendChild(tagsRow);

      grid.appendChild(img);
      grid.appendChild(body);
      article.appendChild(grid);
      list.appendChild(article);
    }
  }

  let archives = $("#archivesList");
  if (archives && Array.isArray(data.archives)) {
    clearElement(archives);
    for (let i = 0; i < data.archives.length; i++) {
      let a = data.archives[i];
      let row = document.createElement("div");
      row.className = "flex items-center justify-between text-sm py-2";

      let label = document.createElement("span");
      label.className = "text-stone-700";
      label.textContent = safeText(a.label);

      let count = document.createElement("span");
      count.className = "text-stone-500";
      count.textContent = safeText(a.count);

      row.appendChild(label);
      row.appendChild(count);
      archives.appendChild(row);
    }
  }

  let yt = $("#youtubeList");
  if (yt && Array.isArray(data.youtubeVideos)) {
    clearElement(yt);
    for (let i = 0; i < data.youtubeVideos.length; i++) {
      let v = data.youtubeVideos[i];
      let link = document.createElement("a");
      link.className =
        "block rounded-lg overflow-hidden border border-stone-200/70 bg-white/80 hover:shadow-sm transition";
      link.href =
        "https://www.youtube.com/watch?v=" + encodeURIComponent(safeText(v.id));
      link.target = "_blank";
      link.rel = "noreferrer";

      let thumbWrap = document.createElement("div");
      thumbWrap.className = "aspect-video bg-stone-100";

      let thumb = document.createElement("img");
      thumb.className = "w-full h-full object-cover";
      thumb.alt = "";
      thumb.src =
        "https://img.youtube.com/vi/" +
        encodeURIComponent(safeText(v.id)) +
        "/hqdefault.jpg";

      thumbWrap.appendChild(thumb);

      let title = document.createElement("div");
      title.className = "p-3 text-sm font-semibold text-slate-900";
      title.textContent = safeText(v.title);

      link.appendChild(thumbWrap);
      link.appendChild(title);
      yt.appendChild(link);
    }
  }
}
