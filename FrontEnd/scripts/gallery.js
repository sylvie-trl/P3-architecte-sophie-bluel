export const token = sessionStorage.getItem("token");

// Récupération et affichage des projets sur la page d'Accueil
export async function fetchProjets() {
  const reponse = await fetch("http://localhost:5678/api/works");
  return await reponse.json();
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
  const reponseCategories = await fetch("http://localhost:5678/api/categories");
  const categories = await reponseCategories.json();

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

// Ajout bouton Edition en mode connecté

// if (!token) {
//   afficherFiltres();
// }

// const btnEdition = document.getElementById("btnEdition");

// if (token && btnEdition) {
//   const bouton = document.createElement("button");
//   bouton.textContent = "modifier";
//   bouton.classList.add("btnEdition");
//   bouton.addEventListener("click", () => {
//     sessionStorage.removeItem("token");
//     // window.location.reload(); il faudra lancer la modale à partir de ce bouton
//   });
//   btnEdition.appendChild(bouton);
// }

// // Gestion du lien Login/Logout dans la navbar

// const navAuth = document.getElementById("nav-auth");

// if (token) {
//   // ajout du bandeau noir en mode édition
//   const bandeauEdition = document.getElementById("adminBandeau");
//   bandeauEdition.classList.add("edition-active");

//   // Change le texte et le comportement
//   navAuth.textContent = "logout";
//   navAuth.href = "#"; // évite de rediriger vers login.html

//   navAuth.addEventListener("click", (event) => {
//     event.preventDefault();
//     sessionStorage.removeItem("token");
//     window.location.reload();
//   });

//   // Ajout margin titre Mes Projets
//   const title = document.getElementById("title");
//   title.classList.add("edition");
// }
