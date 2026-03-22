/**
 * =============================================================================
 * page-courses.js — Filtres et affichage du catalogue de cours (courses.html)
 * =============================================================================
 * Si l’URL contient ?q=… (recherche globale), le champ « Keywords… » est pré-rempli.
 */

function parseQuery() {
  let url = new URL(location.href);
  return {
    q: url.searchParams.get("q") || "",
  };
}

/**
 * Remplit la liste « Technology » à partir des cours (sans innerHTML sur le conteneur parent).
 */
function fillTechSelect(techSelect) {
  if (!techSelect || !Array.isArray(data.courses)) return;

  let techs = [];
  let techSet = {};
  for (let i = 0; i < data.courses.length; i++) {
    let c = data.courses[i];
    let techList = c.technologies || [];
    for (let j = 0; j < techList.length; j++) {
      let t = techList[j];
      if (t && !techSet[t]) {
        techSet[t] = true;
        techs.push(t);
      }
    }
  }
  techs.sort();

  clearElement(techSelect);
  let optAll = document.createElement("option");
  optAll.value = "";
  optAll.textContent = "All technologies";
  techSelect.appendChild(optAll);
  for (let i = 0; i < techs.length; i++) {
    let opt = document.createElement("option");
    opt.value = techs[i];
    opt.textContent = techs[i];
    techSelect.appendChild(opt);
  }
}

/**
 * Langue choisie par les drapeaux (chaîne vide = toutes les langues).
 */
function getSelectedLang() {
  let active = $(".lang-flag-btn.is-active");
  if (!active) return "";
  return active.getAttribute("data-lang") || "";
}

function setLangFlagActive(langCode) {
  $all(".lang-flag-btn").forEach(function (btn) {
    let code = btn.getAttribute("data-lang");
    let on = langCode && code === langCode;
    btn.classList.toggle("is-active", on);
    btn.classList.toggle("border-red-700", on);
    btn.classList.toggle("ring-2", on);
    btn.classList.toggle("ring-red-700", on);
    btn.setAttribute("aria-pressed", on ? "true" : "false");
  });
}

/**
 * Met à jour le texte rouge « 0 Ar — 85 000 Ar » au-dessus des curseurs.
 */
function updatePriceRangeLabel(priceMinEl, priceMaxEl, labelEl) {
  if (!labelEl) return;
  let a = Number(priceMinEl && priceMinEl.value);
  let b = Number(priceMaxEl && priceMaxEl.value);
  if (!Number.isFinite(a)) a = 0;
  if (!Number.isFinite(b)) b = 0;
  let lo = Math.min(a, b);
  let hi = Math.max(a, b);
  labelEl.textContent = formatCartAr(lo) + " — " + formatCartAr(hi);
}

/**
 * Garde min ≤ max quand on bouge les deux curseurs prix.
 */
function syncPriceSliders(priceMinEl, priceMaxEl) {
  if (!priceMinEl || !priceMaxEl) return;
  let lo = Number(priceMinEl.value);
  let hi = Number(priceMaxEl.value);
  if (lo > hi) {
    priceMaxEl.value = String(lo);
  }
  if (hi < lo) {
    priceMinEl.value = String(hi);
  }
}

/**
 * Teste si un cours passe tous les filtres actifs.
 */
function courseMatches(course, qInput, techSelect, levelSelect, selectedLang, priceMin, priceMax) {
  let q = (qInput && qInput.value ? qInput.value : "").trim().toLowerCase();
  let tech = techSelect && techSelect.value ? techSelect.value : "";
  let level = levelSelect && levelSelect.value ? levelSelect.value : "";

  if (q) {
    let blob = (course.title + " " + course.description).toLowerCase();
    if (blob.indexOf(q) === -1) return false;
  }
  if (tech) {
    if ((course.technologies || []).indexOf(tech) === -1) return false;
  }
  if (selectedLang) {
    if (course.language !== selectedLang) return false;
  }
  if (level) {
    if (course.level !== level) return false;
  }
  let p = Number(course.price);
  if (!Number.isFinite(p)) p = 0;
  if (p < priceMin || p > priceMax) return false;
  return true;
}

function buildCourseCard(c) {
  let root = document.createElement("div");
  root.className =
    "rounded-xl bg-white/90 border border-stone-200/70 shadow-sm overflow-hidden flex flex-col";

  let imgWrap = document.createElement("div");
  imgWrap.className = "relative";

  let img = document.createElement("img");
  img.src = safeText(c.thumbnail);
  img.alt = "";
  img.className = "w-full h-44 object-cover";

  let badges = document.createElement("div");
  badges.className = "absolute top-3 left-3 flex gap-2";

  let bLang = document.createElement("span");
  bLang.className =
    "pill rounded-full px-2.5 py-1 text-[10px] tracking-widest uppercase text-stone-600";
  bLang.textContent = safeText(c.language).toUpperCase();

  let bLevel = document.createElement("span");
  bLevel.className =
    "pill rounded-full px-2.5 py-1 text-[10px] tracking-widest uppercase text-stone-600";
  bLevel.textContent = safeText(c.level);

  badges.appendChild(bLang);
  badges.appendChild(bLevel);
  imgWrap.appendChild(img);
  imgWrap.appendChild(badges);

  let body = document.createElement("div");
  body.className = "p-5 flex-1 flex flex-col";

  let title = document.createElement("div");
  title.className = "font-semibold text-slate-900";
  title.textContent = safeText(c.title);

  let desc = document.createElement("div");
  desc.className =
    "text-sm text-stone-600 mt-2 leading-relaxed max-h-[4.5rem] overflow-hidden";
  desc.textContent = safeText(c.description);

  let price = document.createElement("div");
  price.className = "mt-4 text-sm font-semibold text-slate-900";
  price.textContent = formatMGA(c.price);

  let pills = document.createElement("div");
  pills.className = "mt-4 flex flex-wrap gap-2";
  let techList = (c.technologies || []).slice(0, 3);
  for (let i = 0; i < techList.length; i++) {
    let pill = document.createElement("span");
    pill.className =
      "pill rounded-full px-2.5 py-1 text-[10px] tracking-widest uppercase text-stone-600";
    pill.textContent = safeText(techList[i]);
    pills.appendChild(pill);
  }

  let actions = document.createElement("div");
  actions.className = "mt-5 flex items-center gap-3";

  let learn = document.createElement("a");
  learn.className = "text-sm font-semibold text-red-800 hover:underline";
  learn.href = "#";
  learn.addEventListener("click", function (e) {
    e.preventDefault();
  });
  learn.textContent = "Learn more";

  let btn = document.createElement("button");
  btn.className =
    "ml-auto bg-red-700 hover:bg-red-800 text-white text-sm font-semibold px-4 py-2 rounded-lg";
  btn.setAttribute("data-add", String(c.id));
  btn.textContent = "Add to cart";

  actions.appendChild(learn);
  actions.appendChild(btn);

  body.appendChild(title);
  body.appendChild(desc);
  body.appendChild(price);
  body.appendChild(pills);
  body.appendChild(actions);

  root.appendChild(imgWrap);
  root.appendChild(body);
  return root;
}

