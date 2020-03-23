/* eslint-disable no-alert, no-console */
import * as types from '../actions/action-types';
import moment from 'moment';

let current = moment();
const initialState = {
    date: current.format('YYYY-MM-DD'),
    posts: [],
    post: null,
    showAddEditForm: false,
    fileName: null,
    filePath: null,
    random: null
};

const postReducer = (state = initialState, action) => {
    console.log('post reducer: ' + action.type);
    let newstate = state;
    switch (action.type) {
    case types.GET_POSTS_SUCCESS: {
        console.log('action.posts :', action.posts);
        newstate = Object.assign({}, state, { posts: action.posts });
        break;
    }
    case types.GET_EDIT_POST:
        console.log('reduce-GET_EDIT_POST');
        newstate = Object.assign({}, state, {
            currentEntry: action.entry,
            showAddEditForm: true
        });
        break;
    case types.ADD_SUCCESS:
        newstate = Object.assign({}, state, {
            posts: state.posts.concat(action.post),
            showAddEditForm: false
        });
        break;
    case types.CLEAR_ADDEDIT:
        newstate = Object.assign({}, state, {
            currentEntry: null,
            showAddEditForm: false
        });
        break;
    case types.SHOW_FORM:
        newstate = Object.assign({}, state, {
            showAddEditForm: true
        });
        break;
    case types.CHANGE_DATE:
        newstate = Object.assign({}, state, { date: action.date });
        break;
    case types.TOGGLE_ADDEDIT_FORM:
        newstate = Object.assign({}, state, {
            showAddEditForm: !state.showAddEditForm
        });
        break;
    case types.DELETE_SUCCESS:
        console.log('reduce-DELETE_ENTRY');
        newstate = Object.assign({}, state, {
            posts: state.posts.filter(x => x.id !== action.id),
            showAddEditForm: false
        });
        break;
    case types.UPDATE_SUCCESS: {
        let withoutEntry = state.posts.filter(x => x.id !== action.entry.id);
        newstate = Object.assign({}, state, {
            posts: withoutEntry.concat(action.entry),
            showAddEditForm: false
        });
        break;
    }
    case types.UPDATE_FILEVIEW:
        console.log('update fileview');
        newstate = Object.assign({}, state, {
            fileName: action.fileName,
            filePath: action.filePath,
            random: new Date().getTime()
        });
        // add random to refresh state and initiate rerender of UploadViewer
        break;
    default:
    }
    console.log('newstate :', newstate);
    return newstate;
};

export default postReducer;
