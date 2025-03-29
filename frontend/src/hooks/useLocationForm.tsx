import { useRef, useState, useCallback, useEffect } from 'react';
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
  const [isValid, setIsValid] = useState(false);

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
      setIsValid(validateContent());
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

  const validateContent = useCallback(() => {
    try {
      const currentContent = locationsContent.current?.value || '';
      const parsed = JSON.parse(currentContent);
      return Array.isArray(parsed) && parsed.every(item =>
        typeof item === 'object' &&
        'title' in item &&
        'lat' in item &&
        'lng' in item
      );
    } catch {
      return false;
    }
  }, []);

  useEffect(() => {
    setIsValid(validateContent());
  }, [validateContent]);

  const handleContentChange = () => {
    setIsValid(validateContent());
  };

  const removeLocation = (locationToRemove: MarkerType) => {
      const newLocations = locations.filter(
        loc => loc.lat !== locationToRemove.lat || loc.lng !== locationToRemove.lng
      );
      setLocations(newLocations);

      setTimeout(() => {
        document.getElementById('locToInputBtn')?.click();
        setIsValid(validateContent());
      }, 10);
    };

    const updateLocation = (location: MarkerType, field: 'title' | 'coordinates', value: string) => {
        const updatedLocations = locations.map(loc => {
          if (loc.lat === location.lat && loc.lng === location.lng) {
            if (field === 'title') {
              return { ...loc, title: value };
            } else {
              const [lat, lng] = value.split(',').map(n => parseFloat(n.trim()));
              return { ...loc, lat, lng };
            }
          }
          return loc;
        });
        setLocations(updatedLocations);
        setTimeout(() => {
          document.getElementById('locToInputBtn')?.click();
          setIsValid(validateContent());
        }, 10);
      };

      return {
        locationsContent,
        newTitle,
        newCoords,
        populateLocations,
        locations,
        createNewLocation,
        updateInputFromLocations,
        getCoordinatesByBrowser,
        isValid,
        handleContentChange,
        removeLocation,
        updateLocation,
      };
};

export default useLocationForm;
