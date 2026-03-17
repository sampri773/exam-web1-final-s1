/* global data */

const SITE = {
  pages: [
    { href: "index.html", label: "HOME", key: "home" },
    { href: "blog.html", label: "BLOG", key: "blog" },
    { href: "courses.html", label: "COURSES", key: "courses" },
    { href: "testimonials.html", label: "TESTIMONIALS", key: "testimonials" },
    { href: "research.html", label: "RESEARCH", key: "research" },
  ],
};

function $(sel, root = document) {
  return root.querySelector(sel);
}
function $all(sel, root = document) {
  return [...root.querySelectorAll(sel)];
}

function formatMGA(value) {
  try {
    const n = Number(value);
    if (Number.isFinite(n)) return `MGA ${n.toLocaleString("fr-FR")}`;
  } catch (_) {}
  return `MGA ${value}`;
}

function safeText(str) {
  return String(str ?? "");
}

function getCart() {
  try {
    return JSON.parse(localStorage.getItem("cart") || "[]");
  } catch (_) {
    return [];
  }
}
function setCart(items) {
  localStorage.setItem("cart", JSON.stringify(items));
  updateCartBadge();
}
function updateCartBadge() {
  const badge = $("#cartCount");
  const badgeMobile = $("#cartCountMobile");
  if (!badge) return;
  const count = getCart().reduce((acc, it) => acc + (it.qty || 0), 0);
  badge.textContent = String(count);
  badge.classList.toggle("hidden", count <= 0);
  if (badgeMobile) {
    badgeMobile.textContent = String(count);
    badgeMobile.classList.toggle("hidden", count <= 0);
  }
}

function addToCart(course) {
  const cart = getCart();
  const existing = cart.find((c) => c.id === course.id);
  if (existing) existing.qty += 1;
  else cart.push({ id: course.id, qty: 1, title: course.title, price: course.price });
  setCart(cart);
}

function setActiveNav() {
  const path = location.pathname.split("/").pop() || "index.html";
  $all("[data-nav]").forEach((a) => {
    const href = a.getAttribute("href");
    if (href === path) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  });
}

function initMobileMenu() {
  const btn = $("#mobileMenuBtn");
  const panel = $("#mobileMenuPanel");
  if (!btn || !panel) return;
  btn.addEventListener("click", () => {
    panel.classList.toggle("hidden");
  });
}

function initSearchRedirect() {
  const input = $("#globalSearch");
  if (!input) return;
  input.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;
    const q = input.value.trim();
    if (!q) return;
    const url = new URL("courses.html", location.href);
    url.searchParams.set("q", q);
    location.href = url.toString();
  });
}

