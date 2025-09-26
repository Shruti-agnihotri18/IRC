import { useEffect, useState } from 'react';
import { listRequests, listSupplies, runMatch } from '../services/api.js';
import MapDashboard from './MapDashboard.jsx';

export default function AllocationDashboard() {
  const [requests, setRequests] = useState([]);
  const [supplies, setSupplies] = useState([]);
  const [allocations, setAllocations] = useState([]);
  const [filters, setFilters] = useState({ types: [] });
  const [toggles, setToggles] = useState({ requests: true, supplies: true, allocations: true });

  const fetchLists = async () => {
    const [r, s] = await Promise.all([listRequests(), listSupplies()]);
    setRequests(r.data || []);
    setSupplies(s.data || []);
  };

  useEffect(() => { fetchLists(); }, []);

  const handleRunMatch = async () => {
    const res = await runMatch({ types: filters.types });
    setAllocations(res.data || []);
  };

  const filteredRequests = filters.types.length ? requests.filter(r => filters.types.includes(r.type)) : requests;
  const filteredSupplies = filters.types.length ? supplies.filter(s => filters.types.includes(s.type)) : supplies;

  return (
    <div className="grid lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 h-[70vh] card p-2">
        <MapDashboard
          requests={toggles.requests ? filteredRequests : []}
          supplies={toggles.supplies ? filteredSupplies : []}
          allocations={toggles.allocations ? allocations : []}
          showRequests={toggles.requests}
          showSupplies={toggles.supplies}
          showAllocations={toggles.allocations}
        />
      </div>
      <div className="space-y-4">
        <div className="card p-4">
          <div className="font-semibold mb-2">Filters</div>
          <div className="flex flex-wrap gap-2">
            {['water', 'food', 'medicine', 'shelter', 'clothes'].map((t) => {
              const active = filters.types.includes(t);
              return (
                <button key={t} className={`px-3 py-1.5 text-xs rounded-md border ${active ? 'border-cyan text-cyan' : 'border-white/10'}`} onClick={() => setFilters(f => ({ types: active ? f.types.filter(x => x !== t) : [...f.types, t] }))}>
                  {t}
                </button>
              );
            })}
          </div>
        </div>
        <div className="card p-4">
          <div className="font-semibold mb-2">Toggles</div>
          {['requests','supplies','allocations'].map((k) => (
            <label key={k} className="flex items-center justify-between text-sm py-1">
              <span className="capitalize">{k}</span>
              <input type="checkbox" checked={toggles[k]} onChange={() => setToggles(t => ({ ...t, [k]: !t[k] }))} />
            </label>
          ))}
        </div>
        <div className="card p-4 space-y-2">
          <button className="w-full bg-orange text-deepBlue rounded-md py-2 font-semibold" onClick={handleRunMatch}>Run Matching</button>
          <button className="w-full bg-cyan text-deepBlue rounded-md py-2 font-semibold" onClick={fetchLists}>Refresh Lists</button>
        </div>
        <div className="card p-4">
          <div className="font-semibold mb-2">Allocations</div>
          <div className="max-h-64 overflow-auto space-y-2 text-xs">
            {allocations.map((a, idx) => (
              <div key={idx} className="p-2 border border-white/10 rounded-md">
                {a.supply?.type} → {a.request?.type} | qty {a.quantity}
              </div>
            ))}
            {!allocations.length && <div className="opacity-70">No allocations yet.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
