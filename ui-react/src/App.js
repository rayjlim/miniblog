import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import SameDay from './views/SameDay';
import TextEntry from './views/TextEntry';
import OneDay from './views/OneDay';
import Calendar from './views/Calendar';
import Media from './views/Media';
import Login from './views/Login';
import { useAuth0 } from "./utils/react-auth0-spa";
import Loading from "./components/Loading";
import './App.css';

import history from './utils/history';

function App() {
	const authVar = useAuth0();

	const { loading } = authVar;

	if (loading) {
	  return <Loading />;
	}
	return (
		<div id="app" className="App d-flex flex-column h-100">
			<Router history={history}>
				<Switch>

					<Route path="/media" component={Media} />
					<Route path="/calendar" component={Calendar} />
					<Route path="/sameday" exact component={SameDay} />
					<Route path="/textentry" exact component={TextEntry} />
					<Route path="/oneday" component={OneDay} />
					<Route path="/login" component={Login} />
					<Route path="/" component={OneDay} />
				</Switch>
			</Router>
		</div>
	);
}

export default App;
