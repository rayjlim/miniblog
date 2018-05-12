import React, { Component } from "react";

const EntrySearchInput = props => {
	return (
		<div>
			<label htmlFor="searchValue" className="col-xs-3 col-form-label">
				Search
			</label>
			<div className="col-xs-9">
				<input
					type="text"
					name="searchValue"
					id="searchValue"
					className="form-control"
					value={props.searchInput}
					onChange={props.handleSearch}
				/>
			</div>
		</div>
	);
};

export default EntrySearchInput;
