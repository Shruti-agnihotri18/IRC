import React, { useEffect, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import './InteractiveMap.css';
import { getStatusDivIcon, formatLocationString, isValidLatLng } from '../utils/utils';

// Helper component to imperatively move the map when a focus coordinate is provided
function FocusController({ focus }) {
  const map = useMap();
  useEffect(() => {
    if (focus && isValidLatLng(focus.lat, focus.lng)) {
      map.setView([focus.lat, focus.lng], 14, { animate: true });
    }
  }, [focus, map]);
  return null;
}

// InteractiveMap renders request markers with color-coded status icons.
// props:
// - requests: Array of request objects with { id, status, helpType, details, location: {lat,lng}, locationName }
// - focus: optional { lat, lng } to programmatically center map
// - onMarkerClick: optional callback when a marker is clicked
function InteractiveMap({ requests = [], focus = null, onMarkerClick }) {
  // Compute a reasonable map center: average of all valid coordinates or fallback to India center
  const validCoords = useMemo(() =>
    requests
      .map(r => r?.location)
      .filter(loc => loc && isValidLatLng(loc.lat, loc.lng)),
  [requests]);

  const defaultCenter = useMemo(() => ({ lat: 20.5937, lng: 78.9629 }), []); // India geographic center

  const center = useMemo(() => {
    if (focus && isValidLatLng(focus.lat, focus.lng)) return focus;
    if (validCoords.length === 0) return defaultCenter;
    const avg = validCoords.reduce((acc, loc) => ({ lat: acc.lat + loc.lat, lng: acc.lng + loc.lng }), { lat: 0, lng: 0 });
    return { lat: avg.lat / validCoords.length, lng: avg.lng / validCoords.length };
  }, [focus, validCoords, defaultCenter]);

  return (
    <div className="interactive-map card shadow-sm">
      <MapContainer center={[center.lat, center.lng]} zoom={6} scrollWheelZoom style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FocusController focus={focus} />

        {requests.map((req) => {
          const key = req.id || `${req.location?.lat}-${req.location?.lng}-${req.helpType}`;
          const loc = req.location;
          if (!loc || !isValidLatLng(loc.lat, loc.lng)) return null;

          const icon = getStatusDivIcon(req.status);
          return (
            <Marker key={key} position={[loc.lat, loc.lng]} icon={icon} eventHandlers={{ click: () => onMarkerClick && onMarkerClick(req) }}>
              <Popup>
                <div className="popup">
                  <div className="title">{req.helpType || 'Help Request'}</div>
                  <div className="row"><strong>Status:</strong> {req.status || 'unknown'}</div>
                  <div className="row"><strong>Location:</strong> {formatLocationString({ locationName: req.locationName, location: loc })}</div>
                  {req.details && <div className="row"><strong>Details:</strong> {req.details}</div>}
                  {typeof req.peopleCount === 'number' && <div className="row"><strong>People:</strong> {req.peopleCount}</div>}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}

export default InteractiveMap;

