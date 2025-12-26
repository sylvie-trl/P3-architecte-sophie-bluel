// Ouverture et fermeture de la modale

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

  function closeModal() {
    modalOverlay.remove();
  }

  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  modalOverlay
    .querySelector(".modal-close")
    ?.addEventListener("click", closeModal);

  renderGalleryView(modalContent, projets, closeModal);
}

// Vue galerie
function renderGalleryView(modalContent, projets, closeModal) {
  modalContent.innerHTML = getModalContent(projets);

  setupDeleteButtons(modalContent, projets);
  setupAddButton(modalContent, projets, closeModal);

  modalContent
    .querySelector(".modal-close")
    ?.addEventListener("click", closeModal);
}

function setupDeleteButtons(modalContent, projets) {
  modalContent.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", () => handleDelete(btn, projets));
  });
}

async function handleDelete(btn) {
  const id = btn.dataset.id;

  try {
    const response = await fetch(`http://localhost:5678/api/works/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) throw new Error("Erreur API");

    btn.closest("figure").remove();
    await refreshGallery();
  } catch (err) {
    console.error(err);
    alert("Impossible de supprimer le projet.");
  }
}

function setupAddButton(modalContent, projets, closeModal) {
  const addBtn = modalContent.querySelector("#add-project-btn");
  if (addBtn) {
    addBtn.addEventListener("click", () =>
      renderFormView(modalContent, projets, closeModal)
    );
  }
}

// Vue formulaire
function renderFormView(modalContent, projets, closeModal) {
  modalContent.innerHTML = getModalAddFormContent();
  getCategoryOptions();

  const form = modalContent.querySelector("#add-project-form");
  const backBtn = modalContent.querySelector(".modal-return");

  backBtn.addEventListener("click", () =>
    renderGalleryView(modalContent, projets, closeModal)
  );

  modalContent
    .querySelector(".modal-close")
    ?.addEventListener("click", closeModal);

  setupPreview(modalContent);
  setupValidation(modalContent);

  form.addEventListener("submit", (e) =>
    handleSubmit(e, modalContent, projets)
  );
}

// Preview, validation, submit)
function setupPreview(modalContent) {
  const fileInput = modalContent.querySelector("#image");
  const uploadContainer = modalContent.querySelector(".image-upload-container");

  fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (!file) return;

    const label = uploadContainer.querySelector("label");
    if (label) label.style.display = "none";

    let preview = uploadContainer.querySelector(".preview");
    if (!preview) {
      preview = document.createElement("img");
      preview.classList.add("preview");
      uploadContainer.appendChild(preview);
    }

    preview.src = URL.createObjectURL(file);
    preview.style.height = "193px";
  });
}

function setupValidation(modalContent) {
  const fileInput = modalContent.querySelector("#image");
  const titleInput = modalContent.querySelector("#title");
  const categorySelect = modalContent.querySelector("#category");
  const submitBtn = modalContent.querySelector("#submitBtn");

  function validate() {
    const valid =
      titleInput.value && categorySelect.value && fileInput.files.length > 0;

    submitBtn.disabled = !valid;
    submitBtn.style.backgroundColor = valid ? "#1d6154" : "#ccc";
  }

  titleInput.addEventListener("input", validate);
  categorySelect.addEventListener("change", validate);
  fileInput.addEventListener("change", validate);
}

async function handleSubmit(e, modalContent, projets) {
  e.preventDefault();

  const form = modalContent.querySelector("#add-project-form");
  const messageBox = modalContent.querySelector("#form-message");

  const formData = new FormData(form);

  try {
    const response = await fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: formData,
    });

    if (!response.ok) throw new Error("Erreur API");

    const newProjet = await response.json();
    projets.push(newProjet);
    await refreshGallery();

    messageBox.textContent = "Projet ajouté avec succès !";
    messageBox.className = "form-message success";

    form.reset();

    const preview = modalContent.querySelector(".preview");
    const label = modalContent.querySelector(".custom-file-upload");
    if (preview) preview.remove();
    if (label) label.style.display = "flex";
  } catch (err) {
    console.error(err);
    messageBox.textContent = "Impossible d'ajouter le projet.";
    messageBox.className = "form-message error";
  }
}
