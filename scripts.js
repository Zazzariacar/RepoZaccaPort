// scripts.js
// Interazioni leggere: smooth scroll, anno dinamico, lightbox accessibile per i progetti.

document.addEventListener("DOMContentLoaded", () => {
  // Smooth scroll per nav e CTA
  const smoothLinks = Array.from(document.querySelectorAll('a[href^="#"]'));
  smoothLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (href.length > 1 && document.querySelector(href)) {
        e.preventDefault();
        document.querySelector(href).scrollIntoView({ behavior: "smooth", block: "start" });
        history.replaceState(null, "", href);
      }
    });
  });

  // Anno dinamico nel footer
  const footerSmall = document.querySelector(".site-footer small");
  if (footerSmall) {
    const year = new Date().getFullYear();
    footerSmall.textContent = `© ${year} Nome Cognome. Tutti i diritti riservati.`;
  }

  // Lightbox / modal per i project-card
  function createModal() {
    const modal = document.createElement("div");
    modal.className = "project-modal";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.style.cssText = [
      "position:fixed","inset:0","display:flex","align-items:center","justify-content:center",
      "background:rgba(2,8,18,0.6)","padding:1rem","z-index:9999"
    ].join(";");
    modal.innerHTML = `
      <div class="project-modal-inner" style="max-width:900px;width:100%;background:var(--card);padding:1rem;border-radius:12px;box-shadow:0 10px 40px rgba(2,8,18,0.7);color:var(--text);">
        <button class="project-modal-close" aria-label="Chiudi" style="float:right;background:transparent;border:0;color:var(--muted);font-size:1.25rem;cursor:pointer">✕</button>
        <div class="project-modal-body" style="clear:both;display:grid;grid-template-columns:1fr;gap:1rem">
          <!-- content injected dynamically -->
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    return modal;
  }

  let modal = null;
  function openProjectModal(card) {
    if (!card) return;
    if (!modal) modal = createModal();

    const body = modal.querySelector(".project-modal-body");
    // Recupera dati dalla card
    const img = card.querySelector("img");
    const title = card.querySelector("h3")?.textContent || "";
    let desc = Array.from(card.querySelectorAll("p")).map(p => p.textContent).join("\n\n");

    // Dettaglio strumenti per il primo progetto
    if (title === "Stanza isometrica") {
      const toolsText = "Blender (Cycles) per la modellazione e il rendering, Shader Editor per i materiali procedurali, Adobe Photoshop (o il software che usi) per il post-processing.";
      desc = `${desc}\n\n${toolsText}`;
    }

    body.innerHTML = `
      ${img ? `<img src="${img.src}" alt="${img.alt || title}" style="width:100%;height:auto;border-radius:8px;object-fit:cover">` : ""}
      <h3 style="margin:0.25rem 0">${title}</h3>
      <p style="color:var(--muted);margin:0 0 0.5rem;white-space:pre-wrap">${desc}</p>
      <p style="margin:0"><a href="#" class="project-modal-link" style="color:var(--accent);font-weight:600">Apri progetto</a></p>
    `;

    modal.style.display = "flex";
    const closeBtn = modal.querySelector(".project-modal-close");
    closeBtn.focus();

    // Gestione chiusura
    function closeHandler() {
      modal.style.display = "none";
      document.removeEventListener("keydown", escHandler);
      modal.removeEventListener("click", overlayHandler);
      closeBtn.removeEventListener("click", closeHandler);
    }
    function escHandler(e) {
      if (e.key === "Escape") closeHandler();
    }
    function overlayHandler(e) {
      if (e.target === modal) closeHandler();
    }

    closeBtn.addEventListener("click", closeHandler);
    document.addEventListener("keydown", escHandler);
    modal.addEventListener("click", overlayHandler);
  }

  // Collega click alle carte (immagine o link "Dettagli")
  const projectCards = Array.from(document.querySelectorAll(".project-card"));
  projectCards.forEach(card => {
    // mette il puntatore su tutta la card per accessibilità
    card.style.cursor = "pointer";
    card.setAttribute("tabindex", "0");
    // click su card
    card.addEventListener("click", (e) => {
      // evita aprire se l'utente clicca su un link esterno (es. <a> con href vero)
      const targetAnchor = e.target.closest("a[href]");
      if (targetAnchor && targetAnchor.getAttribute("href") !== "#") return;
      openProjectModal(card);
    });
    // apertura con Invio / Space per accessibilità
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openProjectModal(card);
      }
    });
  });

  // Highlight nav in base alla sezione visibile
  const sections = Array.from(document.querySelectorAll("main section[id]"));
  const navLinks = Array.from(document.querySelectorAll(".nav-list a"));
  if ("IntersectionObserver" in window && sections.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const id = entry.target.id;
        const link = navLinks.find(a => a.getAttribute("href") === `#${id}`);
        if (link) link.classList.toggle("active", entry.isIntersecting);
      });
    }, { threshold: 0.45 });
    sections.forEach(s => io.observe(s));
  }
});