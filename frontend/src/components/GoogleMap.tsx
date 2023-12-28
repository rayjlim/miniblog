import { useEffect } from 'react';

const GoogleMap = ({ markers }: { markers: MarkerType[]}) => {
  const googleApi = (window as any).google;
  const drawMap = (markers: MarkerType[]) => {
    const mapOptions = {
      mapId: "DEMO_MAP_ID"
    };

    const map = new googleApi.maps.Map(document.getElementById('map'), mapOptions);
    const bounds = new googleApi.maps.LatLngBounds();

    // Iterate through each marker and extend the bounds
    markers.forEach(marker => {
      const position = new googleApi.maps.LatLng(marker.lat, marker.lng);
      bounds.extend(position);
      new googleApi.maps.Marker({ position, map, title: marker?.title});

    });
    // Set the map's viewport to fit the bounds
    map.fitBounds(bounds);
  }

  useEffect(() => {
    markers.length && drawMap(markers);
  });
  if (!markers?.length) return <div>No Map Points found</div>;

  return (markers.length > 0 && <div id="map" style={{ height: '400px', width: '100%' }} />);
};

export default GoogleMap;
