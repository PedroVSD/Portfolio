const toggleBtn = document.getElementById("theme-toggle");
const htmlElement = document.documentElement;
const savedTheme = localStorage.getItem("theme");
const hamburgerBtn = document.getElementById("hamburger-btn");
const navLinks = document.querySelector(".nav-links");
const idiomas = ["pt", "en"];

if (savedTheme) {
  htmlElement.setAttribute("data-theme", savedTheme);
}

toggleBtn.addEventListener("click", () => {
  const currentTheme = htmlElement.getAttribute("data-theme");

  if (currentTheme === "dark") {
    htmlElement.removeAttribute("data-theme");
    localStorage.setItem("theme", "light");
  } else {
    htmlElement.setAttribute("data-theme", "dark");
    localStorage.setItem("theme", "dark");
  }
});

// Lógica do Menu Hambúrguer
hamburgerBtn.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});

// Fecha o menu automaticamente quando o usuário clica em um link
const links = document.querySelectorAll(".nav-links a");
links.forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("active");
  });
});

//Tradução
const supportedLanguages = ["pt", "en"];

function detectBrowserLanguage() {
  const browserLanguage = navigator.language.toLowerCase();

  return browserLanguage.startsWith("pt") ? "pt" : "en";
}

function getCurrentLanguage() {
  const savedLanguage = localStorage.getItem("language");

  if (savedLanguage && supportedLanguages.includes(savedLanguage)) {
    return savedLanguage;
  }

  return detectBrowserLanguage();
}

async function loadLanguage(language) {
  const response = await fetch(`/locales/${language}.json`);

  const translations = await response.json();

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n;

    const value = key
      .split(".")
      .reduce((obj, item) => obj?.[item], translations);

    if (value) {
      element.textContent = value;
    }
  });

  document.documentElement.lang = language === "pt" ? "pt-BR" : "en";

  localStorage.setItem("language", language);
}

function toggleLanguage() {
  const atual = localStorage.getItem("language") || getAtutalLang();

  const proximo = atual === "pt" ? "en" : "pt";
  loadLanguage(proximo);
}

loadLanguage(getAtutalLang());
