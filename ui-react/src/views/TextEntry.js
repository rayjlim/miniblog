import React, { useState, useEffect, Fragment } from 'react';
import { NavLink as RouterNavLink } from 'react-router-dom';
import constants from '../constants';
import axios from 'axios';


const TextEntry = () => {
	const [ data, setData ] = useState({ entries: [] });

	useEffect(() => {
		console.log('useEffect');
		(async () => {
			// You can await here
			const result = await axios(`${constants.REST_ENDPOINT}api/sameDayEntries/?day=2020-03-26`);
			console.log('result :', result);
			setData(result.data);
			// ...
		})();
  }, []);
  
  

	return (
		<Fragment>
			<h1>TextEntry</h1>
			<RouterNavLink to="/epcal2/react/">Home</RouterNavLink>

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

export default TextEntry;
