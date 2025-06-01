import { createContext, useContext, useState } from "react";
import { apiFetch } from "../utils/api";

const PhotoContext = createContext();

export const PhotoProvider = ({ children }) => {
  const [photos, setPhotos] = useState([]);

  const fetchPhotosByMatch = async (matchName) => {
    try {
      const res = await apiFetch(`/api/photos/${matchName}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      const data = await res.json();
      setPhotos(data.photos);
    } catch (err) {
      console.error("Erreur fetch photos:", err);
    }
  };

  return (
    <PhotoContext.Provider value={{ photos, setPhotos, fetchPhotosByMatch }}>
      {children}
    </PhotoContext.Provider>
  );
};

export const usePhotos = () => useContext(PhotoContext);
