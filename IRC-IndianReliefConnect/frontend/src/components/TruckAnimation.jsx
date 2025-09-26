import { motion } from 'framer-motion';

export default function TruckAnimation({ className = '' }) {
  return (
    <div className={`relative h-24 overflow-hidden ${className}`}>
      <motion.div
        initial={{ x: '-10%' }}
        animate={{ x: '110%' }}
        transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
        className="text-3xl"
      >
        🚚
      </motion.div>
      <div className="absolute bottom-4 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </div>
  );
}
