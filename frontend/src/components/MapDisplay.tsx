import { useEffect } from 'react';
import { MapContainer, Marker, TileLayer, Tooltip, useMap } from 'react-leaflet';
import L, { LatLngExpression } from 'leaflet';

const FitBounds = ({ coordinates }: { coordinates: LatLngExpression[] }) => {
  const map = useMap();

  useEffect(() => {
    if (coordinates.length > 0) {
      const bounds = L.latLngBounds(coordinates);
      map.fitBounds(bounds);
    }
    coordinates.forEach((coord) => {
      console.log(coord);
      // const popup = L.popup()
      //   .setLatLng(coord)
      //   .setContent(coord.title);
      // popup.openOn(map);
    });
  }, [map, coordinates]);

  return null;
};

const MapDisplay = ({ locations }: { locations: MarkerType[] }) => {
  console.log('locations', locations);

  // import { QueryClient } from 'react-query';

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
            {locations.map((coord, index) => (
              <Marker key={index} position={coord}>
                <Tooltip permanent>{coord.title}</Tooltip>
              </Marker>
             ))}

            <FitBounds coordinates={locations} />
          </MapContainer>
        </div>
      </>
    )


  );
};

export default MapDisplay;
