/**
 * =============================================================================
 * page-research.js — Liste des publications (research.html)
 * =============================================================================
 */

function renderResearch(papers = []) {
  const container = document.querySelector("#papersList");
  if (!container) return;

  // Vider le conteneur proprement
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }

  if (!Array.isArray(papers) || papers.length === 0) {
    const p = document.createElement("p");
    p.className = "text-center text-stone-500 py-10";
    p.textContent = "Aucune publication disponible.";
    container.appendChild(p);
    return;
  }

  papers.forEach(paper => {
    // Article principal
    const article = document.createElement("article");
    article.className = "py-10 border-t border-stone-200/70";

    // Ligne metadata (journal • date)
    const metaDiv = document.createElement("div");
    metaDiv.className = "flex flex-wrap items-center gap-3 text-[11px] tracking-widest uppercase text-stone-500";

    if (paper.journal) {
      const journalSpan = document.createElement("span");
      journalSpan.textContent = safeText(paper.journal);
      metaDiv.appendChild(journalSpan);
    }

    const dateStr = paper.publishedDate
      ? new Date(paper.publishedDate).toLocaleDateString("fr-FR", { year: "numeric", month: "long" })
      : "";

    if (dateStr && paper.journal) {
      const sep = document.createElement("span");
      sep.className = "opacity-40";
      sep.textContent = "•";
      metaDiv.appendChild(sep);
    }

    if (dateStr) {
      const dateSpan = document.createElement("span");
      dateSpan.textContent = safeText(dateStr);
      metaDiv.appendChild(dateSpan);
    }

    article.appendChild(metaDiv);

    // Titre
    const h2 = document.createElement("h2");
    h2.className = "mt-3 text-2xl md:text-3xl font-semibold font-serif text-slate-900";
    h2.textContent = safeText(paper.title || "");
    article.appendChild(h2);

    // Abstract
    const abstractDiv = document.createElement("div");
    abstractDiv.className = "mt-4 text-sm text-stone-700 leading-relaxed";
    abstractDiv.textContent = safeText(paper.abstract || "");
    article.appendChild(abstractDiv);

    // Auteurs
    const authorsDiv = document.createElement("div");
    authorsDiv.className = "mt-5 text-sm text-stone-600";

    const authorsStrong = document.createElement("span");
    authorsStrong.className = "font-semibold text-slate-900";
    authorsStrong.textContent = "Auteurs : ";
    authorsDiv.appendChild(authorsStrong);

    const authorsText = document.createTextNode(safeText((paper.authors || []).join(", ")));
    authorsDiv.appendChild(authorsText);

    article.appendChild(authorsDiv);

    // Tags
    const tagsDiv = document.createElement("div");
    tagsDiv.className = "mt-6 flex flex-wrap gap-2";

    (paper.tags || []).forEach(tag => {
      const span = document.createElement("span");
      span.className = "pill rounded-full px-3 py-1 text-[11px] tracking-widest uppercase text-stone-600";
      span.textContent = safeText(tag);
      tagsDiv.appendChild(span);
    });

    article.appendChild(tagsDiv);

    // Lien PDF
    const linkDiv = document.createElement("div");
    linkDiv.className = "mt-6";

    const a = document.createElement("a");
    a.className = "inline-flex items-center gap-2 text-red-800 font-semibold text-sm tracking-wide hover:underline";
    a.href = safeText(paper.pdfUrl || paper.url || "#");
    a.target = "_blank";
    a.rel = "noopener noreferrer";

    a.textContent = "LIRE LE PDF ";

    const arrow = document.createElement("span");
    arrow.setAttribute("aria-hidden", "true");
    arrow.textContent = "→";
    a.appendChild(arrow);

    linkDiv.appendChild(a);
    article.appendChild(linkDiv);

    // Ajout final de l'article au conteneur
    container.appendChild(article);
  });
}