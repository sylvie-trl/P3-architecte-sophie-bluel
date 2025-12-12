import "./gallery.js";
import { refreshGallery } from "./gallery.js";
import {
  getModalContent,
  getModalAddFormContent,
  getCategoryOptions,
} from "./modalContent.js";

export function openModal(projets) {
  const template = document.getElementById("modal-template");
  const clone = template.content.cloneNode(true);
  const modalOverlay = clone.querySelector(".modal-overlay");
  const modalContent = clone.querySelector(".modal-content");

  document.body.appendChild(clone);

  // --- FERMETURE DE LA MODALE ---
  function closeModal() {
    modalOverlay.remove();
  }

  modalOverlay
    .querySelector(".modal-close")
    ?.addEventListener("click", closeModal);
  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  // --- GALERIE ---
  function showGalleryView() {
    modalContent.innerHTML = getModalContent(projets);
    initDeleteButtons();
    initAddProjectButton();

    modalContent
      .querySelector(".modal-close")
      ?.addEventListener("click", closeModal);
  }

  function initDeleteButtons() {
    const deleteButtons = modalContent.querySelectorAll(".delete-btn");
    deleteButtons.forEach((btn) => {
      btn.addEventListener("click", () => handleDeleteProject(btn));
    });
  }

  async function handleDeleteProject(btn) {
    const id = btn.dataset.id;
    try {
      const response = await fetch(`http://localhost:5678/api/works/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) throw new Error("Erreur lors de la suppression");

      btn.closest("figure").remove();
      await refreshGallery();
      console.log(`Projet ${id} supprimé`);
    } catch (error) {
      console.error(error);
      alert("Une erreur est survenue lors de la suppression du projet.");
    }
  }

  function initAddProjectButton() {
    const addBtn = modalContent.querySelector("#add-project-btn");
    if (addBtn) addBtn.addEventListener("click", showAddFormView);
  }

  // --- FORMULAIRE ---
  function showAddFormView() {
    modalContent.innerHTML = getModalAddFormContent();
    getCategoryOptions();

    const fileInput = modalContent.querySelector("#image");
    const titleInput = modalContent.querySelector("#title");
    const uploadContainer = modalContent.querySelector(
      ".image-upload-container"
    );
    const categorySelect = modalContent.querySelector("#category");
    const submitBtn = modalContent.querySelector("#submitBtn");
    const backBtn = modalContent.querySelector(".modal-return");
    const closeBtn = modalContent.querySelector(".modal-close");
    const form = modalContent.querySelector("#add-project-form");

    // Retour et fermeture
    backBtn?.addEventListener("click", showGalleryView);
    closeBtn?.addEventListener("click", closeModal);

    // Clic sur conteneur pour ouvrir le sélecteur
    uploadContainer.addEventListener("click", (e) => {
      if (
        e.target === uploadContainer ||
        e.target.closest(".custom-file-upload")
      ) {
        fileInput.click();
      }
    });

    // Affichage miniature
    fileInput.addEventListener("change", () => {
      const file = fileInput.files[0];
      if (!file) return;

      // Supprimer icône et texte, ne laisser que l'image
      uploadContainer.innerHTML = "";

      const imgPreview = document.createElement("img");
      imgPreview.src = URL.createObjectURL(file);
      imgPreview.alt = "Aperçu image";
      imgPreview.style.width = "auto";
      imgPreview.style.height = "193px";
      imgPreview.style.display = "block";
      imgPreview.style.margin = "10px auto";
      imgPreview.classList.add("preview");

      uploadContainer.appendChild(imgPreview);

      checkFormValidity();
    });

    // Vérification validité formulaire
    function checkFormValidity() {
      if (
        titleInput.value &&
        categorySelect.value &&
        fileInput.files.length > 0
      ) {
        submitBtn.disabled = false;
        submitBtn.style.backgroundColor = "#1d6154";
        submitBtn.style.cursor = "pointer";
      } else {
        submitBtn.disabled = true;
        submitBtn.style.backgroundColor = "#ccc";
        submitBtn.style.cursor = "not-allowed";
      }
    }

    titleInput.addEventListener("input", checkFormValidity);
    categorySelect.addEventListener("change", checkFormValidity);

    // Soumission du formulaire
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

  // Initialisation : afficher la galerie
  showGalleryView();
}
