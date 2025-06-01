import { useState } from "react";
import "./JoueurPicker.css";

const JoueurPicker = ({ joueurs = [], déjàChoisis = [], onAdd, équipes = [] }) => {
  const [label, setLabel] = useState("");
  const [equipe, setEquipe] = useState("");
  const [nouvelleEquipe, setNouvelleEquipe] = useState("");



  const groupes = joueurs.reduce((acc, joueur) => {
    const team = joueur.equipe || "Sans équipe";
    if (!acc[team]) acc[team] = [];
    acc[team].push(joueur);
    return acc;
  }, {});

  const handleAdd = async () => {
  if (!label.trim()) return alert("Donne un nom au joueur !");
  const nomÉquipe = nouvelleEquipe || equipe;
  if (!nomÉquipe) return alert("Choisis ou crée une équipe");

  try {
    const res = await fetch("http://localhost:8000/api/joueurs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ label, equipe: nomÉquipe }),
    });
    const newJoueur = await res.json();
    onAdd(newJoueur); // ajoute dans les photos aussi
    // si tu veux le voir apparaître dans le <select> :
    // setJoueursDispo(prev => [...prev, newJoueur]);

    // reset les champs
    setLabel("");
    setEquipe("");
    setNouvelleEquipe("");
  } catch (err) {
    alert("Erreur lors de l’ajout du joueur");
    console.error(err);
  }
};


  return (
    <div className="joueur-picker-wrapper">
      <select
        onChange={(e) => {
          const joueurId = e.target.value;
          const joueur = joueurs.find((j) => j.id === joueurId);
          if (joueur) onAdd(joueur);
          e.target.value = "";
        }}
        defaultValue=""
        className="joueur-select"
      >
        <option value="" disabled>
          + Ajouter un joueur existant
        </option>
        {Object.entries(groupes).map(([nomEquipe, membres]) => (
          <optgroup key={nomEquipe} label={nomEquipe}>
            {membres
              .filter((j) => !déjàChoisis.includes(j.id))
              .map((j) => (
                <option key={j.id} value={j.id}>
                  {j.label}
                </option>
              ))}
          </optgroup>
        ))}
      </select>

      <div className="ajout-joueur-fields">
        <input
          type="text"
          placeholder="Nom du nouveau joueur"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
        />
        <select value={equipe} onChange={(e) => setEquipe(e.target.value)}>
          <option value="">Choisir une équipe</option>
          {équipes.map((eq) => (
            <option key={eq} value={eq}>
              {eq}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Ou créer une nouvelle équipe"
          value={nouvelleEquipe}
          onChange={(e) => setNouvelleEquipe(e.target.value)}
        />
      </div>

      <button onClick={handleAdd} className="add-joueur-button">
        Ajouter le nouveau joueur
      </button>
    </div>
  );
};

export default JoueurPicker;
