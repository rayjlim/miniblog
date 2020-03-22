import * as types from '../actions/action-types';

const initialState = {
    weight: 0,
    comment: '',
    pushups: 45
};

const quickAddReducer = function quickAddReducer(state = initialState, action) {
    switch (action.type) {
    case types.CHANGE_WEIGHT:
        Object.assign({}, state, { weight: action.weight });
        break;
    case types.CHANGE_COMMENT:
        Object.assign({}, state, { comment: action.comment });
        break;
    case types.CHANGE_PUSHUPS:
        Object.assign({}, state, { pushups: action.pushups });
        break;
    default:
    }
    return state;
};

export default quickAddReducer;
