import React, { useCallback, useState } from 'react';
import { createRequest } from '../services/api';

// CitizenPage: Form to submit help requests
// - Validates essential fields
// - Sends POST /api/requests via api service
function CitizenPage() {
  const [form, setForm] = useState({
    name: '',
    helpType: '',
    peopleCount: '',
    details: '',
    locationName: '',
    location: { lat: '', lng: '' },
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const setField = (field, value) => setForm(prev => ({ ...prev, [field]: value }));
  const setLocationField = (field, value) => setForm(prev => ({ ...prev, location: { ...prev.location, [field]: value } }));

  const detectLocation = useCallback(() => {
    setError('');
    if (!navigator.geolocation) {
      setError('Geolocation not supported in this browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition((pos) => {
      setLocationField('lat', pos.coords.latitude.toFixed(6));
      setLocationField('lng', pos.coords.longitude.toFixed(6));
    }, () => {
      setError('Failed to detect location. Please enter manually.');
    }, { enableHighAccuracy: true });
  }, []);

  const onSubmit = useCallback(async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!form.helpType) {
      setError('Please select a type of help.');
      return;
    }
    if (!form.locationName && !(form.location.lat && form.location.lng)) {
      setError('Please provide location name or coordinates.');
      return;
    }
    const payload = {
      name: form.name || undefined,
      helpType: form.helpType,
      peopleCount: form.peopleCount ? Number(form.peopleCount) : undefined,
      details: form.details || undefined,
      locationName: form.locationName || undefined,
      location: (form.location.lat && form.location.lng) ? { lat: Number(form.location.lat), lng: Number(form.location.lng) } : undefined,
    };

    setSubmitting(true);
    try {
      const res = await createRequest(payload);
      setMessage(res?.message || 'Your request has been submitted. Help is on the way.');
      // Clear form after success
      setForm({ name: '', helpType: '', peopleCount: '', details: '', locationName: '', location: { lat: '', lng: '' } });
    } catch (err) {
      setError(err.message || 'Failed to submit request');
    } finally {
      setSubmitting(false);
    }
  }, [form]);

  return (
    <div className="container" style={{ padding: '16px 0 24px' }}>
      <div className="card" style={{ padding: 16 }}>
        <div style={{ fontWeight: 700, marginBottom: 12, fontSize: 18 }}>Request Help</div>

        {message && (
          <div className="card" style={{ padding: 12, borderLeft: '6px solid var(--color-success)', marginBottom: 12 }}>
            {message}
          </div>
        )}
        {error && (
          <div className="card" style={{ padding: 12, borderLeft: '6px solid var(--color-danger)', marginBottom: 12 }}>
            <strong>Error:</strong> {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="form">
          <div className="grid">
            <div className="field">
              <label>Name (optional)</label>
              <input type="text" value={form.name} onChange={(e) => setField('name', e.target.value)} placeholder="Your name" />
            </div>

            <div className="field">
              <label>Type of Help</label>
              <select value={form.helpType} onChange={(e) => setField('helpType', e.target.value)} required>
                <option value="">Select</option>
                <option>Food</option>
                <option>Water</option>
                <option>Medicine</option>
                <option>Rescue</option>
                <option>Shelter</option>
              </select>
            </div>

            <div className="field">
              <label>Number of People Affected</label>
              <input type="number" min="1" value={form.peopleCount} onChange={(e) => setField('peopleCount', e.target.value)} placeholder="e.g., 4" />
            </div>

            <div className="field span-2">
              <label>Additional Details</label>
              <textarea value={form.details} onChange={(e) => setField('details', e.target.value)} placeholder="Any specific needs or constraints" rows={3} />
            </div>

            <div className="field span-2">
              <label>Location Name</label>
              <input type="text" value={form.locationName} onChange={(e) => setField('locationName', e.target.value)} placeholder="e.g., Near City Hospital, Pune" />
            </div>

            <div className="coords">
              <div className="field">
                <label>Latitude</label>
                <input type="number" step="any" value={form.location.lat} onChange={(e) => setLocationField('lat', e.target.value)} placeholder="e.g., 18.5204" />
              </div>
              <div className="field">
                <label>Longitude</label>
                <input type="number" step="any" value={form.location.lng} onChange={(e) => setLocationField('lng', e.target.value)} placeholder="e.g., 73.8567" />
              </div>
              <div className="field" style={{ alignSelf: 'end' }}>
                <button type="button" className="btn btn-muted" onClick={detectLocation}>Auto-detect</button>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 12 }}>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Submitting…' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .form { display: block; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        @media (max-width: 768px) {
          .grid { grid-template-columns: 1fr; }
        }
        .field { display: grid; gap: 6px; }
        .field input, .field select, .field textarea { padding: 10px 12px; border-radius: 6px; border: 1px solid var(--color-border); background: #fff; }
        .span-2 { grid-column: span 2; }
        @media (max-width: 768px) { .span-2 { grid-column: span 1; } }
        .coords { display: grid; grid-template-columns: 1fr 1fr auto; gap: 12px; align-items: start; }
      `}</style>
    </div>
  );
}

export default CitizenPage;

