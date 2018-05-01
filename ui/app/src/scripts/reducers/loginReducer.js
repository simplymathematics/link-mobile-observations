import { LOGIN_REQUEST, LOGIN_RESPONSE, LOGIN_ERROR } from '../actions/LoginAction';

const initialState = {
    error: ''
};

export default function(state = initialState, action) {
    switch (action.type) {
        case LOGIN_RESPONSE:
            return {
                ...state,
                error: ''
            };
        case LOGIN_ERROR:
            return {
                ...state,
                error: action.content.message
            };
        case LOGIN_REQUEST:
        default:
            return state;
    }
}