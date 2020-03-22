import React from 'react'; // eslint-disable-line no-unused-vars
const EntrySearchInput = (props) => {
    let containerStyle = {
        margin: '0 0 0 10px'
    };
    return (
        <div style={containerStyle}>
            <label htmlFor="searchValue" className="col-xs-9 btn btn-success">
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
