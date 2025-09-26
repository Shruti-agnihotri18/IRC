import { useState } from 'react';
import { createRequest } from '../services/api.js';

const TYPES = ['water', 'food', 'medicine', 'shelter', 'clothes'];

export default function RequestForm({ onCreated, location }) {
  const [form, setForm] = useState({ name: '', phone: '', type: 'water', quantity: 1, location: null });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!location) return alert('Pick a location on the map');
    setSubmitting(true);
    try {
      const payload = { ...form, quantity: Number(form.quantity) };
      await createRequest({
        name: payload.name,
        phone: payload.phone,
        type: payload.type,
        quantity: payload.quantity,
        location: { lat: location[0], lng: location[1] },
      });
      onCreated?.();
      setForm({ name: '', phone: '', type: 'water', quantity: 1, location: null });
      alert('Request created');
    } catch (e) {
      console.error(e);
      alert('Failed to create request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <input name="name" value={form.name} onChange={handleChange} required placeholder="Your name" className="card px-3 py-2" />
        <input name="phone" value={form.phone} onChange={handleChange} required placeholder="Phone" className="card px-3 py-2" />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <select name="type" value={form.type} onChange={handleChange} className="card px-3 py-2">
          {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <input name="quantity" type="number" min="1" value={form.quantity} onChange={handleChange} className="card px-3 py-2" />
        <button type="button" className={`card px-3 py-2 ${location ? 'border-cyan text-cyan' : ''}`} onClick={() => alert('Click on the map to set location')}>{location ? `Picked: ${location[0].toFixed(3)}, ${location[1].toFixed(3)}` : 'Set Location'}</button>
      </div>
      <button disabled={submitting} className="w-full bg-cyan text-deepBlue rounded-md py-2 font-semibold">{submitting ? 'Submitting...' : 'Create Request'}</button>
    </form>
  );
}
