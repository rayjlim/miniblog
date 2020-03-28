import React, { useState, useEffect, Fragment } from 'react';
import { NavLink as RouterNavLink } from 'react-router-dom';
import constants from '../constants';
import axios from 'axios';
import ReactMarkdown from 'react-markdown'; // eslint-disable-line no-unused-vars
import moment from 'moment';


const OneDay = () => {

  // class ContactForm extends React.Component {  
	const [ data, setData ] = useState({ entries: [] });

	useEffect(() => {
    console.log('useEffect');
    
		(async () => {
			// You can await here
			const result = await axios(`${constants.REST_ENDPOINT}api/posts/?date=2019-03-26`);
			console.log('result :', result);
			setData(result.data);
			// ...
		})();
  }, []);

  function getPreviousDay(e) {
    console.log('getPreviousDay');
    e.preventDefault();
    (async () => {
			// You can await here
			const result = await axios(`${constants.REST_ENDPOINT}api/posts/?date=2019-03-25`);
			console.log('result :', result);
			setData(result.data);
			// ...
		})();
  }


	return (
		<Fragment>
			<h1>OneDay</h1>
			<RouterNavLink to="/epcal2/react/">Home</RouterNavLink>
    <button onClick={e => getPreviousDay(e)} >Previous</button>
			<ul>

            {data.entries.map((entry) => {
				let newText = entry.content.replace(/<br \/>/g, '\n');
				
                const dateFormated = moment(entry.date).format('ddd MMM, DD YYYY');
                const calLinkDate = `posts/?gotoYearMonth=${moment(entry.date).format('YYYY-MM')}`;
                const oneDayLink = `main#/oneDay?date=${moment(entry.date).format('YYYY-MM-DD')}`;
                let showEntryDate = <a href={oneDayLink}>{dateFormated}</a>;
                // <a onclick={e=> {location.href=`main#/oneDay?date=${dateFormated}`}}>{dateFormated}</a>);
                // if (props.editLink) {
                //     showEntryDate = (
                //         <a
                //             onClick={(e) => {
                //                 e.preventDefault();
                //                 props.editLink(entry);
                //             }}
                //         >
                //             {moment(entry.date).format('ddd MMM, DD YYYY')}
                //         </a>
                //     );
                //  <TagLister source={newText} /> }

                return (
                    <li key={entry.id} className="blogEntry">
                        {showEntryDate}|
                        <a href={calLinkDate}>Cal</a>|
                        <ReactMarkdown source={newText} escapeHtml={false} />
                       
                    </li>
                );
            })}				
				
			</ul>
		</Fragment>
	);
};

export default OneDay;
