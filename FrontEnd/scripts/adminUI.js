import { fetchProjets, afficherFiltres } from "./gallery.js";
import { openModal } from "./modal.js";

export function initAuthUI() {
  const token = localStorage.getItem("token");

  if (!token) return;

  // Bandeau noir
  const bandeauEdition = document.getElementById("adminBandeau");
  bandeauEdition.classList.add("edition-active");

  // Login -> Logout
  const navAuth = document.getElementById("nav-auth");
  navAuth.textContent = "logout";
  navAuth.href = "#";

  navAuth.addEventListener("click", (event) => {
    event.preventDefault();
    localStorage.removeItem("token");
    window.location.reload();
  });

  // Style sur le titre
  const title = document.getElementById("title");
  title.classList.add("edition");

  // Ajout bouton Edition en mode connecté

  if (!token) {
    afficherFiltres();
  }

  const btnEdition = document.getElementById("btnEdition");

  if (token && btnEdition) {
    const bouton = document.createElement("button");
    bouton.textContent = "modifier";
    bouton.classList.add("btnEdition");
    bouton.addEventListener("click", async () => {
      const projets = await fetchProjets();
      openModal(projets);
    });
    btnEdition.appendChild(bouton);
  }
}
