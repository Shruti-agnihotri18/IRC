import { motion } from 'framer-motion';

export default function FloodLegend({ view, onViewChange }) {
  const items = [
    { color: '#FF4D4F', label: 'High Risk' },
    { color: '#F77F00', label: 'Medium Risk' },
    { color: '#3CCB7F', label: 'Low Risk' },
  ];

  return (
    <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="card p-4 w-64">
      <div className="text-sm font-semibold mb-3">Legend</div>
      <div className="space-y-2">
        {items.map((i) => (
          <div key={i.label} className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: i.color }} />
            <span className="text-xs">{i.label}</span>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <div className="text-xs uppercase tracking-wide opacity-80 mb-2">Toggle View</div>
        <div className="grid grid-cols-3 gap-2">
          {['rainfall', 'river', 'risk'].map((v) => (
            <button
              key={v}
              onClick={() => onViewChange(v)}
              className={`text-xs py-1.5 rounded-md border transition-colors ${view === v ? 'bg-cyan/20 border-cyan text-cyan' : 'border-white/10 hover:border-white/20'}`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
