import { useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';

export function ImageWithFallback({ src, alt, className = "" }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  if (!src || error) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 ${className}`}>
        <ImageIcon className="h-12 w-12 text-gray-300" />
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Skeleton loader */}
      {!loaded && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse rounded" />
      )}
      <img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        className={`
          w-full h-full object-contain
          transition-opacity duration-300 ease-in-out
          ${loaded ? 'opacity-100' : 'opacity-0'}
        `}
        style={{
          imageRendering: 'auto',
          WebkitFontSmoothing: 'antialiased',
        }}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}
