'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Bot, ShieldCheck, Sparkles, Zap, ShoppingCart, ArrowRight } from 'lucide-react';
import { useStore } from '@/context/StoreContext';

export function Hero3DScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { setChatInitialPrompt, setIsChatOpen } = useStore();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 500);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 450);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    // 3D Particles Sphere & Orbital Rings
    const PARTICLE_COUNT = 120;
    const RADIUS = Math.min(width, height) * 0.32;
    const particles: { x: number; y: number; z: number; color: string; size: number }[] = [];

    const colors = ['#6366f1', '#a855f7', '#06b6d4', '#ec4899', '#38bdf8'];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const theta = Math.acos(2 * Math.random() - 1);
      const phi = 2 * Math.PI * Math.random();
      particles.push({
        x: RADIUS * Math.sin(theta) * Math.cos(phi),
        y: RADIUS * Math.sin(theta) * Math.sin(phi),
        z: RADIUS * Math.cos(theta),
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 2.5 + 1.5,
      });
    }

    // Orbital ring points
    const RING_POINTS = 60;
    const ringParticles: { angle: number; radius: number; color: string }[] = [];
    for (let i = 0; i < RING_POINTS; i++) {
      ringParticles.push({
        angle: (i / RING_POINTS) * Math.PI * 2,
        radius: RADIUS * 1.35,
        color: i % 2 === 0 ? '#818cf8' : '#38bdf8',
      });
    }

    let angleX = 0;
    let angleY = 0;
    let targetAngleX = 0;
    let targetAngleY = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse interpolation
      angleX += (targetAngleX - angleX) * 0.05 + 0.003;
      angleY += (targetAngleY - angleY) * 0.05 + 0.005;

      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);
      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);

      const fov = 380;
      const centerX = width / 2;
      const centerY = height / 2;

      // Draw Orbiting Ring 1 (tilted)
      ctx.beginPath();
      for (let i = 0; i <= RING_POINTS; i++) {
        const p = ringParticles[i % RING_POINTS];
        const currentAngle = p.angle + angleY * 1.5;
        const rx = p.radius * Math.cos(currentAngle);
        const ry = p.radius * Math.sin(currentAngle) * 0.4;
        const rz = p.radius * Math.sin(currentAngle) * 0.8;

        const rotX = rx * cosY - rz * sinY;
        const rotZ = rx * sinY + rz * cosY;
        const rotY = ry * cosX - rotZ * sinX;
        const finalZ = ry * sinX + rotZ * cosX;

        const scale = fov / (fov + finalZ + RADIUS);
        const projX = centerX + rotX * scale;
        const projY = centerY + rotY * scale;

        if (i === 0) ctx.moveTo(projX, projY);
        else ctx.lineTo(projX, projY);
      }
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.25)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Render 3D Sphere Particles sorted by depth (Z-buffer simulation)
      const projected = particles.map(p => {
        // Rotate around Y
        const x1 = p.x * cosY - p.z * sinY;
        const z1 = p.x * sinY + p.z * cosY;
        // Rotate around X
        const y2 = p.y * cosX - z1 * sinX;
        const z2 = p.y * sinX + z1 * cosX;

        const scale = fov / (fov + z2 + RADIUS);
        const projX = centerX + x1 * scale;
        const projY = centerY + y2 * scale;
        const alpha = Math.max(0.15, (z2 + RADIUS) / (2 * RADIUS));

        return { projX, projY, scale, alpha, color: p.color, size: p.size, z: z2 };
      });

      projected.sort((a, b) => a.z - b.z);

      // Connect nearby particles with glowing cyber lines
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const dx = projected[i].projX - projected[j].projX;
          const dy = projected[i].projY - projected[j].projY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 42 && projected[i].alpha > 0.3) {
            ctx.beginPath();
            ctx.moveTo(projected[i].projX, projected[i].projY);
            ctx.lineTo(projected[j].projX, projected[j].projY);
            ctx.strokeStyle = `rgba(139, 92, 246, ${0.2 * projected[i].alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // Draw points with glowing core
      projected.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.projX, p.projY, Math.max(1, p.size * p.scale), 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1.0;
      });

      // Ambient Central Hologram Core Glow
      const grad = ctx.createRadialGradient(centerX, centerY, 10, centerX, centerY, RADIUS * 0.7);
      grad.addColorStop(0, 'rgba(129, 140, 248, 0.25)');
      grad.addColorStop(0.5, 'rgba(168, 85, 247, 0.08)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, RADIUS * 0.7, 0, Math.PI * 2);
      ctx.fill();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleMouseMove = (e: MouseEvent) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      targetAngleY = (x / (rect.width / 2)) * 0.8;
      targetAngleX = -(y / (rect.height / 2)) * 0.8;
      setMousePos({ x, y });
    };

    const c = containerRef.current;
    if (c) c.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (c) c.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleLaunchAI = (prompt: string) => {
    setChatInitialPrompt(prompt);
    setIsChatOpen(true);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[460px] sm:h-[480px] rounded-3xl overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950/80 border border-indigo-500/30 shadow-2xl flex items-center justify-center select-none"
    >
      {/* 3D Interactive WebGL/Canvas Hologram */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
      />

      {/* Floating 3D Depth Card 1: Top-Left Agent Status */}
      <div
        style={{
          transform: `translate3d(${mousePos.x * -0.04}px, ${mousePos.y * -0.04}px, 40px)`,
          transition: 'transform 0.15s ease-out',
        }}
        className="absolute top-6 left-6 z-20 hidden sm:flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl bg-slate-900/85 backdrop-blur-xl border border-indigo-400/40 shadow-xl shadow-indigo-950/50"
      >
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md">
          <Bot className="w-4 h-4" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-white">ShopMate Agent</span>
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <p className="text-[10px] text-slate-300">Gemini Function Calling • Multi-Turn</p>
        </div>
      </div>

      {/* Floating 3D Depth Card 2: Top-Right Razorpay Gateway Badge */}
      <div
        style={{
          transform: `translate3d(${mousePos.x * 0.05}px, ${mousePos.y * 0.05}px, 30px)`,
          transition: 'transform 0.15s ease-out',
        }}
        className="absolute top-6 right-6 z-20 flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-slate-900/85 backdrop-blur-xl border border-emerald-400/40 shadow-xl shadow-emerald-950/40"
      >
        <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
          <ShieldCheck className="w-4 h-4" />
        </div>
        <div className="text-left">
          <span className="text-xs font-bold text-emerald-400">Razorpay Verified</span>
          <span className="block text-[9px] text-slate-400">256-Bit SHA256 Gate</span>
        </div>
      </div>

      {/* Floating 3D Depth Card 3: Center Holographic Live Showcase */}
      <div
        style={{
          transform: `translate3d(${mousePos.x * -0.02}px, ${mousePos.y * -0.02}px, 60px)`,
          transition: 'transform 0.1s ease-out',
        }}
        className="relative z-20 text-center max-w-sm px-6 py-6 rounded-3xl bg-slate-900/75 backdrop-blur-2xl border border-white/15 shadow-2xl shadow-purple-950/60 pointer-events-auto"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-[11px] font-semibold mb-3">
          <Sparkles className="w-3 h-3 text-indigo-300 animate-spin-slow" />
          <span>Interactive 3D Agentic Commerce</span>
        </div>

        <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight leading-snug">
          "I need gaming headphones under ₹3,000."
        </h3>

        <p className="text-xs text-slate-300 mt-2 leading-relaxed">
          ShopMate discovers products, calculates real-time discounts, suggests matching RGB accessories, and triggers safe test checkout.
        </p>

        <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-2">
          <button
            onClick={() => handleLaunchAI('I need gaming headphones under ₹3000.')}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 text-white text-xs font-bold shadow-lg shadow-indigo-500/30 transition-all flex items-center justify-center gap-1.5 hover:scale-105 active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Try AI Prompt</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => handleLaunchAI('What are your best mechanical keyboards?')}
            className="w-full sm:w-auto px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-slate-200 text-xs font-medium transition-all"
          >
            ⌨️ Keyboards
          </button>
        </div>
      </div>

      {/* Floating 3D Depth Card 4: Bottom-Left Metrics Pill */}
      <div
        style={{
          transform: `translate3d(${mousePos.x * 0.03}px, ${mousePos.y * 0.03}px, 20px)`,
          transition: 'transform 0.15s ease-out',
        }}
        className="absolute bottom-6 left-6 z-20 hidden md:flex items-center gap-3 px-3.5 py-2 rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-purple-500/30 shadow-lg text-slate-300 text-xs"
      >
        <Zap className="w-4 h-4 text-amber-400" />
        <span>
          Avg Upsell Lift: <strong className="text-white">+₹699</strong> per order
        </span>
      </div>

      {/* Floating 3D Depth Card 5: Bottom-Right Coupon Chip */}
      <div
        style={{
          transform: `translate3d(${mousePos.x * -0.03}px, ${mousePos.y * -0.03}px, 25px)`,
          transition: 'transform 0.15s ease-out',
        }}
        className="absolute bottom-6 right-6 z-20 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-rose-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold"
      >
        <span>🏷️ Code:</span>
        <span className="font-mono tracking-wider text-white bg-black/40 px-2 py-0.5 rounded">SHOPMATE10</span>
        <span className="text-[10px] text-amber-200">(10% OFF)</span>
      </div>

      {/* Ambient Neon Blobs */}
      <div className="absolute -top-12 left-1/4 w-72 h-72 bg-indigo-600/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 right-1/4 w-72 h-72 bg-purple-600/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
}
