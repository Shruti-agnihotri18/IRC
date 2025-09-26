import React from 'react';
import './RequestCard.css';
import { getStatusColor, formatLocationString } from '../utils/utils';

// RequestCard displays a help request summary and an action button for NGOs
// props:
// - request: the request object
// - onMarkAssisted: function(request) -> Promise<void>
// - onFocus: function(request) -> void (optional), to pan/zoom map
// - disabled: boolean (optional) to disable interactions during API calls
function RequestCard({ request, onMarkAssisted, onFocus, disabled }) {
  const color = getStatusColor(request?.status);
  const isServed = String(request?.status || '').toLowerCase() === 'served' || String(request?.status || '').toLowerCase() === 'assisted';

  return (
    <div className="request-card card shadow-sm" style={{ borderLeft: `6px solid ${color}` }}>
      <div className="content" onClick={() => onFocus && onFocus(request)} role="button" tabIndex={0}>
        <div className="title-row">
          <div className="title">{request?.helpType || 'Help Request'}</div>
          <div className="status" style={{ color }}>{request?.status || 'unknown'}</div>
        </div>
        <div className="meta">{formatLocationString({ locationName: request?.locationName, location: request?.location })}</div>
        {typeof request?.peopleCount === 'number' && <div className="meta">People affected: {request.peopleCount}</div>}
        {request?.details && <div className="details">{request.details}</div>}
      </div>
      <div className="actions">
        <button
          className={`btn ${isServed ? 'btn-success' : 'btn-primary'}`}
          onClick={() => onMarkAssisted && onMarkAssisted(request)}
          disabled={disabled || isServed}
          title={isServed ? 'Already marked assisted' : 'Mark as Assisted'}
        >
          {isServed ? 'Assisted' : 'Mark as Assisted'}
        </button>
      </div>
    </div>
  );
}

export default RequestCard;

