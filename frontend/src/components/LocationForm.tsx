import { forwardRef, ForwardedRef } from 'react';
import useLocationForm from '../hooks/useLocationForm';
import { MarkerType } from '../Types';

const LocationForm = ({}, ref: ForwardedRef<HTMLTextAreaElement>) => {
  const {
    locationChange,
    newTitle,
    newCoords,
    populateLocations,
    locations,
    createNewLocation,
    updateInputFromLocations,
    getCoordinatesByBrowser,
  } = useLocationForm(ref as any);

  return (
    <div className="location-form">
      <textarea
        ref={ref}
        onChange={locationChange}
        className="form-control mb-2"
        placeholder="locations"
        rows={2}
        defaultValue=""
      />

      <div className="d-flex gap-2 mb-3">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={populateLocations}
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
      </div>

      <div className="locations-list mb-3">
        {locations.map((location: MarkerType) => (
          <div key={`${location.lat},${location.lng}`} className="location-item">
            {location.title}, {location.lat}, {location.lng}
          </div>
        ))}
      </div>

      <div className="input-group mb-3">
        <input
          type="text"
          ref={newTitle as any}
          className="form-control"
          placeholder="Title"
        />
        <input
          type="text"
          ref={newCoords as any}
          className="form-control"
          placeholder="URL or lat, lon"
        />
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

export default forwardRef(LocationForm);
