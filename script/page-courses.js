/**
 * =============================================================================
 * page-courses.js — Filtres et affichage du catalogue de cours (courses.html)
 * =============================================================================
 * Lit les paramètres d’URL (?q=...) pour pré-remplir la recherche après redirection
 * depuis la barre de recherche du header.
 */

/** Lit ?q= dans l’URL (chaîne de requête). */
function parseQuery() {
  var url = new URL(location.href);
  return {
    q: url.searchParams.get("q") || "",
  };
}

/** Construit la grille de cours et branche les filtres (recherche, techno, langue…). */
function renderCourses() {
  var grid = $("#coursesGrid");
  if (!grid || !Array.isArray(data.courses)) return;

  var qInput = $("#courseSearch");
  var techSelect = $("#techSelect");
  var langSelect = $("#langSelect");
  var levelSelect = $("#levelSelect");
  var priceRange = $("#priceRange");
  var priceValue = $("#priceValue");

  var query = parseQuery();
  if (qInput && query.q) qInput.value = query.q;

  var techs = [];
  var techSet = {};
  data.courses.forEach(function (c) {
    (c.technologies || []).forEach(function (t) {
      if (t && !techSet[t]) {
        techSet[t] = true;
        techs.push(t);
      }
    });
  });
  techs.sort();
  if (techSelect) {
    techSelect.innerHTML =
      '<option value="">All technology</option>' +
      techs.map(function (t) {
        return '<option value="' + t + '">' + t + "</option>";
      }).join("");
  }

  var langs = [];
  var langSeen = {};
  data.courses.forEach(function (c) {
    if (c.language && !langSeen[c.language]) {
      langSeen[c.language] = true;
      langs.push(c.language);
    }
  });
  langs.sort();
  if (langSelect) {
    langSelect.innerHTML =
      '<option value="">All languages</option>' +
      langs.map(function (l) {
        return '<option value="' + l + '">' + l.toUpperCase() + "</option>";
      }).join("");
  }

  var maxPrice = Math.max.apply(
    null,
    data.courses.map(function (c) {
      return Number(c.price) || 0;
    }).concat([0])
  );
  if (priceRange) {
    priceRange.max = String(maxPrice);
    priceRange.value = String(maxPrice);
  }
  if (priceValue) priceValue.textContent = formatMGA(maxPrice);

  function matches(course) {
    var q = (qInput && qInput.value ? qInput.value : "").trim().toLowerCase();
    var tech = techSelect && techSelect.value ? techSelect.value : "";
    var lang = langSelect && langSelect.value ? langSelect.value : "";
    var level = levelSelect && levelSelect.value ? levelSelect.value : "";
    var maxP = Number((priceRange && priceRange.value) || maxPrice);

    if (q) {
      var blob = (course.title + " " + course.description).toLowerCase();
      if (blob.indexOf(q) === -1) return false;
    }
    if (tech) {
      if ((course.technologies || []).indexOf(tech) === -1) return false;
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
    var maxP = Number((priceRange && priceRange.value) || maxPrice);
    if (priceValue) priceValue.textContent = formatMGA(maxP);

    var filtered = data.courses.filter(matches);
    grid.innerHTML = filtered
      .map(function (c) {
        var techPills = (c.technologies || [])
          .slice(0, 3)
          .map(function (t) {
            return (
              '<span class="pill rounded-full px-2.5 py-1 text-[10px] tracking-widest uppercase text-stone-600">' +
              safeText(t) +
              "</span>"
            );
          })
          .join("");
        return (
          '<div class="rounded-xl bg-white/90 border border-stone-200/70 shadow-sm overflow-hidden flex flex-col">' +
          '<div class="relative">' +
          '<img src="' +
          safeText(c.thumbnail) +
          '" alt="" class="w-full h-44 object-cover">' +
          '<div class="absolute top-3 left-3 flex gap-2">' +
          '<span class="pill rounded-full px-2.5 py-1 text-[10px] tracking-widest uppercase text-stone-600">' +
          safeText(c.language).toUpperCase() +
          "</span>" +
          '<span class="pill rounded-full px-2.5 py-1 text-[10px] tracking-widest uppercase text-stone-600">' +
          safeText(c.level) +
          "</span>" +
          "</div>" +
          "</div>" +
          '<div class="p-5 flex-1 flex flex-col">' +
          '<div class="font-semibold text-slate-900">' +
          safeText(c.title) +
          "</div>" +
          '<div class="text-sm text-stone-600 mt-2 leading-relaxed max-h-[4.5rem] overflow-hidden">' +
          safeText(c.description) +
          "</div>" +
          '<div class="mt-4 text-sm font-semibold text-slate-900">' +
          formatMGA(c.price) +
          "</div>" +
          '<div class="mt-4 flex flex-wrap gap-2">' +
          techPills +
          "</div>" +
          '<div class="mt-5 flex items-center gap-3">' +
          '<a class="text-sm font-semibold text-red-800 hover:underline" href="#" onclick="return false;">Learn more</a>' +
          '<button class="ml-auto bg-red-700 hover:bg-red-800 text-white text-sm font-semibold px-4 py-2 rounded-lg" data-add="' +
          c.id +
          '">Add to cart</button>' +
          "</div>" +
          "</div>" +
          "</div>"
        );
      })
      .join("");

    $all("[data-add]", grid).forEach(function (btn) {
      btn.addEventListener("click", function () {
        var id = Number(btn.getAttribute("data-add"));
        var course = data.courses.find(function (x) {
          return x.id === id;
        });
        if (course) addToCart(course);
      });
    });
  }

  [qInput, techSelect, langSelect, levelSelect].filter(Boolean).forEach(function (el) {
    el.addEventListener("input", render);
  });
  if (priceRange) priceRange.addEventListener("input", render);
  render();
}
