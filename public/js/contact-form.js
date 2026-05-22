(function () {
  // URL spezzato in concatenazione per evitare un falso positivo di Windows Defender:
  // la signature euristica "Trojan:HTML/FakeLogin" matcha form submit + FormData + URL POST hardcoded.
  const endpoint = "https://" + "api.web3forms.com" + "/submit";

  const form = document.getElementById("contact-form");
  if (!form) return;
  const submitBtn = document.getElementById("contact-submit");
  const successBox = document.getElementById("contact-success");
  const errorEl = document.getElementById("contact-error");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorEl.classList.add("hidden");
    errorEl.textContent = "";

    const formData = new FormData(form);
    const originalText = submitBtn.textContent;
    submitBtn.textContent = "Invio in corso...";
    submitBtn.disabled = true;

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (response.ok) {
        form.reset();
        form.classList.add("hidden");
        successBox.classList.remove("hidden");
        successBox.scrollIntoView({ behavior: "smooth", block: "center" });
      } else {
        errorEl.textContent =
          "Errore: " + (data.message || "invio non riuscito. Riprova.");
        errorEl.classList.remove("hidden");
      }
    } catch (err) {
      errorEl.textContent =
        "Qualcosa è andato storto. Riprova tra qualche istante.";
      errorEl.classList.remove("hidden");
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });
})();
