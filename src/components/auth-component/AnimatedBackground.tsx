"use client";

import { useEffect, useRef } from "react";

export function AnimatedBackground() {
  const spotlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!spotlightRef.current) return;
      const { clientX, clientY } = e;
      
      // Mengubah posisi spotlight kursor secara efisien
      spotlightRef.current.style.left = `${clientX}px`;
      spotlightRef.current.style.top = `${clientY}px`;
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="auth-bg-container">
      {/* Dynamic Background Animated Mesh */}
      <div className="mesh-gradient" />

      {/* Floating Animated Orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />

      {/* Interactive Cursor Light Effect */}
      <div ref={spotlightRef} className="cursor-spotlight" />
    </div>
  );
}