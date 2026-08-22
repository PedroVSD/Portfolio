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

  toggleBtn.textContent = isDark ? "☀" : "☾";

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
    const response = await fetch(
      `./locales/${language}.json`
    );

    if (!response.ok) {
      throw new Error(
        `Não foi possível carregar o idioma: ${language}`
      );
    }

    const translations =
      await response.json();

    document
      .querySelectorAll("[data-i18n]")
      .forEach((element) => {
        const key = element.dataset.i18n;

        const value = key
          .split(".")
          .reduce(
            (obj, item) => obj?.[item],
            translations
          );

        if (value !== undefined) {
          element.textContent = value;
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
   INICIALIZAÇÃO
   ========================================= */

loadLanguage(
  getCurrentLanguage()
);
