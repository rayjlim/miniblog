import React from "react";

const TagLister = props => {
    
    let result = props.source.match(/#[a-z0-9_]+/gi);
    let tagContent = result !== null ? 'Tags: ' + result.join(', ') : '';
    return (
        <span>{tagContent}</span>
    );
};

export default TagLister;
