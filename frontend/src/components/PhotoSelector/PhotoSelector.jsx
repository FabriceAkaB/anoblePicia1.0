// src/components/PhotoSelector.jsx
import { useState } from "react";
import { assignJoueurs } from "../../utils/api"; 

const PhotoSelector = ({ photo, joueurs }) => {
  const [selected, setSelected] = useState([]);

  const toggle = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((j) => j !== id) : [...prev, id]
    );
  };

  const handleSave = async () => {
    await assignJoueurs(photo.filename, selected);
    alert("Joueurs assignés !");
  };

  return (
    <div className="border rounded-lg p-2 mb-4">
      <img src={photo.wasabiUrl} alt={photo.filename} className="w-full max-w-md mb-2" />
      <div className="flex flex-wrap gap-2 mb-2">
        {joueurs.map((joueur) => (
          <button
            key={joueur.id}
            onClick={() => toggle(joueur.id)}
            className={`px-2 py-1 rounded ${
              selected.includes(joueur.id) ? "bg-green-500 text-white" : "bg-gray-200"
            }`}
          >
            #{joueur.numero} {joueur.nom}
          </button>
        ))}
      </div>
      <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-1 rounded">
        Sauvegarder
      </button>
    </div>
  );
};

export default PhotoSelector;
