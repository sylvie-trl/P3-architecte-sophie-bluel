import {
  fetchProjets,
  afficherProjets,
  afficherFiltres,
  token,
} from "./gallery.js";
import { initAuthUI } from "./adminUI.js";

async function main() {
  const projets = await fetchProjets();
  afficherProjets(projets);

  if (!token) {
    afficherFiltres(projets);
  }

  initAuthUI(projets);
}

main();
