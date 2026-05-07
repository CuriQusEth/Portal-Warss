import React, { useEffect, useRef } from 'react';
import { GameEngine, Team, UnitType } from '../lib/game/engine';

interface GameCanvasProps {
  engine: GameEngine;
  onPortalPlace: () => void;
}

export function GameCanvas({ engine, onPortalPlace }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let animationFrameId: number;
    
    const render = () => {
      engine.tick();
      
      // Clear
      ctx.fillStyle = '#050510'; // Dark atmospheric night
      ctx.fillRect(0, 0, engine.width, engine.height);
      
      // Draw Grid / Arena markings
      ctx.strokeStyle = 'rgba(255,255,255,0.05)';
      ctx.lineWidth = 1;
      for(let x=0; x < engine.width; x += 50) {
          ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, engine.height); ctx.stroke();
      }
      for(let y=0; y < engine.height; y += 50) {
          ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(engine.width, y); ctx.stroke();
      }
      
      // Draw Portals
      engine.portals.forEach(p => {
          ctx.save();
          ctx.translate(p.pos.x, p.pos.y);
          
          // Glow
          const time = Date.now() / 500;
          const scale = 1 + Math.sin(time) * 0.1;
          
          ctx.scale(scale, scale);
          
          ctx.beginPath();
          ctx.arc(0, 0, 25, 0, Math.PI * 2);
          ctx.fillStyle = p.team === Team.PLAYER ? 'rgba(59, 130, 246, 0.4)' : 'rgba(239, 68, 68, 0.4)';
          ctx.fill();
          
          ctx.beginPath();
          ctx.arc(0, 0, 15, 0, Math.PI * 2);
          ctx.fillStyle = p.team === Team.PLAYER ? '#3b82f6' : '#ef4444';
          ctx.fill();
          
          // HP Bar
          ctx.restore();
          ctx.fillStyle = '#333';
          ctx.fillRect(p.pos.x - 20, p.pos.y - 40, 40, 4);
          ctx.fillStyle = '#10b981';
          ctx.fillRect(p.pos.x - 20, p.pos.y - 40, 40 * (p.hp / p.maxHp), 4);
      });
      
      // Draw Units
      engine.units.forEach(u => {
          ctx.save();
          ctx.translate(u.pos.x, u.pos.y);
          
          // Target rotation
          if (u.target) {
              const angle = Math.atan2(u.target.pos.y - u.pos.y, u.target.pos.x - u.pos.x);
              ctx.rotate(angle);
          }
          
          ctx.fillStyle = u.team === Team.PLAYER ? '#60a5fa' : '#f87171';
          
          if (u.type === UnitType.WARRIOR) {
              ctx.fillRect(-6, -6, 12, 12);
          } else {
              ctx.beginPath();
              ctx.moveTo(8, 0);
              ctx.lineTo(-6, 6);
              ctx.lineTo(-6, -6);
              ctx.fill();
          }
          ctx.restore();
          
          // Small HP
          if(u.hp < u.maxHp) {
             ctx.fillStyle = '#ef4444';
             ctx.fillRect(u.pos.x - 6, u.pos.y - 12, 12 * (u.hp / u.maxHp), 2);
          }
      });
      
      // Draw Particles
      engine.particles.forEach(p => {
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.life / p.maxLife;
          ctx.beginPath();
          ctx.arc(p.pos.x, p.pos.y, 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1.0;
      });
      
      animationFrameId = requestAnimationFrame(render);
    };
    
    render();
    
    return () => {
        cancelAnimationFrame(animationFrameId);
    };
  }, [engine]);
  
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if(!rect) return;
      const x = (e.clientX - rect.left) * (engine.width / rect.width);
      const y = (e.clientY - rect.top) * (engine.height / rect.height);
      
      engine.addPlayerPortal({ x, y });
      onPortalPlace();
      // Try vibrate
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
          navigator.vibrate(50);
      }
  };

  return (
    <canvas 
        ref={canvasRef}
        width={engine.width}
        height={engine.height}
        onPointerDown={handlePointerDown}
        className="w-full h-full object-contain touch-none cursor-crosshair"
    />
  );
}
