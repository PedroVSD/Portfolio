const toggleBtn = document.getElementById("theme-toggle");
const htmlElement = document.documentElement;

const hamburgerBtn = document.getElementById("hamburger-btn");
const navLinks = document.querySelector(".nav-links");

const supportedLanguages = ["pt", "en"];
const languageToggle = document.getElementById("language-toggle");
/* =========================================
   TEMA CLARO / ESCURO
   ========================================= */

const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
  htmlElement.setAttribute("data-theme", "dark");
}

function updateThemeButton() {
  if (!toggleBtn) return;

  const isDark =
    htmlElement.getAttribute("data-theme") === "dark";

  toggleBtn.setAttribute(
    "aria-label",
    isDark
      ? "Ativar modo claro"
      : "Ativar modo escuro"
  );

  toggleBtn.setAttribute(
    "title",
    isDark
      ? "Ativar modo claro"
      : "Ativar modo escuro"
  );
}

updateThemeButton();

if (toggleBtn) {
  toggleBtn.addEventListener("click", () => {
    const currentTheme =
      htmlElement.getAttribute("data-theme");

    if (currentTheme === "dark") {
      htmlElement.removeAttribute("data-theme");
      localStorage.setItem("theme", "light");
    } else {
      htmlElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    }

    updateThemeButton();
  });
}


/* =========================================
   MENU HAMBÚRGUER
   ========================================= */

   /* =========================================
      MENU HAMBÚRGUER
      ========================================= */

   if (hamburgerBtn && navLinks) {

     // Abre / fecha ao clicar no botão
     hamburgerBtn.addEventListener("click", (event) => {
       event.stopPropagation();

       navLinks.classList.toggle("active");
     });

     // Fecha ao clicar em qualquer link
     const links = document.querySelectorAll(".nav-links a");

     links.forEach((link) => {
       link.addEventListener("click", () => {
         navLinks.classList.remove("active");
       });
     });

     // Fecha ao clicar fora do menu
     document.addEventListener("click", (event) => {

       const clicouNoMenu =
         navLinks.contains(event.target);

       const clicouNoBotao =
         hamburgerBtn.contains(event.target);

       if (!clicouNoMenu && !clicouNoBotao) {
         navLinks.classList.remove("active");
       }
     });
   }


/* =========================================
   TRADUÇÃO
   ========================================= */


if (languageToggle) {
    languageToggle.addEventListener("click", () => {
      toggleLanguage();
    });
}

function detectBrowserLanguage() {
  const browserLanguage =
    navigator.language.toLowerCase();

  return browserLanguage.startsWith("pt")
    ? "pt"
    : "en";
}

function getCurrentLanguage() {
  const savedLanguage =
    localStorage.getItem("language");

  if (
    savedLanguage &&
    supportedLanguages.includes(savedLanguage)
  ) {
    return savedLanguage;
  }

  return detectBrowserLanguage();
}

async function loadLanguage(language) {
  try {
    let response = await fetch(`./locales/${language}.json`);

    if (!response.ok) {
      response = await fetch(`../locales/${language}.json`);
    }

    if (!response.ok) {
      throw new Error(
        `Não foi possível carregar o idioma: ${language}`
      );
    }

    const translations =
      await response.json();

    document.querySelectorAll("[data-i18n]").forEach((element) => {
        const key = element.dataset.i18n;
        const value = key.split(".").reduce((obj, item) => obj?.[item], translations);
        if (value !== undefined) {
          // If element is a title, update document title as well
          if (element.tagName === "TITLE") {
            element.textContent = value;
            document.title = value;
          } else {
            element.textContent = value;
          }
        }
      });

      // Suporte para tradução de atributos alt (imagens da galeria)
      document.querySelectorAll("[data-i18n-alt]").forEach((element) => {
        const key = element.dataset.i18nAlt;
        const value = key.split(".").reduce((obj, item) => obj?.[item], translations);
        if (value !== undefined) {
          element.setAttribute("alt", value);
        }
      });

    document.documentElement.lang =
      language === "pt"
        ? "pt-BR"
        : "en";

    localStorage.setItem(
      "language",
      language
    );

  } catch (error) {
    console.error(
      "Erro ao carregar tradução:",
      error
    );
  }
}

function toggleLanguage() {
  const atual =
    getCurrentLanguage();

  const proximo =
    atual === "pt"
      ? "en"
      : "pt";

  loadLanguage(proximo);
}


/* =========================================
   LIGHTBOX — clique na imagem para expandir
   ========================================= */

function initLightbox() {
  const images = document.querySelectorAll(".project-image img");
  if (!images.length) return;

  // cria overlay único
  let overlay = document.querySelector(".lightbox-overlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.className = "lightbox-overlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "Imagem expandida");
    overlay.innerHTML = `
      <div class="lightbox-content">
        <button class="lightbox-close" type="button" aria-label="Fechar imagem">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
        <img alt="" />
        <p class="lightbox-caption"></p>
      </div>
    `;
    document.body.appendChild(overlay);
  }

  const overlayImg = overlay.querySelector("img");
  const captionEl = overlay.querySelector(".lightbox-caption");
  const closeBtn = overlay.querySelector(".lightbox-close");
  const content = overlay.querySelector(".lightbox-content");

  function openLightbox(src, alt, caption) {
    overlayImg.src = src;
    overlayImg.alt = alt || "";
    captionEl.textContent = caption || alt || "";
    captionEl.style.display = caption || alt ? "block" : "none";
    overlay.classList.add("is-open");
    document.body.style.overflow = "hidden";
    closeBtn.focus();
  }

  function closeLightbox() {
    overlay.classList.remove("is-open");
    document.body.style.overflow = "";
  }

  images.forEach((img) => {
    img.style.cursor = "zoom-in";
    img.addEventListener("click", () => {
      const figcaption = img.closest("figure")?.querySelector("figcaption");
      const caption = figcaption ? figcaption.textContent.trim() : "";
      openLightbox(img.currentSrc || img.src, img.alt, caption);
    });
  });

  closeBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    closeLightbox();
  });

  overlay.addEventListener("click", (e) => {
    // clique fora da imagem (no overlay) fecha
    if (e.target === overlay) closeLightbox();
  });

  // clique no content mas fora da img não deve fechar; já tratado por overlay check

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.classList.contains("is-open")) {
      closeLightbox();
    }
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initLightbox);
} else {
  initLightbox();
}

/* =========================================
   INICIALIZAÇÃO
   ========================================= */

loadLanguage(
  getCurrentLanguage()
);