function renderHome() {
  const about1 = $("#aboutPart1");
  const about2 = $("#aboutPart2");
  if (about1) about1.textContent = safeText(data.aboutMe_part1);
  if (about2) about2.textContent = safeText(data.aboutMe_part2);

  const overview = $("#overviewStats");
  if (overview && Array.isArray(data.overview)) {
    overview.innerHTML = data.overview
      .map(
        (o) => `
        <div class="text-center">
          <div class="text-3xl md:text-4xl font-semibold text-slate-900">${safeText(o.number)}</div>
          <div class="text-[11px] tracking-widest uppercase text-stone-500 mt-1">${safeText(o.label)}</div>
        </div>`
      )
      .join("");
  }

  const exp = $("#experienceList");
  if (exp && Array.isArray(data.experiences)) {
    exp.innerHTML = data.experiences
      .map(
        (e) => `
      <div class="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-4 py-7 border-t border-stone-200/70">
        <div class="text-[11px] tracking-widest uppercase text-stone-500">${safeText(e.year)}</div>
        <div>
          <div class="font-semibold text-slate-900">${safeText(e.role)}</div>
          <div class="text-sm text-stone-600">${safeText(e.org)}</div>
          <div class="text-sm text-stone-600 mt-3 leading-relaxed">${safeText(e.desc)}</div>
        </div>
      </div>`
      )
      .join("");
  }

  const homeCourses = $("#homeCourses");
  if (homeCourses && Array.isArray(data.homeCourses)) {
    homeCourses.innerHTML = data.homeCourses
      .map(
        (c) => `
      <div class="rounded-xl bg-white/80 border border-stone-200/70 p-5 shadow-sm">
        <div class="text-[11px] tracking-widest uppercase text-stone-500">${safeText(c.tag)}</div>
        <div class="font-semibold text-slate-900 mt-2">${safeText(c.title)}</div>
        <div class="text-sm text-stone-600 mt-4 flex items-center justify-between">
          <span>${safeText(c.mode)}</span>
          <span>${safeText(c.duration)}</span>
        </div>
      </div>`
      )
      .join("");
  }

  const teasers = $("#testimonialsTeaser");
  if (teasers && Array.isArray(data.testimonials)) {
    const pick = data.testimonials.slice(0, 5);
    teasers.innerHTML = pick
      .map(
        (t) => `
        <div class="rounded-xl bg-white/85 border border-stone-200/70 p-5 shadow-sm">
          <div class="text-red-700 text-xs tracking-widest">${"★".repeat(t.rating || 0)}</div>
          <div class="text-sm text-stone-700 mt-3 leading-relaxed">"${safeText(t.description)}"</div>
          <div class="flex items-center gap-3 mt-5">
            <img src="${safeText(t.thumbnail)}" alt="" class="w-9 h-9 rounded-full object-cover border border-stone-200">
            <div class="leading-tight">
              <div class="text-sm font-semibold text-slate-900">${safeText(t.author.split(",")[0] || t.author)}</div>
              <div class="text-[11px] tracking-widest uppercase text-stone-500">${safeText(t.role)}</div>
            </div>
          </div>
        </div>`
      )
      .join("");
  }
}

function renderTestimonials() {
  const grid = $("#testimonialsGrid");
  if (!grid || !Array.isArray(data.testimonials)) return;
  grid.innerHTML = data.testimonials
    .map(
      (t) => `
      <div class="rounded-xl bg-white/85 border border-stone-200/70 p-6 shadow-sm">
        <div class="flex items-start justify-between gap-4">
          <div class="text-red-700 text-xs tracking-widest">${"★".repeat(t.rating || 0)}</div>
          <div class="text-[11px] tracking-widest uppercase text-stone-500">${safeText(t.role)}</div>
        </div>
        <div class="text-sm text-stone-700 mt-4 leading-relaxed">"${safeText(t.description)}"</div>
        <div class="flex items-center gap-3 mt-6">
          <img src="${safeText(t.thumbnail)}" alt="" class="w-10 h-10 rounded-full object-cover border border-stone-200">
          <div class="leading-tight">
            <div class="text-sm font-semibold text-slate-900">${safeText(t.author)}</div>
          </div>
        </div>
      </div>`
    )
    .join("");
}

function renderResearch() {
  const list = $("#papersList");
  if (!list || !Array.isArray(data.papers)) return;
  list.innerHTML = data.papers
    .map((p) => {
      const date = p.publishedDate ? new Date(p.publishedDate).toLocaleDateString("fr-FR", { year: "numeric", month: "long" }) : "";
      const tags = (p.tags || []).map((t) => `<span class="pill rounded-full px-3 py-1 text-[11px] tracking-widest uppercase text-stone-600">${safeText(t)}</span>`).join("");
      const authors = (p.authors || []).join(", ");
      return `
      <article class="py-10 border-t border-stone-200/70">
        <div class="flex flex-wrap items-center gap-3 text-[11px] tracking-widest uppercase text-stone-500">
          <span>${safeText(p.journal)}</span>
          <span class="opacity-40">•</span>
          <span>${safeText(date)}</span>
        </div>
        <h2 class="mt-3 text-2xl md:text-3xl font-semibold font-serif text-slate-900">${safeText(p.title)}</h2>
        <div class="mt-4 text-sm text-stone-700 leading-relaxed">${safeText(p.abstract)}</div>
        <div class="mt-5 text-sm text-stone-600"><span class="font-semibold text-slate-900">Authors:</span> ${safeText(authors)}</div>
        <div class="mt-6 flex flex-wrap gap-2">${tags}</div>
        <div class="mt-6">
          <a class="inline-flex items-center gap-2 text-red-800 font-semibold text-sm tracking-wide hover:underline" href="${safeText(p.pdfUrl || p.url)}" target="_blank" rel="noreferrer">READ PDF <span aria-hidden="true">→</span></a>
        </div>
      </article>`;
    })
    .join("");
}

