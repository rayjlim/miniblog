import { useState, useRef } from 'react';
import parseJsonArray from '../utils/parseJsonArray';

const useLocationForm = (locationsInput: any) => {
  const newTitle = useRef<HTMLInputElement>();
  const newCoords = useRef<HTMLInputElement>();
  const [locations, setLocations] = useState<any[]>([]);

  function locationChange() {
    // nothing to do when textarea changes
  }
  const populateLocations = () => {
    const parsedLocations = parseJsonArray(locationsInput?.current?.value);
    setLocations(parsedLocations);
  };
  const updateInputFromLocations = () => {
    if (locationsInput && locationsInput.current) {
      locationsInput.current.value = JSON.stringify(locations);
    }
  };

  function createNewLocation() {
    // The different forms of expected input
    // 1. 37.82879684957708, -122.42176267186676
    // 2. https://maps.apple.com/?address=1500%20S%20Tenth%20St,%20San%20Jose,%20CA%2095112,%20United%20States&auid=4146272712971004545&ll=37.319246,-121.864025&lsp=9902&q=Sharks%20Ice&t=m
    // 3. https://maps.apple.com/?address=211%20N%20Ninth%20St,%20Unit%207,%20San%20Jose,%20CA%20%2095112,%20United%20States&auid=8237050432004312930&ll=37.336411,-121.880426&lsp=9902&q=Bowling%20%26%20Billiards%20-%20San%20Jos%C3%A9%20State%20University&t=m
    // 4. https://maps.apple.com/?ll=37.738379,-121.461823&q=Dropped%20Pin&t=m

    console.log((newCoords as any)?.current.value);
    let title = 'place';
    let pieces: string[] = [];

    if ((newCoords?.current?.value as string)?.includes('maps.apple.com')) {
      const regex = /[&|?]ll=([^&]+)/;
      const match = (newCoords?.current?.value as string)?.match(regex);
      console.log(match);
      if (!match)
        return;

      if (match && match[1]) {
        pieces = (match[1] as string).split(',');
      }
      const regex2 = /&q=([^&]+)/;
      const match2 = (newCoords?.current?.value as string)?.match(regex2);
      if (newTitle?.current?.value === '' && match2 && match2[1]) {
        title = decodeURIComponent(match2[1]);
      }

    } else {
      const regex = /^[-+]?[0-9]*\.?[0-9]+,\s*[-+]?[0-9]*\.?[0-9]+$/;
      const match = (newCoords?.current?.value as string)?.match(regex);
      console.log(match);
      if (match && match[0]) {
        pieces = (match[0] as string).split(',');
        title = newTitle?.current?.value || '';
      } else {
        return;
      }
    }

    const newLocation = {
      title,
      lat: parseFloat(pieces[0]),
      lng: parseFloat(pieces[1])
    }
    setLocations([...locations, newLocation]);
    if (newTitle && newTitle.current)
      newTitle.current.value = '';
    if (newCoords && newCoords.current)
      newCoords.current.value = '';
    setTimeout(() => {
      document.getElementById('locToInputBtn')?.click();
    }, 10);

  }

  function getCoordinatesByBrowser() {
    if ('geolocation' in navigator) {
      // Use the Geolocation API to get the current position
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // The `position` object contains the user's coordinates
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
          if (newCoords && newCoords.current)
            newCoords.current.value = `${latitude}, ${longitude}`;
        },
        (error) => {
          console.error(`Error getting geolocation: ${error.message}`);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }
  return {
    locationChange,
    newTitle,
    newCoords,
    populateLocations,
    locations,
    createNewLocation,
    updateInputFromLocations,
    getCoordinatesByBrowser
  };

};
export default useLocationForm;
