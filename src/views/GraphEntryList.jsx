import React from 'react'; // eslint-disable-line no-unused-vars
const GraphEntryList = (props) => {
    const listItems = props.entrys.map((entry) => {
        return (
            <li key={entry.id}>
                {entry.date} | {entry.main} | {entry.average} | {entry.comment}
            </li>
        );
    });

    return <ul className="col-sm-9 list-group">{listItems}</ul>;
};

export default GraphEntryList;
