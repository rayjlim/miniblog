import React from "react";

const TagLister = props => {
    
    let result = props.source.match(/#[a-z0-9_]+/gi);
    let tags = result !== null ? result.join(', ') : '';
    return (
        <span>Tags: {tags}</span>
    );
};

export default TagLister;
