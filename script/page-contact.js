/**
 * =============================================================================
 * page-contact.js — Formulaire de contact / collaboration (contact.html)
 * =============================================================================
 * Ici on intercepte l’envoi du formulaire pour éviter le rechargement de la page
 * et afficher un message de confirmation (démo sans serveur).
 * Pour un vrai envoi par e-mail, il faudrait un backend (PHP, Node, etc.).
 */

function initContactPage() {
  var form = $("#contactForm");
  var feedback = $("#contactFeedback");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var name = $("#contactName") && $("#contactName").value.trim();
    var email = $("#contactEmail") && $("#contactEmail").value.trim();
    var message = $("#contactMessage") && $("#contactMessage").value.trim();

    if (!name || !email || !message) {
      if (feedback) {
        feedback.textContent = "Merci de remplir tous les champs obligatoires.";
        feedback.classList.remove("hidden");
        feedback.classList.add("text-amber-800");
      }
      return;
    }

    if (feedback) {
      feedback.textContent =
        "Merci " +
        name +
        " ! Votre message a bien été enregistré localement (démo). En production, il serait envoyé par e-mail.";
      feedback.classList.remove("hidden", "text-amber-800");
      feedback.classList.add("text-green-800");
    }
    form.reset();
  });
}
