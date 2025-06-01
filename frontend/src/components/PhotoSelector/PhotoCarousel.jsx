// src/components/PhotoCarousel.jsx
import { useState, useEffect } from "react";
import { assignJoueurs } from "../../utils/api";
import "./PhotoCarousel.css";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PhotoCarousel = ({ photos, joueurs }) => {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState([]);

  const toggle = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((j) => j !== id) : [...prev, id]
    );
  };

  const handleSave = async () => {
    await assignJoueurs(photos[index].filename, selected);
    alert("Joueurs assignés !");
  };

  const prev = () => setIndex((i) => (i > 0 ? i - 1 : photos.length - 1));
  const next = () => setIndex((i) => (i < photos.length - 1 ? i + 1 : 0));

  if (!photos.length) return <p>Aucune photo.</p>;

  useEffect(() => {
  if (photos.length > 0) {
    const nextIndex = (index + 1) % photos.length;
    const preloadImg = new Image();
    preloadImg.src = photos[nextIndex].wasabiUrl;
  }
}, [index, photos]);


  return (
    <div className="carousel-wrapper">
      <button className="carousel-button" onClick={prev} style={{ left: 0 }}>
        <ChevronLeft size={24} />
      </button>

      <img
        src={photos[index].wasabiUrl}
        alt={photos[index].filename}
        className="carousel-image"
        loading="lazy"
      />

      <button className="carousel-button" onClick={next} style={{ right: 0 }}>
        <ChevronRight size={24} />
      </button>

      <div className="joueurs-container">
        {joueurs.map((joueur) => (
          <button
            key={joueur.id}
            onClick={() => toggle(joueur.id)}
            className={`joueur-btn ${
              selected.includes(joueur.id) ? "selected" : ""
            }`}
          >
            #{joueur.numero} {joueur.nom}
          </button>
        ))}
      </div>

      <button onClick={handleSave} className="save-button">
        Sauvegarder
      </button>
    </div>
  );
};

export default PhotoCarousel;
