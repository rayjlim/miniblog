import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import SameDay from './views/SameDay';
import TextEntry from './views/TextEntry';
import OneDay from './views/OneDay';

import './App.css';

import history from './utils/history';

function App() {
	return (
		<div id="app" className="App d-flex flex-column h-100">
			<Router history={history}>
				<Switch>
					<Route path="/sameday" exact component={SameDay} />
					<Route path="/textentry" exact component={TextEntry} />
					<Route path="/oneday" component={OneDay} />
					<Route path="/" component={OneDay} />
				</Switch>
			</Router>
		</div>
	);
}

export default App;
