import { useEffect, useState } from 'react';
import MapDashboard from '../components/MapDashboard.jsx';
import RequestForm from '../components/RequestForm.jsx';
import SupplyForm from '../components/SupplyForm.jsx';
import AllocationDashboard from '../components/AllocationDashboard.jsx';
import { listRequests, listSupplies } from '../services/api.js';

export default function Dashboard() {
  const [role, setRole] = useState('victim'); // victim | ngo | authority
  const [requests, setRequests] = useState([]);
  const [supplies, setSupplies] = useState([]);
  const [pickedLocation, setPickedLocation] = useState(null);

  const refresh = async () => {
    const [r, s] = await Promise.all([listRequests(), listSupplies()]);
    setRequests(r.data || []);
    setSupplies(s.data || []);
  };

  useEffect(() => { refresh(); }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center gap-3">
        <span className="text-sm opacity-80">Role</span>
        {['victim','ngo','authority'].map((r) => (
          <button key={r} onClick={() => setRole(r)} className={`px-3 py-1.5 text-xs rounded-md border ${role === r ? 'border-cyan text-cyan' : 'border-white/10'}`}>{r}</button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 h-[70vh] card p-2">
          <MapDashboard
            onLocationPick={(coords) => setPickedLocation(coords)}
            requests={requests}
            supplies={supplies}
            allocations={[]}
          />
        </div>
        <div className="space-y-4">
          {role === 'victim' && (
            <div className="card p-4">
              <div className="font-semibold mb-2">Create Request</div>
              <div className="text-xs opacity-80 mb-2">Click on the map to set location</div>
              <RequestForm onCreated={refresh} location={pickedLocation} />
              {pickedLocation && <div className="text-xs mt-2 opacity-80">Picked: {pickedLocation[0].toFixed(3)}, {pickedLocation[1].toFixed(3)}</div>}
            </div>
          )}
          {role === 'ngo' && (
            <div className="card p-4">
              <div className="font-semibold mb-2">Create Supply</div>
              <div className="text-xs opacity-80 mb-2">Click on the map to set location</div>
              <SupplyForm onCreated={refresh} location={pickedLocation} />
              {pickedLocation && <div className="text-xs mt-2 opacity-80">Picked: {pickedLocation[0].toFixed(3)}, {pickedLocation[1].toFixed(3)}</div>}
            </div>
          )}
          {role === 'authority' && (
            <div className="card p-4">
              <div className="font-semibold mb-2">Allocations</div>
              <AllocationDashboard />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
