'use client';

import { useEffect, useRef, useState } from 'react';
import * as skinview3d from 'skinview3d';

interface Props {
  skinUrl: string | null | undefined;
  width?: number;
  height?: number;
}

export default function SkinViewer3D({ skinUrl, width = 280, height = 350 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const viewerRef = useRef<skinview3d.SkinViewer | null>(null);

  useEffect(() => {
    if (!canvasRef.current || !skinUrl) return;

    let isMounted = true;

    const initViewer = async () => {
      // Nettoyage propre avant de recommencer
      if (viewerRef.current) {
        viewerRef.current.dispose();
        viewerRef.current = null;
      }

      setLoading(true);
      setError(false);

      try {
        // 1. On vérifie manuellement si l'image charge au niveau du navigateur
        // avant de la donner à skinview3d
        await new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = resolve;
          img.onerror = reject;
          img.src = skinUrl;
        });

        if (!isMounted) return;

        // 2. Initialisation du moteur 3D
        const viewer = new skinview3d.SkinViewer({
          canvas: canvasRef.current!,
          width: width,
          height: height,
        });

        viewerRef.current = viewer;

        // Configuration
        viewer.animation = new skinview3d.WalkingAnimation();
        viewer.autoRotate = true;
        viewer.autoRotateSpeed = 0.6;
        viewer.camera.position.set(-20, 15, 40);

        // Chargement du skin
        await viewer.loadSkin(skinUrl);

        if (isMounted) {
          setLoading(false);
        }
      } catch (err) {
        console.error("Échec chargement skin (URL possiblement 404):", skinUrl);
        if (isMounted) {
          setError(true);
          setLoading(false);
        }
      }
    };

    initViewer();

    return () => {
      isMounted = false;
      if (viewerRef.current) {
        viewerRef.current.dispose();
        viewerRef.current = null;
      }
    };
  }, [skinUrl, width, height]);

  if (!skinUrl) return (
    <div className="flex items-center justify-center bg-white/[0.02] rounded-[2.5rem] border border-dashed border-white/5 text-neutral-600 text-[10px] font-black uppercase tracking-widest" style={{ width, height }}>
      En attente du Skin
    </div>
  );

  return (
    <div className="relative group overflow-hidden rounded-[2.5rem] bg-black/40 border border-white/5 shadow-2xl" style={{ width, height }}>
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a0612]/80 z-20 backdrop-blur-md">
          <div className="w-5 h-5 border-2 border-[#683892] border-t-transparent rounded-full animate-spin mb-3" />
          <span className="text-[8px] font-black text-white/40 uppercase tracking-widest">Matérialisation...</span>
        </div>
      )}

      {error ? (
        <div className="flex flex-col items-center justify-center h-full w-full p-8 text-center bg-red-500/5">
          <span className="text-xl mb-2">🌑</span>
          <span className="text-[10px] font-black text-red-500 uppercase mb-1">Erreur de Flux</span>
          <p className="text-[8px] text-neutral-500 uppercase leading-relaxed font-bold">
            Le fichier est introuvable sur le serveur.
          </p>
        </div>
      ) : (
        <canvas ref={canvasRef} className="cursor-grab active:cursor-grabbing outline-none" />
      )}
    </div>
  );
}