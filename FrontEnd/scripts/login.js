const formulaireConnexion = document.getElementById("login-form");
let errorMessage = document.getElementById("error-message");

formulaireConnexion.addEventListener("submit", async (event) => {
  event.preventDefault(); // Empêche le rechargement de la page
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const reponse = await fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!reponse.ok) {
      const errorData = await reponse.json();

      errorMessage.textContent =
        errorData.message || "Erreur dans l'identifiant ou le mot de passe";
      throw new Error(
        errorData.message || "Erreur dans l'identifiant ou le mot de passe"
      );
    } else {
      const data = await reponse.json();
      localStorage.setItem("token", data.token);
      window.location.href = "index.html";
    }
  } catch (error) {
    console.error("Erreur lors de la connexion : " + error.message);
    errorMessage.textContent = "Erreur dans l'identifiant ou le mot de passe";
  }
});
