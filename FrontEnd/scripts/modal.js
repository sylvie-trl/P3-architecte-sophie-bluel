import "./gallery.js";
import { refreshGallery } from "./gallery.js";
import { getModalContent } from "./modalContent.js";
import { getModalAddFormContent } from "./modalContent.js";

export function openModal(projets) {
  const template = document.getElementById("modal-template");
  const clone = template.content.cloneNode(true);
  const modalOverlay = clone.querySelector(".modal-overlay");
  const modalContent = clone.querySelector(".modal-content");

  showGalleryView();

  document.body.appendChild(clone);

  // Fermer la modale
  const closeModal = () => modalOverlay.remove();
  modalOverlay
    .querySelector(".modal-close")
    .addEventListener("click", closeModal);
  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  function showGalleryView() {
    modalContent.innerHTML = getModalContent(projets);

    // Delete buttons
    const deleteButtons = modalContent.querySelectorAll(".delete-btn");
    deleteButtons.forEach((btn) => {
      btn.addEventListener("click", async () => {
        const id = btn.dataset.id;
        try {
          const response = await fetch(
            `http://localhost:5678/api/works/${id}`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          if (!response.ok) throw new Error("Erreur lors de la suppression");

          btn.closest("figure").remove();
          await refreshGallery();
          console.log(`Projet ${id} supprimé`);
        } catch (error) {
          console.error(error);
          alert("Une erreur est survenue lors de la suppression du projet.");
        }
      });
    });

    // Bouton Ajouter → bascule vers formulaire
    const addBtn = modalContent.querySelector("#add-project-btn");
    if (addBtn) {
      addBtn.addEventListener("click", showAddFormView);
    }
  }

  function showAddFormView() {
    modalContent.innerHTML = getModalAddFormContent();

    // Bouton retour à la galerie
    const backBtn = modalContent.querySelector("#back-to-gallery");
    backBtn.addEventListener("click", showGalleryView);

    // Soumission du formulaire
    const form = modalContent.querySelector("#add-project-form");
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const title = form.title.value;
      const imageFile = form.image.files[0];
      const category = form.category.value;

      const formData = new FormData();
      formData.append("title", title);
      formData.append("image", imageFile);
      formData.append("category", category);

      try {
        const response = await fetch("http://localhost:5678/api/works", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        });

        if (!response.ok) throw new Error("Erreur lors de l'ajout du projet");

        const newProjet = await response.json();
        projets.push(newProjet);
        await refreshGallery();
        alert("Projet ajouté avec succès !");
        showGalleryView();
      } catch (err) {
        console.error(err);
        alert("Impossible d'ajouter le projet");
      }
    });
  }
}
