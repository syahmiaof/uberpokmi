import { useEffect, useRef, useState } from "react";
import { Crosshair, Layers, Minus, Navigation, Plus } from "lucide-react";
import { locationById } from "./data";
import { useDemo } from "./store";
import type { CircleMarker, Map as LeafletMap } from "leaflet";
import "leaflet/dist/leaflet.css";
export function MapExperience({
  from = "bintang",
  to = "klcc",
  progress = 0,
  status = "Your city is waiting",
  searching = false,
}: {
  from?: string;
  to?: string;
  progress?: number;
  status?: string;
  searching?: boolean;
}) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [tiles, setTiles] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const pointer = useRef<{
    x: number;
    y: number;
    px: number;
    py: number;
  } | null>(null);
  const mapElement = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const vehicleRef = useRef<CircleMarker | null>(null);
  const { toast } = useDemo();
  const a = locationById(from);
  const hasRoute = Boolean(from && to && from !== to);
  const b = hasRoute ? locationById(to) : a;
  const flip = a.lng > b.lng;
  const start = { x: flip ? 650 : 230, y: a.lat > b.lat ? 180 : 400 };
  const end = { x: flip ? 230 : 650, y: a.lat > b.lat ? 400 : 180 };
  const points = [
    start,
    { x: start.x + (end.x - start.x) * 0.32, y: start.y },
    { x: start.x + (end.x - start.x) * 0.32, y: end.y },
    end,
  ];
  const path = `M${points.map((p) => `${p.x},${p.y}`).join(" L")}`;
  const t = Math.min(0.9999, Math.max(0, progress)) * 3;
  const segment = Math.floor(t);
  const vehicle = {
    x:
      points[segment].x +
      (points[segment + 1].x - points[segment].x) * (t - segment),
    y:
      points[segment].y +
      (points[segment + 1].y - points[segment].y) * (t - segment),
  };
  useEffect(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, [from, to]);
  useEffect(() => {
    if (!tiles || !mapElement.current) return;
    let disposed = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    setLoaded(false);
    const container = mapElement.current;
    import("leaflet")
      .then((L) => {
        if (disposed) return;
        const map = L.map(container, { zoomControl: false }).setView(
          [a.lat, a.lng],
          14,
        );
        mapRef.current = map;
        const layer = L.tileLayer(
          "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
          {
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19,
          },
        );
        const fallback = () => {
          if (!disposed) {
            setTiles(false);
            toast("Map tiles unavailable. Your simulated map is ready.");
          }
        };
        layer.once("tileload", () => {
          if (!disposed) {
            setLoaded(true);
            clearTimeout(timer);
          }
        });
        layer.once("tileerror", fallback);
        layer.addTo(map);
        L.circleMarker([a.lat, a.lng], {
          radius: 9,
          fillColor: "#C8FF3D",
          color: "#101412",
          fillOpacity: 1,
        })
          .addTo(map)
          .bindTooltip(a.name);
        if (hasRoute) {
          L.circleMarker([b.lat, b.lng], {
            radius: 9,
            fillColor: "#ff7448",
            color: "#101412",
            fillOpacity: 1,
          })
            .addTo(map)
            .bindTooltip(b.name);
          L.polyline(
            [
              [a.lat, a.lng],
              [a.lat, b.lng],
              [b.lat, b.lng],
            ],
            { color: "#689b00", weight: 5, dashArray: "8 6" },
          ).addTo(map);
          vehicleRef.current = L.circleMarker([a.lat, a.lng], {
            radius: 7,
            fillColor: "#f5f7f2",
            color: "#101412",
            fillOpacity: 1,
          }).addTo(map);
          map.fitBounds(
            [
              [a.lat, a.lng],
              [b.lat, b.lng],
            ],
            { padding: [60, 60], maxZoom: 15 },
          );
        }
        timer = setTimeout(fallback, 6000);
      })
      .catch(() => {
        if (!disposed) {
          setTiles(false);
          toast("Map could not load. Showing the offline simulation.");
        }
      });
    return () => {
      disposed = true;
      clearTimeout(timer);
      mapRef.current?.remove();
      mapRef.current = null;
      vehicleRef.current = null;
    };
  }, [tiles, a, b, hasRoute, toast]);
  useEffect(() => {
    if (!vehicleRef.current || !hasRoute) return;
    const value = Math.max(0, Math.min(1, progress));
    const latitude =
      value <= 0.5 ? a.lat : a.lat + (b.lat - a.lat) * ((value - 0.5) * 2);
    const longitude =
      value <= 0.5 ? a.lng + (b.lng - a.lng) * (value * 2) : b.lng;
    vehicleRef.current.setLatLng([latitude, longitude]);
  }, [a, b, hasRoute, progress, loaded]);
  return (
    <div className={`map-experience ${searching ? "searching" : ""}`}>
      <div className="map-top">
        <span>
          <span className="live-dot" /> {status}
        </span>
        <button className="map-layer" onClick={() => setTiles(!tiles)}>
          <Layers size={15} />
          {tiles ? "Schematic" : "Street map"}
        </button>
      </div>
      <div
        className="schematic"
        onPointerDown={(e) => {
          if (tiles) return;
          e.currentTarget.setPointerCapture(e.pointerId);
          pointer.current = {
            x: e.clientX,
            y: e.clientY,
            px: pan.x,
            py: pan.y,
          };
        }}
        onPointerMove={(e) => {
          if (pointer.current)
            setPan({
              x: Math.max(
                -200,
                Math.min(
                  200,
                  pointer.current.px + e.clientX - pointer.current.x,
                ),
              ),
              y: Math.max(
                -150,
                Math.min(
                  150,
                  pointer.current.py + e.clientY - pointer.current.y,
                ),
              ),
            });
        }}
        onPointerUp={() => (pointer.current = null)}
        onPointerCancel={() => (pointer.current = null)}
      >
        <svg
          viewBox="0 0 880 620"
          role="img"
          aria-label={`Simulated route from ${a.name} to ${b.name}`}
        >
          <g
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: "440px 310px",
            }}
          >
            <rect width="880" height="620" fill="#19221e" />
            {Array.from({ length: 72 }, (_, i) => (
              <rect
                key={i}
                x={(i % 9) * 110 - 30}
                y={Math.floor(i / 9) * 88 - 30}
                width={70 + (i % 3) * 5}
                height={52 + (i % 4) * 3}
                rx="7"
                fill={
                  i % 13 === 0 ? "#293e2b" : i % 4 === 0 ? "#26332b" : "#202b24"
                }
                stroke="#2a362e"
              />
            ))}
            <path
              d="M-50 95 L900 95 M-40 290 L920 290 M-30 510 L910 510 M120 -50 L120 700 M540 -50 L540 700 M760 -50 L760 700 M-50 680 L920 -40"
              fill="none"
              stroke="#354039"
              strokeWidth="12"
            />
            <path
              d="M-50 95 L900 95 M-40 290 L920 290 M-30 510 L910 510 M120 -50 L120 700 M540 -50 L540 700 M760 -50 L760 700 M-50 680 L920 -40"
              fill="none"
              stroke="#485047"
              strokeWidth="1"
            />
            <path
              d="M-50 420 C 200 390 190 120 420 80 S640 30 650 -30"
              fill="none"
              stroke="#243a3b"
              strokeWidth="30"
            />
            <text x="560" y="370" className="map-district">
              KUALA LUMPUR
            </text>
            <text x="370" y="550" className="map-street">
              JALAN TUN RAZAK
            </text>
            <text x="170" y="75" className="map-street">
              JALAN AMPANG
            </text>
            <text x="660" y="115" className="map-park">
              KLCC PARK
            </text>
            <circle cx="700" cy="150" r="3" fill="#7f977b" />
            {hasRoute && <path d={path} className="map-route-shadow" />}
            {hasRoute && (
              <path d={path} className="map-route" key={`${from}-${to}`} />
            )}
            {(hasRoute ? [start, end] : [start]).map((p, i) => (
              <g key={i} transform={`translate(${p.x},${p.y})`}>
                <circle
                  r="27"
                  fill={i ? "#ff744822" : "#c8ff3d22"}
                  className={!i && searching ? "pulse-marker" : ""}
                />
                <circle
                  r="13"
                  fill={i ? "#ff7448" : "#c8ff3d"}
                  stroke="#101412"
                  strokeWidth="4"
                />
                <rect
                  x="-85"
                  y={i ? -64 : 30}
                  width="170"
                  height="30"
                  rx="6"
                  fill="#101412"
                  stroke="#3a473c"
                />
                <text
                  y={i ? -44 : 50}
                  textAnchor="middle"
                  className="pin-label"
                >
                  {i ? b.name : a.name}
                </text>
              </g>
            ))}
            {hasRoute && progress > 0 && (
              <g
                className="moving-marker"
                style={{
                  transform: `translate(${vehicle.x}px, ${vehicle.y}px)`,
                }}
              >
                <rect
                  x="-20"
                  y="-14"
                  width="40"
                  height="28"
                  rx="8"
                  fill="#f5f7f2"
                  stroke="#101412"
                  strokeWidth="3"
                />
                <rect
                  x="-10"
                  y="-10"
                  width="15"
                  height="20"
                  rx="4"
                  fill="#26382a"
                />
              </g>
            )}
          </g>
        </svg>
      </div>
      {tiles && (
        <div ref={mapElement} className={`tile-map ${loaded ? "ready" : ""}`} />
      )}
      <div className="map-bottom">
        <div>
          <Navigation size={13} />
          {tiles
            ? loaded
              ? "Demo route · not live tracking"
              : "Loading tiles · schematic available"
            : "Simulated map · drag to explore"}
        </div>
        <div className="map-controls">
          <button
            aria-label="Zoom in"
            onClick={() =>
              tiles
                ? mapRef.current?.zoomIn()
                : setZoom((z) => Math.min(1.8, z + 0.2))
            }
          >
            <Plus size={18} />
          </button>
          <button
            aria-label="Zoom out"
            onClick={() =>
              tiles
                ? mapRef.current?.zoomOut()
                : setZoom((z) => Math.max(0.8, z - 0.2))
            }
          >
            <Minus size={18} />
          </button>
          <button
            aria-label="Recenter map"
            onClick={() => {
              setZoom(1);
              setPan({ x: 0, y: 0 });
              mapRef.current?.fitBounds(
                [
                  [a.lat, a.lng],
                  [b.lat, b.lng],
                ],
                { padding: [60, 60], maxZoom: 15 },
              );
            }}
          >
            <Crosshair size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
