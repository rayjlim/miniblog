import { useEffect } from 'react';
import { useSetting } from './SettingContext';
import { DEFAULT_MAP_ZOOM } from '../constants';
import { Loader } from "@googlemaps/js-api-loader";
import { GOOGLE_MAPS_ENABLED } from '../constants';
import './GoogleMap.css';

const GoogleMap = ({ locations }: { locations: MarkerType[] }) => {
  console.log(locations);
  const { GOOGLE_API_KEY } = useSetting() as SettingsType;

  const loader = new Loader({
    apiKey: GOOGLE_API_KEY,
    version: "weekly"
  });

  const drawMap = async () => {
    loader.load().then(async () => {
      //@ts-ignore
      const { Map } = await google.maps.importLibrary("maps");
      let map = new Map(document.getElementById("map") as HTMLElement, {
        mapId: "DEMO_MAP_ID",
      });
      //@ts-ignore
      const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

      if (locations.length > 1) {
        const bounds = new google.maps.LatLngBounds();
        // Iterate through each marker and extend the bounds
        locations.forEach(location => {
          const position = new google.maps.LatLng(location.lat, location.lng);
          bounds.extend(position);
          const locationDiv = document.createElement("div");

          locationDiv.className = "map-marker";
          locationDiv.textContent = location?.title || '';
          console.log(locationDiv);
          new AdvancedMarkerElement({
            position,
            map,
            content: locationDiv
          });

        });
        // Set the map's viewport to fit the bounds
        map.fitBounds(bounds);
      }
      else {
        let location = locations[0];
        const locationDiv = document.createElement("div");

        locationDiv.className = "map-marker";
        locationDiv.textContent = location?.title || '';
        map.setCenter(location);
        map.setZoom(DEFAULT_MAP_ZOOM);
        new AdvancedMarkerElement({
          position: location,
          map: map,
          content: locationDiv
        });
      }
    });
  }

  useEffect(() => {
    locations.length && GOOGLE_MAPS_ENABLED && drawMap();
  });
  if (!locations?.length) return <div>No Map Points found</div>;

  return (locations.length > 0 &&
    (
      <>
        <ul>
          {locations.map(location => <li key={location.title}>{location.title}</li>)}
        </ul>
        <div id="map" />
      </>
    )


  );
};

export default GoogleMap;
