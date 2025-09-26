import React, { useEffect, useState } from 'react';
import AlertBanner from '../components/AlertBanner';
import InteractiveMap from '../components/InteractiveMap';
import { getAlerts, getRequests } from '../services/api';

// HomePage: Main dashboard aggregating alerts and a map of requests.
// Data fetching occurs on initial mount. Errors are displayed minimally.
function HomePage() {
  const [alerts, setAlerts] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    async function fetchAll() {
      setLoading(true);
      setError('');
      try {
        // Execute both API calls in parallel for efficiency
        const [alertsData, requestsData] = await Promise.all([
          getAlerts(),
          getRequests(),
        ]);
        if (!isMounted) return;
        setAlerts(Array.isArray(alertsData) ? alertsData : (alertsData?.alerts || []));
        setRequests(Array.isArray(requestsData) ? requestsData : (requestsData?.requests || []));
      } catch (err) {
        if (!isMounted) return;
        setError(err.message || 'Failed to fetch data');
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchAll();
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="container" style={{ padding: '16px 0 24px' }}>
      <AlertBanner alerts={alerts} />

      {error && (
        <div className="card" style={{ padding: 12, borderLeft: '6px solid var(--color-danger)', marginBottom: 12 }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      <div className="card" style={{ padding: 12, marginTop: 12 }}>
        <div style={{ fontWeight: 600, marginBottom: 8 }}>Live Requests Map</div>
        {loading ? (
          <div style={{ padding: 24 }}>Loading map...</div>
        ) : (
          <InteractiveMap requests={requests} />
        )}
      </div>
    </div>
  );
}

export default HomePage;

