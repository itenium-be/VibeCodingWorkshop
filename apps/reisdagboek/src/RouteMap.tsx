import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useRef } from 'react';
import type { Stop } from './trip';

export function RouteMap({ stops, onPick }: { stops: Stop[]; onPick: (date: string) => void }) {
  const el = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!el.current || stops.length === 0) return;
    const map = L.map(el.current, { scrollWheelZoom: false, attributionControl: true });
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);
    const points = stops.map((s) => L.latLng(s.lat, s.lng));
    L.polyline(points, { color: '#b5502f', weight: 3, dashArray: '2 9', lineCap: 'round' }).addTo(map);
    for (const s of stops) {
      L.marker([s.lat, s.lng], {
        icon: L.divIcon({ className: 'pin', html: `<span><b>${s.number}</b></span>`, iconSize: [30, 38], iconAnchor: [15, 36] }),
        title: `Dag ${s.number}`,
      })
        .on('click', () => onPick(s.date))
        .addTo(map);
    }
    if (points.length === 1) map.setView(points[0], 11);
    else map.fitBounds(L.latLngBounds(points), { padding: [36, 36] });
    return () => void map.remove();
  }, [stops, onPick]);

  if (stops.length === 0) return null;
  return (
    <div className="map-card taped">
      <div ref={el} className="map" />
    </div>
  );
}
