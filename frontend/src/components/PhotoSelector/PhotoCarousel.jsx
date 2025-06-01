// src/components/PhotoCarousel.jsx
import { useState, useEffect } from "react";
import { assignJoueurs } from "../../utils/api";
import "./PhotoCarousel.css";
import { ChevronLeft, ChevronRight } from "lucide-react";
import usePreloadImages from "../../hooks/usePreloadImages";

const PhotoCarousel = ({
  photos = [],
  joueurs = [],
  /* props venant du parent : */
  index: indexProp,            // ← nouvel arg. (l’index courant que le parent veut fixer)
  onIndexChange,               // idem
  onCopyPrevious,              // callback pour copier la photo précédente
  onShortcutAdd = () => {},    // ← ***ICI***: valeur par défaut (noop)
}) => {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState([]);
  const [jump, setJump] = useState("");


  usePreloadImages(photos, index, 5); // pré-chargement léger
  /* --- navigation ------------------------------------------------------- */
  const prev = () =>
    setIndex((i) => (i > 0 ? i - 1 : photos.length - 1));
  const next = () =>
    setIndex((i) => (i < photos.length - 1 ? i + 1 : 0));


  useEffect(() => {
    onIndexChange?.(index);
  }, [index, onIndexChange]);

  /* --- assignation joueur ---------------------------------------------- */
  const toggle = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((j) => j !== id) : [...prev, id]
    );
  };

  useEffect(() => {
  function handleKey(e) {
    if (!photos.length) return;

    /* navigation ---------------------------------- */
    if (e.key === "ArrowRight") {
      e.preventDefault();
      next();
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      prev();
    }

    /* copier tous les joueurs de la photo précédente */
    if (e.key.toLowerCase() === "z") {
      const prevIndex = index > 0 ? index - 1 : photos.length - 1;
      onCopyPrevious?.(photos[prevIndex]);
    }

    /* raccourcis 0-9  -------------------------------- */
    if (e.code.startsWith("Digit")) {
      const digit = Number(e.code.slice(5));     // "Digit7" -> 7
      const num   = digit === 0 ? 9 : digit - 1; // 0→9, 1→0, 2→1 …

      const joueur = joueurs[num];
      if (!joueur) return;                       // pas assez de joueurs

      const equipe = e.shiftKey ? "Équipe B" : "Équipe A";
      onShortcutAdd?.({ ...joueur, equipe });
    }
  }

  window.addEventListener("keydown", handleKey);
  return () => window.removeEventListener("keydown", handleKey);
}, [index, photos, joueurs, onCopyPrevious, onShortcutAdd]);


  const handleCopyPrev = () => {
    if (!photos.length) return;
    const prevIndex = index > 0 ? index - 1 : photos.length - 1;
    const prevPhoto = photos[prevIndex];
    onCopyPrevious?.(prevPhoto);
  };

  /* --- garde quand aucune photo ---------------------------------------- */
  if (!photos.length) return <p>Aucune photo</p>;

  /* --- rendu ----------------------------------------------------------- */
  return (
    <div className="carousel-wrapper">
      <div className="carousel-jump">
        <div style={{ textAlign: "center", marginBottom: 8 }}>
          <button
            onClick={handleCopyPrev}
            style={{
              backgroundColor: "#ff9800",
              color: "#fff",
              border: "none",
              padding: "6px 12px",
              borderRadius: 8,
              cursor: "pointer",
            }}
          >
            Copier depuis la photo précédente
          </button>
        </div>
        <input
          type="number"
          min="1"
          max={photos.length}
          placeholder="N°"
          value={jump}
          onChange={(e) => setJump(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleGo();
          }}
        />
        <button onClick={handleGo}>Go</button>
      </div>
      <h2 className="carousel-title">
        {photos[index].filename}
      </h2>
      <span className="image-counter">
        {index + 1} / {photos.length}
      </span>
      <button className="carousel-button" style={{ left: 0 }} onClick={prev}>
        <ChevronLeft size={24} />
      </button>

      <img
        className="carousel-image"
        src={photos[index].wasabiUrl}
        alt={photos[index].filename}
        loading="lazy"
      />

      <button className="carousel-button" style={{ right: 0 }} onClick={next}>
        <ChevronRight size={24} />
      </button>

      


    </div>
  );
  function handleGo() {
    const n = parseInt(jump, 10);
    if (n >= 1 && n <= photos.length) {
      setIndex(n - 1);          // tableau 0-based → input 1-based
      onIndexChange?.(n - 1);
    }
    setJump("");                // reset le champ
  }
};

export default PhotoCarousel;
