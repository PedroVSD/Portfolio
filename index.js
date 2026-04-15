const toggleBtn = document.getElementById("theme-toggle");
const htmlElement = document.documentElement;

const savedTheme = localStorage.getItem("theme");
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
const hamburgerBtn = document.getElementById("hamburger-btn");
const navLinks = document.querySelector(".nav-links");

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