function renderCourses() {
  let grid = $("#coursesGrid");
  if (!grid || !Array.isArray(data.courses)) return;

  let qInput = $("#courseSearch");
  let techSelect = $("#techSelect");
  let levelSelect = $("#levelSelect");
  let priceMinEl = $("#priceRangeMin");
  let priceMaxEl = $("#priceRangeMax");
  let priceLabel = $("#priceRangeLabel");
  let clearBtn = $("#filtersClearAll");
  let langFlags = $("#langFlags");

  let query = parseQuery();
  if (qInput && query.q) qInput.value = query.q;

  fillTechSelect(techSelect);

  let maxPrice = 0;
  for (let i = 0; i < data.courses.length; i++) {
    let p = Number(data.courses[i].price) || 0;
    if (p > maxPrice) maxPrice = p;
  }

  if (priceMinEl) {
    priceMinEl.min = "0";
    priceMinEl.max = String(maxPrice);
    priceMinEl.value = "0";
  }
  if (priceMaxEl) {
    priceMaxEl.min = "0";
    priceMaxEl.max = String(maxPrice);
    priceMaxEl.value = String(maxPrice);
  }
  updatePriceRangeLabel(priceMinEl, priceMaxEl, priceLabel);

  function getPriceFilterBounds() {
    let a = Number(priceMinEl && priceMinEl.value);
    let b = Number(priceMaxEl && priceMaxEl.value);
    if (!Number.isFinite(a)) a = 0;
    if (!Number.isFinite(b)) b = maxPrice;
    return {
      lo: Math.min(a, b),
      hi: Math.max(a, b),
    };
  }

  function render() {
    let bounds = getPriceFilterBounds();
    updatePriceRangeLabel(priceMinEl, priceMaxEl, priceLabel);

    clearElement(grid);

    let langSel = getSelectedLang();
    for (let i = 0; i < data.courses.length; i++) {
      let c = data.courses[i];
      if (
        courseMatches(
          c,
          qInput,
          techSelect,
          levelSelect,
          langSel,
          bounds.lo,
          bounds.hi
        )
      ) {
        grid.appendChild(buildCourseCard(c));
      }
    }
  }

  function clearAllFilters() {
    if (qInput) qInput.value = "";
    if (techSelect) techSelect.selectedIndex = 0;
    if (levelSelect) levelSelect.selectedIndex = 0;
    setLangFlagActive("");
    if (priceMinEl) priceMinEl.value = "0";
    if (priceMaxEl) priceMaxEl.value = String(maxPrice);
    updatePriceRangeLabel(priceMinEl, priceMaxEl, priceLabel);
    render();
  }

  if (langFlags) {
    langFlags.addEventListener("click", function (e) {
      let btn = e.target.closest(".lang-flag-btn");
      if (!btn || !langFlags.contains(btn)) return;
      let code = btn.getAttribute("data-lang");
      if (!code) return;
      if (btn.classList.contains("is-active")) {
        setLangFlagActive("");
      } else {
        setLangFlagActive(code);
      }
      render();
    });
  }

  if (priceMinEl) {
    priceMinEl.addEventListener("input", function () {
      let lo = Number(priceMinEl.value);
      let hi = Number(priceMaxEl && priceMaxEl.value);
      if (lo > hi) {
        priceMaxEl.value = priceMinEl.value;
      }
      render();
    });
  }
  if (priceMaxEl) {
    priceMaxEl.addEventListener("input", function () {
      let lo = Number(priceMinEl && priceMinEl.value);
      let hi = Number(priceMaxEl.value);
      if (hi < lo) {
        priceMinEl.value = priceMaxEl.value;
      }
      render();
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener("click", clearAllFilters);
  }

  grid.addEventListener("click", function (e) {
    let btn = e.target.closest("[data-add]");
    if (!btn || !grid.contains(btn)) return;
    let id = Number(btn.getAttribute("data-add"));
    let course = null;
    for (let i = 0; i < data.courses.length; i++) {
      if (data.courses[i].id === id) {
        course = data.courses[i];
        break;
      }
    }
    if (course) addToCart(course);
  });

  let textInputs = [qInput, techSelect, levelSelect];
  for (let i = 0; i < textInputs.length; i++) {
    if (textInputs[i]) textInputs[i].addEventListener("input", render);
  }

  render();
}
