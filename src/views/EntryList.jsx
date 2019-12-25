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
                const dateFormated = moment(entry.date).format("ddd MMM, DD YYYY");
                const calLinkDate = `posts/?gotoYearMonth=` + moment(entry.date).format("YYYY-MM");
                const oneDayLink = 'main#/oneDay?date='+moment(entry.date).format("YYYY-MM-DD");
                let showEntryDate = (<a href={oneDayLink}>{dateFormated}</a>);    
                // <a onclick={e=> {location.href=`main#/oneDay?date=${dateFormated}`}}>{dateFormated}</a>);
                if (props.editLink) {
                    showEntryDate = (
                        <a onClick={e => {
                                e.preventDefault();
                                props.editLink(entry);
                            }}
                        >{moment(entry.date).format("ddd MMM, DD YYYY")}</a>
                    );
                }
                
                return (
                    <li key={entry.id} className="blogEntry">
                        {showEntryDate}|
                        <a href={calLinkDate}>Cal</a>|
                        <ReactMarkdown source={newText} />
                        <TagLister source={newText} />
                    </li>
                );
            })}
        </ul>
    );
};

export default EntryList;
