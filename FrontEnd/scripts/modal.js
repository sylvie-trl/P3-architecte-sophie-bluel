import "./gallery.js";

export function getModalContent(projets) {
  let contentHTML = `
    <button class="modal-close">
        <img src="./assets/icons/xmark.svg"/>
    </button>
    <h2 class="title-modal">Galerie Photo</h2>
    <div class="modal-gallery">`;

  projets.forEach((projet) => {
    contentHTML += `
        <figure class="modal-figure">
            <img src="${projet.imageUrl}" alt="${projet.title}" class="modal-img" />
            <button class="delete-btn" data-id="${projet.id}" title="Supprimer">
                <img src="./assets/icons/trashIcon.svg" class="test-img"/>
            </button>
        </figure>`;
  });

  contentHTML += `</div>`;
  contentHTML += `<button id="add-project-btn" class="add-project-btn">Ajouter une photo</button>`;

  return contentHTML;
}

export function openModal(contentHTML) {
  const template = document.getElementById("modal-template");
  const clone = template.content.cloneNode(true);
  const modalOverlay = clone.querySelector(".modal-overlay");
  const modalContent = clone.querySelector(".modal-content");
  modalContent.innerHTML = contentHTML;

  // Attacher les events delete
  const deleteButtons = modalContent.querySelectorAll(".delete-btn");
  deleteButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      console.log("Supprimer projet avec id :", id);
      btn.closest("figure").remove();
    });
  });

  document.body.appendChild(clone);

  // Fermer la modale
  const closeBtn = modalOverlay.querySelector(".modal-close");
  closeBtn.addEventListener("click", () => modalOverlay.remove());
  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) modalOverlay.remove();
  });
}
