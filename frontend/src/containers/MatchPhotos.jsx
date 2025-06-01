import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  initMatchJson,
  updatePhotoAssign,
  fetchMatchs
} from "../utils/api";       // on importe fetchMatchs ici
import PhotoCarousel from "../components/PhotoSelector/PhotoCarousel";
import JoueurPicker from "../components/JoueurPicker/JoueurPicker";

const MatchPhotos = () => {
  const { matchName } = useParams();
  const [photos, setPhotos] = useState([]);
  const [current, setCurrent] = useState(0);
  const [équipes] = useState(["Équipe A", "Équipe B"]);
  const [joueursDispo, setJoueursDispo] = useState([]);

  // 1) Charger la liste des joueurs disponibles (inchangé)
  useEffect(() => {
    fetch("http://localhost:8000/api/joueurs")
      .then((res) => res.json())
      .then(setJoueursDispo)
      .catch(() => setJoueursDispo([]));
  }, []);

  // 2) Initialiser / lire le JSON de ce match (inchangé)
  useEffect(() => {
    initMatchJson(matchName)
      .then(setPhotos)
      .catch((e) => console.error("Init JSON KO :", e));
  }, [matchName]);

  if (!photos.length) {
    return <p style={{ textAlign: "center" }}>Chargement…</p>;
  }

  // 3) Accès direct aux tableaux par équipe pour la photo courante
  const currentPhoto = photos[current];
  const joueursEquipeA = Array.isArray(currentPhoto["Équipe A"])
    ? currentPhoto["Équipe A"]
    : [];
  const joueursEquipeB = Array.isArray(currentPhoto["Équipe B"])
    ? currentPhoto["Équipe B"]
    : [];


  // 5) Handler existant pour ajouter un joueur
  const handleAdd = async (joueur) => {
    const updatedPhotos = [...photos];
    const photo = updatedPhotos[current];
    const teamKey = joueur.equipe || "Sans équipe";
    if (!Array.isArray(photo[teamKey])) photo[teamKey] = [];
    if (!photo[teamKey].some((j) => j.id === joueur.id)) {
      photo[teamKey].push(joueur);
      setPhotos(updatedPhotos);
      setJoueursDispo((prev) =>
        prev.some((j) => j.id === joueur.id) ? prev : [...prev, joueur]
      );
    }

    console.log("→ updatePhotoAssign envoi :", photo);
    try {
      const res = await updatePhotoAssign(photo);
      if (!res.ok) {
        const errData = await res.json();
        console.error("🚨 updatePhotoAssign a planté :", errData);
        return;
      }
      console.log("✔️ updatePhotoAssign OK");
    } catch (fetchError) {
      console.error("🚨 Impossible d’atteindre le serveur :", fetchError);
    }
  };

  // 6) Handler existant pour retirer un joueur
  const handleRemove = async (joueur) => {
    const updatedPhotos = [...photos];
    const photo = updatedPhotos[current];
    const teamKey = joueur.equipe || "Sans équipe";
    photo[teamKey] = (photo[teamKey] || []).filter((j) => j.id !== joueur.id);

    setPhotos(updatedPhotos);

    try {
      const res = await updatePhotoAssign(photo);
      if (!res.ok) {
        const errData = await res.json();
        console.error("🚨 updatePhotoAssign a planté :", errData);
      } else {
        console.log("✔️ updatePhotoAssign OK");
      }
    } catch (fetchError) {
      console.error("🚨 Impossible d’atteindre le serveur :", fetchError);
    }
  };

  const handleCopyPrevious = async (prevPhoto) => {
    // Exemple : on veut copier Équipe A et Équipe B dans la photo courante
    // Récupère le index courant via binding du composant
    // Supposons que vous remontiez l’index actuel en state ‘current’ :
    const currIndex = current; // état maintenu avec onIndexChange
    const updated = [...photos];
    const currPhoto = { ...updated[currIndex] };

    // On écrase les tableaux d’équipes avec ceux de prevPhoto
    currPhoto["Équipe A"] = [...(prevPhoto["Équipe A"] || [])];
    currPhoto["Équipe B"] = [...(prevPhoto["Équipe B"] || [])];

    // On remet dans la liste et on met à jour le state
    updated[currIndex] = currPhoto;
    setPhotos(updated);

    // Puis on persiste chez le back-end
    const res = await updatePhotoAssign(currPhoto);
    if (!res.ok) {
      const err = await res.json();
      console.error("Erreur updatePhotoAssign:", err);
    }
  };
  

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ textAlign: "center" }}>{matchName}</h2>

      <PhotoCarousel photos={photos} joueurs={joueursDispo} index={current} onIndexChange={setCurrent} onCopyPrevious={handleCopyPrevious} onShortcutAdd={handleAdd} />

      {/* Affichage distinct des joueurs par équipe */}
      <div style={{ display: "flex", justifyContent: "space-around", marginTop: 16 }}>
        {/* Colonne Équipe A */}
        <div style={{ flex: 1, marginRight: 8 }}>
          <h3 style={{ textAlign: "center", marginBottom: 8 }}>Équipe A</h3>
          <div style={{ textAlign: "center" }}>
            {joueursEquipeA.map((joueur) => (
              <span
                key={joueur.id}
                style={{
                  display: "inline-block",
                  background: "#4caf50",
                  color: "#fff",
                  borderRadius: 12,
                  padding: "2px 10px",
                  margin: 4,
                  cursor: "pointer",
                }}
                onClick={() => handleRemove(joueur)}
              >
                {joueur.label} &times;
              </span>
            ))}
          </div>
        </div>

        {/* Colonne Équipe B */}
        <div style={{ flex: 1, marginLeft: 8 }}>
          <h3 style={{ textAlign: "center", marginBottom: 8 }}>Équipe B</h3>
          <div style={{ textAlign: "center" }}>
            {joueursEquipeB.map((joueur) => (
              <span
                key={joueur.id}
                style={{
                  display: "inline-block",
                  background: "#2196f3",
                  color: "#fff",
                  borderRadius: 12,
                  padding: "2px 10px",
                  margin: 4,
                  cursor: "pointer",
                }}
                onClick={() => handleRemove(joueur)}
              >
                {joueur.label} &times;
              </span>
            ))}
          </div>
        </div>
      </div>

      <JoueurPicker
        joueurs={joueursDispo}
        onAdd={handleAdd}
        déjàChoisis={[...joueursEquipeA, ...joueursEquipeB].map((j) => j.id)}
        équipes={équipes}
      />
    </div>
  );
};

export default MatchPhotos;
