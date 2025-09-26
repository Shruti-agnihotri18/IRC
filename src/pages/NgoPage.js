import React, { useCallback, useEffect, useMemo, useState } from 'react';
import InteractiveMap from '../components/InteractiveMap';
import RequestCard from '../components/RequestCard';
import { getRequests, updateRequest } from '../services/api';

// NGO Dashboard
// - Two-column layout: map (left) and scrollable list (right)
// - Polls requests every 30s
// - Clicking a card focuses the map on the request
function NgoPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [focus, setFocus] = useState(null); // { lat, lng }

  const fetchData = useCallback(async () => {
    setError('');
    try {
      const data = await getRequests();
      setRequests(Array.isArray(data) ? data : (data?.requests || []));
    } catch (err) {
      setError(err.message || 'Failed to load requests');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    fetchData();
    // Poll every 30 seconds
    const interval = setInterval(() => {
      if (isMounted) fetchData();
    }, 30000);
    return () => { isMounted = false; clearInterval(interval); };
  }, [fetchData]);

  const onFocus = useCallback((req) => {
    if (req?.location?.lat && req?.location?.lng) {
      setFocus({ lat: req.location.lat, lng: req.location.lng });
    }
  }, []);

  const onMarkAssisted = useCallback(async (req) => {
    if (!req?.id) return;
    setIsUpdating(true);
    try {
      await updateRequest(req.id, { status: 'served' });
      // Refresh list after successful update
      await fetchData();
    } catch (err) {
      alert(err.message || 'Failed to update request');
    } finally {
      setIsUpdating(false);
    }
  }, [fetchData]);

  return (
    <div className="container" style={{ padding: '16px 0 24px' }}>
      <div style={{ fontWeight: 700, marginBottom: 12, fontSize: 18 }}>NGO Helpline Dashboard</div>
      {error && (
        <div className="card" style={{ padding: 12, borderLeft: '6px solid var(--color-danger)', marginBottom: 12 }}>
          <strong>Error:</strong> {error}
        </div>
      )}
      <div className="card" style={{ padding: 12 }}>
        <div className="layout">
          <div className="left">
            {loading ? (
              <div style={{ padding: 24 }}>Loading map...</div>
            ) : (
              <InteractiveMap requests={requests} focus={focus} onMarkerClick={onFocus} />
            )}
          </div>
          <div className="right">
            <div className="list-header">Active Requests ({requests.length})</div>
            <div className="list">
              {requests.map((req) => (
                <RequestCard
                  key={req.id}
                  request={req}
                  onMarkAssisted={onMarkAssisted}
                  onFocus={onFocus}
                  disabled={isUpdating}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .layout { display: grid; grid-template-columns: 2fr 1fr; gap: 12px; }
        @media (max-width: 1024px) {
          .layout { grid-template-columns: 1fr; }
        }
        .left { min-height: 420px; }
        .right { min-height: 420px; max-height: 420px; overflow: auto; display: grid; grid-template-rows: auto 1fr; gap: 8px; }
        .list { display: grid; gap: 8px; }
        .list-header { font-weight: 600; }
      `}</style>
    </div>
  );
}

export default NgoPage;

