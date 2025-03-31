import { useRef, useState, useCallback } from 'react';
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

  const updateTextareaAndValidate = useCallback(() => {
    if (locationsContent?.current) {
      locationsContent.current.value = JSON.stringify(locations);
      document.getElementById('locToInputBtn')?.click();
      setIsValid(validateContent());
    }
  }, [locations, validateContent]);

  const populateLocations = () => {
    const parsedLocations = parseJsonArray(locationsContent?.current?.value || '');
    setLocations(parsedLocations);
  };

  const parseAppleMapsUrl = useCallback((url: string): AppleMapsMatch | null => {
    const coordinatesMatch = url.match(/[&|?]ll=([^&]+)/);
    const titleMatch = url.match(/&q=([^&]+)/);
    if (!coordinatesMatch?.[1]) return null;
    return {
      coordinates: coordinatesMatch[1].split(','),
      title: titleMatch?.[1] ? decodeURIComponent(titleMatch[1]) : undefined
    };
  }, []);

  const parseCoordinates = useCallback((input: string): string[] | null => {
    const regex = /^[-+]?[0-9]*\.?[0-9]+,\s*[-+]?[0-9]*\.?[0-9]+$/;
    const match = input.match(regex);
    return match ? match[0].split(',') : null;
  }, []);

  const createNewLocation = () => {
    if (!newCoords.current?.value) return;


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

    setLocations(prev => [...prev, newLocation]);
    if (newTitle.current) newTitle.current.value = '';
    if (newCoords.current) newCoords.current.value = '';
    setTimeout(updateTextareaAndValidate, 10);
  };

  const getCoordinatesByBrowser = () => {
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
      (error) => console.error(`Error getting geolocation: ${error.message}`)
    );
  };

  const removeLocation = useCallback((locationToRemove: MarkerType) => {
    setLocations(prev =>
      prev.filter(loc => loc.lat !== locationToRemove.lat || loc.lng !== locationToRemove.lng)
    );
    setTimeout(updateTextareaAndValidate, 10);
  }, [updateTextareaAndValidate]);

  const updateLocation = useCallback((location: MarkerType, field: 'title' | 'coordinates', value: string) => {
    setLocations(prev => prev.map(loc => {
      if (loc.lat === location.lat && loc.lng === location.lng) {
        if (field === 'title') {
          return { ...loc, title: value };
        }
        const [lat, lng] = value.split(',').map(n => parseFloat(n.trim()));
        return { ...loc, lat, lng };
      }
      return loc;
    }));
    setTimeout(updateTextareaAndValidate, 10);
  }, [updateTextareaAndValidate]);

  return {
    locationsContent,
    newTitle,
    newCoords,
    populateLocations,
    locations,
    createNewLocation,
    updateInputFromLocations: updateTextareaAndValidate,
    getCoordinatesByBrowser,
    isValid,
    handleContentChange: validateContent,
    removeLocation,
    updateLocation,
  };
};

export default useLocationForm;
