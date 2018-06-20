import React from "react";
import ReactMarkdown from "react-markdown";
import TagLister from './TagLister.jsx';
import moment from "moment";

const EntryList = props => {
    console.log(props.entrys);
    return (
        <ul className="col-sm-12 list-group ">
            {props.entrys.map(entry => {
                let newText = entry.content.replace(/<br \/>/g, "\n");
                let showEntryDate = moment(entry.date).format(
                    "ddd MMM, DD YYYY"
                );
                let calLinkDate = `posts/?gotoYearMonth=`+moment(entry.date).format("YYYY-MM");
                if (props.editLink) {
                    showEntryDate = (
                        <a
                            onClick={e => {
                                e.preventDefault();
                                props.editLink(entry);
                            }}
                        >
                            { moment(entry.date).format("ddd MMM, DD YYYY") }
                        </a>
                    );
                }
                let oneDayLink = `main#/oneDay?date=` + moment(entry.date).format("YYYY-MM-DD");
                return (
                    <li key={entry.id} className="blogEntry">
                        <a href={ oneDayLink }>{showEntryDate}</a> | 
                        <a href={ calLinkDate }>Cal</a>
                        |<ReactMarkdown source={newText} />
                        <TagLister source={newText} />
                    </li>
                );
            })}
        </ul>
    );
};

export default EntryList;
