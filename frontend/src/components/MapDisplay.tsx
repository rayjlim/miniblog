import { useEffect, useState } from 'react';
import { MapContainer, Marker, TileLayer, Tooltip, useMap } from 'react-leaflet';
import L, { LatLngExpression } from 'leaflet';
import { MarkerType } from '../Types';
import { HOME_LOCATION } from '../constants';

const FitBounds = ({ coordinates }: { coordinates: LatLngExpression[] }) => {
  const map = useMap();

  useEffect(() => {
    if (coordinates.length > 0) {
      const bounds = L.latLngBounds(coordinates);
      map.fitBounds(bounds);
    }
    // coordinates.forEach((coord) => {
    //   console.log(coord);
    // });
  }, [map, coordinates]);

  return null;
};

const houseIcon = L.divIcon({
  html: '🏠',
  className: 'house-marker',
  iconSize: [25, 25],
  iconAnchor: [12, 12]
});

interface MapDisplayProps {
  locations: MarkerType[];
}

const MapDisplay = ({ locations }: MapDisplayProps) => {
  const homeLocation = HOME_LOCATION ? JSON.parse(HOME_LOCATION) : null;
  const [showHome, setShowHome] = useState(true);

  if (!locations?.length) return <div>No Map Points found</div>;

  return (locations.length > 0 &&
    (
      <>
        <ul>
          {locations.map(location => <li key={location.title}>{location.title}</li>)}
        </ul>
        <div style={{ 'border': '1px solid grey', 'height': '400px', 'width': '100%' }}>
          <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {homeLocation && showHome && (
              <Marker position={homeLocation as LatLngExpression} icon={houseIcon}>
                <Tooltip permanent={false} interactive>Home</Tooltip>
              </Marker>
            )}
            {locations.map((coord, index) => (
              <Marker key={index} position={coord}>
                <Tooltip>{coord.title}</Tooltip>
              </Marker>
            ))}
            <FitBounds coordinates={(homeLocation && showHome ? [...locations, homeLocation] : locations) as LatLngExpression[]} />
          </MapContainer>
        </div>
        <div className="map-controls mb-2">
          <button
            className="btn btn-sm"
            onClick={() => setShowHome(!showHome)}
            title="Toggle home location"
          >
            {showHome ? '🏠' : '⌂'}
          </button>
        </div>
      </>
    )
  );
};

export default MapDisplay;
