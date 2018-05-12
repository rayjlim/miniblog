import * as types from "../actions/action-types";
import moment from "moment";

var current = moment();
const initialState = {
  date: current.format("YYYY-MM-DD"),
  posts: [],
  post: null,
  showAddEditForm: false,
  fileName: null,
  filePath: null,
  random: null
};

const postReducer = function(state = initialState, action) {
  console.log("post reducer" + action.type);
  switch (action.type) {
    case types.GET_POSTS_SUCCESS:
      return Object.assign({}, state, { posts: action.posts });
      break;
    case types.GET_EDIT_POST:
      console.log("reduce-GET_EDIT_POST");
      return Object.assign({}, state, {
        currentEntry: action.entry,
        showAddEditForm: true
      });
      break;
    case types.ADD_SUCCESS:
      return Object.assign({}, state, {
        posts: state.posts.concat(action.post),
        showAddEditForm: false
      });
      break;
    case types.CLEAR_ADDEDIT:
      return Object.assign({}, state, {
        currentEntry: null,
        showAddEditForm: false
      });
      break;
    case types.SHOW_FORM:
      return Object.assign({}, state, {
        showAddEditForm: true
      });
      break;
    case types.CHANGE_DATE:
      return Object.assign({}, state, { date: action.date });
      break;
    case types.TOGGLE_ADDEDIT_FORM:
      return Object.assign({}, state, {
        showAddEditForm: !state.showAddEditForm
      });
      break;
    case types.DELETE_SUCCESS:
      console.log("reduce-DELETE_ENTRY");
      return Object.assign({}, state, {
        posts: state.posts.filter(x => x.id !== action.id),
        showAddEditForm: false
      });
      break;
    case types.UPDATE_SUCCESS:
      let withoutEntry = state.posts.filter(x => x.id !== action.entry.id);
      return Object.assign({}, state, {
        posts: withoutEntry.concat(action.entry),
        showAddEditForm: false
      });
      break;
    case types.UPDATE_FILEVIEW:
      console.log("update fileview");
      return Object.assign({}, state, {
        fileName: action.fileName,
        filePath: action.filePath,
        random: new Date().getTime()
      });
      // add random to refresh state and initiate rerender of UploadViewer
      break;
    default:
      return state;
  }
};

export default postReducer;
