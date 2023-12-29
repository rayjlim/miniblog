import { useEffect } from 'react';
import { DEFAULT_MAP_ZOOM } from '../constants';

const GoogleMap = ({ locations }: { locations: MarkerType[] }) => {
  console.log(locations);
  const googleApi = (window as any).google;

  const drawMap = () => {
    const mapOptions = {
      mapId: "DEMO_MAP_ID",
    };

    const map = new googleApi.maps.Map(document.getElementById('map'), mapOptions);
    if (locations.length > 1) {
      const bounds = new googleApi.maps.LatLngBounds();
      // Iterate through each marker and extend the bounds
      locations.forEach(location => {
        const position = new googleApi.maps.LatLng(location.lat, location.lng);
        bounds.extend(position);
        new googleApi.maps.Marker({ position, map, title: location?.title });

      });
      // Set the map's viewport to fit the bounds
      map.fitBounds(bounds);
    }
    else {
      let location = locations[0];
      map.setCenter(location);
      map.setZoom(DEFAULT_MAP_ZOOM);
      new googleApi.maps.Marker({
        ...location,
        position: location,
        map: map
      });
    }
  }

  useEffect(() => {
    locations.length && drawMap();
  });
  if (!locations?.length) return <div>No Map Points found</div>;

  return (locations.length > 0 && <div id="map" style={{ height: '400px', width: '100%' }} />);
};

export default GoogleMap;
