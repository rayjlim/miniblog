import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import TextEntry from './views/TextEntry';
import OneDay from './views/OneDay';

import './App.css';

import history from './utils/history';
import { NavLink as RouterNavLink } from 'react-router-dom';

function App() {
	return (
		<div className="App">
			<Router history={history}>
				<div id="app" className="d-flex flex-column h-100">
					<Switch>
						<Route path="/textentry" exact component={TextEntry} />
						<Route path="/oneday" component={OneDay} />
						<Route path="/" component={OneDay} />
					</Switch>
					<RouterNavLink to="/textentry">textentry</RouterNavLink>
					<RouterNavLink to="/oneday">oneday</RouterNavLink>
				</div>
			</Router>
		</div>
	);
}

export default App;
