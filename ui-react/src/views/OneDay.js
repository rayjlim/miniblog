import React, { useState, useEffect, Fragment } from 'react';
import { NavLink as RouterNavLink } from 'react-router-dom';
import constants from '../constants';
import axios from 'axios';
import ReactMarkdown from 'react-markdown'; // eslint-disable-line no-unused-vars
import moment from 'moment';
import AddForm from './AddForm.jsx'; //eslint-disable no-unused-vars
import EditForm from './EditForm.jsx'; //eslint-disable no-unused-vars

const OneDay = () => {
	const [ data, setData ] = useState({ entries: [] });
	const [ oDate, setDate ] = useState(moment().format('YYYY-MM-DD'));
	const [ formMode, setFormMode ] = useState(0);
	const [ entry, setEntry ] = useState({});
	console.log('oDate :', oDate);

	const btnShowAddForm = (
		<button onClick={(e) => showAddForm(e)} className="btn btn-default">
			Show Add Form
		</button>
	);

	async function loadDay(date) {
		console.log('loadDay2 oDate :', date);
		const result = await axios(`${constants.REST_ENDPOINT}api/posts/?date=${date}`);
		console.log('result :', result);
		setData(result.data);
	}

	function handleButtonDirection(e) {
		let _date = moment(oDate, 'YYYY-MM-DD');
		let updateDate = _date.add(e.target.value, 'days').format('YYYY-MM-DD');
		setDate(updateDate);
		console.log('oneday:hbd.' + e.target.value, oDate, updateDate);

		loadDay(updateDate);
		setFormMode(0);
	}

	function resetEntryForm() {
		console.log('close form', oDate);
		setFormMode(0);
		loadDay(oDate);
	}

	function showAddForm(e) {
		console.log('showAddForm#oDate :', oDate);
		setFormMode(1);
	}

	function showEditForm(e, entry) {
		e.preventDefault();
		console.log('id :', entry.id);
		setFormMode(2);
		setEntry(entry);
	}

	function updateDate(e) {
		console.log('e :', e.target.value);
		let myval = e.target.value;
		setDate(myval);
		loadDay(myval);
	}

	useEffect(() => {
		console.log('OndeDay: useEffect');
		let loc = window.location + '';
		let param = loc.substring(loc.indexOf('?'));
		console.log('param :', param);
		let urlParams = new URLSearchParams(param);

		const _date = urlParams.has('date') ? urlParams.get('date') : moment().format('YYYY-MM-DD');
		setDate(_date);
		loadDay(_date);
	}, []);

	function showAddEditForm(mode) {
		console.log('mode :', mode);
		if (!mode || mode === 0) {
			return btnShowAddForm;
		} else if (mode === 1) {
			return <AddForm date={oDate} onSuccess={() => resetEntryForm()} />;
		} else if (mode === 2) {
			return <EditForm entry={entry} onSuccess={() => resetEntryForm()} />;
		}
	}

	return (
		<Fragment>
			<h1>OneDay</h1>
			<RouterNavLink to="/textentry">Search</RouterNavLink>
			<RouterNavLink to="/sameday">Same Day</RouterNavLink>
			<RouterNavLink to="/calendar">Calendar</RouterNavLink>


			<button onClick={(e) => handleButtonDirection(e)} className="btn btn-info btn-lrg" value="-1">
				&lt;&lt;-Prev
			</button>
			<input
				type="text"
				className="form-control"
				id="formDpInput"
				value={oDate}
				// defaultValue={oDate}
				onChange={(e) => updateDate(e)}
			/>
			{oDate}
			<button onClick={(e) => handleButtonDirection(e)} className="btn btn-success btn-lrg" value="1">
				Next-&gt;&gt;
			</button>

			{showAddEditForm(formMode)}
			<ul>
				{data.entries.map((entry) => {
					let newText = entry.content.replace(/<br \/>/g, '\n');
					newText = newText.replace(/..\/uploads/g, `${constants.UPLOAD_PREFIX}uploads`);
					const dateFormated = moment(entry.date).format('ddd MMM, DD YYYY');
					let showEntryDate = (
						<a onClick={(e) => showEditForm(e, entry)} href="#?">
							{dateFormated}
						</a>
					);

					return (
						<li key={entry.id} className="blogEntry">
							{showEntryDate} |
							<ReactMarkdown source={newText} escapeHtml={false} />
						</li>
					);
				})}
			</ul>
		</Fragment>
	);
};

export default OneDay;
