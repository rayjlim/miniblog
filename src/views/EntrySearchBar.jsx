import React from "react";
import EntrySearchInput from "./EntrySearchInput.jsx";
import SameDayInput from "./SameDayInput.jsx";

const EntrySearchBar = props => {
	return (
		<div className="form-group row well">
			<EntrySearchInput
				handleSearch={props.handleSearch}
				searchInput={props.searchInput}
			/>
			<SameDayInput
				handleSameDay={props.handleSameDay}
				handleSameDayChange={props.handleSameDayChange}
				sameDayInput={props.sameDayInput}
			/>
		</div>
	);
};

export default EntrySearchBar;
