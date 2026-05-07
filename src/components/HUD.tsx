import { motion } from 'framer-motion';

export function HUD({ score, wave }: { score: number; wave: number }) {
    return (
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start pointer-events-none z-10">
            <motion.div 
                key={wave}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-black/50 backdrop-blur-md border border-white/10 px-4 py-2 rounded-lg"
            >
                <div className="text-[10px] uppercase text-gray-400 tracking-widest font-mono">Current Wave</div>
                <div className="text-2xl font-bold text-white font-mono mt-[-2px]">{wave}</div>
            </motion.div>
            
            <motion.div 
                key={score}
                initial={{ scale: 1.2, color: '#60a5fa' }}
                animate={{ scale: 1, color: '#ffffff' }}
                className="bg-black/50 backdrop-blur-md border border-white/10 px-4 py-2 rounded-lg text-right"
            >
                <div className="text-[10px] uppercase text-gray-400 tracking-widest font-mono">Score</div>
                <div className="text-2xl font-bold text-white font-mono mt-[-2px]">{score}</div>
            </motion.div>
        </div>
    );
}
