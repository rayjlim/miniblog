import { forwardRef } from 'react';
import useLocationForm from '../hooks/useLocationForm';
const LocationForm = ({ }, ref: any) => {
  const {
    locationChange,
    newTitle,
    newCoords,
    populateLocations,
    locations,
    createNewLocation,
    updateInputFromLocations,
    getCoordinatesByBrowser,
    getLocation

  } = useLocationForm(ref);

  return (
    <div>
      <textarea
        ref={ref as any}
        onChange={() => locationChange()}
        className="form-control"
        placeholder="locations"
        rows={2}
        defaultValue={''}
      />
      <button type="button"
        onClick={() => populateLocations()}>input to locations</button>
      <button type="button" id="locToInputBtn" style={{ display: 'none' }}
        onClick={() => updateInputFromLocations()}>locations to input</button>

      {locations.map(((location: MarkerType) => (
        <div key={`${location.lat},${location.lng}`}>{location.title}, {location.lat}, {location.lng}</div>
      )))}
      <div>
        <input type="text" ref={newTitle as any} />
        <input type="text" ref={newCoords as any} />
      </div>
      <button type="button" onClick={() => getLocation()}>Get Location</button>
      <button type="button" onClick={() => createNewLocation()}>parse</button>
      <button type="button" title="get current location"
        onClick={() => getCoordinatesByBrowser()}>Here</button>

    </div>
  );
};
export default forwardRef(LocationForm);
