import { useEffect, useState } from "react";
import { fetchMatchs } from "../utils/api";
import { useNavigate } from "react-router-dom";
import "./HomePage.css"; // pour ajouter du CSS pur

const HomePage = () => {
  const [matchs, setMatchs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMatchs()
      .then((data) => {
        setMatchs(data);
      })
      .catch((err) => {
        console.error("Erreur en récupérant les matchs:", err);
      });
  }, []);

  const handleClick = (matchName) => {
    navigate(`/match/${matchName}`);
  };

  return (
    <div className="homepage">
      <h1 className="homepage-title">Choisis ton match</h1>
      <div className="match-list">
        {matchs.map((match, i) => (
          <button
            key={i}
            className="match-button"
            onClick={() => handleClick(match)}
          >
            {match}
          </button>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
