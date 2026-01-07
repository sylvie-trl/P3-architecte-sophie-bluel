const API_URL = "http://localhost:5678/api";

export async function getWorks() {
  const res = await fetch(`${API_URL}/works`);
  if (!res.ok) throw new Error("Erreur lors de la récupération des travaux");
  return await res.json();
}

export async function getCategories() {
  const res = await fetch(`${API_URL}/categories`);
  if (!res.ok) throw new Error("Erreur lors de la récupération des catégories");
  return await res.json();
}

export async function deleteWork(id) {
  const res = await fetch(`${API_URL}/works/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  if (!res.ok) throw new Error("Erreur lors de la suppression du projet");
  return true;
}

export async function addWork(formData) {
  const res = await fetch(`${API_URL}/works`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: formData,
  });
  if (!res.ok) throw new Error("Erreur lors de l'ajout du projet");
  return await res.json();
}

export async function login(email, password) {
  const res = await fetch(`${API_URL}/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      errorData.message || "Erreur dans l'identifiant ou le mot de passe"
    );
  }
  return await res.json();
}
