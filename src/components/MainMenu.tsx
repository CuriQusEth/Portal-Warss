import { motion } from 'framer-motion';

export function MainMenu({ onStart }: { onStart: () => void }) {
  return (
    <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-6 text-center z-50">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-blue-400 to-indigo-600 tracking-tighter uppercase mb-4" style={{ fontFamily: 'var(--font-display)' }}>
          Portal Wars
        </h1>
        <p className="text-gray-400 max-w-md mx-auto mb-8 text-sm uppercase tracking-widest">
          A Fast-Paced Strategic Real-Time Portal Combat Game
        </p>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStart}
          className="relative px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold uppercase tracking-widest text-lg rounded-sm overflow-hidden group"
        >
          <span className="relative z-10">Enter the Rift</span>
          <div className="absolute inset-0 bg-blue-400/50 blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </motion.button>
      </motion.div>
      <div className="absolute bottom-8 left-0 right-0 text-gray-600 text-xs uppercase tracking-widest">
        Tap to open portals. Destroy enemy portals.
      </div>
    </div>
  );
}
