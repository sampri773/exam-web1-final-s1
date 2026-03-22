/**
 * =============================================================================
 * page-home.js — Contenu dynamique pour la page d’accueil (index.html)
 * =============================================================================
 * Les textes et listes viennent de l’objet global `data` (tokimahery.data.js).
 * On construit le HTML avec createElement + textContent (pas innerHTML).
 */

function renderHome() {
  let about1 = $("#aboutPart1");
  let about2 = $("#aboutPart2");
  if (about1) about1.textContent = safeText(data.aboutMe_part1);
  if (about2) about2.textContent = safeText(data.aboutMe_part2);

  let overview = $("#overviewStats");
  if (overview && Array.isArray(data.overview)) {
    clearElement(overview);
    for (let i = 0; i < data.overview.length; i++) {
      let o = data.overview[i];
      let block = document.createElement("div");
      block.className = "text-center";

      let num = document.createElement("div");
      num.className = "text-3xl md:text-4xl font-semibold text-slate-900";
      num.textContent = safeText(o.number);

      let label = document.createElement("div");
      label.className =
        "text-[11px] tracking-widest uppercase text-stone-500 mt-1";
      label.textContent = safeText(o.label);

      block.appendChild(num);
      block.appendChild(label);
      overview.appendChild(block);
    }
  }

  let exp = $("#experienceList");
  if (exp && Array.isArray(data.experiences)) {
    clearElement(exp);
    for (let i = 0; i < data.experiences.length; i++) {
      let e = data.experiences[i];
      let row = document.createElement("div");
      row.className =
        "grid grid-cols-1 md:grid-cols-[180px_1fr] gap-4 py-7 border-t border-stone-200/70";

      let yearCol = document.createElement("div");
      yearCol.className =
        "text-[11px] tracking-widest uppercase text-stone-500";
      yearCol.textContent = safeText(e.year);

      let mainCol = document.createElement("div");

      let role = document.createElement("div");
      role.className = "font-semibold text-slate-900";
      role.textContent = safeText(e.role);

      let org = document.createElement("div");
      org.className = "text-sm text-stone-600";
      org.textContent = safeText(e.org);

      let desc = document.createElement("div");
      desc.className = "text-sm text-stone-600 mt-3 leading-relaxed";
      desc.textContent = safeText(e.desc);

      mainCol.appendChild(role);
      mainCol.appendChild(org);
      mainCol.appendChild(desc);

      row.appendChild(yearCol);
      row.appendChild(mainCol);
      exp.appendChild(row);
    }
  }

  let homeCourses = $("#homeCourses");
  if (homeCourses && Array.isArray(data.homeCourses)) {
    clearElement(homeCourses);
    for (let i = 0; i < data.homeCourses.length; i++) {
      let c = data.homeCourses[i];
      let card = document.createElement("div");
      card.className =
        "rounded-xl bg-white/80 border border-stone-200/70 p-5 shadow-sm";

      let tag = document.createElement("div");
      tag.className =
        "text-[11px] tracking-widest uppercase text-stone-500";
      tag.textContent = safeText(c.tag);

      let title = document.createElement("div");
      title.className = "font-semibold text-slate-900 mt-2";
      title.textContent = safeText(c.title);

      let foot = document.createElement("div");
      foot.className =
        "text-sm text-stone-600 mt-4 flex items-center justify-between";
      let spanMode = document.createElement("span");
      spanMode.textContent = safeText(c.mode);
      let spanDur = document.createElement("span");
      spanDur.textContent = safeText(c.duration);
      foot.appendChild(spanMode);
      foot.appendChild(spanDur);

      card.appendChild(tag);
      card.appendChild(title);
      card.appendChild(foot);
      homeCourses.appendChild(card);
    }
  }

  let teasers = $("#testimonialsTeaser");
  if (teasers && Array.isArray(data.testimonials)) {
    clearElement(teasers);
    let pick = data.testimonials.slice(0, 5);
    for (let i = 0; i < pick.length; i++) {
      let t = pick[i];
      let card = document.createElement("div");
      card.className =
        "rounded-xl bg-white/85 border border-stone-200/70 p-5 shadow-sm";

      let starsRow = document.createElement("div");
      starsRow.className = "text-red-700 text-xs tracking-widest";
      starsRow.textContent = "★".repeat(t.rating || 0);

      let quote = document.createElement("div");
      quote.className = "text-sm text-stone-700 mt-3 leading-relaxed";
      let authorPart = safeText(t.author).split(",")[0] || safeText(t.author);
      quote.textContent = '"' + safeText(t.description) + '"';

      let authorBlock = document.createElement("div");
      authorBlock.className = "flex items-center gap-3 mt-5";

      let img = document.createElement("img");
      img.src = safeText(t.thumbnail);
      img.alt = "";
      img.className =
        "w-9 h-9 rounded-full object-cover border border-stone-200";

      let textWrap = document.createElement("div");
      textWrap.className = "leading-tight";

      let nameEl = document.createElement("div");
      nameEl.className = "text-sm font-semibold text-slate-900";
      nameEl.textContent = authorPart;

      let roleEl = document.createElement("div");
      roleEl.className =
        "text-[11px] tracking-widest uppercase text-stone-500";
      roleEl.textContent = safeText(t.role);

      textWrap.appendChild(nameEl);
      textWrap.appendChild(roleEl);
      authorBlock.appendChild(img);
      authorBlock.appendChild(textWrap);

      card.appendChild(quote);
      card.appendChild(authorBlock);
      teasers.appendChild(card);
      card.appendChild(starsRow);
    }
  }
}
