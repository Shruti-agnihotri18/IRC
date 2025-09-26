import { useEffect, useMemo, useRef, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, LayersControl, LayerGroup, useMap, Polyline, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import { getFloods, updateFloods } from '../services/api.js';
import FloodLegend from './FloodLegend.jsx';
import SimulationControl from './SimulationControl.jsx';

const riskColor = (risk) => {
  if (risk === 'high') return '#FF4D4F';
  if (risk === 'medium') return '#F77F00';
  return '#3CCB7F';
};

function FlyTo({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.flyTo(center, 7, { duration: 1.0 });
  }, [center, map]);
  return null;
}

export default function MapDashboard({ onLocationPick, showRequests = true, showSupplies = true, showAllocations = true, requests = [], supplies = [], allocations = [] }) {
  const [floods, setFloods] = useState([]);
  const [view, setView] = useState('risk');
  const [center, setCenter] = useState([22.9734, 78.6569]); // India centroid
  const [loading, setLoading] = useState(false);
  const mapRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await getFloods();
        if (mounted) setFloods(res.data || []);
      } catch (e) {
        console.error('Failed to fetch floods', e);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const handleSimulate = async () => {
    setLoading(true);
    try {
      await updateFloods();
      const res = await getFloods();
      setFloods(res.data || []);
    } catch (e) {
      console.error('Simulation failed', e);
    } finally {
      setLoading(false);
    }
  };

  const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

  const activeLayerData = useMemo(() => {
    return floods.map((f) => ({
      ...f,
      color:
        view === 'risk' ? riskColor(f.risk) : view === 'rainfall' ? '#40B9D6' : '#3B82F6',
    }));
  }, [floods, view]);

  const requestIcon = useMemo(() => new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconSize: [20, 32],
    iconAnchor: [10, 32],
    className: 'hue-rotate-90 saturate-200',
  }), []);

  const supplyIcon = useMemo(() => new L.DivIcon({
    className: 'bg-transparent',
    html: '<div style="width:14px;height:14px;border-radius:50%;background:#40B9D6;border:2px solid white;box-shadow:0 0 10px rgba(64,185,214,.8)"></div>',
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  }), []);

  const handleMapClick = (e) => {
    if (typeof onLocationPick === 'function') {
      const { lat, lng } = e.latlng;
      onLocationPick([lat, lng]);
    }
  };

  return (
    <div className="relative w-full h-full">
      <div className="absolute top-4 left-4 z-[1000]">
        <FloodLegend view={view} onViewChange={setView} />
      </div>
      <div className="absolute top-4 right-4 z-[1000]">
        <SimulationControl onSimulate={handleSimulate} loading={loading} />
      </div>

      <MapContainer ref={mapRef} center={center} zoom={5} scrollWheelZoom className="map-container rounded-lg overflow-hidden border border-white/10">
        <TileLayer attribution='&copy; OpenStreetMap contributors' url={tileUrl} />
        <FlyTo center={center} />

        <LayersControl position="bottomright">
          <LayersControl.Overlay name="Rainfall" checked={view === 'rainfall'}>
            <LayerGroup>
              {activeLayerData.map((p) => (
                <AnimatedCircle key={p.id || `${p.district}-${p.lat}`} point={p} field="rainfall" />
              ))}
            </LayerGroup>
          </LayersControl.Overlay>
          <LayersControl.Overlay name="River Level" checked={view === 'river'}>
            <LayerGroup>
              {activeLayerData.map((p) => (
                <AnimatedCircle key={p.id || `${p.district}-${p.lat}`} point={p} field="riverLevel" />
              ))}
            </LayerGroup>
          </LayersControl.Overlay>
          <LayersControl.Overlay name="Risk" checked={view === 'risk'}>
            <LayerGroup>
              {activeLayerData.map((p) => (
                <AnimatedCircle key={p.id || `${p.district}-${p.lat}`} point={p} field="risk" />
              ))}
            </LayerGroup>
          </LayersControl.Overlay>
        </LayersControl>

        {showRequests && requests.map((r) => (
          <Marker key={`req-${r.id || r._id}`} position={[r.location.lat, r.location.lng]} icon={requestIcon}>
            <Popup>
              <div className="text-sm">
                <div className="font-semibold">Request: {r.type}</div>
                <div>Qty: {r.quantity}</div>
                <div>Name: {r.name}</div>
              </div>
            </Popup>
          </Marker>
        ))}

        {showSupplies && supplies.map((s) => (
          <Marker key={`sup-${s.id || s._id}`} position={[s.location.lat, s.location.lng]} icon={supplyIcon}>
            <Popup>
              <div className="text-sm">
                <div className="font-semibold">Supply: {s.type}</div>
                <div>Qty: {s.quantity}</div>
                <div>By: {s.provider}</div>
              </div>
            </Popup>
          </Marker>
        ))}

        {showAllocations && allocations.map((a, idx) => (
          <AnimatedAllocation key={`alloc-${idx}`} allocation={a} />
        ))}

        <MapClickCatcher onClick={handleMapClick} />
      </MapContainer>
    </div>
  );
}

function AnimatedCircle({ point, field }) {
  const [radius, setRadius] = useState(8);
  const [color, setColor] = useState(point.color);

  useEffect(() => {
    setColor(point.color);
    const val = field === 'rainfall' ? point.rainfall : field === 'riverLevel' ? point.riverLevel : point.risk;
    const base = field === 'risk' ? (point.risk === 'high' ? 16 : point.risk === 'medium' ? 12 : 8) : Math.min(16, Math.max(6, (val || 0) / 10));
    setRadius(base);
  }, [point, field]);

  return (
    <CircleMarker center={[point.lat, point.lng]} radius={radius} pathOptions={{ color, fillColor: color, fillOpacity: 0.6, weight: 2 }}>
      <Popup>
        <div className="text-sm space-y-1">
          <div className="font-semibold">{point.district}</div>
          <div>Rainfall: {point.rainfall} mm</div>
          <div>River: {point.riverLevel} m</div>
          <div>Risk: <span style={{ color: riskColor(point.risk) }}>{point.risk}</span></div>
        </div>
      </Popup>
    </CircleMarker>
  );
}

function MapClickCatcher({ onClick }) {
  const map = useMap();
  useEffect(() => {
    map.on('click', onClick);
    return () => { map.off('click', onClick); };
  }, [map, onClick]);
  return null;
}

function AnimatedAllocation({ allocation }) {
  const from = [allocation.supply.location.lat, allocation.supply.location.lng];
  const to = [allocation.request.location.lat, allocation.request.location.lng];
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf;
    let start;
    const duration = 3000;
    const step = (ts) => {
      if (!start) start = ts;
      const t = Math.min(1, (ts - start) / duration);
      setProgress(t);
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [allocation]);

  const current = [from[0] + (to[0] - from[0]) * progress, from[1] + (to[1] - from[1]) * progress];

  return (
    <>
      <Polyline positions={[from, to]} pathOptions={{ color: '#40B9D6', weight: 3, dashArray: '6 8' }} />
      <Marker position={current} icon={new L.DivIcon({
        className: 'bg-transparent',
        html: '<div style="transform: translate(-50%, -50%);font-size:16px">🚚</div>',
        iconSize: [24, 24]
      })}>
        <Popup>
          Aid arriving in {Math.max(1, Math.round((1 - progress) * 15))} mins
        </Popup>
      </Marker>
    </>
  );
}