function renderBlog() {
  const list = $("#postsList");
  if (list && Array.isArray(data.posts)) {
    const posts = [...data.posts].sort((a, b) => new Date(b.creationDate) - new Date(a.creationDate));
    list.innerHTML = posts
      .map((p) => {
        const date = p.creationDate ? new Date(p.creationDate).toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" }) : "";
        const tags = (p.tags || []).slice(0, 4).map((t) => `<span class="pill rounded-full px-3 py-1 text-[10px] tracking-widest uppercase text-stone-600">${safeText(t)}</span>`).join("");
        return `
        <article class="rounded-xl bg-white/85 border border-stone-200/70 shadow-sm overflow-hidden">
          <div class="grid grid-cols-1 md:grid-cols-[220px_1fr]">
            <img src="${safeText(p.thumbnail)}" alt="" class="w-full h-44 md:h-full object-cover">
            <div class="p-6">
              <div class="text-[11px] tracking-widest uppercase text-stone-500">${safeText(date)}</div>
              <h2 class="mt-2 text-xl md:text-2xl font-semibold font-serif text-slate-900">${safeText(p.title)}</h2>
              <div class="mt-3 text-sm text-stone-700 leading-relaxed">${safeText(p.description)}</div>
              <div class="mt-5 flex flex-wrap gap-2">${tags}</div>
            </div>
          </div>
        </article>`;
      })
      .join("");
  }

  const archives = $("#archivesList");
  if (archives && Array.isArray(data.archives)) {
    archives.innerHTML = data.archives
      .map(
        (a) => `
        <div class="flex items-center justify-between text-sm py-2">
          <span class="text-stone-700">${safeText(a.label)}</span>
          <span class="text-stone-500">${safeText(a.count)}</span>
        </div>`
      )
      .join("");
  }

  const yt = $("#youtubeList");
  if (yt && Array.isArray(data.youtubeVideos)) {
    yt.innerHTML = data.youtubeVideos
      .map(
        (v) => `
        <a class="block rounded-lg overflow-hidden border border-stone-200/70 bg-white/80 hover:shadow-sm transition" href="https://www.youtube.com/watch?v=${safeText(v.id)}" target="_blank" rel="noreferrer">
          <div class="aspect-video bg-stone-100">
            <img class="w-full h-full object-cover" alt="" src="https://img.youtube.com/vi/${safeText(v.id)}/hqdefault.jpg">
          </div>
          <div class="p-3 text-sm font-semibold text-slate-900">${safeText(v.title)}</div>
        </a>`
      )
      .join("");
  }
}

function parseQuery() {
  const url = new URL(location.href);
  return {
    q: url.searchParams.get("q") || "",
  };
}

