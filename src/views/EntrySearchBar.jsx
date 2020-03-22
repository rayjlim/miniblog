import React from 'react'; // eslint-disable-line no-unused-vars
import EntrySearchInput from './EntrySearchInput.jsx'; // eslint-disable-line no-unused-vars
import SameDayInput from './SameDayInput.jsx'; // eslint-disable-line no-unused-vars

const EntrySearchBar = (props) => {
    return (
        <div className="form-group row well">
            <EntrySearchInput handleSearch={props.handleSearch} searchInput={props.searchInput} />
            <SameDayInput
                handleSameDay={props.handleSameDay}
                handleSameDayChange={props.handleSameDayChange}
                sameDayInput={props.sameDayInput}
            />
        </div>
    );
};

export default EntrySearchBar;
