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
import { Sun } from 'lucide-react';

type GameState = 'MENU' | 'PLAYING' | 'GAMEOVER';

export default function App() {
  const [gameState, setGameState] = useState<GameState>('MENU');
  const [score, setScore] = useState(0);
  const [wave, setWave] = useState(1);
  const engineRef = useRef<GameEngine | null>(null);
  const { address, isConnected } = useAccount();
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
  const sendGMTransaction = async () => {
     try {
       await sendTransactionAsync({
           to: '0xcD0dd3716C5561De47a24949335dF8a8CD8F71a3', // GM Contract
           value: 0n,
           data: '0x' // Add GM selector if needed, or just 0 ETH transfer as example
       });
     } catch(e) {
       console.error("GM Failed", e);
     }
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden select-none">
      {/* Top right container for standard persistent UI buttons across all stages */}
      <div className="absolute top-4 right-4 z-[60] flex items-center gap-2">
        {isConnected && (
            <button 
                onClick={sendGMTransaction} 
                className="px-3 py-2 rounded-lg bg-[#E8A020]/20 hover:bg-[#E8A020]/30 border border-[#E8A020]/40 text-[#E8A020] transition-colors flex items-center gap-2 font-['Cinzel'] text-xs font-bold"
            >
                <Sun size={14} />
                Say GM
            </button>
        )}
      </div>

      {gameState === 'MENU' && (
          <MainMenu onStart={handleStart} />
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
