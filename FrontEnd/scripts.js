// Récupération et affichage des projets sur la page d'Accueil

const reponse = await fetch("http://localhost:5678/api/works");
const projets = await reponse.json();

const galerie = document.querySelector(".galerie");
const portfolio = document.getElementById("portfolio");

function afficherProjets(liste) {
  galerie.innerHTML = ""; // Vider la galerie avant d'afficher les projets filtrés
  liste.forEach((projet) => {
    const figure = document.createElement("figure");

    const image = document.createElement("img");
    image.src = projet.imageUrl;
    image.alt = projet.title;

    const caption = document.createElement("figcaption");
    caption.textContent = projet.title;

    figure.appendChild(image);
    figure.appendChild(caption);
    galerie.appendChild(figure);
  });
}

afficherProjets(projets);

// Ajout dynamique des 4 boutons de filtres

const divFiltres = document.createElement("div");
divFiltres.classList.add("filtres");

function creerBtnFiltre(categorie) {
  const btnFiltre = document.createElement("button");
  btnFiltre.textContent = categorie.name;
  btnFiltre.dataset.categoryId = categorie.id;
  btnFiltre.classList.add("filtre");
  divFiltres.appendChild(btnFiltre);

  if (categorie.id === 0) {
    btnFiltre.classList.add("active");
  }
  btnFiltre.addEventListener("click", () => {
    // Retirer la classe 'active' de tous les boutons
    document.querySelectorAll(".filtre").forEach((btn) => {
      btn.classList.remove("active");
    });
    // Ajouter la classe 'active' au bouton cliqué
    btnFiltre.classList.add("active");

    if (categorie.id === 0) {
      afficherProjets(projets);
    } else {
      const projetsFiltres = projets.filter(
        (projet) => projet.categoryId === categorie.id
      );
      afficherProjets(projetsFiltres);
    }
  });
}

async function afficherFiltres() {
  const reponseCategories = await fetch("http://localhost:5678/api/categories");
  const categories = await reponseCategories.json();

  categories.unshift({ id: 0, name: "Tous" }); // Ajout de la catégorie "Tous"

  categories.forEach((categorie) => {
    creerBtnFiltre(categorie);
  });

  portfolio.insertBefore(divFiltres, galerie);
}

afficherFiltres();
