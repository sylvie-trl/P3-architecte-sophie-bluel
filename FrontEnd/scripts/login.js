import { login } from "./api.js";

const formulaireConnexion = document.getElementById("login-form");
let errorMessage = document.getElementById("error-message");

formulaireConnexion.addEventListener("submit", async (event) => {
  event.preventDefault();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  try {
    const data = await login(email, password);
    localStorage.setItem("token", data.token);
    window.location.href = "index.html";
  } catch (error) {
    console.error("Erreur lors de la connexion : " + error.message);
    errorMessage.textContent =
      error.message || "Erreur dans l'identifiant ou le mot de passe";
  }
});
