// src/hooks/usePreloadImages.js
import { useEffect } from "react";

export default function usePreloadImages(photos, index, radius = 3) {
  useEffect(() => {
    if (!photos.length) return;

    const preloaders = [];
    for (let offset = -radius; offset <= radius; offset++) {
      const i = (index + offset + photos.length) % photos.length;
      const { wasabiUrl } = photos[i];
      const img = new Image();
      img.src = wasabiUrl;
      preloaders.push(img);
    }

    // facultatif : clean pour libérer de la RAM
    return () => preloaders.forEach((img) => (img.src = ""));
  }, [photos, index, radius]);
}
