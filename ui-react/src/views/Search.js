import React, { useState, useEffect, Fragment } from 'react';
import { NavLink as RouterNavLink } from 'react-router-dom';
import constants from '../constants';
import axios from 'axios';
import moment from 'moment';
import ReactMarkdown from 'react-markdown'; // eslint-disable-line no-unused-vars
import AddForm from '../components/AddForm.jsx'; //eslint-disable no-unused-vars
import EditForm from '../components/EditForm.jsx'; //eslint-disable no-unused-vars

const DEBOUNCE_TIME = 300;

const TextEntry = () => {
	// class ContactForm extends React.Component {
	const [ data, setData ] = useState({ entries: [] });
	const [ searchText, setText ] = useState('');
	const [ formMode, setFormMode ] = useState(0);
	const [ entry, setEntry ] = useState({});

	useEffect(() => {
		console.log('useEffect');
		getEntries('');
	}, []);

	/** 
	 * Get blog entries for text search
	 * @param  {string} text text to search for
	 */
	function getEntries(text) {
		console.log('getEntries#text:', text);
		(async () => {
			// You can await here
			const result = await axios(`${constants.REST_ENDPOINT}api/posts/?searchParam=${text}`);
			console.log('result :', result);
			if (result.status !== 200) {
				console.log('result.status :', result.status);
				alert(`loading error : ${result.status}`);
				return;
			} else if (typeof result.data === 'string') {
				console.log('invalid json');
			} else {
				console.log('result.data :>> ', result.data.unauth);
				if (result.data.unauth) {
					// setAuth(false);
					alert('no auth');
				} else {
					const searchVal = document.getElementById('searchText').value;
					if (searchVal.length) {
						const reg = new RegExp(searchVal, 'gi');

						const highlightedData = result.data.entries.map((entry) => {
							const highlighted = entry.content.replace(reg, (str) => {
								return `<b>${str}</b>`;
							});
							return { ...entry, content: highlighted };
						});
						console.log('highlightedData :>> ', highlightedData);

						setData({ entries: highlightedData });
					} else {
						setData(result.data);
					}
				}
			}

			// ...
		})();
	}

	let debouncedSearch = debounce(getEntries, DEBOUNCE_TIME);
	function search(text) {
		console.log('TEC: search' + text);
		// setText(text);
		debouncedSearch(text);
	}

	const btnShowAddForm = (
		<button onClick={(e) => showAddForm(e)} className="btn btn-default">
			Show Add Form
		</button>
	);

	function showAddForm(e) {
		setFormMode(1);
	}
	function showEditForm(e, entry) {
		e.preventDefault();
		console.log('id :', entry.id);
		setFormMode(2);
		setEntry(entry);
	}

	function resetEntryForm() {
		setFormMode(0);
		getEntries(searchText);
	}

	function showAddEditForm(mode) {
		console.log('mode :', mode);
		if (!mode || mode === 0) {
			return btnShowAddForm;
		} else if (mode === 1) {
			return <AddForm date={''} onSuccess={() => resetEntryForm()} />;
		} else if (mode === 2) {
			return <EditForm entry={entry} onSuccess={() => resetEntryForm()} />;
		}
	}

	function showEntries() {
		return formMode !== 1 && formMode !== 2 ? (
			<Fragment>
				<ul className="entriesList">
					{data.entries.map((entry) => {
						let newText = entry.content.replace(/<br \/>/g, '\n');
						newText = newText.replace(/..\/uploads/g, `${constants.PROJECT_ROOT}uploads`);
						const dateFormated = moment(entry.date).format('ddd MMM, DD YYYY');

						let showEntryDate = (
							<button onClick={(e) => showEditForm(e, entry)} className="plainLink">
								{dateFormated}
							</button>
						);
						return (
							<li key={entry.id} className="blogEntry">
								{showEntryDate}|
								<ReactMarkdown source={newText} escapeHtml={false} />
							</li>
						);
					})}
				</ul>

			</Fragment>
		) : (
			''
		);
	}

	return (
		<Fragment>
			<nav className="navbar navbar-expand-sm  fixed-top navbar-light bg-light">
				<RouterNavLink to="/">
					<i className="fa fa-home" /> <span>Home</span>
				</RouterNavLink>
				<RouterNavLink to="/sameday">
					{' '}
					<i className="fa fa-calendar-check" /> <span>Same Day</span>
				</RouterNavLink>
				<RouterNavLink to="/calendar">
					<i className="fa fa-calendar" /> <span>Calendar</span>
				</RouterNavLink>
			</nav>
			<br />
			<br />

			<h1>Text Search</h1>

			<section className="container">
				<input
					id="searchText"
					type="text"
					className="form-control"
					// value={searchText}
					defaultValue=""
					placeholder="Search term"
					onChange={(e) => search(e.target.value)}
				/>
			</section>

			<section className="container">{showAddEditForm(formMode)}</section>

			<section className="container">{showEntries()}</section>

			<nav className="navbar navbar-expand-sm  fixed-bottom navbar-light bg-light">
				<a href="/uploadForm/" className="btn navbar-btn">
					<i className="fa fa-file-upload" /> Upload Pix
				</a>
			</nav>
		</Fragment>
	);
};

function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this,
			args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
}
export default TextEntry;