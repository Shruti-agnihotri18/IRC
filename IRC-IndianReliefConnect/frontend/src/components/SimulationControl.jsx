import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';

export default function SimulationControl({ onSimulate, loading }) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSimulate}
      disabled={loading}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-orange text-deepBlue font-semibold shadow-glow disabled:opacity-70"
    >
      <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
      {loading ? 'Simulating...' : 'Simulate'}
    </motion.button>
  );
}
