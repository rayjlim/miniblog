import React, { useState, useEffect, Fragment } from 'react';
import { NavLink as RouterNavLink } from 'react-router-dom';
import constants from '../constants';
import axios from 'axios';
import moment from 'moment';
import ReactMarkdown from 'react-markdown'; // eslint-disable-line no-unused-vars
const DEBOUNCE_TIME = 300;
const SameDay = () => {
	// class ContactForm extends React.Component {
	const [ data, setData ] = useState({ entries: [] });
	const [ oDate, setDate ] = useState('');

	useEffect(() => {
		console.log('useEffect');
		console.log('ODB: componentDidMount');

		let loc = window.location + '';

		let param = loc.substring(loc.indexOf('?'));
		console.log('param :', param);
		let urlParams = new URLSearchParams(param);

		console.log('urlParams.has date : ' + urlParams.has('date'));
		const date = urlParams.has('date') ? urlParams.get('date') : moment().format('YYYY-MM-DD');
		console.log('passed date: ' + date);
		setDate(date);
		loadDay(date);
	}, []);

	function loadDay(_date) {
		(async () => {
			// You can await here
			const result = await axios(`${constants.REST_ENDPOINT}api/sameDayEntries/?day=${_date}`);
			console.log('result :', result);
			console.log('typeof result.data :', typeof result.data);
			if(typeof result.data === 'string')
			console.log('invalid json');

			else{
				setData(result.data);
			}
			// ...
		})();
	}

	function handleButtonDirection(e) {
		console.log('hbd.' + e.target.value);

		let date = moment(oDate, 'YYYY-MM-DD');
		let updateDate = date.add(e.target.value, 'days').format('YYYY-MM-DD');
		setDate(updateDate);
		loadDay(updateDate);
	}

	let debouncedTextEdit = debounce(handleDateTextEdit, DEBOUNCE_TIME);

	function handleDateTextEdit(text){
		setDate(text)
		loadDay(text);
	}

	return (
		<Fragment>
			<h1>Same Day</h1>
			<RouterNavLink to="/">Home</RouterNavLink>
			<RouterNavLink to="/textentry">textentry</RouterNavLink>

			<button onClick={(e) => handleButtonDirection(e)} className="btn btn-info btn-lrg" value="-1">
				&lt;&lt;-Prev
			</button>
			<input
				type="text"
				className="form-control"
				id="formDpInput"
				defaultValue={oDate}
				onChange={(e) => debouncedTextEdit(e.target.value)}
			/>
			<button onClick={(e) => handleButtonDirection(e)} className="btn btn-success btn-lrg" value="1">
				Next-&gt;&gt;
			</button>
			{oDate}
			<ul>
				{data.entries.map((entry) => {
					let newText = entry.content.replace(/<br \/>/g, '\n');
					newText = newText.replace(/..\/uploads/g, `${constants.UPLOAD_PREFIX}uploads`);
					const dateFormated = moment(entry.date).format('ddd MMM, DD YYYY');
					const oneDayLink = `/?date=${entry.date}`;
					let showEntryDate = <a href={oneDayLink}>{dateFormated}</a>;

					return (
						<li key={entry.id} className="blogEntry">
							{showEntryDate}|
							<ReactMarkdown source={newText} escapeHtml={false} />
						</li>
					);
				})}
			</ul>
		</Fragment>
	);
};

function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};

export default SameDay;
