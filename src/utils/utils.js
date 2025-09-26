// Utility helpers for IRC – Indian Relief Connect
// - Color helpers
// - Leaflet marker icon helpers
// - Simple formatters and validators

import L from 'leaflet';

export function getStatusColor(status) {
  // Normalize status to lower-case for safety
  const normalized = String(status || '').toLowerCase();
  switch (normalized) {
    case 'urgent':
      return '#e74c3c'; // red
    case 'moderate':
      return '#f39c12'; // orange
    case 'served':
    case 'assisted':
      return '#2ecc71'; // green
    default:
      return '#7f8c8d'; // muted gray
  }
}

export function getRiskColor(riskLevel) {
  const normalized = String(riskLevel || '').toLowerCase();
  if (normalized === 'high') return '#ff4d4f';
  if (normalized === 'medium') return '#ffd666';
  return '#3c6382'; // default to brand-accent
}

// Create a colored divIcon for status-based markers
export function getStatusDivIcon(status) {
  const normalized = String(status || '').toLowerCase();
  const className = `status-marker ${normalized || 'unknown'}`;
  return L.divIcon({
    className,
    html: '<div class="dot"></div>',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });
}

export function isValidLatLng(lat, lng) {
  const isNum = (v) => typeof v === 'number' && Number.isFinite(v);
  return isNum(lat) && isNum(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
}

export function formatLocationString({ locationName, location }) {
  if (locationName) return locationName;
  if (location && isValidLatLng(location.lat, location.lng)) {
    return `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`;
  }
  return 'Unknown location';
}

