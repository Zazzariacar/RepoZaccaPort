document.addEventListener("DOMContentLoaded", () => {
  
  // 1. EFFETTO MOUSE BLOOM (BAGLIORE DINAMICO)
  const bloom = document.querySelector(".cursor-bloom");
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let bloomX = mouseX;
  let bloomY = mouseY;

  if (bloom) {
    document.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    const updateBloomPosition = () => {
      const ease = 0.08; 
      bloomX += (mouseX - bloomX) * ease;
      bloomY += (mouseY - bloomY) * ease;

      bloom.style.transform = `translate3d(${bloomX}px, ${bloomY}px, 0) translate(-50%, -50%)`;
      requestAnimationFrame(updateBloomPosition);
    };
    
    updateBloomPosition();
  }

  // 2. SMOOTH SCROLL
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

  // 3. ANNO DINAMICO NEL FOOTER
  const yearPlaceholder = document.getElementById("year-placeholder");
  if (yearPlaceholder) {
    yearPlaceholder.textContent = new Date().getFullYear();
  }

  // 4. MODALE / LIGHTBOX PER I PROGETTI
  function createModal() {
    const modal = document.createElement("div");
    modal.className = "project-modal";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.style.cssText = [
      "position:fixed", "inset:0", "display:flex", "align-items:center", "justify-content:center",
      "background:rgba(5, 3, 10, 0.85)", "padding:1.5rem", "z-index:9999", "opacity:0", "transition:opacity 0.2s ease"
    ].join(";");
    
    modal.innerHTML = `
      <div class="project-modal-inner" style="max-width:700px; width:100%; background: #0c0919; padding:1.75rem; border-radius:12px; box-shadow:0 20px 50px rgba(0,0,0,0.8); color:#e2dee9; position:relative;">
        <button class="project-modal-close" aria-label="Chiudi" style="position:absolute; top:1.25rem; right:1.25rem; background:transparent; border:0; color:#837d9c; font-size:1.5rem; cursor:pointer; padding:0.25rem; line-height:1; transition:color 0.2s;">✕</button>
        <div class="project-modal-body" style="display:grid; grid-template-columns:1fr; gap:1.25rem">
          <!-- Iniezione dinamica -->
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    return modal;
  }

  let modal = null;

  function openProjectModal(card) {
    if (!card || card.classList.contains("upcoming")) return;
    if (!modal) modal = createModal();

    const body = modal.querySelector(".project-modal-body");
    const closeBtn = modal.querySelector(".project-modal-close");
    
    const title = card.querySelector("h3")?.textContent || "";
    let desc = card.querySelector("p")?.textContent || "";
    const imgUrl = card.getAttribute("data-modal-img");

    if (title === "Stanza isometrica") {
      desc += "\n\nStrumenti utilizzati: Blender (Cycles) per la modellazione e il rendering, Shader Editor per i materiali procedurali, Adobe Photoshop per il post-processing.";
    } else if (title === "Penna magica — Witch Hat Atelier") {
      desc += "\n\nStrumenti utilizzati: Blender per la modellazione, UV unwrapping e rendering con Cycles. Materiali procedurali per la texture del legno e shader personalizzati per le incisioni.";
    } else if (title === "Set Katana e Maschera — Vita da Slime") {
      desc += "\n\nStrumenti utilizzati: Modellazione 3D interamente realizzata in Blender (retopologia ottimizzata per la maschera, materiali procedurali metallici avanzati per la lama e l'Hamon), con post-processing tramite intelligenza artificiale per evidenziare i dettagli di finitura, le luci atmosferiche e i riflessi sul metallo.";
    }

    body.innerHTML = `
      ${imgUrl ? `<img src="${imgUrl}" alt="${title}" style="width:100%; max-height:350px; border-radius:6px; object-fit:cover; border: 1px solid rgba(255,255,255,0.05);">` : ""}
      <h3 style="margin:0.5rem 0 0; font-family:Georgia, serif; font-size:1.5rem; color:#ffffff; font-weight:normal;">${title}</h3>
      <p style="color:#837d9c; margin:0 0 1rem; white-space:pre-wrap; font-size:0.95rem; line-height:1.6;">${desc}</p>
    `;

    modal.style.display = "flex";
    setTimeout(() => {
      modal.style.opacity = "1";
    }, 10);
    
    closeBtn.focus();

    function closeHandler() {
      modal.style.opacity = "0";
      setTimeout(() => {
        modal.style.display = "none";
      }, 200);
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

  const projectCards = Array.from(document.querySelectorAll(".project-card:not(.upcoming)"));
  projectCards.forEach(card => {
    card.setAttribute("tabindex", "0");
    
    card.addEventListener("click", (e) => {
      const targetAnchor = e.target.closest("a.details-link");
      if (targetAnchor) {
        e.preventDefault();
      }
      openProjectModal(card);
    });

    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openProjectModal(card);
      }
    });
  });

  // NAV HIGHLIGHT
  const sections = Array.from(document.querySelectorAll("main section[id]"));
  const navLinks = Array.from(document.querySelectorAll(".nav-list a"));
  if ("IntersectionObserver" in window && sections.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const id = entry.target.id;
        const link = navLinks.find(a => a.getAttribute("href") === `#${id}`);
        if (link) {
          link.classList.toggle("active", entry.isIntersecting);
        }
      });
    }, { threshold: 0.35 });
    sections.forEach(s => io.observe(s));
  }
});