import { useEffect, useRef, useState } from 'react';

export function Lightbox({ photos, start, onClose }: { photos: string[]; start: number; onClose: () => void }) {
  const strip = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(start);

  const go = (i: number) => {
    const s = strip.current!;
    s.scrollTo({ left: Math.max(0, Math.min(photos.length - 1, i)) * s.clientWidth, behavior: 'smooth' });
  };

  useEffect(() => {
    const s = strip.current!;
    s.scrollLeft = start * s.clientWidth;
    document.body.style.overflow = 'hidden';
    return () => void (document.body.style.overflow = '');
  }, [start]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') go(index + 1);
      if (e.key === 'ArrowLeft') go(index - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label="Fotogalerij">
      <div
        ref={strip}
        className="lightbox-strip"
        onScroll={(e) => setIndex(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))}
      >
        {photos.map((src, i) => (
          <div key={i} className="lightbox-slide" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <img src={src} alt={`Foto ${i + 1}`} />
          </div>
        ))}
      </div>
      <button className="lightbox-close" onClick={onClose} aria-label="Sluiten">
        ✕
      </button>
      {index > 0 && (
        <button className="lightbox-nav prev" onClick={() => go(index - 1)} aria-label="Vorige foto">
          ‹
        </button>
      )}
      {index < photos.length - 1 && (
        <button className="lightbox-nav next" onClick={() => go(index + 1)} aria-label="Volgende foto">
          ›
        </button>
      )}
      <div className="lightbox-count">
        {index + 1} / {photos.length}
      </div>
    </div>
  );
}
