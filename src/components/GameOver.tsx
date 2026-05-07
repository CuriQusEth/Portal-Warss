import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAccount, useConnect, useSignMessage, useSendTransaction } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { generateSIWEMessage, withAttribution } from '../lib/erc8021';
import { stringToHex, parseEther } from 'viem';

interface GameOverProps {
  score: number;
  wave: number;
  onRestart: () => void;
}

export function GameOver({ score, wave, onRestart }: GameOverProps) {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { signMessageAsync } = useSignMessage();
  const { sendTransactionAsync, isPending } = useSendTransaction();
  const [status, setStatus] = useState<string>('');
  const [txHash, setTxHash] = useState<string>('');

  const handleConnect = () => {
    connect({ connector: injected() });
  };

  const handleRecordScore = async () => {
    if (!address) return;
    try {
      setStatus('Signing SIWE Message...');
      const message = generateSIWEMessage(address, score, wave);
      await signMessageAsync({ account: address as `0x${string}`, message });
      
      setStatus('Recording on Base Mainnet...');
      // Encode score data to hex and affix ERC-8021 attribution
      const rawData = stringToHex(JSON.stringify({ score, wave }));
      const calldata = withAttribution(rawData);
      
      // Sending a 0 ETH transaction to self on Base with the attribution calldata
      const tx = await sendTransactionAsync({
        to: address, 
        value: parseEther('0'),
        data: calldata as `0x${string}`
      });
      
      setTxHash(tx);
      setStatus('Success! Recorded in the Portal Codex.');
    } catch (err: any) {
      console.error(err);
      setStatus(`Failed: ${err.shortMessage || err.message}`);
    }
  };

  return (
    <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center p-6 text-center z-50 fallback-bg">
      <motion.div 
        initial={{ y: 50, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }}
      >
        <h2 className="text-4xl md:text-6xl font-black text-red-500 uppercase tracking-tighter mb-2" style={{ fontFamily: 'var(--font-display)' }}>Realm Defeated</h2>
        
        <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-lg my-8 w-full max-w-sm">
            <div className="flex justify-between items-center border-b border-gray-800 pb-2 mb-2">
                <span className="text-gray-500 text-xs uppercase tracking-widest font-mono">Highest Wave</span>
                <span className="text-white font-mono text-xl">{wave}</span>
            </div>
            <div className="flex justify-between items-center">
                <span className="text-gray-500 text-xs uppercase tracking-widest font-mono">Commander Score</span>
                <span className="text-blue-400 font-mono text-2xl">{score}</span>
            </div>
        </div>

        {!isConnected ? (
          <button 
            onClick={handleConnect}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white uppercase font-bold tracking-widest rounded-sm mb-4"
          >
            Connect Wallet
          </button>
        ) : (
          <button 
            onClick={handleRecordScore}
            disabled={isPending || !!txHash}
            className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white uppercase font-bold tracking-widest rounded-sm mb-4 disabled:opacity-50"
          >
            {isPending ? 'Recording...' : txHash ? 'Saved on-chain' : 'Record This Battle on-chain'}
          </button>
        )}

        {status && <p className="text-gray-400 text-xs mb-4 max-w-xs mx-auto break-words">{status}</p>}
        {txHash && (
           <a 
             href={`https://basescan.org/tx/${txHash}`} 
             target="_blank" 
             rel="noreferrer"
             className="block text-blue-400 text-xs mb-4 uppercase hover:text-blue-300 underline"
           >
             View on Basescan
           </a>
        )}

        <button 
          onClick={onRestart}
          className="text-gray-500 hover:text-white uppercase tracking-widest text-sm underline"
        >
          Deploy Again
        </button>
      </motion.div>
    </div>
  );
}
