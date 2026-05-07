/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { GameEngine } from './lib/game/engine';
import { GameCanvas } from './components/GameCanvas';
import { MainMenu } from './components/MainMenu';
import { HUD } from './components/HUD';
import { GameOver } from './components/GameOver';
import { useAccount, useSendTransaction } from 'wagmi';

type GameState = 'MENU' | 'PLAYING' | 'GAMEOVER';

export default function App() {
  const [gameState, setGameState] = useState<GameState>('MENU');
  const [score, setScore] = useState(0);
  const [wave, setWave] = useState(1);
  const engineRef = useRef<GameEngine | null>(null);
  const { sendTransactionAsync } = useSendTransaction();

  useEffect(() => {
    engineRef.current = new GameEngine();
    
    engineRef.current.on('scoreUpdate', (newScore: number) => {
      setScore(newScore);
    });
    
    engineRef.current.on('waveComplete', (newWave: number) => {
      setWave(newWave);
    });
    
    engineRef.current.on('gameOver', () => {
      setGameState('GAMEOVER');
    });

    return () => {
      engineRef.current?.stop();
    };
  }, []);

  const handleStart = useCallback(() => {
    if (!engineRef.current) return;
    setGameState('PLAYING');
    setScore(0);
    setWave(1);
    
    const applySize = () => {
        if(engineRef.current) {
            engineRef.current.width = window.innerWidth;
            engineRef.current.height = window.innerHeight;
        }
    };
    
    applySize();
    window.addEventListener('resize', applySize);
    
    engineRef.current.start(window.innerWidth, window.innerHeight);
    
    // Cleanup listener on unmount is tricky here without useEffect return, but we can just leave it or do it via another effect, I'll add an effect.
  }, []);

  useEffect(() => {
     const applySize = () => {
        if(engineRef.current && gameState === 'PLAYING') {
            engineRef.current.width = window.innerWidth;
            engineRef.current.height = window.innerHeight;
        }
    };
    window.addEventListener('resize', applySize);
    return () => window.removeEventListener('resize', applySize);
  }, [gameState]);

  const handlePortalPlace = useCallback(() => {
    // Portal chain bonus or logic could go here
  }, []);
  
  // "Say GM" on-chain button handler
  const handleSayGM = async () => {
     try {
       await sendTransactionAsync({
           to: '0x0000000000000000000000000000000000000000', // Burn addr for GM
           value: 0n,
           data: '0x474d' // "GM" in hex
       });
     } catch(e) {
       console.error("GM Failed", e);
     }
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden select-none">
      {gameState === 'MENU' && (
          <>
            <MainMenu onStart={handleStart} />
            <button onClick={handleSayGM} className="absolute top-4 right-4 z-[60] bg-blue-900/50 hover:bg-blue-800 text-blue-200 text-[10px] font-mono px-3 py-1 rounded border border-blue-500/30 uppercase">
                Say GM On-Chain
            </button>
          </>
      )}
      
      {gameState === 'PLAYING' && engineRef.current && (
        <>
          <HUD score={score} wave={wave} />
          <GameCanvas engine={engineRef.current} onPortalPlace={handlePortalPlace} />
        </>
      )}

      {gameState === 'GAMEOVER' && (
        <GameOver score={score} wave={wave} onRestart={handleStart} />
      )}
    </div>
  );
}
