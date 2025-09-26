import React, { useState } from 'react';
import './AlertBanner.css';
import { getRiskColor } from '../utils/utils';

// AlertBanner
// - Renders one or more alert strips at the top of a page
// - Dismissible per alert for the current session
// props: alerts: Array<{ id?: string; title?: string; message?: string; riskLevel?: 'high'|'medium'|'low'; }>
function AlertBanner({ alerts = [] }) {
  const [dismissedIds, setDismissedIds] = useState(() => new Set());

  if (!alerts || alerts.length === 0) return null;

  const visibleAlerts = alerts.filter((a, idx) => {
    const id = a.id ?? String(idx);
    return !dismissedIds.has(id);
  });

  if (visibleAlerts.length === 0) return null;

  return (
    <div className="alert-banners container">
      {visibleAlerts.map((alert, idx) => {
        const id = alert.id ?? String(idx);
        const bgColor = getRiskColor(alert.riskLevel);
        return (
          <div key={id} className="alert-banner card shadow-sm" style={{ borderLeft: `6px solid ${bgColor}` }}>
            <div className="alert-content">
              <div className="alert-title">{alert.title || 'System Alert'}</div>
              <div className="alert-message">{alert.message || 'Please stay safe and follow local guidance.'}</div>
            </div>
            <button
              className="btn btn-muted dismiss"
              onClick={() => setDismissedIds(prev => new Set(prev).add(id))}
            >
              Dismiss
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default AlertBanner;

