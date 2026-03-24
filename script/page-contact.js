function initContactPage() {
  let form = $("#contactForm");
  let feedback = $("#contactFeedback");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    let name = $("#contactName") && $("#contactName").value.trim();
    let email = $("#contactEmail") && $("#contactEmail").value.trim();
    let message = $("#contactMessage") && $("#contactMessage").value.trim();

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
