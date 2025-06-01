// src/components/FadeInImage.jsx
import { useState } from "react";

export default function FadeInImage({ thumb, full, alt, ...props }) {
  const [src, setSrc] = useState(thumb ?? full);

  return (
    <img
      {...props}
      src={src}
      alt={alt}
      onLoad={() => src === thumb && setSrc(full)}
      style={{
        filter: src === thumb ? "blur(10px)" : "none",
        transition: "filter .3s ease",
        ...props.style,
      }}
    />
  );
}
