/**
 * ═══════════════════════════════════════════════════════════
 * PROJECT IMAGE — LYRIX OS
 * Smart image wrapper: loads real image if available,
 * falls back to NoSignalPlaceholder on error or empty path.
 * ═══════════════════════════════════════════════════════════
 */

import { useState } from 'react';
import NoSignalPlaceholder from './NoSignalPlaceholder';

interface ProjectImageProps {
  /** Image URL / path */
  src?: string;
  /** Alt text */
  alt: string;
  /** Fallback gradient for the placeholder */
  gradient?: [string, string];
  /** Fallback label */
  label?: string;
  /** Additional classes on the outer wrapper */
  className?: string;
}

export default function ProjectImage({
  src,
  alt,
  gradient,
  label,
  className = '',
}: ProjectImageProps) {
  const [hasError, setHasError] = useState(false);

  // If no src or a previous load error → placeholder
  if (!src || hasError) {
    return (
      <NoSignalPlaceholder
        gradient={gradient}
        label={label}
        className={className}
      />
    );
  }

  return (
    <div className={`relative w-full aspect-video overflow-hidden ${className}`}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onError={() => setHasError(true)}
        className="w-full h-full object-cover"
      />
    </div>
  );
}
