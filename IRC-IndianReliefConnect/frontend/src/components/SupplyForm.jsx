import { useState } from 'react';
import { createSupply } from '../services/api.js';

const TYPES = ['water', 'food', 'medicine', 'shelter', 'clothes'];

export default function SupplyForm({ onCreated, location }) {
  const [form, setForm] = useState({ provider: '', type: 'water', quantity: 1, location: null });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!location) return alert('Pick a location on the map');
    setSubmitting(true);
    try {
      const payload = { ...form, quantity: Number(form.quantity) };
      await createSupply({
        provider: payload.provider,
        type: payload.type,
        quantity: payload.quantity,
        location: { lat: location[0], lng: location[1] },
      });
      onCreated?.();
      setForm({ provider: '', type: 'water', quantity: 1, location: null });
      alert('Supply created');
    } catch (e) {
      console.error(e);
      alert('Failed to create supply');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <input name="provider" value={form.provider} onChange={handleChange} required placeholder="Provider name" className="card px-3 py-2" />
        <select name="type" value={form.type} onChange={handleChange} className="card px-3 py-2">
          {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <input name="quantity" type="number" min="1" value={form.quantity} onChange={handleChange} className="card px-3 py-2" />
        <button type="button" className={`card px-3 py-2 ${location ? 'border-cyan text-cyan' : ''}`} onClick={() => alert('Click on the map to set location')}>{location ? `Picked: ${location[0].toFixed(3)}, ${location[1].toFixed(3)}` : 'Set Location'}</button>
        <button disabled={submitting} className="bg-orange text-deepBlue rounded-md py-2 font-semibold">{submitting ? 'Submitting...' : 'Create Supply'}</button>
      </div>
    </form>
  );
}
