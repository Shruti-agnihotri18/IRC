import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

function Globe() {
  return (
    <mesh rotation={[0.2, 0.4, 0]}>
      <sphereGeometry args={[1.6, 64, 64]} />
      <meshStandardMaterial color="#40B9D6" metalness={0.1} roughness={0.4} />
    </mesh>
  );
}

export default function LandingPage() {
  return (
    <div className="relative min-h-[calc(100vh-56px)]">
      <div className="absolute inset-0 -z-10">
        <Canvas camera={{ position: [0, 0, 5] }}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <Stars radius={50} depth={20} count={3000} factor={4} saturation={0} fade />
          <Globe />
          <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.6} />
        </Canvas>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-20 grid lg:grid-cols-2 gap-10 items-center">
        <div className="space-y-6">
          <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-4xl md:text-6xl font-black leading-tight">
            <span className="gradient-text">Predict. Prepare. Protect.</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }} className="text-lg opacity-90">
            IRC – IndianReliefConnect empowers authorities, NGOs and citizens with live flood risk prediction and rapid relief coordination.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.6 }} className="flex gap-4">
            <Link to="/dashboard" className="px-6 py-3 rounded-lg bg-orange text-deepBlue font-semibold shadow-glow">Go to Dashboard</Link>
            <a href="https://www.openstreetmap.org" target="_blank" rel="noreferrer" className="px-6 py-3 rounded-lg border border-white/20 hover:border-white/40 transition-colors">OSM</a>
          </motion.div>
        </div>
        <div className="card p-6 glass">
          <div className="text-sm uppercase opacity-80 mb-2">About</div>
          <p className="opacity-90">
            Built for Smart India Hackathon. Frontend integrates with an Express + MongoDB backend via environment-based API URL. Live maps use Leaflet and OpenStreetMap tiles.
          </p>
        </div>
      </div>
    </div>
  );
}