function renderCourses() {
  const grid = $("#coursesGrid");
  if (!grid || !Array.isArray(data.courses)) return;

  const qInput = $("#courseSearch");
  const techSelect = $("#techSelect");
  const langSelect = $("#langSelect");
  const levelSelect = $("#levelSelect");
  const priceRange = $("#priceRange");
  const priceValue = $("#priceValue");

  const query = parseQuery();
  if (qInput && query.q) qInput.value = query.q;

  const techs = [...new Set(data.courses.flatMap((c) => c.technologies || []).filter(Boolean))].sort();
  if (techSelect) {
    techSelect.innerHTML = `<option value="">All technology</option>` + techs.map((t) => `<option value="${t}">${t}</option>`).join("");
  }
  const langs = [...new Set(data.courses.map((c) => c.language).filter(Boolean))].sort();
  if (langSelect) {
    langSelect.innerHTML = `<option value="">All languages</option>` + langs.map((l) => `<option value="${l}">${l.toUpperCase()}</option>`).join("");
  }

  const maxPrice = Math.max(...data.courses.map((c) => Number(c.price) || 0), 0);
  if (priceRange) {
    priceRange.max = String(maxPrice);
    priceRange.value = String(maxPrice);
  }
  if (priceValue) priceValue.textContent = formatMGA(maxPrice);

  function matches(course) {
    const q = (qInput?.value || "").trim().toLowerCase();
    const tech = techSelect?.value || "";
    const lang = langSelect?.value || "";
    const level = levelSelect?.value || "";
    const maxP = Number(priceRange?.value || maxPrice);

    if (q) {
      const blob = `${course.title} ${course.description}`.toLowerCase();
      if (!blob.includes(q)) return false;
    }
    if (tech) {
      if (!(course.technologies || []).includes(tech)) return false;
    }
    if (lang) {
      if (course.language !== lang) return false;
    }
    if (level) {
      if (course.level !== level) return false;
    }
    if (Number(course.price) > maxP) return false;
    return true;
  }

  function render() {
    const maxP = Number(priceRange?.value || maxPrice);
    if (priceValue) priceValue.textContent = formatMGA(maxP);

    const filtered = data.courses.filter(matches);
    grid.innerHTML = filtered
      .map((c) => {
        const techPills = (c.technologies || []).slice(0, 3).map((t) => `<span class="pill rounded-full px-2.5 py-1 text-[10px] tracking-widest uppercase text-stone-600">${safeText(t)}</span>`).join("");
        return `
        <div class="rounded-xl bg-white/90 border border-stone-200/70 shadow-sm overflow-hidden flex flex-col">
          <div class="relative">
            <img src="${safeText(c.thumbnail)}" alt="" class="w-full h-44 object-cover">
            <div class="absolute top-3 left-3 flex gap-2">
              <span class="pill rounded-full px-2.5 py-1 text-[10px] tracking-widest uppercase text-stone-600">${safeText(c.language).toUpperCase()}</span>
              <span class="pill rounded-full px-2.5 py-1 text-[10px] tracking-widest uppercase text-stone-600">${safeText(c.level)}</span>
            </div>
          </div>
          <div class="p-5 flex-1 flex flex-col">
            <div class="font-semibold text-slate-900">${safeText(c.title)}</div>
            <div class="text-sm text-stone-600 mt-2 leading-relaxed max-h-[4.5rem] overflow-hidden">${safeText(c.description)}</div>
            <div class="mt-4 text-sm font-semibold text-slate-900">${formatMGA(c.price)}</div>
            <div class="mt-4 flex flex-wrap gap-2">${techPills}</div>
            <div class="mt-5 flex items-center gap-3">
              <a class="text-sm font-semibold text-red-800 hover:underline" href="#" onclick="return false;">Learn more</a>
              <button class="ml-auto bg-red-700 hover:bg-red-800 text-white text-sm font-semibold px-4 py-2 rounded-lg" data-add="${c.id}">Add to cart</button>
            </div>
          </div>
        </div>`;
      })
      .join("");

    $all("[data-add]", grid).forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = Number(btn.getAttribute("data-add"));
        const course = data.courses.find((x) => x.id === id);
        if (course) addToCart(course);
      });
    });
  }

  [qInput, techSelect, langSelect, levelSelect].filter(Boolean).forEach((el) => el.addEventListener("input", render));
  if (priceRange) priceRange.addEventListener("input", render);
  render();
}

function init() {
  setActiveNav();
  initMobileMenu();
  initSearchRedirect();
  updateCartBadge();

  const page = document.body.getAttribute("data-page");
  if (page === "home") renderHome();
  if (page === "blog") renderBlog();
  if (page === "courses") renderCourses();
  if (page === "testimonials") renderTestimonials();
  if (page === "research") renderResearch();
}

document.addEventListener("DOMContentLoaded", init);

