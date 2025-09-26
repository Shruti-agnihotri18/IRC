import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: [/^http:\/\/localhost:55\d{2}$/], credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

// In-memory data stores
let floods = [
  { id: 'dl', district: 'Delhi', lat: 28.6139, lng: 77.2090, rainfall: 120, riverLevel: 5.2, risk: 'medium' },
  { id: 'mum', district: 'Mumbai', lat: 19.0760, lng: 72.8777, rainfall: 200, riverLevel: 6.1, risk: 'high' },
  { id: 'kol', district: 'Kolkata', lat: 22.5726, lng: 88.3639, rainfall: 80, riverLevel: 4.4, risk: 'low' },
  { id: 'chn', district: 'Chennai', lat: 13.0827, lng: 80.2707, rainfall: 150, riverLevel: 5.8, risk: 'medium' },
  { id: 'gwh', district: 'Guwahati', lat: 26.1445, lng: 91.7362, rainfall: 170, riverLevel: 6.5, risk: 'high' },
];

let requests = [];
let supplies = [];

// Flood APIs
app.get('/api/floods', (req, res) => {
  res.json(floods);
});

app.put('/api/floods/update', (req, res) => {
  floods = floods.map((p) => {
    const deltaRain = Math.round((Math.random() - 0.4) * 20);
    const deltaRiver = (Math.random() - 0.4) * 0.5;
    const levels = ['low','medium','high'];
    const idx = Math.max(0, Math.min(2, levels.indexOf(p.risk) + (Math.random() > 0.6 ? 1 : Math.random() < 0.3 ? -1 : 0)));
    return {
      ...p,
      rainfall: Math.max(0, (p.rainfall || 0) + deltaRain),
      riverLevel: Math.max(0, (p.riverLevel || 0) + deltaRiver),
      risk: levels[idx],
    };
  });
  res.json({ updated: true, floods });
});

// Request APIs
app.get('/api/requests', (req, res) => res.json(requests));
app.post('/api/requests', (req, res) => {
  const { name, phone, type, quantity, location } = req.body || {};
  if (!name || !phone || !type || !quantity || !location) return res.status(400).json({ message: 'Missing fields' });
  const doc = { _id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, name, phone, type, quantity, location };
  requests.push(doc);
  res.status(201).json(doc);
});

// Supply APIs
app.get('/api/supplies', (req, res) => res.json(supplies));
app.post('/api/supplies', (req, res) => {
  const { provider, type, quantity, location } = req.body || {};
  if (!provider || !type || !quantity || !location) return res.status(400).json({ message: 'Missing fields' });
  const doc = { _id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, provider, type, quantity, location };
  supplies.push(doc);
  res.status(201).json(doc);
});

// Matching API
app.post('/api/match/run', (req, res) => {
  const { types = [] } = req.body || {};
  const reqs = types.length ? requests.filter(r => types.includes(r.type)) : [...requests];
  const sups = types.length ? supplies.filter(s => types.includes(s.type)) : [...supplies];

  const allocations = [];
  const supMap = new Map();
  for (const s of sups) supMap.set(s._id, { ...s, remaining: s.quantity });

  for (const r of reqs) {
    const candidates = sups.filter(s => s.type === r.type);
    // naive nearest match by simple distance
    candidates.sort((a, b) => distance(a.location, r.location) - distance(b.location, r.location));
    for (const s of candidates) {
      const entry = supMap.get(s._id);
      if (!entry || entry.remaining <= 0) continue;
      const qty = Math.min(entry.remaining, r.quantity);
      if (qty <= 0) continue;
      allocations.push({ supply: s, request: r, quantity: qty });
      entry.remaining -= qty;
      break;
    }
  }
  res.json(allocations);
});

function distance(a, b) {
  if (!a || !b) return 1e9;
  const dx = (a.lat - b.lat);
  const dy = (a.lng - b.lng);
  return Math.sqrt(dx*dx + dy*dy);
}

app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));
