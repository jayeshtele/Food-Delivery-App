import { useEffect, useMemo, useState } from "react";
import { DEFAULT_FOOD_IMAGE, getFoodFallbackImage } from "../utils/imageFallback";

export default function SmartImage({
  src,
  alt,
  fallbackName,
  className = "",
  loading = "lazy",
  ...props
}) {
  const fallbackSrc = useMemo(
    () => getFoodFallbackImage(fallbackName || alt),
    [alt, fallbackName],
  );
  const preferredSrc = src?.trim() ? src : fallbackSrc;
  const [currentSrc, setCurrentSrc] = useState(preferredSrc);

  useEffect(() => {
    setCurrentSrc(preferredSrc);
  }, [preferredSrc]);

  const handleError = () => {
    if (currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      return;
    }

    if (currentSrc !== DEFAULT_FOOD_IMAGE) {
      setCurrentSrc(DEFAULT_FOOD_IMAGE);
    }
  };

  return (
    <img
      {...props}
      src={currentSrc}
      alt={alt}
      className={className}
      loading={loading}
      onError={handleError}
    />
  );
}
