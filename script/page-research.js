/**
 * =============================================================================
 * page-research.js — Liste des publications (research.html)
 * =============================================================================
 */

function renderResearch(papers = []) {
  const container = document.querySelector("#papersList");
  if (!container) return;

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
    const article = document.createElement("article");
    article.className = "rounded-lg border-[1.5px] border-[#f0ece4] px-[2%] py-[3%] relative top-0 hover:top-[-0.5vh] hover:shadow-[0px_5px_10px_#e5e0d8] duration-300 flex flex-col gap-3";

    const metaContainer = document.createElement("div");
    metaContainer.className = "flex justify-between items-center text-[0.6rem] text-[#a8a29e] ";

    const tagsDiv = document.createElement("div");
    tagsDiv.className = "flex flex-wrap gap-2";
    (paper.tags || []).forEach(tag => {
      const span = document.createElement("span");
      span.className = "rounded-3xl p-[1px] px-[0.5vw] bg-[#f9f6f1] ";
      span.textContent = safeText(tag);
      tagsDiv.appendChild(span);
    });
    metaContainer.appendChild(tagsDiv);

    // Date
    const dateStr = paper.publishedDate
      ? new Date(paper.publishedDate).toLocaleDateString("fr-FR", { year: "numeric", month: "long" })
      : "";
    
    const dateSpan = document.createElement("span");
    dateSpan.className = "text-right";
    dateSpan.textContent = safeText(dateStr);
    metaContainer.appendChild(dateSpan);
    
    article.appendChild(metaContainer);

    const h2 = document.createElement("h2");
    h2.className = "";
    h2.textContent = safeText(paper.title || "");
    article.appendChild(h2);

    
    const authorsDiv = document.createElement("div");
    authorsDiv.className = "text-[#a8a29e] text-[0.7rem]";
    authorsDiv.textContent = safeText((paper.authors || []).join(", "));
    article.appendChild(authorsDiv);

    const abstractDiv = document.createElement("p");
    abstractDiv.className = "font-semibold";
    abstractDiv.textContent = safeText(paper.abstract || "");
    article.appendChild(abstractDiv);


    const linkDiv = document.createElement("div");

    const a = document.createElement("a");
    a.className = "underline hover:opacity-50 duration-300 border-t-[1px] border-[#f0ece4] flex pt-3 font-semibold text-[0.8rem] text-[#b91c1c] ";
    a.href = safeText(paper.pdfUrl || paper.url || "#");
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.textContent = "READ PDF ";

    const arrow = document.createElement("span");
    arrow.setAttribute("aria-hidden", "true");
    arrow.textContent = "→";
    a.appendChild(arrow);

    linkDiv.appendChild(a);
    article.appendChild(linkDiv);

    container.appendChild(article);
  });
}
