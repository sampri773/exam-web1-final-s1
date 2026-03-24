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
      block.className = "flex flex-col gap-0";

      let num = document.createElement("h3");
      num.className = " text-[#b91c1c] font-bold";
      num.textContent = safeText(o.number);

      let label = document.createElement("p");
      label.className =
        "text-[0.8rem] uppercase text-[#a8a29e] ";
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
        "flex flex-col gap-2 py-5 px-3 border-l-[1.5px] border-[#e5e0d8] hover:border-[#b91c1c] duration-500 ";

      let yearCol = document.createElement("div");
      yearCol.className =
        "text-[0.8rem] text-[#b91c1c] tracking-widest uppercase font-bold";
      yearCol.textContent = safeText(e.year);

      let mainCol = document.createElement("div");

      let role = document.createElement("div");
      role.className = "font-semibold text-[1rem] text-[#1a1a1a] ";
      role.textContent = safeText(e.role);

      let org = document.createElement("div");
      org.className = "text-[#a8a29e] uppercase text-[0.7rem]";
      org.textContent = safeText(e.org);

      let desc = document.createElement("p");
      desc.className = " mt-3 leading-relaxed";
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
        "flex flex-col justify-between items-start gap-5 bg-[#ffffff] rounded-lg px-5 py-5 shadow-[0px_0px_2px_#e5e0d8] relative top-0 hover:top-[-0.5vh] duration-300";

      let tag = document.createElement("div");
      tag.className =
        "text-[0.6rem] text-[#f9f6f1] rounded-3xl bg-[#991b1b] px-2 py-[0.1vh] ";
      tag.textContent = safeText(c.tag);

      let title = document.createElement("h3");
      title.className = "font-bold leading-[1rem] text-[0.9rem] ";
      title.textContent = safeText(c.title);


      let foot = document.createElement("footer");
      foot.className =
        "flex w-full justify-between text-[#a8a29e] text-[0.7rem] border-t-[1.5px] pt-2";
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
