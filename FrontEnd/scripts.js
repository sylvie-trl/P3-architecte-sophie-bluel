// Récupération et affichage des projets sur la page d'Accueil

const reponse = await fetch("http://localhost:5678/api/works");
const projets = await reponse.json();

const galerie = document.querySelector(".galerie");

projets.forEach((projet) => {
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

// Ajout dynamique des 4 boutons de filtres

const divFiltres = document.createElement("div");
divFiltres.classList.add("filtres");

const btnFiltreTous = document.createElement("button");
btnFiltreTous.textContent = "Tous";
btnFiltreTous.classList.add("filtre-tous");

const btnFiltreObjets = document.createElement("button");
btnFiltreObjets.textContent = "Objets";
btnFiltreObjets.classList.add("filtre-objets");

const btnFiltreAppartements = document.createElement("button");
btnFiltreAppartements.textContent = "Appartements";
btnFiltreAppartements.classList.add("filtre-appartements");

const btnFiltreHotelRestaurant = document.createElement("button");
btnFiltreHotelRestaurant.textContent = "Hôtels & restaurants";
btnFiltreHotelRestaurant.classList.add("filtre-hotels-restaurants");

divFiltres.appendChild(btnFiltreTous);
divFiltres.appendChild(btnFiltreObjets);
divFiltres.appendChild(btnFiltreAppartements);
divFiltres.appendChild(btnFiltreHotelRestaurant);

const portfolio = document.getElementById("portfolio");

portfolio.insertBefore(divFiltres, galerie);

// Récupération via l'API des catégories des projets

// const reponseCategories = await fetch("http://localhost:5678/api/categories");
// const categories = await reponseCategories.json();
