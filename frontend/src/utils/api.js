const backendURL = import.meta.env.VITE_BACKEND_URL;

// Utilise fetch avec token si besoin
export const apiFetch = (url, options = {}) => {
  return fetch(backendURL + url, {
    ...options,
  });
};

export const fetchMatchs = async () => {
  const res = await apiFetch("/api/photos/matchs");
  if (!res.ok) {
    throw new Error("Impossible de récupérer les matchs");
  }
  const data = await res.json();
  return data.matchs;
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
