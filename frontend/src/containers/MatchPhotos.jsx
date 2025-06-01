import { useEffect, useState } from "react";
import { fetchPhotos } from "../utils/api";
import PhotoCarousel from "../components/PhotoSelector/PhotoCarousel";
import { useParams } from "react-router-dom";

const joueursExemple = [
  { id: "j7", numero: 7, nom: "Touré" },
  { id: "j10", numero: 10, nom: "Mbappé" },
  { id: "j4", numero: 4, nom: "Diaz" },
];

const MatchPhotos = () => {
  const [photos, setPhotos] = useState([]);
  const { matchName } = useParams();

  useEffect(() => {
    fetchPhotos(matchName)
      .then((data) => {
        if (data?.photos) {
          setPhotos(data.photos);
        } else {
          console.error("Pas de photos dans data :", data);
        }
      })
      .catch((err) => {
        console.error("Erreur lors du fetch :", err);
      });
  }, [matchName]);

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Photos du match</h1>
      {photos.length > 0 ? (
        <PhotoCarousel photos={photos} joueurs={joueursExemple} />
      ) : (
        <p className="text-center text-gray-500">Aucune photo trouvée.</p>
      )}
    </div>
  );
};

export default MatchPhotos;
