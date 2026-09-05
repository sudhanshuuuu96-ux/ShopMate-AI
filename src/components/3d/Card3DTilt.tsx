'use client';

import React, { useRef, useState } from 'react';

interface Card3DTiltProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  glowColor?: string;
}

export function Card3DTilt({
  children,
  className = '',
  maxTilt = 10,
  glowColor = 'rgba(99, 102, 241, 0.25)',
}: Card3DTiltProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({});
  const [glareStyle, setGlareStyle] = useState<React.CSSProperties>({ opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = -((y - centerY) / centerY) * maxTilt;
    const rotateY = ((x - centerX) / centerX) * maxTilt;

    setStyle({
      transform: `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(6px)`,
      transition: 'transform 0.08s ease-out',
      boxShadow: `0 20px 35px -10px ${glowColor}, 0 0 15px 0 ${glowColor}`,
    });

    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    setGlareStyle({
      opacity: 0.35,
      background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 65%)`,
      transition: 'opacity 0.2s ease',
    });
  };

  const handleMouseLeave = () => {
    setStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)',
      transition: 'transform 0.5s ease-out, box-shadow 0.5s ease-out',
    });
    setGlareStyle({
      opacity: 0,
      transition: 'opacity 0.5s ease-out',
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={style}
      className={`relative rounded-2xl will-change-transform transform-gpu ${className}`}
    >
      {/* Specular Glare Layer */}
      <div
        style={glareStyle}
        className="pointer-events-none absolute inset-0 z-20 rounded-2xl overflow-hidden"
      />
      {children}
    </div>
  );
}
