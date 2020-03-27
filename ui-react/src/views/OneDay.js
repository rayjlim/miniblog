import React, { useState, useEffect, Fragment } from 'react';
import { NavLink as RouterNavLink } from 'react-router-dom';
import constants from '../constants';
import axios from 'axios';




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
				{data.entries.map((item) => (
					<li key={item.id}>
						<a href={item.id}>
							{item.date}: {item.content}
						</a>
					</li>
				))}
			</ul>
		</Fragment>
	);
};

export default OneDay;
