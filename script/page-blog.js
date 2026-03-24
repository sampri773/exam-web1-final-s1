let currentPage = 1;
const postsPerPage = 5;

function renderBlog() {
  let list = $("#postsList");
  if (!list || !Array.isArray(data.posts)) return;

  let allPosts = data.posts.slice().sort((a, b) => new Date(b.creationDate) - new Date(a.creationDate));

  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const postsToShow = allPosts.slice(startIndex, endIndex);

  clearElement(list);

  postsToShow.forEach(p => {
    let article = document.createElement("article");
    article.className = "shadow-[0px_5px_10px_#f0ece4] rounded-lg p-5 flex gap-5 mb-6";

    let img = document.createElement("img");
    img.src = safeText(p.thumbnail);
    img.className = "hidden rounded-lg md:block md:w-[15vw] object-cover";

    let contentWrapper = document.createElement("div");
    contentWrapper.className = "flex flex-col justify-between gap-5";

    let textGroup = document.createElement("div");
    textGroup.className = "flex flex-col gap-2";

    let h2 = document.createElement("h2");
    h2.className = "text-[1.3rem] font-semibold text-[#b91c1c]";
    h2.textContent = safeText(p.title);

    let dateEl = document.createElement("div");
    dateEl.className = "font-semibold text-[0.9rem] text-[#1a1a1a]";
    dateEl.textContent = p.creationDate ? new Date(p.creationDate).toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" }) : "";

    let desc = document.createElement("p");
    desc.className = "text-sm text-stone-700";
    desc.textContent = safeText(p.description);

    textGroup.append(h2, dateEl, desc);

    let tagsGroup = document.createElement("div");
    tagsGroup.className = "flex gap-3";
    (p.tags || []).slice(0, 4).forEach(tag => {
      let span = document.createElement("span");
      span.className = "rounded-full px-2 py-0.5 bg-blue-300 text-[0.6rem] text-white";
      span.textContent = safeText(tag);
      tagsGroup.appendChild(span);
    });

    contentWrapper.append(textGroup, tagsGroup);
    article.append(img, contentWrapper);
    list.appendChild(article);
  });

  renderPagination(allPosts.length);
  renderSidebar();
}

function renderPagination(totalItems) {
  const paginationContainer = document.querySelector("#pagination");
  if (!paginationContainer) return;

  const totalPages = Math.ceil(totalItems / postsPerPage);
  paginationContainer.innerHTML = "";

  const nav = document.createElement("nav");
  nav.className = "flex justify-center items-center gap-4 mt-10";

  if (currentPage > 1) {
    nav.appendChild(createPageBtn("← Prev", () => { currentPage--; renderBlog(); }));
  }

  for (let i = 1; i <= totalPages; i++) {
    const btn = createPageBtn(i, () => { currentPage = i; renderBlog(); });
    if (i === currentPage) {
      btn.className = "px-3 py-1 text-sm flex items-center justify-center rounded-lg bg-red-700 text-white text-sm font-semibold";
    }
    nav.appendChild(btn);
  }

  if (currentPage < totalPages) {
    nav.appendChild(createPageBtn("Next →", () => { currentPage++; renderBlog(); }));
  }

  paginationContainer.appendChild(nav);
}

function createPageBtn(label, onClick) {
  const btn = document.createElement("button");
  btn.className = "px-3 py-1 text-sm font-semibold text-stone-500 hover:text-red-700 transition rounded-lg border-[1.5px] border-[#f0ece4] ";
  btn.textContent = label;
  btn.onclick = (e) => {
    e.preventDefault();
    onClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  return btn;
}

function renderSidebar() {
  let archives = $("#archivesList");
  if (archives && Array.isArray(data.archives)) {
    clearElement(archives);
    data.archives.forEach(a => {
      let row = document.createElement("div");
      row.className = "flex items-center justify-between text-[0.7rem] font-semibold text-[#78716c]";
      row.innerHTML = `<span class="py-[0.5vh]">${safeText(a.label)}</span><span>${safeText(a.count)}</span>`;
      archives.appendChild(row);
    });
  }

  var yt = $("#youtubeList");
  if (yt && Array.isArray(data.youtubeVideos)) {
    yt.innerHTML = data.youtubeVideos
      .map(function (v) {
        return (
          '<a class="" href="https://www.youtube.com/watch?v=' +
          safeText(v.id) +
          '" target="_blank" rel="noreferrer">' +
          '<div class="aspect-video">' +
          '<img class="w-full h-full object-cover rounded-lg" alt="" src="https://img.youtube.com/vi/' +
          safeText(v.id) +
          '/hqdefault.jpg">' +
          "</div>" +
          '<div class="p-3 text-sm font-semibold">' +
          safeText(v.title) +
          "</div>" +
          "</a>"
        );
      })
      .join("");
  }
}

function handleSubscribe() {
  const emailInput = document.querySelector("#subscribeEmail");
  const subscribeBtn = document.querySelector("#subscribeBtn");
  if (!emailInput || !subscribeBtn) return;

  const email = emailInput.value.trim();
  if (email === "" || !email.includes("@")) {
    alert("Veuillez entrer une adresse email valide.");
    return;
  }

  subscribeBtn.disabled = true;
  const originalText = subscribeBtn.textContent;
  subscribeBtn.textContent = "You have been subscribed !";

  setTimeout(() => {
    subscribeBtn.disabled = false;
    subscribeBtn.textContent = originalText;
    emailInput.value = "";
  }, 3000);
}

document.addEventListener("DOMContentLoaded", () => {
  renderBlog();
  const btn = document.querySelector("#subscribeBtn");
  if (btn) btn.addEventListener("click", handleSubscribe);
});
