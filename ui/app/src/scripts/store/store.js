import thunkMiddleware from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer from '../reducers/rootReducer.js';
import Immutable from 'immutable';

const composeEnhancers = composeWithDevTools({
    serialize: {
        immutable: Immutable
    }
});

const store = createStore(
    rootReducer,
    composeEnhancers(
        applyMiddleware(
            thunkMiddleware
        )
    )
);

export default store;