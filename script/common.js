/**
 * =============================================================================
 * common.js — Code JavaScript PARTAGÉ par toutes les pages du site
 * =============================================================================
 * Ce fichier contient les fonctions utilisées partout : navigation, panier,
 * recherche, menu mobile, etc. Chaque page charge ce fichier en premier,
 * puis un fichier spécifique (par ex. page-home.js) si besoin.
 */

/* -----------------------------------------------------------------------------
 * Petits raccourcis pour sélectionner des éléments dans le HTML (comme en jQuery)
 * $  = le PREMIER élément qui correspond au sélecteur CSS
 * $all = TOUS les éléments qui correspondent
 * ----------------------------------------------------------------------------- */
function $(sel, root) {
  root = root || document;
  return root.querySelector(sel);
}
function $all(sel, root) {
  root = root || document;
  return Array.prototype.slice.call(root.querySelectorAll(sel));
}

/**
 * Formate un prix en Ariary (MGA) pour l’affichage, avec séparateurs français.
 * @param {*} value — nombre ou texte représentant le prix
 */
function formatMGA(value) {
  try {
    var n = Number(value);
    if (Number.isFinite(n)) return "MGA " + n.toLocaleString("fr-FR");
  } catch (e) {}
  return "MGA " + value;
}

/**
 * Convertit une valeur en chaîne sûre pour l’affichage (évite undefined/null).
 */
function safeText(str) {
  return String(str == null ? "" : str);
}

/* =============================================================================
 * PANIER (stocké dans le navigateur avec localStorage)
 * Le panier persiste quand l’utilisateur revient sur le site.
 * ============================================================================= */

/** Lit le panier depuis le stockage local ; renvoie un tableau vide si erreur. */
function getCart() {
  try {
    return JSON.parse(localStorage.getItem("cart") || "[]");
  } catch (e) {
    return [];
  }
}

/** Enregistre le panier et met à jour le badge (petit nombre sur l’icône panier). */
function setCart(items) {
  localStorage.setItem("cart", JSON.stringify(items));
  updateCartBadge();
}

/** Affiche le nombre d’articles sur le badge du panier (desktop + mobile). */
function updateCartBadge() {
  var badge = $("#cartCount");
  var badgeMobile = $("#cartCountMobile");
  if (!badge) return;
  var cart = getCart();
  var count = cart.reduce(function (acc, it) {
    return acc + (it.qty || 0);
  }, 0);
  badge.textContent = String(count);
  badge.classList.toggle("hidden", count <= 0);
  if (badgeMobile) {
    badgeMobile.textContent = String(count);
    badgeMobile.classList.toggle("hidden", count <= 0);
  }
}

/**
 * Ajoute un cours au panier (ou augmente la quantité s’il est déjà présent).
 * @param {Object} course — objet cours avec au moins id, title, price
 */
function addToCart(course) {
  var cart = getCart();
  var existing = cart.find(function (c) {
    return c.id === course.id;
  });
  if (existing) existing.qty += 1;
  else cart.push({ id: course.id, qty: 1, title: course.title, price: course.price });
  setCart(cart);
}

/* =============================================================================
 * NAVIGATION : lien actif (soulignement / aria-current sur la page courante)
 * ============================================================================= */

function setActiveNav() {
  var path = location.pathname.split("/").pop() || "index.html";
  $all("[data-nav]").forEach(function (a) {
    var href = a.getAttribute("href");
    if (href === path) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  });
}

/* =============================================================================
 * MENU MOBILE (bouton hamburger → ouvre/ferme le panneau)
 * ============================================================================= */

function initMobileMenu() {
  var btn = $("#mobileMenuBtn");
  var panel = $("#mobileMenuPanel");
  if (!btn || !panel) return;
  btn.addEventListener("click", function () {
    panel.classList.toggle("hidden");
  });
}

/* =============================================================================
 * RECHERCHE GLOBALE (Entrée dans la barre → redirection vers cours avec ?q=...)
 * ============================================================================= */

function initSearchRedirect() {
  var input = $("#globalSearch");
  if (!input) return;
  input.addEventListener("keydown", function (e) {
    if (e.key !== "Enter") return;
    var q = input.value.trim();
    if (!q) return;
    var url = new URL("courses.html", location.href);
    url.searchParams.set("q", q);
    location.href = url.toString();
  });
}

/**
 * À appicher au chargement de CHAQUE page : navigation, menu, recherche, badge panier.
 * Les pages spécifiques appellent ensuite leur propre fonction (ex. renderHome).
 */
function initCommon() {
  setActiveNav();
  initMobileMenu();
  initSearchRedirect();
  updateCartBadge();
}
