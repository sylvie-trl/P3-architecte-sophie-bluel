import { getWorks, getCategories } from "./api.js";

export const token = localStorage.getItem("token");

// Récupération et affichage des projets sur la page d'Accueil
export async function fetchProjets() {
  return await getWorks();
}

export function afficherProjets(liste) {
  const galerie = document.querySelector(".galerie");
  galerie.innerHTML = "";

  liste.forEach((projet) => {
    const figure = document.createElement("figure");

    const img = document.createElement("img");
    img.src = projet.imageUrl;
    img.alt = projet.title;

    const caption = document.createElement("figcaption");
    caption.textContent = projet.title;

    figure.appendChild(img);
    figure.appendChild(caption);
    galerie.appendChild(figure);
  });
}

// Ajout dynamique des 4 boutons de filtres

function creerBtnFiltre(categorie, projets) {
  const btnFiltre = document.createElement("button");
  btnFiltre.textContent = categorie.name;
  btnFiltre.dataset.categoryId = categorie.id;
  btnFiltre.classList.add("filtre");

  if (categorie.id === 0) btnFiltre.classList.add("active");

  btnFiltre.addEventListener("click", () => {
    document
      .querySelectorAll(".filtre")
      .forEach((btn) => btn.classList.remove("active"));
    btnFiltre.classList.add("active");

    if (categorie.id === 0) {
      afficherProjets(projets);
    } else {
      afficherProjets(
        projets.filter((projet) => projet.categoryId === categorie.id)
      );
    }
  });

  return btnFiltre;
}

export async function afficherFiltres(projets) {
  const categories = await getCategories();

  categories.unshift({ id: 0, name: "Tous" });

  const divFiltres = document.createElement("div");
  divFiltres.classList.add("filtres");

  categories.forEach((categorie) => {
    const btn = creerBtnFiltre(categorie, projets);
    divFiltres.appendChild(btn);
  });

  const portfolio = document.getElementById("portfolio");
  const galerie = document.querySelector(".galerie");

  portfolio.insertBefore(divFiltres, galerie);
}

export async function refreshGallery() {
  try {
    const projets = await fetchProjets();
    afficherProjets(projets);
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la galerie :", error);
  }
}
