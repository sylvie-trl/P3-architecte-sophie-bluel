import { fetchProjets, afficherFiltres } from "./gallery.js";
import { getModalContent, openModal } from "./modal.js";

export function initAuthUI() {
  const token = sessionStorage.getItem("token");

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
    sessionStorage.removeItem("token");
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
      console.log("je clique sur le bouton modifier");
      const projets = await fetchProjets();
      const contentHTML = getModalContent(projets);
      openModal(contentHTML);
      //   sessionStorage.removeItem("token");
      //   // window.location.reload(); il faudra lancer la modale à partir de ce bouton
    });
    btnEdition.appendChild(bouton);
  }
}
