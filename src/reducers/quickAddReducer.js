import * as types from "../actions/action-types";
import moment from "moment";

var current = moment();
const initialState = {
  weight: 0,
  comment: "",
  pushups: 45
};

const quickAddReducer = function(state = initialState, action) {
  switch (action.type) {
    case types.CHANGE_WEIGHT:
      return Object.assign({}, state, { weight: action.weight });
      break;
    case types.CHANGE_COMMENT:
      return Object.assign({}, state, { comment: action.comment });
      break;
    case types.CHANGE_PUSHUPS:
      return Object.assign({}, state, { pushups: action.pushups });
      break;
    default:
      return state;
  }
};

export default quickAddReducer;
