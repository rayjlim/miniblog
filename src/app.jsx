import React from "react"; // Presenter Note: Required even if we're not using the `React` object
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import store from "./reducers/store";
import { Switch, Route, HashRouter, Redirect } from "react-router-dom";

import TextEntryContainer from "./containers/TextEntryContainer.jsx";
import FullCalendarContainer from "./containers/FullCalendarContainer.jsx";
import OneDayBox from "./containers/OneDayBox.jsx";
import UploadViewerController from "./containers/UploadViewerController.jsx";

ReactDOM.render(
    <Provider store={store}>
        <HashRouter>
            <Switch>
                <Route path="/text" component={TextEntryContainer} />
                <Route path="/calendar" component={FullCalendarContainer} />
                <Route path="/oneDay" component={OneDayBox} />
                <Route path="/uploadViewer" component={UploadViewerController} />
                <Route path="/" component={TextEntryContainer} />
                <Redirect to="/" />
            </Switch>
        </HashRouter>
    </Provider>,
    document.getElementById("app")
);
