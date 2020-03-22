import React from 'react'; // eslint-disable-line no-unused-vars

const SameDayInput = (props) => {
    let containerStyle = {
        margin: '0 0 0 10px'
    };
    let btnStyle = {
        margin: '0 0 9px 0'
    };
    return (
        <div style={containerStyle}>
            <button onClick={props.handleSameDay} className="btn btn-success btn-lrg col-xs-9" style={btnStyle}>
                Same Day
            </button>
            <div className="col-xs-9">
                <input
                    type="text"
                    name="sameDayValue"
                    id="sameDayValue"
                    className="form-control"
                    value={props.sameDayInput}
                    onChange={props.handleSameDayChange}
                />
            </div>
        </div>
    );
};

export default SameDayInput;
