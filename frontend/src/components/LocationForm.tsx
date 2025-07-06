import { useEffect } from 'react';
import useLocationForm from '../hooks/useLocationForm';
import { MarkerType } from '../Types';

interface LocationFormProps {
  content?: string;
  initialLocation?: {
    title: string;
    coord: string;
  };
}

const LocationForm = ({ content = "", initialLocation }: LocationFormProps) => {
  const {
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
  } = useLocationForm();

  useEffect(() => {
    if (!content && !initialLocation) return;

    try {
      let locations = [];
      if (content) {
        const cleanContent = content.startsWith('"')
          ? content.slice(1, -1).replace(/\\"/g, '"').replace(/\\n/g, '')
          : content;
        locations = JSON.parse(cleanContent);
      }

      if (initialLocation) {
        const [lat, lng] = initialLocation.coord.split(',').map(coord => parseFloat(coord.trim()));
        locations.push({
          title: initialLocation.title,
          lat,
          lng
        });
      }

      if (locationsContent.current) {
        locationsContent.current.value = JSON.stringify(locations);
        populateLocations();
      }
    } catch (e) {
      console.error('Invalid JSON content or coordinates:', e);
    }
  }, [content, initialLocation]);

  const LocationItem = ({ location }: { location: MarkerType }) => (
    <div className="input-group mb-2" style={{
      display: 'flex',
      flexDirection: 'row',
      width: '100%',
      gap: '0.5rem'
    }}>
      <input
        type="text"
        className="form-control"
        value={location.title}
        onChange={(e) => updateLocation(location, 'title', e.target.value)}
      />
      <input
        type="text"
        className="form-control"
        value={`${location.lat}, ${location.lng}`}
        onChange={(e) => updateLocation(location, 'coordinates', e.target.value)}
      />
      <button
        type="button"
        className="btn btn-danger"
        onClick={() => removeLocation(location)}
      >
        <i className="fa fa-trash" />
      </button>
    </div>
  );

  return (
    <div className="location-form">
      <textarea
        ref={locationsContent}
        name="locationContent"
        className="form-control mb-2"
        placeholder="locations"
        rows={2}
        defaultValue={content}
        onChange={handleContentChange}
      />

      <button
        type="button"
        className="btn btn-secondary mb-2"
        onClick={populateLocations}
        disabled={!isValid}
        style={{ display: isValid ? 'none' : 'block' }}
      >
        Input to locations
      </button>

      <button
        type="button"
        id="locToInputBtn"
        className="btn btn-secondary"
        style={{ display: 'none' }}
        onClick={updateInputFromLocations}
      >
        Locations to input
      </button>

      <div className="locations-list mb-1">
        {locations.map((location) => (
          <LocationItem
            key={`${location.lat},${location.lng}`}
            location={location}
          />
        ))}
      </div>

      <div className="input-group mb-3">
        <input
          type="text"
          name="newLocationTitle"
          ref={newTitle}
          className="form-control"
          placeholder="Title"
        />
        <input
          type="text"
          name="newLocationCoords"
          ref={newCoords}
          className="form-control"
          placeholder="URL or lat, lon"
        />
        <span
          className="input-group-text"
          title="Coordinate grab instructions - In google maps
- Press and hold location to get coordinates
- Press and hold Home bar (bottom of screen) to get to Screen capture
- Circle the coordinates text
- Select Text, Copy"
          style={{ cursor: 'help' }}
        >
          <i className="fa fa-question-circle" />
        </span>
      </div>

      <div className="d-flex gap-2">
        <button
          type="button"
          className="btn btn-primary"
          onClick={getCoordinatesByBrowser}
        >
          Use Current Location
        </button>
        <button
          type="button"
          className="btn btn-success"
          onClick={createNewLocation}
        >
          Parse
        </button>
      </div>
    </div>
  );
};

export default LocationForm;
