import { combineReducers } from 'redux';
// import { combineReducers } from 'redux-immutable';
import { reducer as FormReducer } from 'redux-form/immutable';
import loginReducer from './loginReducer.js';
import dataReducer from './dataReducer.js';
import controlReducer from './controlReducer.js';
import joyrideReducer from './joyrideReducer.js';

const rootReducer = combineReducers({
    form: FormReducer,
    login: loginReducer,
    data: dataReducer,
    control: controlReducer,
    joyride: joyrideReducer
});

export default rootReducer;