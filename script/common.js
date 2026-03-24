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
    let n = Number(value);
    if (Number.isFinite(n)) return "MGA " + n.toLocaleString("fr-FR");
  } catch (e) {}
  return "MGA " + value;
}

function formatCartAr(value) {
  let n = Number(value);
  if (!Number.isFinite(n)) return "0 Ar";
  return n.toLocaleString("fr-FR") + " Ar";
}

function truncateCartTitle(title, maxLen) {
  let s = safeText(title);
  if (s.length <= maxLen) return s;
  return s.slice(0, maxLen - 1) + "\u2026";
}


function safeText(str) {
  return String(str == null ? "" : str);
}


function clearElement(el) {
  while (el.firstChild) {
    el.removeChild(el.firstChild);
  }
}

function getCart() {
  try {
    return JSON.parse(localStorage.getItem("cart") || "[]");
  } catch (e) {
    return [];
  }
}

function setCart(items) {
  localStorage.setItem("cart", JSON.stringify(items));
  updateCartBadge();
  refreshCartModal();
}

function removeCartItem(courseId) {
  let cart = getCart().filter(function (c) {
    return c.id !== courseId;
  });
  setCart(cart);
}

function updateCartBadge() {
  let badge = $("#cartCount");
  let badgeMobile = $("#cartCountMobile");
  if (!badge) return;
  let cart = getCart();
  let count = cart.reduce(function (acc, it) {
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
  let cart = getCart();
  let existing = cart.find(function (c) {
    return c.id === course.id;
  });
  if (existing) existing.qty += 1;
  else cart.push({ id: course.id, qty: 1, title: course.title, price: course.price });
  setCart(cart);
}

function setCartOpenExpanded(isOpen) {
  $all("[data-cart-open]").forEach(function (btn) {
    btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });
}

function ensureCartModal() {
  if ($("#cartModalOverlay")) return;

  let overlay = document.createElement("div");
  overlay.id = "cartModalOverlay";
  overlay.className = "cart-modal-overlay hidden";
  overlay.setAttribute("aria-hidden", "true");

  overlay.addEventListener("click", function (e) {
    if (e.target === overlay) closeCartModal();
  });

  let panel = document.createElement("div");
  panel.className = "cart-modal-panel";
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-modal", "true");
  panel.setAttribute("aria-labelledby", "cartModalTitle");

  let header = document.createElement("div");
  header.className = "cart-modal-header";

  let h2 = document.createElement("h2");
  h2.id = "cartModalTitle";
  h2.className = "cart-modal-title";
  h2.textContent = "Your cart";

  let closeBtn = document.createElement("button");
  closeBtn.type = "button";
  closeBtn.className = "cart-modal-close";
  closeBtn.setAttribute("aria-label", "Close cart");
  closeBtn.textContent = "\u00D7";
  closeBtn.addEventListener("click", closeCartModal);

  header.appendChild(h2);
  header.appendChild(closeBtn);

  let body = document.createElement("div");
  body.id = "cartModalItems";
  body.className = "cart-modal-body";

  body.addEventListener("click", function (e) {
    let btn = e.target.closest("[data-remove-id]");
    if (!btn) return;
    let id = Number(btn.getAttribute("data-remove-id"));
    if (Number.isFinite(id)) removeCartItem(id);
  });

  let footer = document.createElement("div");
  footer.className = "cart-modal-footer";

  let totalRow = document.createElement("div");
  totalRow.className = "cart-modal-total-row";

  let totalLabel = document.createElement("span");
  totalLabel.textContent = "TOTAL";

  let totalAmount = document.createElement("span");
  totalAmount.id = "cartModalTotal";
  totalAmount.className = "cart-modal-total-amount";

  totalRow.appendChild(totalLabel);
  totalRow.appendChild(totalAmount);

  let confirmBtn = document.createElement("button");
  confirmBtn.type = "button";
  confirmBtn.id = "cartModalConfirm";
  confirmBtn.className = "cart-modal-confirm";
  confirmBtn.textContent = "CONFIRM ORDER";
  confirmBtn.addEventListener("click", confirmCartOrder);

  footer.appendChild(totalRow);
  footer.appendChild(confirmBtn);

  panel.appendChild(header);
  panel.appendChild(body);
  panel.appendChild(footer);

  overlay.appendChild(panel);
  document.body.appendChild(overlay);
}

function ensureOrderToast() {
  if ($("#orderToast")) return;

  let toast = document.createElement("div");
  toast.id = "orderToast";
  toast.className = "order-toast hidden";
  toast.setAttribute("role", "status");
  toast.setAttribute("aria-live", "polite");

  let icon = document.createElement("span");
  icon.className = "order-toast-icon";
  icon.setAttribute("aria-hidden", "true");
  icon.textContent = "\uD83C\uDF89";

  let wrap = document.createElement("div");
  wrap.className = "order-toast-text";

  let strong = document.createElement("strong");
  strong.textContent = "Thank you so much for buying our course!";

  let span = document.createElement("span");
  span.textContent =
    "We'll be in touch shortly with all the details. Welcome aboard!";

  wrap.appendChild(strong);
  wrap.appendChild(span);

  let closeT = document.createElement("button");
  closeT.type = "button";
  closeT.className = "order-toast-close";
  closeT.setAttribute("aria-label", "Close notification");
  closeT.textContent = "\u00D7";
  closeT.addEventListener("click", function () {
    toast.classList.add("hidden");
  });

  toast.appendChild(icon);
  toast.appendChild(wrap);
  toast.appendChild(closeT);
  document.body.appendChild(toast);
}

function refreshCartModal() {
  ensureCartModal();

  let body = $("#cartModalItems");
  let totalEl = $("#cartModalTotal");
  let confirmBtn = $("#cartModalConfirm");
  if (!body || !totalEl || !confirmBtn) return;

  let cart = getCart();
  clearElement(body);

  let sum = 0;
  for (let i = 0; i < cart.length; i++) {
    let it = cart[i];
    let qty = it.qty || 1;
    let price = Number(it.price) || 0;
    sum += price * qty;
  }

  totalEl.textContent = formatCartAr(sum);

  if (cart.length === 0) {
    let p = document.createElement("p");
    p.className = "cart-modal-empty";
    p.textContent = "Your cart is empty.";
    body.appendChild(p);
    confirmBtn.disabled = true;
    return;
  }

  confirmBtn.disabled = false;

  for (let j = 0; j < cart.length; j++) {
    let it = cart[j];
    let qty = it.qty || 1;
    let price = Number(it.price) || 0;
    let lineTotal = price * qty;

    let row = document.createElement("div");
    row.className = "cart-line";

    let title = document.createElement("div");
    title.className = "cart-line-title";
    title.textContent = truncateCartTitle(it.title, 42);

    let priceEl = document.createElement("div");
    priceEl.className = "cart-line-price";
    priceEl.textContent = formatCartAr(lineTotal);

    let rm = document.createElement("button");
    rm.type = "button";
    rm.className = "cart-line-remove";
    rm.setAttribute("data-remove-id", String(it.id));
    rm.setAttribute("aria-label", "Remove from cart");
    let rmIcon = document.createElement("i");
    rmIcon.className = "fa-solid fa-trash-can";
    rmIcon.setAttribute("aria-hidden", "true");
    rm.appendChild(rmIcon);

    row.appendChild(title);
    row.appendChild(priceEl);
    row.appendChild(rm);
    body.appendChild(row);
  }
}

function openCartModal() {
  ensureCartModal();
  ensureOrderToast();
  let o = $("#cartModalOverlay");
  if (!o) return;
  refreshCartModal();
  o.classList.remove("hidden");
  o.setAttribute("aria-hidden", "false");
  setCartOpenExpanded(true);
  document.body.style.overflow = "hidden";
}

function closeCartModal() {
  let o = $("#cartModalOverlay");
  if (!o) return;
  o.classList.add("hidden");
  o.setAttribute("aria-hidden", "true");
  setCartOpenExpanded(false);
  document.body.style.overflow = "";
}

function confirmCartOrder() {
  let cart = getCart();
  if (cart.length === 0) return;
  setCart([]);
  closeCartModal();
  showOrderToast();
}

function showOrderToast() {
  ensureOrderToast();
  let t = $("#orderToast");
  if (!t) return;
  t.classList.remove("hidden");
  window.clearTimeout(window.orderToastTimer);
  window.orderToastTimer = window.setTimeout(function () {
    t.classList.add("hidden");
  }, 8000);
}

function initCartModalAndToast() {
  $all("[data-cart-open]").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      openCartModal();
    });
  });

  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    let o = $("#cartModalOverlay");
    if (!o || o.classList.contains("hidden")) return;
    closeCartModal();
  });
}


function setActiveNav() {
  let path = location.pathname.split("/").pop() || "index.html";
  $all("[data-nav]").forEach(function (a) {
    let href = a.getAttribute("href");
    if (href === path) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  });
}


function initMobileMenu() {
  let btn = $("#mobileMenuBtn");
  let panel = $("#mobileMenuPanel");
  if (!btn || !panel) return;
  btn.addEventListener("click", function () {
    panel.classList.toggle("hidden");
  });
}


function initSearchRedirect() {
  let input = $("#globalSearch");
  if (!input) return;
  input.addEventListener("keydown", function (e) {
    if (e.key !== "Enter") return;
    let q = input.value.trim();
    if (!q) return;
    let url = new URL("courses.html", location.href);
    url.searchParams.set("q", q);
    location.href = url.toString();
  });
}

function initCommon() {
  setActiveNav();
  initMobileMenu();
  initSearchRedirect();
  updateCartBadge();
  initCartModalAndToast();
}
