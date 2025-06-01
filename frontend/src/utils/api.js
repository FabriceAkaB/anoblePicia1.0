const backendURL = import.meta.env.VITE_BACKEND_URL;

// Utilise fetch avec token si besoin
export const apiFetch = (url, options = {}) => {
  return fetch(backendURL + url, {
    ...options,
  });
};

// src/utils/api.js

export const fetchMatchs = async () => {
  const res = await apiFetch("/api/photos/matchs");
  if (!res.ok) {
    throw new Error("Impossible de récupérer la liste des matchs");
  }
  const data = await res.json();
  return data.matchs; // ex. ["match001", "match002", "match003", …]
};


// Fonction pour récupérer toutes les photos d’un match
export const fetchPhotos = async (matchName) => {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/photos/match/${matchName}`);
  const data = await res.json();
  return data; // et non pas { data }
};

// Fonction pour assigner des joueurs à une photo
export const assignJoueurs = (filename, joueurs) => {
  return fetch(`${backendURL}/api/photos/${filename}/assign`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ joueurs }),
  });
};

// récupère (ou crée) le JSON d'assignation pour un match
export const initMatchJson = async (matchName) => {
  const res = await apiFetch(`/api/photos/match/${matchName}/init`, {
    method: "POST",
  });
  if (!res.ok) throw new Error("Init JSON échoué");
  return await res.json();       // ← plus de .photos
};


export const updatePhotoAssign = (photo) =>
  apiFetch("/api/photos/update", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(photo),
  });

