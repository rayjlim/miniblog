import { combineReducers } from "redux";

// Reducers
import postReducer from "./post-reducer";
import quickAddReducer from "./quickAddReducer";

// Combine Reducers
var reducers = combineReducers({
	postState: postReducer,
	quickAddState: quickAddReducer
});

export default reducers;
