import { useState, useRef } from 'react';
import parseJsonArray from '../utils/parseJsonArray';

import { MarkerType } from '../Types';

interface AppleMapsMatch {
  coordinates: string[];
  title?: string;
}

const useLocationForm = () => {
  const locationsContent = useRef<HTMLTextAreaElement>(null);
  const newTitle = useRef<HTMLInputElement>(null);
  const newCoords = useRef<HTMLInputElement>(null);
  const [locations, setLocations] = useState<MarkerType[]>([]);

  const populateLocations = () => {
    const parsedLocations = parseJsonArray(locationsContent?.current?.value || '');
    setLocations(parsedLocations);
  };

  const updateInputFromLocations = () => {
    if (locationsContent?.current) {
      locationsContent.current.value = JSON.stringify(locations);
    }
  };

  const parseAppleMapsUrl = (url: string): AppleMapsMatch | null => {
    const coordinatesMatch = url.match(/[&|?]ll=([^&]+)/);
    const titleMatch = url.match(/&q=([^&]+)/);

    if (!coordinatesMatch?.[1]) return null;

    return {
      coordinates: coordinatesMatch[1].split(','),
      title: titleMatch?.[1] ? decodeURIComponent(titleMatch[1]) : undefined
    };
  };

  const parseCoordinates = (input: string): string[] | null => {
    const regex = /^[-+]?[0-9]*\.?[0-9]+,\s*[-+]?[0-9]*\.?[0-9]+$/;
    const match = input.match(regex);
    return match ? match[0].split(',') : null;
  };

  const createNewLocation = () => {
    if (!newCoords.current?.value) return;

    if (locationsContent?.current?.value) {
      populateLocations();
    }

    let coordinates: string[];
    let title = newTitle.current?.value || 'place';

    if (newCoords.current.value.includes('maps.apple.com')) {
      const result = parseAppleMapsUrl(newCoords.current.value);
      if (!result) return;
      coordinates = result.coordinates;
      if (!newTitle.current?.value && result.title) {
        title = result.title;
      }
    } else {
      const result = parseCoordinates(newCoords.current.value);
      if (!result) return;
      coordinates = result;
    }

    const newLocation: MarkerType = {
      title,
      lat: parseFloat(coordinates[0]),
      lng: parseFloat(coordinates[1])
    };

    setLocations([...locations, newLocation]);

    if (newTitle.current) newTitle.current.value = '';
    if (newCoords.current) newCoords.current.value = '';

    setTimeout(() => {
      document.getElementById('locToInputBtn')?.click();
    }, 10);
  };

  const getCoordinatesByBrowser = () => {
    if (locationsContent?.current?.value) {
      populateLocations();
    }

    if (!('geolocation' in navigator)) {
      console.error('Geolocation is not supported by this browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (newCoords.current) {
          newCoords.current.value = `${position.coords.latitude}, ${position.coords.longitude}`;
        }
      },
      (error) => {
        console.error(`Error getting geolocation: ${error.message}`);
      }
    );
  };

  return {
    locationsContent,
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
